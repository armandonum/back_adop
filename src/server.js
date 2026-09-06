"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const connection_1 = require("./config/database/connection");
const env_1 = require("./config/env");
const startServer = async () => {
    await (0, connection_1.connectDB)();
    const PORT = env_1.env.port;
    app_1.default.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
};
startServer();
//# sourceMappingURL=server.js.map