import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import z from "zod";
import { findUserByName, registerUser, userExists } from "../database/user";
import { publicProcedure, router } from "../trpc";

const secret = (() => {
	if (process.env.PORT) {
		return process.env.PORT;
	}

	console.error("PORT environment variable not set!");
	process.exit(1);
})();

export const UserRouter = router({
	userRegister: publicProcedure
		.input(z.object({ username: z.string(), password: z.string() }))
		.mutation(async (opts) => {
			const { input } = opts;
			const { username, password } = input;

			if (await userExists(username)) {
				throw new TRPCError({
					code: "CONFLICT",
					message: "Username is not available.",
				});
			}

			const secret = process.env.SECRET || "";
			const hash_rounds = 10;
			const hash = await bcrypt.hash(password, hash_rounds);

			await registerUser({ username, hash, created_at: new Date() });
			const token = jwt.sign({ username }, secret, { expiresIn: "7d" });

			return { token, username, iat: Date.now() };
		}),

	userLogin: publicProcedure
		.input(
			z.object({
				username: z.string(),
				password: z.string(),
			}),
		)
		.query(async ({ input }) => {
			const { username, password } = input;

			const user = await findUserByName(username);

			if (user === undefined) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Username or password is incorrect",
				});
			} else {
				const { hash } = user;
				const ok = await bcrypt.compare(password, hash);

				if (!ok) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Username or password is incorrect",
					});
				}

				const token = jwt.sign({ username }, secret, { expiresIn: "7d" });
				return { token, username, iat: Date.now() };
			}
		}),
});
