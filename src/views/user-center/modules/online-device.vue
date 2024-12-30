<script setup lang="tsx">
import { NButton, NPopconfirm } from 'naive-ui';
import dayjs from 'dayjs';
import { fetchForceLogoutMyself, fetchGetOnlineDevices } from '@/service/api';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';

const appStore = useAppStore();

const {
  columns,
  columnChecks,
  data,
  getData,
  loading,
  mobilePagination,
} = useTable({
  immediate: undefined,
  apiFn: fetchGetOnlineDevices,
  showTotal: true,
  apiParams: {
    pageNum: 1,
    pageSize: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    userName: null,
    loginLocation: null
  },
  columns: () => [
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 64
    },
    {
      key: 'userName',
      title: $t('page.monitor.online.userName'),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'clientKey',
      title: $t('page.monitor.online.clientKey'),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'deviceType',
      title: $t('page.monitor.online.deviceType'),
      align: 'center',
      width: 80
    },
    {
      key: 'ipaddr',
      title: $t('page.monitor.online.ipaddr'),
      align: 'center',
      minWidth: 130
    },
    {
      key: 'loginLocation',
      title: $t('page.monitor.online.loginLocation'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'browser',
      title: $t('page.monitor.online.browser'),
      align: 'center',
      minWidth: 80
    },
    {
      key: 'os',
      title: $t('page.monitor.online.os'),
      align: 'center',
      minWidth: 80
    },
    {
      key: 'loginTime',
      title: $t('page.monitor.online.loginTime'),
      align: 'center',
      minWidth: 120,
      render: row => {
        if (!row.loginTime){
          return null;
        }
        return dayjs(row.loginTime).format('YYYY-MM-DD HH:mm:ss'); // 使用 dayjs 格式化日期
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => (
        <div class="flex-center gap-8px">
          <NPopconfirm onPositiveClick={() => handleForceLogout(row.id)}>
            {{
              default: () => $t('page.monitor.online.confirmLogout'),
              trigger: () => (
                <NButton type="error" ghost size="small">
                  {$t('page.monitor.online.forceLogout')}
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
  handleAdd,
  checkedRowKeys,
  onDeleted
  // closeDrawer
} = useTableOperate(data, getData);

async function handleForceLogout(id: number | string) {
  console.log(id);
  const { error } = await fetchForceLogoutMyself(id);
  if (error) {
    window.$message?.error(error.message);
    return;
  }
  onDeleted();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard
      :title="$t('page.monitor.online.title')"
      :bordered="false"
      size="small"
      class="sm:flex-1-hidden card-wrapper"
    >
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :hide-batch-delete="true"
          @add="handleAdd"
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
    </NCard>
  </div>
</template>

<style scoped></style>
