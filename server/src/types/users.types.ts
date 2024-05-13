export interface iAuthUserData {
  id?: number;
  nickname?: string;
  isLoggedIn?: boolean;
}

export interface iPatchData {
  nickname?: string;
  profileImg?: string;
}

export interface iResetCheckData {
  email: string;
}
export interface iResetPassword extends iResetCheckData {
  password: string;
  id?: number;
}

export interface iUserResetPasswordData {
  originPassword: string;
  newPassword: string;
}
