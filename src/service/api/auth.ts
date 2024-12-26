import { request } from '../request';


// pc端固定客户端授权id
const clientId = import.meta.env.VITE_APP_CLIENT_ID;

/**
 * Captcha
 *
 */
export function fetchCaptcha() {
  return request<AuthApi.CaptchaData>({
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
export function fetchLogin(loginParams: AuthApi.LoginParams) {
  return request<AuthApi.LoginToken>({
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


/**
 * 注册
 * @param data
 */
export function register(data: any) {
  const params = {
    ...data,
    clientId,
    grantType: 'password'
  };
  return request({
    url: '/auth/register',
    headers: {
      isToken: false,
      isEncrypt: true,
      repeatSubmit: false
    },
    method: 'post',
    data: params
  });
}


/**
 * 注销
 */
export function logout() {
  request({
    url: '/resource/sse/close',
    method: 'get'
  });
  return request({
    url: '/auth/logout',
    method: 'post'
  });
}


/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return request<AuthApi.LoginToken>({
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
