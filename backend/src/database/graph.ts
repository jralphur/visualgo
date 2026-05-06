import type { EditedGraph, Graph, NewGraph } from "../database_types";
import { getDatabase } from "./database";

export async function getGraphsByUsername(
	username: Graph["username"],
	target_fields: Array<keyof Graph>,
) {
	return await (await getDatabase())
		.selectFrom("graphs")
		.select(target_fields)
		.where("username", "=", username)
		.execute();
}

export async function addNewGraph(newGraph: NewGraph) {
	return await (await getDatabase())
		.insertInto("graphs")
		.values(newGraph)
		.returningAll()
		.executeTakeFirstOrThrow();
}

export async function editGraph(uid: Graph["uid"], graph: EditedGraph) {
	return await (await getDatabase())
		.updateTable("graphs")
		.set(graph)
		.where("uid", "=", uid)
		.returningAll()
		.executeTakeFirstOrThrow();
}

export async function getGraphbyUid(
	uid: Graph["uid"],
	target_fields: Array<keyof Graph>,
) {
	return await (await getDatabase())
		.selectFrom("graphs")
		.select(target_fields)
		.where("uid", "=", uid)
		.executeTakeFirstOrThrow();
}

export async function deleteGraphByUid(uid: Graph["uid"]) {
	return await (await getDatabase())
		.deleteFrom("graphs")
		.where("uid", "=", uid)
		.executeTakeFirstOrThrow();
}

export async function getRecentGraphs(limit: number) {
	return await (await getDatabase())
		.selectFrom("graphs")
		.select([
			"uid",
			"username",
			"last_modified",
			"name",
			"preview",
			"description",
		])
		.orderBy("last_modified", "desc")
		.limit(limit)
		.execute();
}
