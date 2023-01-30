"use strict";
// not found
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundError = void 0;
const notFoundError = (req, res, next) => {
    const error = new Error('Not found: ' + req.originalUrl);
    res.status(404);
    next(error);
};
exports.notFoundError = notFoundError;
const errorHandler = (error, req, res) => {
    console.log(`errorHandler: `, { error });
    const statuscode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statuscode);
    res.json({
        message: error === null || error === void 0 ? void 0 : error.message,
        stack: error === null || error === void 0 ? void 0 : error.stack,
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map