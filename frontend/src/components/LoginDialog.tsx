import { capitalizeFirst } from "@/util";

interface LoginDialog {
  username: string;
  password: string;
  errorMessage?: string;
  submitAction: "login" | "register";
  setUsername: (s: string) => void;
  setPassword: (s: string) => void;
  handleSubmit: () => Promise<void>;
  switchSubmitAction: () => void;
}

export const LoginDialog = ({
  username,
  password,
  errorMessage,
  submitAction,
  setUsername,
  setPassword,
  handleSubmit,
  switchSubmitAction,
}: LoginDialog) => {
  const button = (
    <button type="button" onClick={() => switchSubmitAction()}>
      {capitalizeFirst(submitAction)}
    </button>
  );

  return (
    <form>
      <label>
        Username
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      {errorMessage && <p>{errorMessage}</p>}

      {submitAction === "login" ? (
        <section>Already have an account? {button} </section>
      ) : (
        <section>Don't have an account? {button} </section>
      )}

      <button type="submit" onSubmit={handleSubmit} />
    </form>
  );
};
