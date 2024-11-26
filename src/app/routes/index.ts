import { Router  } from "express";
import { UserRoutes } from "../module/users/user.routes";
import { AuthRoutes } from "../module/auth/auth.route";
import { bookRoutes } from "../module/book/book.route";
import { ReadingRouter } from "../module/reading/reading.routes";
import { AdminRouters } from "../module/admin/admin.route";
import { PointRouter } from "../module/points/points.routes";
import { KnowledgeHubRouter } from "../module/knowledgeHub/knowledgeHub.routes";
import { AuthorGuide } from "../module/authorGuid/authorGuide.routes";
import { PaymentRoutes } from "../module/payment/payment.routes";
import { inviteRouter } from "../module/invite/invite.routes";



const router = Router();
const moduleRoutes=[
    {   path: '/users',
        route: UserRoutes
    },
    {   path: '/auth',
        route: AuthRoutes
    },
    {   path: '/book',
        route: bookRoutes
    },
 
    {   path: '/reading',
        route: ReadingRouter
    },
    {   path: '/admin',
        route: AdminRouters
    },
    {
        path: '/point',
        route: PointRouter
    },
    {
        path: '/knowledgeHub',
        route: KnowledgeHubRouter
    },
    {
        path: '/authorGuide',
        route: AuthorGuide
    },
    {
        path: '/payment',
        route: PaymentRoutes
    },
    {
        path: '/invite',
        route: inviteRouter
    }
 
]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;