/**
 * Namespace AuthApi
 *
 * auth backend api type
 */
declare namespace AuthApi {

  import UserVO = SystemUserApi.UserVO;

  interface LoginParams {
    tenantId?: string;
    username?: string;
    password?: string;
    rememberMe?: boolean;
    socialCode?: string;
    socialState?: string;
    source?: string;
    code?: string;
    uuid?: string;
    clientId?: string;
    grantType?: string;
  }

  interface CaptchaData {
    captchaEnabled: boolean;
    uuid: string;
    img?: string;
  }

  interface LoginToken {
    access_token: string;
    refresh_token: string;
  }

  interface UserInfo {
    user: UserVO;
    roles: string[];
    permissions: string[];
  }



}
