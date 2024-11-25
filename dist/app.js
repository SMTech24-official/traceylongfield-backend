"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const routes_1 = __importDefault(require("./app/routes"));
const node_cron_1 = __importDefault(require("node-cron"));
const path_1 = __importDefault(require("path"));
const payment_services_1 = require("./app/module/payment/payment.services");
const deleteUnverifiedUser_1 = require("./app/utils/deleteUnverifiedUser");
const AppError_1 = __importDefault(require("./app/errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const app = (0, express_1.default)();
//parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ origin: ['https://celebrated-kitten-1b6ccf.netlify.app', "http://localhost:3000", "https://amz-book-review.vercel.app"], credentials: true }));
// application routes
app.use('/api', routes_1.default);
app.get('/', (req, res) => {
    res.send('Hi Developer !');
});
// Serve static files from the uploads directory
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "..", "uploads")));
app.use(express_1.default.static("public"));
node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, payment_services_1.checkExpiredSubscriptions)();
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, error.message);
    }
}));
node_cron_1.default.schedule("*/1 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, deleteUnverifiedUser_1.deleteUnverifiedUsers)();
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, error.message);
    }
}));
app.use(globalErrorhandler_1.default);
//Not Found
app.use(notFound_1.default);
exports.default = app;
