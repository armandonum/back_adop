"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const roles_1 = require("../middlewares/roles");
const adminController_1 = require("../controllers/adminController");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate, roles_1.requireAdmin);
router.get('/usuarios', adminController_1.listarUsuarios);
router.put('/usuarios/:id/estado', adminController_1.cambiarEstadoUsuario);
router.get('/mascotas', adminController_1.listarTodasMascotas);
router.get('/solicitudes', adminController_1.listarTodasSolicitudes);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map