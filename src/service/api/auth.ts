import { request } from '../request';


// pc端固定客户端授权id
const clientId = import.meta.env.VITE_APP_CLIENT_ID;

/**
 * Captcha
 *
 */
export function fetchCaptcha() {
  return request<Api.Auth.CaptchaData>({
    url: '/auth/code',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  });
}

/**
 * Login
 *
 * @param userName User name
 * @param password Password
 */
export function fetchLogin(loginParams: Api.Auth.LoginParams) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/login',
    headers: {
      isToken: false,
      isEncrypt: true
    },
    method: 'post',
    data: {
      ...loginParams,
      clientId: loginParams.clientId || clientId,
      grantType: loginParams.grantType || 'password'
    }
  });
}

/** Get user info */
export function fetchGetUserInfo() {
  return request<Api.Auth.UserInfo>({ url: '/system/user/getInfo' });
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/refreshToken',
    method: 'post',
    data: {
      refreshToken
    }
  });
}

/**
 * return custom backend error
 *
 * @param code error code
 * @param msg error message
 */
export function fetchCustomBackendError(code: string, msg: string) {
  return request({ url: '/auth/error', params: { code, msg } });
}
