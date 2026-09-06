"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const seguimientoController_1 = require("../controllers/seguimientoController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, seguimientoController_1.listarSeguimientos);
router.get('/:id', auth_1.authenticate, seguimientoController_1.obtenerSeguimiento);
router.post('/', auth_1.authenticate, seguimientoController_1.crearSeguimiento);
exports.default = router;
//# sourceMappingURL=seguimientoRoutes.js.map