import type { NewUser } from "../database_types";
import { getDatabase } from "./database";

export async function findUserByName(username: string) {
	return await (await getDatabase())
		.selectFrom("users")
		.where("username", "=", username)
		.selectAll()
		.executeTakeFirst();
}

export async function userExists(username: string) {
	return !!(await findUserByName(username));
}

export async function registerUser(person: NewUser) {
	return await (await getDatabase())
		.insertInto("users")
		.values(person)
		.returning(["username", "created_at"])
		.executeTakeFirstOrThrow();
}
