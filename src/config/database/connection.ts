// backend/src/config/database/connection.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:Admin123456@flori.kepjxld.mongodb.net/adopciones?retryWrites=true&w';

export const connectDB = async () => {
  try {
    // ✅ Configurar opciones de conexión para Vercel
    const options = {
      serverSelectionTimeoutMS: 10000, // 10 segundos
      socketTimeoutMS: 45000, // 45 segundos
      family: 4, // Usar IPv4
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

// ✅ Función para verificar si MongoDB está conectado
export const isConnected = () => mongoose.connection.readyState === 1;

// ✅ Eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('🟢 MongoDB conectado');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Error en MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 MongoDB desconectado');
});