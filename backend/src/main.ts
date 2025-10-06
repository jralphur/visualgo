import express from "express";
import { RequestHandler } from 'express';

const server = express();
const port = 8000;

const logger: RequestHandler =  (req, _, next) => {
    console.log(new Date(Date.now()).toString(), req.method, req.path)
    next()
}

server.use(logger);
server.get('/', (_, res) => {
    res.send("Hello, world!");
})

server.listen(port, () => {
    console.log(`Listening on ${port}`);
})