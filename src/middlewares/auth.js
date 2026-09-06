"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new ApiError_1.default({
                name: 'UNAUTHORIZED',
                message: 'Token no proporcionado',
                code: 'TOKEN_MISSING',
                status: 401,
            });
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('❌ [AUTH] Error:', error);
        next(error);
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map