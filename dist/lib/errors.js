"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { ValidationError } = require('yup');
class UnauthorizedError extends Error {
}
class ForbiddenError extends Error {
}
class NotFoundError extends Error {
}
class ServerError extends Error {
}
exports.errors = {
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ValidationError,
    ServerError // 500
};
//# sourceMappingURL=errors.js.map