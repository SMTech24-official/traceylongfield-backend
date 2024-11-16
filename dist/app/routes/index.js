"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("../module/users/user.routes");
const auth_route_1 = require("../module/auth/auth.route");
const book_route_1 = require("../module/book/book.route");
const reading_routes_1 = require("../module/reading/reading.routes");
const admin_route_1 = require("../module/admin/admin.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    { path: '/users',
        route: user_routes_1.UserRoutes
    },
    { path: '/auth',
        route: auth_route_1.AuthRoutes
    },
    { path: '/book',
        route: book_route_1.bookRoutes
    },
    { path: '/reading',
        route: reading_routes_1.ReadingRouter
    },
    { path: '/admin',
        route: admin_route_1.AdminRouters
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
