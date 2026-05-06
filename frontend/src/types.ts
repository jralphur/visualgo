export type LoginArguments = {
  username: string;
  password: string;
};

export type UserRegisterResponse = {
  username: string;
  iat: number;
  token: string;
};

export type PostPreview = {
  username: string;
  description: string;
  preview: string;
  name: string;
  uid: string;
  last_modified: string;
};

export type UserLoginResponse = UserRegisterResponse;
export type RegisterArguments = LoginArguments;
export type JWTToken = {
  iat: number;
  token: string;
  username: string;
};
