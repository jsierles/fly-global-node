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
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const express = require("express");
const cookieParser = require("cookie-parser");
const fly_nodejs_1 = require("fly-nodejs");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: fly_nodejs_1.regionalDatabaseUrl()
        },
    },
});
const app = express();
const port = 3500;
app.set('view engine', 'pug');
app.set('views', './views');
app.use(cookieParser());
app.use(fly_nodejs_1.requestHandler);
// Hack to enable error handling in async handlers
// https://medium.com/@benlugavere/using-promises-with-express-8c986c10fae
const asyncWrap = (routeHandler) => (req, res, next) => Promise
    .resolve(routeHandler(req, res, next))
    .catch(err => next(err));
function createUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const random = Math.round(Math.random() * 100);
        yield prisma.user.create({
            data: {
                email: `someemail${random}@example.com`,
                name: `Fer${random}`
            }
        });
    });
}
const root = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.user.findMany();
    res.render('index', { users });
});
const writeGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield createUser();
    const content = `Posted in region ${process_1.env.FLY_REGION}`;
    res.send(content);
});
const post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield createUser();
    const content = `Posted in region ${process_1.env.FLY_REGION}`;
    res.send(content);
});
app.get("/", asyncWrap(root));
app.get("/write_get", asyncWrap(writeGet));
app.post("/", asyncWrap(post));
app.use(fly_nodejs_1.errorHandler);
app.listen(port, () => {
    console.log(`Flying on http://localhost:${port}`);
});
