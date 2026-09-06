"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const solicitudController_1 = require("../controllers/solicitudController");
const auth_1 = require("../middlewares/auth");
const roles_1 = require("../middlewares/roles");
const validation_1 = require("../middlewares/validation");
const router = (0, express_1.Router)();
router.get('/test', (req, res) => {
    res.json({
        message: '✅Ruta de solicitudes funcionando',
        timestamp: new Date().toISOString()
    });
});
router.get('/mis-solicitudes', auth_1.authenticate, roles_1.requireSolicitante, solicitudController_1.listarSolicitudes);
router.get('/recibidas', auth_1.authenticate, roles_1.requireOferente, solicitudController_1.solicitudesRecibidas);
router.post('/', auth_1.authenticate, roles_1.requireSolicitante, (0, validation_1.validate)(validation_1.validacionesSolicitud), solicitudController_1.crearSolicitud);
//  Rutas con parámetros (deben ir al final)
router.get('/:id', auth_1.authenticate, solicitudController_1.obtenerSolicitud);
router.put('/:id/responder', auth_1.authenticate, roles_1.requireOferente, solicitudController_1.responderSolicitud);
router.put('/:id/cancelar', auth_1.authenticate, roles_1.requireSolicitante, solicitudController_1.cancelarSolicitud);
exports.default = router;
//# sourceMappingURL=solicitudRoutes.js.map