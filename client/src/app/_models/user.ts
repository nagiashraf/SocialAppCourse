export interface User {
  username: string;
  token: string;
  tokenExpirationTime: Date;
  refreshToken: string;
  refreshTokenExpirationTime: Date;
  mainPhotoUrl: string;
  knownAs: string;
  roles: string[];
}