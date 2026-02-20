const API_BASE = 'http://localhost:3001/api';

// Upload a single file
export const uploadFile = async (file, path) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Upload failed');
    }

    return response.json();
};

// Upload multiple files
export const uploadMultipleFiles = async (files, folder) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('folder', folder);

    const response = await fetch(`${API_BASE}/upload-multiple`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Upload failed');
    }

    return response.json();
};

// Get a signed download URL
export const getDownloadUrl = async (fileKey) => {
    const response = await fetch(`${API_BASE}/download-url?key=${encodeURIComponent(fileKey)}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to get download URL');
    }

    return response.json();
};

// Download file directly through proxy
export const downloadFile = async (fileKey, fileName) => {
    const response = await fetch(`${API_BASE}/download?key=${encodeURIComponent(fileKey)}`);

    if (!response.ok) {
        throw new Error('Download failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || fileKey.split('/').pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};

// List files in a folder
export const listFiles = async (prefix = '', maxKeys = 100) => {
    const response = await fetch(
        `${API_BASE}/files?prefix=${encodeURIComponent(prefix)}&maxKeys=${maxKeys}`
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to list files');
    }

    return response.json();
};

// Delete a file
export const deleteFile = async (fileKey) => {
    const response = await fetch(`${API_BASE}/files?key=${encodeURIComponent(fileKey)}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Delete failed');
    }

    return response.json();
};
