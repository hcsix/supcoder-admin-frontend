import { listRequest, request } from '../../request';
import RoleDeptTree = SystemRoleApi.RoleDeptTree;
import UserQuery = SystemUserApi.UserQuery;
import UserVO = SystemUserApi.UserVO;
import PaginatingResponse = App.Service.PaginatingResponse;
import RoleVO = SystemRoleApi.RoleVO;

export function fetchGetRoles(params?: SystemRoleApi.RoleSearchParams) {
  return listRequest<PaginatingResponse<SystemRoleApi.Role>>({
    url: '/system/role/list',
    method: 'get',
    params
  }).then(response => {
    if (response && response.data?.rows) {
      response.data.rows = response.data?.rows.map(role => ({
        ...role,
        id: Number(role.roleId)
      }));
    }
    if (response?.data && params) {
      response.data.pageNum = params.pageNum ?? 1;
      response.data.pageSize = params.pageSize ?? 10;
    }
    return response;
  });
}

/**
 * 删除角色
 *
 * @param userId 用户ID
 */
export function fetchDelRole(roleId: Array<string | number> | string | number) {
  return request({
    url: `/system/role/${roleId}`,
    method: 'delete'
  });
}

/** 新增角色 */
export function fetchAddRole(data: any) {
  return request({
    url: '/system/role',
    method: 'post',
    data
  });
}

/**
 * 修改角色
 *
 * @param data
 */
export function fetchUpdateRole(data: any) {
  return request({
    url: '/system/role',
    method: 'put',
    data
  });
}

/**
 * 通过roleIds查询角色
 *
 * @param roleIds
 */
export function optionSelectfunction(roleIds: (number | string)[]) {
  return request<RoleVO[]>({
    url: `/system/role/optionselect?roleIds=${roleIds}`,
    method: 'get'
  });
}

/** 查询角色详细 */
export function getRolefunction(roleId: string | number) {
  return request<RoleVO[]>({
    url: `/system/role/${roleId}`,
    method: 'get'
  });
}

/** 角色数据权限 */
export function dataScopefunction(data: any) {
  return request({
    url: '/system/role/dataScope',
    method: 'put',
    data
  });
}

/** 角色状态修改 */
export function changeRoleStatusfunction(roleId: string | number, status: string) {
  const data = {
    roleId,
    status
  };
  return request({
    url: '/system/role/changeStatus',
    method: 'put',
    data
  });
}

/** 查询角色已授权用户列表 */
export function allocatedUserListfunction(query: UserQuery) {
  return request<UserVO[]>({
    url: '/system/role/authUser/allocatedList',
    method: 'get',
    params: query
  });
}

/** 查询角色未授权用户列表 */
export function unallocatedUserListfunction(query: UserQuery) {
  return request<UserVO[]>({
    url: '/system/role/authUser/unallocatedList',
    method: 'get',
    params: query
  });
}

/** 取消用户授权角色 */
export function authUserCancelfunction(data: any) {
  return request({
    url: '/system/role/authUser/cancel',
    method: 'put',
    data
  });
}

/** 批量取消用户授权角色 */
export function authUserCancelAllfunction(data: any) {
  return request({
    url: '/system/role/authUser/cancelAll',
    method: 'put',
    params: data
  });
}

/** 授权用户选择 */
export function authUserSelectAllfunction(data: any) {
  return request({
    url: '/system/role/authUser/selectAll',
    method: 'put',
    params: data
  });
}

// 根据角色ID查询部门树结构
export function deptTreeSelectfunction(roleId: string | number) {
  return request<RoleDeptTree>({
    url: `/system/role/deptTree/${roleId}`,
    method: 'get'
  });
}
