export type JwtAccessPayload = {
  idUser: number;
  username: string;
};

export type JwtRefreshPayload = {
  sid: number;
  idUser: number;
};

export type RegisterUserDTO = {
  username: string;
  password: string;
};

export type User = {
  idUser: number;
  username: string;
  password: string;
};
