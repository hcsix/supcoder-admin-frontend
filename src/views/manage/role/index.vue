<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { fetchDelRole, fetchGetRoles } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import { enableStatusRecord } from '@/constants/business';
import RoleOperateDrawer from './modules/role-operate-drawer.vue';
import RoleSearch from './modules/role-search.vue';

const appStore = useAppStore();

const {
  columns,
  columnChecks,
  data,
  loading,
  getData,
  getDataByPage,
  mobilePagination,
  searchParams,
  resetSearchParams
} = useTable({
  apiFn: fetchGetRoles,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    roleName: null,
    roleKey: null
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'index',
      title: $t('common.index'),
      width: 64,
      align: 'center'
    },
    {
      key: 'roleName',
      title: $t('page.manage.role.roleName'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'roleKey',
      title: $t('page.manage.role.roleCode'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'remark',
      title: $t('page.manage.role.roleDesc'),
      minWidth: 120
    },
    {
      key: 'status',
      title: $t('page.manage.role.roleStatus'),
      align: 'center',
      width: 100,
      render: row => {
        if (row.status === null) {
          return null;
        }
        const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
          0: 'success',
          1: 'warning'
        };

        const label = $t(enableStatusRecord[row.status]);

        return <NTag type={tagMap[row.status]}>{label}</NTag>;
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 150,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" ghost size="small">
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>
      )
    }
  ]
});

const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onBatchDeleted,
  onDeleted
  // closeDrawer
} = useTableOperate(data, getData);

async function handleBatchDelete() {
  // request
  const { error } = await fetchDelRole(checkedRowKeys.value);
  if (error) {
    window.$message?.error(error.message);
    return;
  }
  onBatchDeleted();
}

async function handleDelete(id: number | string) {
  const { error } = await fetchDelRole(id);
  if (error) {
    window.$message?.error(error.message);
    return;
  }
  onDeleted();
}

function edit(id: number | string) {
  const numericId = typeof id === 'string' ? Number.parseInt(id, 10) : id;
  if (Number.isNaN(numericId as number)) {
    console.error('Invalid ID');
    return;
  }
  handleEdit(numericId as number);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <RoleSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard :title="$t('page.manage.role.title')" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="702"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <RoleOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>
