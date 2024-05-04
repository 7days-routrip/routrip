export const passwordRegex: RegExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!^%*#?&])[A-Za-z\d@!^%*#?&]{8,16}$/;
export const emailRegex: RegExp = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;
export const nicknameRegex: RegExp = /^[A-za-z0-9가-힣]{2,10}$/;
