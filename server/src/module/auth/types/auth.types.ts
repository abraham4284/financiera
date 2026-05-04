export type JwtAccessPayload = {
  idUser: number;
  username: string;
  idRole: number;
};

export type JwtRefreshPayload = {
  sid: number;
  idUser: number;
};

export type RegisterUserDTO = {
  username: string;
  password: string;
  idRole: number
};

export type User = {
  idUser: number;
  username: string;
  password: string;
  idRole: number
};
