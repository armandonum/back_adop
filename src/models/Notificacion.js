"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificacionModel = void 0;
const mongoose_1 = require("mongoose");
const notificacionSchema = new mongoose_1.Schema({
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    tipo: {
        type: String,
        required: true,
        enum: [
            'solicitud_nueva',
            'solicitud_aprobada',
            'solicitud_rechazada',
            'solicitud_cancelada',
            'adopcion_registrada',
            'seguimiento_nuevo',
            'mensaje',
            'sistema',
            'recordatorio',
        ],
        maxlength: 50,
    },
    titulo: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    mensaje: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
    },
    enlace: {
        type: String,
        trim: true,
        maxlength: 255,
        default: null,
    },
    leido: {
        type: Boolean,
        default: false,
    },
    fechaLectura: {
        type: Date,
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed,
    },
    prioridad: {
        type: String,
        enum: ['baja', 'media', 'alta'],
        default: 'media',
        maxlength: 10,
    },
}, {
    collection: 'notificaciones',
    versionKey: false,
    timestamps: true,
});
notificacionSchema.index({ usuario: 1 });
notificacionSchema.index({ leido: 1 });
notificacionSchema.index({ usuario: 1, leido: 1 });
notificacionSchema.index({ createdAt: -1 });
notificacionSchema.index({ tipo: 1 });
exports.NotificacionModel = (0, mongoose_1.model)('Notificacion', notificacionSchema);
//# sourceMappingURL=Notificacion.js.map