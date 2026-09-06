"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificacionController_1 = require("../controllers/notificacionController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, notificacionController_1.listarNotificaciones);
router.put('/:id/leer', auth_1.authenticate, notificacionController_1.marcarComoLeida);
router.put('/leer-todas', auth_1.authenticate, notificacionController_1.marcarTodasComoLeidas);
router.delete('/:id', auth_1.authenticate, notificacionController_1.eliminarNotificacion);
exports.default = router;
//# sourceMappingURL=notificacionRoutes.js.map