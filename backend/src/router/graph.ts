import { TRPCError } from "@trpc/server";
import { NoResultError } from "kysely";
import { ulid } from "ulid";
import z from "zod";
import {
	addNewGraph,
	editGraph,
	getGraphbyUid,
	getGraphsByUsername,
	getRecentGraphs,
} from "../database/graph";
import { authedProcedure, publicProcedure, router } from "../trpc";

export const GraphRouter = router({
	addGraph: authedProcedure
		.input(
			z.object({
				graph_name: z.string(),
				description: z.string().nullish(),
				graph: z.string(),
				preview: z.base64(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { username } = ctx;

			const g = await addNewGraph({
				username,
				graph_json: input.graph,
				name: input.graph_name,
				uid: ulid(),
				preview: z.util.base64ToUint8Array(input.preview),
				description: input.description ?? "",
				creation_date: new Date(),
				last_modified: new Date(),
			});

			return g;
		}),
	getGraphNamesByUsername: publicProcedure
		.input(z.object({ name: z.string() }))
		.query(async (opts) => {
			const { name } = opts.input;

			const g = await getGraphsByUsername(name, [
				"creation_date",
				"uid",
				"username",
				"last_modified",
			]);

			return g;
		}),
	getGraphbyUid: authedProcedure
		.input(z.object({ uid: z.string() }))
		.query(async (opts) => {
			const { uid } = opts.input;

			try {
				const g = await getGraphbyUid(uid, [
					"creation_date",
					"uid",
					"username",
					"graph_json",
					"last_modified",
					"name",
				]);
				return g;
			} catch (e) {
				if (e instanceof NoResultError) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: `graph ${uid} does not exist`,
					});
				}
			}
		}),
	editGraphByUid: authedProcedure
		.input(
			z.object({
				uid: z.string(),
				updatedGraph: z
					.object({
						name: z.string(),
						new_graph: z.string().optional(),
					})
					.partial(),
			}),
		)
		.query(async (opts) => {
			const { uid, updatedGraph } = opts.input;
			const username = opts.ctx.username;
			const { name, new_graph } = updatedGraph;

			try {
				const g = await getGraphbyUid(uid, ["username"]);
				if (g.username !== username) {
					throw new TRPCError({
						code: "UNAUTHORIZED",
					});
				}

				const edited = await editGraph(uid, {
					name: name ?? g.name,
					graph_json: new_graph ?? g.graph_json,
					last_modified: new Date(),
				});

				return edited;
			} catch (e) {
				if (e instanceof NoResultError) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: `graph ${uid} does not exist`,
					});
				}
			}
		}),
	getRecentGraphs: publicProcedure
		.input(z.object({ limit: z.number().default(10) }))
		.query(async ({ input }) => {
			const { limit } = input;

			const res = await getRecentGraphs(limit);

			return res.map((r) => ({
				...r,
				preview: z.util.uint8ArrayToBase64(r.preview),
			}));
		}),
});
