"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/mascotaRoutes.ts
const express_1 = require("express");
const mascotaController_1 = require("../controllers/mascotaController");
const auth_1 = require("../middlewares/auth");
const roles_1 = require("../middlewares/roles");
const validation_1 = require("../middlewares/validation");
const upload_1 = require("../middlewares/upload");
const router = (0, express_1.Router)();
router.get('/', mascotaController_1.listarMascotas);
router.get('/mis-mascotas', auth_1.authenticate, roles_1.requireOferente, mascotaController_1.misMascotas);
router.get('/:id', mascotaController_1.obtenerMascota);
router.post('/', auth_1.authenticate, roles_1.requireOferente, upload_1.uploadMascota, (0, validation_1.validate)(validation_1.validacionesMascota), mascotaController_1.crearMascota);
router.put('/:id', auth_1.authenticate, upload_1.uploadMascota, mascotaController_1.actualizarMascota);
router.delete('/:id', auth_1.authenticate, mascotaController_1.eliminarMascota);
exports.default = router;
//# sourceMappingURL=mascotaRoutes.js.map