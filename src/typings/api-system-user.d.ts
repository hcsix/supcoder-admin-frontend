import PageQuery = Api.Common.PageQuery;

/**
 * Namespace AuthApi
 *
 * auth backend api type
 */
declare namespace SystemUserApi {
  import CommonSearchParams = Api.Common.CommonSearchParams;
  import CommonRecord = Api.Common.CommonRecord;

  /** 用户信息 */
  export interface UserInfo {
    user: UserVO;
    roles: string[];
    permissions: string[];
  }

  export interface UserInfoVO {
    user: UserVO;
    roles: SystemRoleApi.Role[];
    roleIds: string[];
    roleGroup: string;
  }

  /** user search params */
  type UserSearchParams = CommonType.RecordNullable<
    Pick<User, 'userName' | 'sex' | 'nickName' | 'phonenumber' | 'email' | 'status'> & CommonSearchParams
  >;

  /** user */
  type User = CommonRecord<{
    userId: string | number;
    /** user name */
    userName: string;
    avatar: string;
    /** user gender */
    sex: UserGender | null;
    /** user nick name */
    nickName: string;
    /** user phone */
    phonenumber: string;
    /** user email */
    email: string;
    /** user role code collection */
    loginIp: string;
    loginDate: string;
    remark: string;
  }>;

  /**
   * user gender
   *
   * - "0": "unknown"
   * - "1": "male"
   * - "2": "female"
   */
  type UserGender = '0' | '1' | '2';

  /** 用户表单类型 */
  export interface UserForm {
    id?: string;
    userId?: string;
    userName: string;
    nickName?: string;
    password?: string;
    phonenumber?: string;
    email?: string;
    sex?: string;
    status: string;
    remark?: string;
    postIds?: string[];
    roleIds?: string[];
  }

  /** 用户查询对象类型 */
  export interface UserQuery extends PageQuery {
    userName?: string;
    phonenumber?: string;
    status?: string;
    deptId?: string | number;
    roleId?: string | number;
  }

  /** 用户返回对象 */
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
    roles: SystemRoleApi.Role[];
    roleIds: any;
    roleId: any;
    admin: boolean;
  }

  export interface ResetPwdForm {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
}
