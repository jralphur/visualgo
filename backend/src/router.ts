import { GraphRouter } from "./router/graph";
import { UserRouter } from "./router/user";
import { router } from "./trpc";

export const AppRouter = router({
	user: UserRouter,
	graphs: GraphRouter,
});

export type AppRouter = typeof AppRouter;
