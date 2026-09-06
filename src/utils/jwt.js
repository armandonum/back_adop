"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const JWT_SECRET = env_1.env.jwtSecret || 'secret-key';
const JWT_EXPIRES_IN = env_1.env.jwtExpiresIn || '7d';
const generateToken = (payload) => {
    const options = {
        expiresIn: JWT_EXPIRES_IN,
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.js.map