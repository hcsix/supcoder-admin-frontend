<script setup lang="tsx">
import { NButton, NPopconfirm } from 'naive-ui';
import { fetchDelDictType, fetchGetDictTypeList } from '@/service/api';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { useRouterPush } from '@/hooks/common/router';
import DictOperateDrawer from './modules/dict-operate-drawer.vue';
import DictSearch from './modules/dict-search.vue';

const appStore = useAppStore();
const { routerPushByKey } = useRouterPush();

const {
  columns,
  columnChecks,
  data,
  getData,
  getDataByPage,
  loading,
  mobilePagination,
  searchParams,
  resetSearchParams
} = useTable({
  apiFn: fetchGetDictTypeList,
  showTotal: true,
  apiParams: {
    pageNum: 1,
    pageSize: 10
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'dictName',
      title: $t('page.manage.dict.dictName'),
      align: 'center',
      width: 150
    },
    {
      key: 'dictType',
      title: $t('page.manage.dict.dictType'),
      align: 'center',
      width: 150,
      render: row => {
        if (row.dictType === null) {
          return null;
        }
        const label = row.dictType;
        return (
          <NButton type="primary" ghost size="small" onClick={() => goToDictDataPage(row.id)}>
            {label}
          </NButton>
        );
      }
    },
    {
      key: 'remark',
      title: $t('page.manage.dict.dictDesc'),
      align: 'center',
      minWidth: 150
    },
    {
      key: 'createTime',
      title: $t('common.createdTime'),
      align: 'center',
      width: 210
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 180,
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
  console.log(checkedRowKeys.value);
  const { error } = await fetchDelDictType(checkedRowKeys.value);
  if (error) {
    return;
  }
  onBatchDeleted();
}

async function handleDelete(id: number | string) {
  console.log(id);
  const { error } = await fetchDelDictType(id);
  if (error) {
    return;
  }
  onDeleted();
}

function edit(id: number | string) {
  console.log(`handleEdit id is ${id}`);
  handleEdit(id);
}

function goToDictDataPage(id: number | string) {
  console.log(`goToDictDataPage id is ${id}`);
  routerPushByKey('manage_dict-data', { params: { id: String(id) } });
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <DictSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard :title="$t('page.manage.user.title')" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
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
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <DictOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
