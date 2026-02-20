import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import multer from 'multer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ─── S3 Client (Backblaze B2 S3-Compatible) ──────────────────────────
const s3 = new S3Client({
    endpoint: process.env.B2_ENDPOINT,
    region: process.env.B2_REGION,
    credentials: {
        accessKeyId: process.env.B2_KEY_ID,
        secretAccessKey: process.env.B2_APP_KEY
    },
    forcePathStyle: true
});

// ─── CORS ─────────────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

// ─── Multer for file uploads ──────────────────────────────────────────
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB max
});

// ─── HEALTH CHECK ─────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── UPLOAD FILE ──────────────────────────────────────────────────────
// POST /api/upload
// Body: multipart/form-data with 'file' field and 'path' field
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const filePath = req.body.path || req.file.originalname;
        const contentType = req.file.mimetype || 'application/octet-stream';

        const command = new PutObjectCommand({
            Bucket: process.env.B2_BUCKET_NAME,
            Key: filePath,
            Body: req.file.buffer,
            ContentType: contentType
        });

        await s3.send(command);

        const publicUrl = `https://f005.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${filePath}`;

        res.json({
            success: true,
            fileName: filePath,
            url: publicUrl,
            size: req.file.size,
            contentType
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed', details: error.message });
    }
});

// ─── UPLOAD MULTIPLE FILES ────────────────────────────────────────────
app.post('/api/upload-multiple', upload.array('files', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files provided' });
        }

        const folder = req.body.folder || '';
        const results = [];

        for (const file of req.files) {
            const filePath = folder ? `${folder}/${file.originalname}` : file.originalname;

            const command = new PutObjectCommand({
                Bucket: process.env.B2_BUCKET_NAME,
                Key: filePath,
                Body: file.buffer,
                ContentType: file.mimetype || 'application/octet-stream'
            });

            await s3.send(command);

            results.push({
                fileName: filePath,
                url: `https://f005.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${filePath}`,
                size: file.size,
                contentType: file.mimetype
            });
        }

        res.json({ success: true, files: results });
    } catch (error) {
        console.error('Multi-upload error:', error);
        res.status(500).json({ error: 'Upload failed', details: error.message });
    }
});

// ─── GET SIGNED DOWNLOAD URL ──────────────────────────────────────────
// GET /api/download-url?key=path/to/file.stl
app.get('/api/download-url', async (req, res) => {
    try {
        const { key } = req.query;
        if (!key) {
            return res.status(400).json({ error: 'File key is required' });
        }

        const command = new GetObjectCommand({
            Bucket: process.env.B2_BUCKET_NAME,
            Key: key,
            ResponseContentDisposition: `attachment; filename="${key.split('/').pop()}"`
        });

        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

        res.json({ success: true, url: signedUrl, expiresIn: 3600 });
    } catch (error) {
        console.error('Download URL error:', error);
        res.status(500).json({ error: 'Failed to generate download URL', details: error.message });
    }
});

// ─── PROXY DOWNLOAD (streams file through server) ─────────────────────
// GET /api/download?key=path/to/file.stl
app.get('/api/download', async (req, res) => {
    try {
        const { key } = req.query;
        if (!key) {
            return res.status(400).json({ error: 'File key is required' });
        }

        const command = new GetObjectCommand({
            Bucket: process.env.B2_BUCKET_NAME,
            Key: key
        });

        const response = await s3.send(command);
        const fileName = key.split('/').pop();

        res.setHeader('Content-Type', response.ContentType || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        if (response.ContentLength) {
            res.setHeader('Content-Length', response.ContentLength);
        }

        response.Body.pipe(res);
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Download failed', details: error.message });
    }
});

// ─── LIST FILES ───────────────────────────────────────────────────────
// GET /api/files?prefix=laser/&maxKeys=100
app.get('/api/files', async (req, res) => {
    try {
        const { prefix, maxKeys, continuationToken } = req.query;

        const command = new ListObjectsV2Command({
            Bucket: process.env.B2_BUCKET_NAME,
            Prefix: prefix || '',
            MaxKeys: parseInt(maxKeys) || 100,
            ContinuationToken: continuationToken || undefined
        });

        const response = await s3.send(command);

        const files = (response.Contents || []).map(item => ({
            key: item.Key,
            size: item.Size,
            lastModified: item.LastModified,
            url: `https://f005.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${item.Key}`
        }));

        res.json({
            success: true,
            files,
            totalFiles: response.KeyCount,
            isTruncated: response.IsTruncated,
            nextToken: response.NextContinuationToken
        });
    } catch (error) {
        console.error('List files error:', error);
        res.status(500).json({ error: 'Failed to list files', details: error.message });
    }
});

// ─── DELETE FILE ──────────────────────────────────────────────────────
// DELETE /api/files?key=path/to/file.stl
app.delete('/api/files', async (req, res) => {
    try {
        const { key } = req.query;
        if (!key) {
            return res.status(400).json({ error: 'File key is required' });
        }

        const command = new DeleteObjectCommand({
            Bucket: process.env.B2_BUCKET_NAME,
            Key: key
        });

        await s3.send(command);

        res.json({ success: true, message: `File ${key} deleted` });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Delete failed', details: error.message });
    }
});

// ─── START SERVER ─────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🚀 ArtDesing Proxy Server running on http://localhost:${PORT}`);
    console.log(`📦 B2 Bucket: ${process.env.B2_BUCKET_NAME}`);
    console.log(`🌍 Allowed Origins: ${allowedOrigins.join(', ')}\n`);
});
