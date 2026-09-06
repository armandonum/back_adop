"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reporteController_1 = require("../controllers/reporteController");
const auth_1 = require("../middlewares/auth");
const roles_1 = require("../middlewares/roles");
const router = (0, express_1.Router)();
router.get('/estadisticas', auth_1.authenticate, roles_1.requireAdmin, reporteController_1.estadisticasGenerales);
router.get('/adopciones', auth_1.authenticate, roles_1.requireAdmin, reporteController_1.reporteAdopciones);
router.get('/mascotas', auth_1.authenticate, roles_1.requireAdmin, reporteController_1.reporteMascotas);
router.get('/solicitudes', auth_1.authenticate, roles_1.requireAdmin, reporteController_1.reporteSolicitudes);
exports.default = router;
//# sourceMappingURL=reporteRoutes.js.map