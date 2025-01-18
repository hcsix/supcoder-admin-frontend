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
    dictId: number;
    /** user name */
    dictName: string;
    dictType: string;
    /** user gender */
    remark: string;
  }>;

  /** 字典表单类型 */
  export interface DictTypeForm {
    dictId?: number;
    dictName: string;
    dictType: string;
    remark?: string;
    createTime: string;
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
