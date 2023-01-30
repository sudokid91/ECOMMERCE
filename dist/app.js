"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const dbConnect_1 = require("./config/dbConnect");
(0, dbConnect_1.dbConnect)();
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const body_parser_1 = __importDefault(require("body-parser"));
const errorHandler_1 = require("./middlewares/errorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const PORT = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use("/api/user", authRoute_1.default);
app.use(errorHandler_1.notFoundError);
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log("server listening on port: ", PORT);
});
//# sourceMappingURL=app.js.map