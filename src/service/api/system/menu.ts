import type { FlatResponseData } from '~/packages/axios';
import { handleTree } from '@/utils/util';
import { request } from '../../request';
import RoleMenuTree = SystemMenuApi.RoleMenuTree;
import MenuSearchParams = SystemMenuApi.MenuSearchParams;
import PaginatingResponse = App.Service.PaginatingResponse;
import BaseResponse = App.Service.BaseResponse;

/**
 * 根据角色ID查询菜单下拉树结构
 *
 * @param roleId
 */
export function fetchRoleMenuTreeOptions(roleId: string | number) {
  return request<RoleMenuTree>({
    url: `/system/menu/roleMenuTreeselect/${roleId}`,
    method: 'get'
  });
}

/**
 * 查询菜单列表
 *
 * @param query
 */
export function fetchGetMenuList(
  query?: MenuSearchParams
): Promise<FlatResponseData<PaginatingResponse<SystemMenuApi.Menu>>> {
  return request<SystemMenuApi.Menu[]>({
    url: '/system/menu/list',
    method: 'get',
    params: query
  }).then(response => {
    if (response.error) {
      return response;
    }
    const commonResponse: BaseResponse = {
      code: response.response.data.code,
      msg: response.response.data.msg
    };
    let paginatedResponse: PaginatingResponse<SystemMenuApi.Menu> = {
      ...commonResponse,
      rows: [],
      total: 0,
      pageNum: 1,
      pageSize: 0
    };

    try {
      if (response && response.data) {
        const menuData = response.data?.map(menu => ({
          ...menu,
          id: menu.menuId
        }));
        const handledData = handleTree<SystemMenuApi.Menu>(menuData);
        paginatedResponse = {
          ...commonResponse,
          rows: handledData,
          total: handledData.length, // 从响应中获取 total，如果没有则使用数组长度
          pageNum: 1, // 从响应中获取 pageNum，如果没有则假设为 1
          pageSize: handledData.length // 从响应中获取 pageSize，如果没有则使用数组长度
        };
      }
    } catch (error) {
      console.error('Error processing menu list:', error);
    }
    console.log('paginatedResponse:', paginatedResponse);
    const responseResult: FlatResponseData<PaginatingResponse<SystemMenuApi.Menu>> = {
      data: paginatedResponse,
      error: null,
      response: response.response
    };
    return responseResult;
  });
}

/**
 * 删除菜单
 *
 * @param menuId 菜单ID
 */
export function fetchDelMenu(menuId: string | number) {
  return request({
    url: `/system/menu/${menuId}`,
    method: 'delete'
  });
};

// // 查询菜单详细
// export const getMenu = (menuId: string | number): AxiosPromise<MenuVO> => {
//   return request({
//     url: '/system/menu/' + menuId,
//     method: 'get'
//   });
// };
//
// // 查询菜单下拉树结构
// export const treeselect = (): AxiosPromise<MenuTreeOption[]> => {
//   return request({
//     url: '/system/menu/treeselect',
//     method: 'get'
//   });
// };
//
//
//
// // 根据角色ID查询菜单下拉树结构
// export const tenantPackageMenuTreeselect = (packageId: string | number): AxiosPromise<RoleMenuTree> => {
//   return request({
//     url: '/system/menu/tenantPackageMenuTreeselect/' + packageId,
//     method: 'get'
//   });
// };
//
// // 新增菜单
// export const addMenu = (data: MenuForm) => {
//   return request({
//     url: '/system/menu',
//     method: 'post',
//     data: data
//   });
// };
//
// // 修改菜单
// export const updateMenu = (data: MenuForm) => {
//   return request({
//     url: '/system/menu',
//     method: 'put',
//     data: data
//   });
// };
//

