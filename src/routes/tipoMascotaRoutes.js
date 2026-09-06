"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tipoMascotaController_1 = require("../controllers/tipoMascotaController");
const auth_1 = require("../middlewares/auth");
const roles_1 = require("../middlewares/roles");
const router = (0, express_1.Router)();
router.get('/', tipoMascotaController_1.listarTiposMascota);
router.post('/', auth_1.authenticate, roles_1.requireAdmin, tipoMascotaController_1.crearTipoMascota);
router.put('/:id', auth_1.authenticate, roles_1.requireAdmin, tipoMascotaController_1.actualizarTipoMascota);
router.delete('/:id', auth_1.authenticate, roles_1.requireAdmin, tipoMascotaController_1.eliminarTipoMascota);
exports.default = router;
//# sourceMappingURL=tipoMascotaRoutes.js.map