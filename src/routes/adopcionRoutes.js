"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adopcionController_1 = require("../controllers/adopcionController");
const auth_1 = require("../middlewares/auth");
const roles_1 = require("../middlewares/roles");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, roles_1.requireAdmin, adopcionController_1.listarAdopciones);
router.get('/mis-adopciones', auth_1.authenticate, adopcionController_1.misAdopciones);
router.get('/:id', auth_1.authenticate, adopcionController_1.obtenerAdopcion);
router.post('/', auth_1.authenticate, roles_1.requireAdmin, adopcionController_1.registrarAdopcion);
router.put('/:id/estado', auth_1.authenticate, roles_1.requireAdmin, adopcionController_1.actualizarEstadoAdopcion);
exports.default = router;
//# sourceMappingURL=adopcionRoutes.js.map