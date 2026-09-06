"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipoMascotaModel = void 0;
const mongoose_1 = require("mongoose");
const tipoMascotaSchema = new mongoose_1.Schema({
    nombreTipo: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: 50,
    },
    descripcion: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    icono: {
        type: String,
        trim: true,
        maxlength: 255,
    },
    estado: {
        type: Boolean,
        default: true,
    },
}, {
    collection: 'tipos_mascota',
    versionKey: false,
    timestamps: true,
});
exports.TipoMascotaModel = (0, mongoose_1.model)('TipoMascota', tipoMascotaSchema);
//# sourceMappingURL=TipoMascota.js.map