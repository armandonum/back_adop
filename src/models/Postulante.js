"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostulanteModel = void 0;
const mongoose_1 = require("mongoose");
const postulanteSchema = new mongoose_1.Schema({
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
        unique: true,
    },
    nombres: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80,
    },
    apellidos: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80,
    },
    ci: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20,
    },
    fechaNacimiento: {
        type: Date,
        required: true,
    },
    edad: {
        type: Number,
        required: true,
        min: 0,
    },
    telefono: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20,
    },
    correo: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        maxlength: 100,
    },
    direccion: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
    },
    ciudad: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80,
        default: 'Sucre',
    },
    ocupacion: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80,
    },
    tipoVivienda: {
        type: String,
        required: true,
        enum: ['casa', 'departamento', 'habitacion', 'otro'],
        maxlength: 30,
    },
    tenenciaVivienda: {
        type: String,
        required: true,
        enum: ['propia', 'alquilada', 'familiar', 'anticretico', 'otro'],
        maxlength: 30,
    },
    tienePatio: {
        type: Boolean,
        default: false,
    },
    tieneOtrasMascotas: {
        type: Boolean,
        default: false,
    },
    experienciaMascotas: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    motivoAdopcion: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    estado: {
        type: Boolean,
        default: true,
    },
}, {
    collection: 'postulantes',
    versionKey: false,
    timestamps: true,
});
postulanteSchema.index({ usuario: 1 });
postulanteSchema.index({ ci: 1 });
postulanteSchema.index({ correo: 1 });
exports.PostulanteModel = (0, mongoose_1.model)('Postulante', postulanteSchema);
//# sourceMappingURL=Postulante.js.map