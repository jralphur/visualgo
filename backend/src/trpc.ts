import { initTRPC, TRPCError } from "@trpc/server";
import type * as trpcExpress from "@trpc/server/adapters/express";
import jwt from "jsonwebtoken";
import type { AuthToken } from "./types";

export const createContext = async ({
	req,
	res,
}: trpcExpress.CreateExpressContextOptions) => {
	const getAuthHeaders = () => {
		if (req.headers?.authorization?.startsWith("Bearer")) {
			return req.headers.authorization.split(" ")[1];
		}

		return null;
	};

	const parseDecodedToken = (j: unknown): j is AuthToken => {
		return j instanceof Object && "iat" in j && "token" in j && "username" in j;
	};

	const decodeJWTToken = async (bearer: string) => {
		const d = jwt.verify(bearer, "secret");
		if (parseDecodedToken(d)) {
			return d;
		}

		return null;
	};

	const bearer = getAuthHeaders() || null;

	if (bearer === null) {
		return {};
	}

	const decoded = await decodeJWTToken(bearer);

	if (decoded) {
		return { username: decoded.username };
	}

	return {};
};

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();
// const t = initTRPC.create();
export const publicProcedure = t.procedure;
export const authedProcedure = publicProcedure.use(function isAuthed(opts) {
	if (!opts.ctx.username) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
		});
	}
	return opts.next({
		ctx: {
			username: opts.ctx.username,
		},
	});
});
export const router = t.router;
