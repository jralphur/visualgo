import bcrypt from "bcrypt";
import { type Kysely, sql } from "kysely";
import {
	afterAll,
	afterEach,
	assert,
	beforeAll,
	beforeEach,
	describe,
	expect,
	test,
} from "vitest";
import type { Database } from "../database_types";
import { getDatabase } from "./database";
import { registerUser } from "./user";

const hasAccount = async (
	db: Kysely<Database> | undefined,
	username: string,
) => {
	const query = await db
		?.selectFrom("users")
		.select("username")
		.where("username", "=", username)
		.executeTakeFirst();

	return query !== undefined;
};

describe("account registration", async () => {
	let db: Kysely<Database> | undefined;
	assert(process.env.DB_HOST, "DB_HOST environment variable is not defined");
	assert(process.env.DB_PORT, "DB_PORT environment variable is not defined");
	const port = parseInt(process.env.DB_PORT, 10);
	// console.log(port);
	assert(
		!Number.isNaN(port) && Number.isInteger(port),
		"DB_PORT is not an integer",
	);

	beforeAll(async () => {
		db = await getDatabase();

		// await db?.schema
		// 	.createTable("users")
		// 	.addColumn("username", "varchar", (cb) => cb.primaryKey())
		// 	.addColumn("hash", "varchar")
		// 	.addColumn("created_at", "timestamp", (cb) =>
		// 		cb.notNull().defaultTo(sql`now()`),
		// 	)
		// 	.execute();
	});

	afterAll(async () => {
		// await db?.schema.dropTable("users").execute();
		await db?.destroy();
	});

	beforeEach(async () => {
		await db?.schema
			.createTable("users")
			.ifNotExists()
			.addColumn("username", "varchar", (cb) => cb.primaryKey())
			.addColumn("hash", "varchar")
			.addColumn("created_at", "timestamp", (cb) =>
				cb.notNull().defaultTo(sql`now()`),
			)
			.execute();
	});

	afterEach(async () => {
		if (db) await sql`drop table ${sql.table("users")}`.execute(db);
	});

	test("registering a new account", async () => {
		const password = await bcrypt.hash("password", 10);

		await expect(
			registerUser({
				username: "test",
				created_at: new Date(),
				hash: password,
			}),
		).resolves.not.toThrowError();

		const acc = await hasAccount(db, "test");

		expect(acc).toBe(true);
	});

	test("registering account that already exists should fail", async () => {
		const password = await bcrypt.hash("password", 10);

		await expect(
			registerUser({
				username: "test",
				created_at: new Date(),
				hash: password,
			}),
		).resolves.not.toThrowError();

		expect(await hasAccount(db, "test")).toBe(true);

		await expect(
			registerUser({
				username: "test",
				created_at: new Date(),
				hash: password,
			}),
		).rejects.toThrowError();
	});
});

// describe("existing accounts", async () => {
// 	let db: Kysely<Database> | undefined;

// 	beforeAll(async () => {
// 		db = getDatabase();

// 		await db?.schema
// 			.createTable("users")
// 			.addColumn("username", "varchar", (cb) => cb.primaryKey())
// 			.addColumn("hash", "varchar")
// 			.addColumn("created_at", "timestamp", (cb) =>
// 				cb.notNull().defaultTo(sql`now()`),
// 			)
// 			.execute();

// 		const password = await bcrypt.hash("password", 10);
// 		try {
// 			await registerUser({
// 				username: "test",
// 				created_at: new Date(),
// 				hash: password,
// 			});
// 		} catch (e: unknown) {
// 			if (e instanceof NoResultError)
// 				console.error("failed to register db", e.message);
// 		}
// 	});

// 	afterAll(async () => {
// 		if (db) await sql`drop table ${sql.table("users")}`.execute(db);
// 		await db?.destroy();
// 	});
// });
