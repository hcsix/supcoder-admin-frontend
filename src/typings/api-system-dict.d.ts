/**
 * Namespace AuthApi
 *
 * auth backend api type
 */
declare namespace SystemDictApi {
  import CommonSearchParams = Api.Common.CommonSearchParams;
  import CommonRecord = Api.Common.CommonRecord;

  /** DictType search params */
  type DictTypeSearchParams = CommonType.RecordNullable<Pick<DictType, 'dictName' | 'dictType'> & CommonSearchParams>;

  /** DictType */
  type DictType = CommonRecord<{
    dictId: string | number;
    /** user name */
    dictName: string;
    dictType: string;
    /** user gender */
    remark: string;
  }>;

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
