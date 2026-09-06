"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../middlewares/validation");
const router = (0, express_1.Router)();
router.post('/registro', (0, validation_1.validate)(validation_1.validacionesRegistro), authController_1.registro);
router.post('/login', (0, validation_1.validate)(validation_1.validacionesLogin), authController_1.login);
router.get('/perfil', auth_1.authenticate, authController_1.perfil);
router.put('/cambiar-contrasena', auth_1.authenticate, authController_1.cambiarContrasena);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map