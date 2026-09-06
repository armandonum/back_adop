"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseError extends Error {
    constructor(params) {
        super(params.message);
        this.name = params.name;
        this.code = params.code;
        this.status = params.status;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}
exports.default = BaseError;
//# sourceMappingURL=BaseError.js.map