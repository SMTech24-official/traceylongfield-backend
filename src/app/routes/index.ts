import { Router  } from "express";
import { UserRoutes } from "../module/users/user.routes";
import { AuthRoutes } from "../module/auth/auth.route";
import { bookRoutes } from "../module/book/book.route";
import { ReadingRouter } from "../module/reading/reading.routes";
import { AdminRouters } from "../module/admin/admin.route";


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
 
]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;