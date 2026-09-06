// backend/src/config/database/connection.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Verificar que la variable existe
const MONGO_URI = process.env.MONGO_URI || '';

// ✅ Log para depuración (NUNCA mostrar la contraseña completa en producción)
console.log('🔍 MONGO_URI configurada?', MONGO_URI ? '✅ Sí' : '❌ No');
console.log('🔍 MONGO_URI longitud:', MONGO_URI.length);
console.log('🔍 MONGO_URI comienza con mongodb:', MONGO_URI.startsWith('mongodb'));

if (!MONGO_URI) {
  console.error('❌ MONGO_URI no está definida en las variables de entorno');
}

export const connectDB = async () => {
  try {
    // ✅ Validar que la URI existe y es válida
    if (!MONGO_URI || !MONGO_URI.startsWith('mongodb')) {
      throw new Error(`MONGO_URI inválida: "${MONGO_URI}". Debe comenzar con "mongodb://" o "mongodb+srv://"`);
    }

    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 1,
    };

    await mongoose.connect(MONGO_URI, options);
    console.log('✅ MongoDB conectado exitosamente');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    throw error;
  }
};

export const isConnected = () => mongoose.connection.readyState === 1;

mongoose.connection.on('connected', () => {
  console.log('🟢 MongoDB conectado');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Error en MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 MongoDB desconectado');
});