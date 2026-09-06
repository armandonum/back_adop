"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolicitudAdopcionModel = void 0;
const mongoose_1 = require("mongoose");
const solicitudAdopcionSchema = new mongoose_1.Schema({
    postulante: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Postulante',
        required: true,
    },
    mascota: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Mascota',
        required: true,
    },
    oferente: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Oferente',
        required: true,
    },
    fechaSolicitud: {
        type: Date,
        default: Date.now,
    },
    estadoSolicitud: {
        type: String,
        required: true,
        enum: ['pendiente', 'aprobada', 'rechazada', 'cancelada'],
        default: 'pendiente',
        maxlength: 30,
    },
    motivoPostulacion: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
    },
    // Evaluación - según documento
    tiempoDisponible: {
        type: String,
        enum: ['menos_1_hora', '1_3_horas', '3_5_horas', 'mas_5_horas'],
        maxlength: 30,
    },
    tipoVivienda: {
        type: String,
        enum: ['casa_patio', 'casa_jardin', 'departamento', 'casa_pequena'],
        maxlength: 30,
    },
    experienciaPrevia: {
        type: Boolean,
        default: false,
    },
    tieneOtrosAnimales: {
        type: Boolean,
        default: false,
    },
    otrosAnimalesDescripcion: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    tieneHijos: {
        type: Boolean,
        default: false,
    },
    edadesHijos: {
        type: String,
        trim: true,
        maxlength: 100,
    },
    presupuestoMensual: {
        type: String,
        enum: ['menos_100', '100_300', '300_500', 'mas_500'],
        maxlength: 30,
    },
    compromiso: {
        type: String,
        enum: ['bajo', 'medio', 'alto'],
        maxlength: 30,
    },
    razonAdopcion: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    resultadoEvaluacion: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    puntajeEvaluacion: {
        type: Number,
        min: 0,
        max: 100,
    },
    entrevistaRealizada: {
        type: Boolean,
        default: false,
    },
    visitaDomiciliaria: {
        type: Boolean,
        default: false,
    },
    observaciones: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    comentarioOferente: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    fechaRespuesta: {
        type: Date,
    },
}, {
    collection: 'solicitudes_adopcion',
    versionKey: false,
    timestamps: true,
});
// Índices
solicitudAdopcionSchema.index({ postulante: 1, mascota: 1 }, { unique: true });
solicitudAdopcionSchema.index({ mascota: 1 });
solicitudAdopcionSchema.index({ oferente: 1 });
solicitudAdopcionSchema.index({ estadoSolicitud: 1 });
solicitudAdopcionSchema.index({ fechaSolicitud: -1 });
exports.SolicitudAdopcionModel = (0, mongoose_1.model)('SolicitudAdopcion', solicitudAdopcionSchema);
//# sourceMappingURL=SolicitudAdopcion.js.map