// Backblaze B2 Configuration
export const B2_CONFIG = {
    bucketName: 'artdesing',
    bucketId: 'fcc21b5502267b9e90cb0a1a',
    endpoint: 'https://s3.us-east-005.backblazeb2.com',
    publicUrl: 'https://f005.backblazeb2.com/file/artdesing',
    keyId: '005c2b526be0baa000000002b',
    // Application key should be used server-side only via proxy
};

// Helper to get the public URL for a file
export const getFileUrl = (fileName) => {
    return `${B2_CONFIG.publicUrl}/${fileName}`;
};

// Categories and their folder prefixes in B2
export const CATEGORIES = {
    laser: {
        id: 'laser',
        name: 'Corte Láser',
        icon: 'Zap',
        color: '#ff4757',
        gradient: 'linear-gradient(135deg, #ff4757, #ff6b81)',
        description: 'Archivos SVG, DXF, AI para corte y grabado láser',
        extensions: ['.svg', '.dxf', '.ai', '.cdr', '.pdf'],
        folder: 'laser/'
    },
    printing3d: {
        id: 'printing3d',
        name: 'Impresión 3D',
        icon: 'Box',
        color: '#7c4dff',
        gradient: 'linear-gradient(135deg, #7c4dff, #b388ff)',
        description: 'Modelos STL, OBJ, 3MF listos para imprimir',
        extensions: ['.stl', '.obj', '.3mf', '.gcode', '.step'],
        folder: '3d/'
    },
    sublimation: {
        id: 'sublimation',
        name: 'Sublimación',
        icon: 'Palette',
        color: '#00b4d8',
        gradient: 'linear-gradient(135deg, #00b4d8, #48cae4)',
        description: 'Diseños PNG, JPG de alta resolución para sublimación',
        extensions: ['.png', '.jpg', '.jpeg', '.svg', '.pdf', '.psd'],
        folder: 'sublimation/'
    }
};
