"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingle = exports.uploadMascota = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Asegurar que la carpeta uploads existe
const uploadDir = path_1.default.join(__dirname, '../../uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Configuración de almacenamiento
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, `mascota-${uniqueSuffix}${ext}`);
    }
});
// Filtro de archivos (solo imágenes)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Solo se permiten imágenes (JPEG, PNG, JPG, WEBP, GIF)'), false);
    }
};
// Configurar multer
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: fileFilter
});
// Middleware para subir múltiples imágenes (hasta 5)
exports.uploadMascota = exports.upload.fields([
    { name: 'fotoPrincipal', maxCount: 1 },
    { name: 'fotografias', maxCount: 5 }
]);
// Middleware para subir una sola imagen
exports.uploadSingle = exports.upload.single('fotoPrincipal');
//# sourceMappingURL=upload.js.map