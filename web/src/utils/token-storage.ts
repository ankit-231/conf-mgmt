export interface ITokenStorage {
  saveAccessToken(token: string): Promise<void>;
  getAccessToken(): Promise<string | null>;
  deleteAccessToken(): Promise<void>;

  saveRefreshToken(token: string): Promise<void>;
  getRefreshToken(): Promise<string | null>;
  deleteRefreshToken(): Promise<void>;

  clearAllTokens(): Promise<void>;
}

// TODO: for a more secure setup, move to httpOnly cookies set by the backend
// (requires BE to set Set-Cookie on login/refresh + CORS credentials config).
// Using localStorage for this iteration since it's simplest and matches the
// mobile app's web fallback (see law_web mobile's token-storage.ts).
class LocalStorageTokenStorage implements ITokenStorage {
  private readonly ACCESS_TOKEN_KEY = "access_token";
  private readonly REFRESH_TOKEN_KEY = "refresh_token";

  private setItem(key: string, value: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
  }

  private getItem(key: string): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  }

  private removeItem(key: string) {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  }

  async saveAccessToken(token: string): Promise<void> {
    this.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  async getAccessToken(): Promise<string | null> {
    return this.getItem(this.ACCESS_TOKEN_KEY);
  }

  async deleteAccessToken(): Promise<void> {
    this.removeItem(this.ACCESS_TOKEN_KEY);
  }

  async saveRefreshToken(token: string): Promise<void> {
    this.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  async getRefreshToken(): Promise<string | null> {
    return this.getItem(this.REFRESH_TOKEN_KEY);
  }

  async deleteRefreshToken(): Promise<void> {
    this.removeItem(this.REFRESH_TOKEN_KEY);
  }

  async clearAllTokens(): Promise<void> {
    await Promise.all([this.deleteAccessToken(), this.deleteRefreshToken()]);
  }
}

export const tokenStorage: ITokenStorage = new LocalStorageTokenStorage();
