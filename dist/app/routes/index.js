"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("../module/users/user.routes");
const auth_route_1 = require("../module/auth/auth.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    { path: '/users',
        route: user_routes_1.UserRoutes
    },
    { path: '/auth',
        route: auth_route_1.AuthRoutes
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
