import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import { useState } from "react";
import { setJWTToken } from "@/jwt";
import { trpc } from "../trpc";
import { LoginDialog } from "./LoginDialog";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  const [submitAction, setSubmitAction] = useState<"login" | "register">(
    "login",
  );

  const loginAction = async () => {
    try {
      const data = await queryClient.fetchQuery(
        trpc.user.userLogin.queryOptions({ username, password }),
      );
      setJWTToken(data);
    } catch (e) {
      if (isTRPCClientError(e)) {
        console.log(e.message);
        setErrorMessage(e.message);
      }
    }
  };

  const registerAction = async () => {
    try {
      register.mutate({ username, password });
    } catch (e) {
      if (isTRPCClientError(e)) {
        console.log(e.message);
        setErrorMessage(e.message);
      }
    }
  };

  const handleSubmit = async () => {
    switch (submitAction) {
      case "login":
        await loginAction();
        break;
      case "register":
        await registerAction();
        break;
    }
  };

  const switchSubmitAction = () => {
    switch (submitAction) {
      case "login":
        setSubmitAction("register");
        break;
      case "register":
        setSubmitAction("login");
        break;
    }
  };

  const queryClient = useQueryClient();
  const register = useMutation(
    trpc.user.userRegister.mutationOptions({
      onSuccess: (d) => setJWTToken(d),
      onError: (d) => setErrorMessage(d.message),
    }),
  );

  const handleSetUsername = (s: string) => setUsername(s);
  const handleSetPassword = (s: string) => setPassword(s);

  return (
    <LoginDialog
      username={username}
      password={password}
      errorMessage={errorMessage}
      submitAction={submitAction}
      setUsername={handleSetUsername}
      setPassword={handleSetPassword}
      switchSubmitAction={switchSubmitAction}
      handleSubmit={handleSubmit}
    />
  );
};

export default Login;
