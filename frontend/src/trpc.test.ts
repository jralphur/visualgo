import {
  createTRPCClient,
  httpBatchLink,
  isTRPCClientError,
  TRPCClientError,
} from "@trpc/client";
import {
  afterAll,
  assert,
  beforeAll,
  describe,
  expect,
  expectTypeOf,
  test,
} from "vitest";
import type { AppRouter } from "../../backend/src/router";
import { getAuthorizationHeaders } from "./jwt";
import type { UserLoginResponse, UserRegisterResponse } from "./types";

const url = `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT ?? "9000"}/trpc`;
describe("registering an account through trpc", () => {
  let client: ReturnType<typeof createTRPCClient<AppRouter>> | null = null;
  beforeAll(() => {
    client = createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url,
          ...getAuthorizationHeaders(),
        }),
      ],
    });
  });

  afterAll(() => {});

  test("registering a new account", async () => {
    assert(client !== null);

    const user = { username: "username", password: "password" };

    const res = await client?.user.mutate(user);

    expectTypeOf<UserRegisterResponse>(
      res,
    ).toEqualTypeOf<UserRegisterResponse>();
  });

  test("registering a new account, account already exists", async () => {
    assert(client !== null);

    const user = { username: "username", password: "password" };

    const res = client?.user.mutate(user);

    await expect(res).rejects.toBeInstanceOf(TRPCClientError);
  });
});

describe("logging in with an account", () => {
  let client: ReturnType<typeof createTRPCClient<AppRouter>> | null = null;

  beforeAll(async () => {
    client = createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url,
          ...getAuthorizationHeaders(),
        }),
      ],
    });

    // await client.userRegister.mutate({
    //   username: "username",
    //   password: "password",
    // });
  });

  test("logging in with an account", async () => {
    assert(client !== null);

    const account = await client?.userLogin.query({
      username: "username",
      password: "password",
    });

    expectTypeOf(account).toEqualTypeOf<UserLoginResponse>();
  });

  test("logging in with an account, account doesn't exist", async () => {
    assert(client !== null);

    try {
      await client?.userLogin.query({
        username: "nouser",
        password: "nopass",
      });
    } catch (e) {
      assert(isTRPCClientError(e), "Failed to error");
    }
  });

  test("logging in with an account, wrong username", async () => {
    assert(client !== null);

    try {
      await client?.userLogin.query({
        username: "nouser",
        password: "password",
      });
    } catch (e) {
      assert(isTRPCClientError(e), "Failed to error");
    }
  });

  test("logging with an account, wrong password", async () => {
    assert(client !== null);

    try {
      await client?.userLogin.query({
        username: "username",
        password: "owpap",
      });
    } catch (e) {
      assert(isTRPCClientError(e), "Failed to error");
    }
  });
});
