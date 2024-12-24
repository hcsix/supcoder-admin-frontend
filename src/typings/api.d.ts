/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      /** current page number */
      current: number;
      /** page size */
      size: number;
      /** total count */
      total: number;
    }

    /** common params of paginating query list data */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      records: T[];
    }

    /** common search params of table */
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    /**
     * enable status
     *
     * - "1": enabled
     * - "2": disabled
     */
    type EnableStatus = '1' | '2';

    /** common record */
    type CommonRecord<T = any> = {
      /** record id */
      id: number;
      /** record creator */
      createBy: string;
      /** record create time */
      createTime: string;
      /** record updater */
      updateBy: string;
      /** record update time */
      updateTime: string;
      /** record status */
      status: EnableStatus | null;
    } & T;
  }

  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {

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

    /**
     * 用户返回对象
     */
    export interface UserVO extends BaseEntity {
      userId: string | number;
      tenantId: string;
      deptId: number;
      userName: string;
      nickName: string;
      userType: string;
      email: string;
      phonenumber: string;
      sex: string;
      avatar: string;
      status: string;
      delFlag: string;
      loginIp: string;
      loginDate: string;
      remark: string;
      deptName: string;
      roles: RoleVO[];
      roleIds: any;
      postIds: any;
      roleId: any;
      admin: boolean;
    }

    export interface RoleVO extends BaseEntity {
      roleId: string | number;
      roleName: string;
      roleKey: string;
      roleSort: number;
      dataScope: string;
      menuCheckStrictly: boolean;
      deptCheckStrictly: boolean;
      status: string;
      delFlag: string;
      remark?: any;
      flag: boolean;
      menuIds?: Array<string | number>;
      deptIds?: Array<string | number>;
      admin: boolean;
    }

  }

  /**
   * namespace Route
   *
   * backend api module: "route"
   */
  namespace Route {
    type ElegantConstRoute = import('@elegant-router/types').ElegantConstRoute;

    interface MenuRoute extends ElegantConstRoute {
      id: string;
    }

    interface UserRoute {
      routes: MenuRoute[];
      home: import('@elegant-router/types').LastLevelRouteKey;
    }
  }
}
