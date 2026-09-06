"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarPassword = exports.validarTelefono = exports.validarCI = exports.validarEmail = void 0;
const validarEmail = (email) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
};
exports.validarEmail = validarEmail;
const validarCI = (ci) => {
    const regex = /^[0-9]{6,10}$/;
    return regex.test(ci);
};
exports.validarCI = validarCI;
const validarTelefono = (telefono) => {
    const regex = /^[0-9]{7,10}$/;
    return regex.test(telefono);
};
exports.validarTelefono = validarTelefono;
const validarPassword = (password) => {
    return password.length >= 6;
};
exports.validarPassword = validarPassword;
//# sourceMappingURL=validators.js.map