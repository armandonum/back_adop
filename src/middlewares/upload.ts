// backend/src/middlewares/upload.ts
import multer from 'multer';
import path from 'path';

// ✅ Configuración para almacenar archivos en memoria
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (JPEG, PNG, JPG, WEBP, GIF)'), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

export const uploadMascota = upload.fields([
  { name: 'fotoPrincipal', maxCount: 1 },
  { name: 'fotografias', maxCount: 5 }
]);

export const uploadSingle = upload.single('fotoPrincipal');