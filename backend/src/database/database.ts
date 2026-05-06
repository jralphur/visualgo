import assert from "node:assert";
import { Kysely, PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import type { Database } from "../database_types";

let db: Kysely<Database> | undefined;

export async function getDatabase(): Promise<Kysely<Database>> {
	// assert(process.env.DB_HOST, "DB_HOST environment variable is not defined");
	assert(process.env.DB_PORT, "DB_PORT environment variable is not defined");
	const port = parseInt(process.env.DB_PORT, 10);
	// assert(
	// 	!Number.isNaN(port) && !Number.isInteger(port),
	// 	"DB_PORT is not an integer",
	// );

	if (!db) {
		db = new Kysely<Database>({
			dialect: new PostgresDialect({
				pool: new Pool({
					database: process.env.DB_DATABASE,
					host: process.env.DB_HOST,
					user: process.env.DB_USERNAME,
					password: process.env.DB_PASSWORD,
					port,
					max: 10,
				}),
			}),
		});

		await Promise.all([createUserTable(db), createGraphTable(db)]);
		return db;
	} else {
		return db;
	}
}

const createUserTable = async (db: Kysely<Database>) => {
	await db?.schema
		.createTable("users")
		.ifNotExists()
		.addColumn("username", "varchar", (cb) => cb.primaryKey())
		.addColumn("hash", "varchar")
		.addColumn("created_at", "timestamp", (cb) =>
			cb.notNull().defaultTo(sql`now()`),
		)
		.execute();
};

const createGraphTable = async (db: Kysely<Database>) => {
	await db?.schema
		.createTable("graphs")
		.ifNotExists()
		.addColumn("uid", "varchar", (cb) => cb.primaryKey())
		.addColumn("username", "varchar")
		.addColumn("name", "varchar")
		.addColumn("graph_json", "text")
		.addColumn("preview", "bytea")
		.addColumn("description", "varchar(120)")
		.addColumn("creation_date", "date", (cb) =>
			cb.notNull().defaultTo(sql`now()`),
		)
		.addColumn("last_modified", "date", (cb) =>
			cb.notNull().defaultTo(sql`now()`),
		)
		.execute();
};
