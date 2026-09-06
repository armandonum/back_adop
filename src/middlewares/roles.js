"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireSolicitante = exports.requireOferente = exports.requireRole = void 0;
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new ApiError_1.default({
                name: 'UNAUTHORIZED',
                message: 'No autenticado',
                code: 'NOT_AUTHENTICATED',
                status: 401,
            });
        }
        if (!roles.includes(req.user.rol)) {
            throw new ApiError_1.default({
                name: 'FORBIDDEN',
                message: 'No tiene permisos para realizar esta acción',
                code: 'INSUFFICIENT_PERMISSIONS',
                status: 403,
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
exports.requireOferente = (0, exports.requireRole)('oferente', 'administrador');
exports.requireSolicitante = (0, exports.requireRole)('solicitante', 'administrador');
exports.requireAdmin = (0, exports.requireRole)('administrador');
//# sourceMappingURL=roles.js.map