"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const handleError = (res, error, status = 500) => {
    return res.status(status).json({
        success: false,
        message: error.message || "Internal Server Error",
    });
};
exports.handleError = handleError;
