import PageQuery = Api.Common.PageQuery;

/**
 * Namespace AuthApi
 *
 * auth backend api type
 */
declare namespace SystemUserApi {


  import RoleVO = SystemRoleApi.RoleVO;
  import PostVO = SystemPostApi.PostVO;
  import CommonSearchParams = Api.Common.CommonSearchParams;
  import PaginatingQueryRecord = Api.Common.PaginatingQueryRecord;

  /**
   * 用户信息
   */
  export interface UserInfo {
    user: UserVO;
    roles: string[];
    permissions: string[];
  }


  /** user search params */
  type UserSearchParams = CommonType.RecordNullable<
    Pick<Api.SystemManage.User, 'userName' | 'userGender' | 'nickName' | 'userPhone' | 'userEmail' | 'status'> &
    CommonSearchParams
  >;

  /** user list */
  type UserList = PaginatingQueryRecord<UserVO>;

  /**
   * 用户查询对象类型
   */
  export interface UserQuery extends PageQuery {
    userName?: string;
    phonenumber?: string;
    status?: string;
    deptId?: string | number;
    roleId?: string | number;
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

  /**
   * 用户表单类型
   */
  export interface UserForm {
    id?: string;
    userId?: string;
    deptId?: number;
    userName: string;
    nickName?: string;
    password: string;
    phonenumber?: string;
    email?: string;
    sex?: string;
    status: string;
    remark?: string;
    postIds: string[];
    roleIds: string[];
  }

  export interface UserInfoVO {
    user: UserVO;
    roles: RoleVO[];
    roleIds: string[];
    posts: PostVO[];
    postIds: string[];
    roleGroup: string;
    postGroup: string;
  }

  export interface ResetPwdForm {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
}