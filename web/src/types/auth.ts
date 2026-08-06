export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginData {
  access: string;
  refresh: string;
}

export interface RefreshTokenPayload {
  refresh: string;
}

export interface RefreshTokenData {
  access: string;
}

export interface VerifyTokenPayload {
  token: string;
}

export interface BlacklistTokenPayload {
  refresh: string;
}
