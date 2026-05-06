import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";

export interface Database {
	users: UserTable;
	graphs: GraphTable;
}

export interface UserTable {
	username: string;
	hash: string;
	created_at: ColumnType<Date, Date, never>;
}

export interface GraphTable {
	uid: string;
	username: string;
	name: string;
	graph_json: string;
	preview: Uint8Array;
	description: string;
	creation_date: ColumnType<Date, Date, Date>;
	last_modified: ColumnType<Date, Date, Date>;
}

export type NewUser = Insertable<UserTable>;
export type User = Selectable<UserTable>;

export type NewGraph = Insertable<GraphTable>;
export type Graph = Selectable<GraphTable>;
export type EditedGraph = Updateable<GraphTable>;
