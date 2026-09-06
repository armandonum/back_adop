"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const razaController_1 = require("../controllers/razaController");
const auth_1 = require("../middlewares/auth");
const roles_1 = require("../middlewares/roles");
const router = (0, express_1.Router)();
router.get('/', razaController_1.listarRazas);
router.post('/', auth_1.authenticate, roles_1.requireAdmin, razaController_1.crearRaza);
router.put('/:id', auth_1.authenticate, roles_1.requireAdmin, razaController_1.actualizarRaza);
router.delete('/:id', auth_1.authenticate, roles_1.requireAdmin, razaController_1.eliminarRaza);
exports.default = router;
//# sourceMappingURL=razaRoutes.js.map