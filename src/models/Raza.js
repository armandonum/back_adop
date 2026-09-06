"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazaModel = void 0;
const mongoose_1 = require("mongoose");
const razaSchema = new mongoose_1.Schema({
    tipoMascota: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'TipoMascota',
        required: true,
    },
    nombreRaza: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80,
    },
    descripcion: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    caracteristicas: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    estado: {
        type: Boolean,
        default: true,
    },
}, {
    collection: 'razas',
    versionKey: false,
    timestamps: true,
});
razaSchema.index({ tipoMascota: 1, nombreRaza: 1 }, { unique: true });
razaSchema.index({ tipoMascota: 1 });
razaSchema.index({ nombreRaza: 1 });
exports.RazaModel = (0, mongoose_1.model)('Raza', razaSchema);
//# sourceMappingURL=Raza.js.map