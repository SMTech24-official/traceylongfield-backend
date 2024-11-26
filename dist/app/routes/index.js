"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("../module/users/user.routes");
const auth_route_1 = require("../module/auth/auth.route");
const book_route_1 = require("../module/book/book.route");
const reading_routes_1 = require("../module/reading/reading.routes");
const admin_route_1 = require("../module/admin/admin.route");
const points_routes_1 = require("../module/points/points.routes");
const knowledgeHub_routes_1 = require("../module/knowledgeHub/knowledgeHub.routes");
const authorGuide_routes_1 = require("../module/authorGuid/authorGuide.routes");
const payment_routes_1 = require("../module/payment/payment.routes");
const invite_routes_1 = require("../module/invite/invite.routes");
const activity_route_1 = require("../module/activity/activity.route");
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
    {
        path: '/point',
        route: points_routes_1.PointRouter
    },
    {
        path: '/knowledgeHub',
        route: knowledgeHub_routes_1.KnowledgeHubRouter
    },
    {
        path: '/authorGuide',
        route: authorGuide_routes_1.AuthorGuide
    },
    {
        path: '/payment',
        route: payment_routes_1.PaymentRoutes
    },
    {
        path: '/invite',
        route: invite_routes_1.inviteRouter
    },
    {
        path: '/activity',
        route: activity_route_1.activityRouter
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
