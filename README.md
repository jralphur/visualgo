Currently working on project. This project is a visualization app of popular computer science data structures and algorithm.

Many features are missing.

The goal is for users to create and share algorithms and their implementation.

Frontend: React + Tanstack Query + Tanstack Router + Tailwind + tRPC + PixiJS (WebGL drawing)

Backend: tRPC with a small Express.js wrapper + PostgresSQL

Database logic and code has not been implemented yet, but it perform to the `instareddit` project where I would have tables for accounts, user profiles, favorite algorithms visualizations
posted visualizations, etc.

Using Valkey (fork of Redis) to handle authentication

There is currently a bug involving with third party libraries for PixiJS, as these do not interact with the DOM or React in a simple manner.
