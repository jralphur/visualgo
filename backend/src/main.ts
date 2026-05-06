import * as trpcExpress from "@trpc/server/adapters/express";
import assert from "assert";
import express, { type RequestHandler } from "express";
import { AppRouter } from "./router";
import { createContext } from "./trpc";

assert(process.env.PORT, "PORT environment variable isn't set!");
const server = express();
const port = process.env.PORT;

const logger: RequestHandler = (req, _, next) => {
	console.log(new Date(Date.now()).toString(), req.method, req.path);
	next();
};

server.use(logger);
server.use(
	"/trpc",
	trpcExpress.createExpressMiddleware({
		router: AppRouter,
		createContext,
	}),
);

server.get("/", (_, res) => {
	res.send("Hello, world!");
});

server.listen(port, () => {
	console.log(`Listening on ${port}`);
});
