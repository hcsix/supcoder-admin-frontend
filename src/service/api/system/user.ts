import { parseStrEmpty } from '@/utils/util';
import { listRequest, request } from '../../request';
import UserVO = SystemUserApi.UserVO;
import UserInfoVO = SystemUserApi.UserInfoVO;
import UserForm = SystemUserApi.UserForm;
import RoleVO = SystemRoleApi.RoleVO;
import PaginatingResponse = App.Service.PaginatingResponse;

/** Get user info */
export function fetchGetUserInfo() {
  return request<SystemUserApi.UserInfo>({ url: '/system/user/getInfo' });
}

/**
 * 查询用户列表
 *
 * @param query
 */
export function fetchGetUserList(params?: SystemUserApi.UserSearchParams) {
  return listRequest<PaginatingResponse<SystemUserApi.User>>({
    url: '/system/user/list',
    method: 'get',
    params
  }).then(response => {
    if (response && response.data?.rows) {
      response.data.rows = response.data?.rows.map(user => ({
        ...user,
        id: user.userId
      }));
    }
    return response;
  });
}

/**
 * 获取用户详情
 *
 * @param userId
 */
export function fetchGetUserDetail(userId?: string | number) {
  return request<UserInfoVO>({
    url: `/system/user/${parseStrEmpty(userId)}`,
    method: 'get'
  });
}

/** 新增用户 */
export function fetchAddUser(data: UserForm) {
  return request({
    url: '/system/user',
    method: 'post',
    data
  });
}

/** 修改用户 */
export function fetchUpdateUser(data: UserForm) {
  return request({
    url: '/system/user',
    method: 'put',
    data
  });
}

/**
 * 删除用户
 *
 * @param userId 用户ID
 */
export function fetchDelUser(userId: Array<string | number> | string | number) {
  return request({
    url: `/system/user/${userId}`,
    method: 'delete'
  });
}

/**
 * 通过用户ids查询用户
 *
 * @param userIds
 */
export function optionSelect(userIds: (number | string)[]) {
  return request<UserVO[]>({
    url: `/system/user/optionselect?userIds=${userIds}`,
    method: 'get'
  });
}

/**
 * 用户密码重置
 *
 * @param userId 用户ID
 * @param password 密码
 */
export function resetUserPwd(userId: string | number, password: string) {
  const data = {
    userId,
    password
  };
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    headers: {
      isEncrypt: true,
      repeatSubmit: false
    },
    data
  });
}

/**
 * 用户状态修改
 *
 * @param userId 用户ID
 * @param status 用户状态
 */
export function changeUserStatus(userId: number | string, status: string) {
  const data = {
    userId,
    status
  };
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    data
  });
}

/** 查询用户个人信息 */
export function getUserProfile() {
  return request<UserInfoVO>({
    url: '/system/user/profile',
    method: 'get'
  });
}

/**
 * 修改用户个人信息
 *
 * @param data 用户信息
 */
export function updateUserProfile(data: UserForm) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data
  });
}

/**
 * 用户密码重置
 *
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 */
export function updateUserPwd(oldPassword: string, newPassword: string) {
  const data = {
    oldPassword,
    newPassword
  };
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    headers: {
      isEncrypt: true,
      repeatSubmit: false
    },
    data
  });
}

/**
 * 用户头像上传
 *
 * @param data 头像文件
 */
export function uploadAvatar(data: FormData) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data
  });
}

/**
 * 查询授权角色
 *
 * @param userId 用户ID
 */
export function getAuthRole(userId: string | number) {
  return request<{ user: UserVO; roles: RoleVO[] }>({
    url: `/system/user/authRole/${userId}`,
    method: 'get'
  });
}

/**
 * 保存授权角色
 *
 * @param data 用户ID
 */
export function updateAuthRole(data: { userId: string; roleIds: string }) {
  return request({
    url: '/system/user/authRole',
    method: 'put',
    params: data
  });
}

/**
 * 查询当前部门的所有用户信息
 *
 * @param deptId
 */
export function listUserByDeptId(deptId: string | number) {
  return request<UserVO[]>({
    url: `/system/user/list/dept/${deptId}`,
    method: 'get'
  });
}
