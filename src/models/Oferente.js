"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OferenteModel = void 0;
const mongoose_1 = require("mongoose");
const oferenteSchema = new mongoose_1.Schema({
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
    tipoOferente: {
        type: String,
        required: true,
        enum: ['persona', 'rescatista', 'organizacion'],
        maxlength: 30,
    },
    estado: {
        type: Boolean,
        default: true,
    },
}, {
    collection: 'oferentes',
    versionKey: false,
    timestamps: true,
});
oferenteSchema.index({ usuario: 1 });
oferenteSchema.index({ ci: 1 });
oferenteSchema.index({ correo: 1 });
exports.OferenteModel = (0, mongoose_1.model)('Oferente', oferenteSchema);
//# sourceMappingURL=Oferente.js.map