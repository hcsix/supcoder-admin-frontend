<script setup lang="tsx">
import { NButton, NListItem, NPopconfirm } from 'naive-ui';
import dayjs from 'dayjs';
import { ref } from 'vue';
import { fetchForceLogoutMyself, fetchGetOnlineDevices } from '@/service/api';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';

const appStore = useAppStore();

const { columns, columnChecks, data, getData, loading, mobilePagination } = useTable({
  immediate: undefined,
  apiFn: fetchGetOnlineDevices,
  showTotal: true,
  apiParams: {
    pageNum: 1,
    pageSize: 10
  },
  columns: () => [
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 64
    },
    {
      key: 'tokenId',
      title: $t('page.monitor.online.tokenId'),
      align: 'center',
      minWidth: 100,
      ellipsis: {
        show: true,
        tooltip: {
          scrollable: true,
          maxWidth: 300,
          showTooltip: true
        }
      }
    },
    {
      key: 'clientKey',
      title: $t('page.monitor.online.clientKey'),
      align: 'center',
      minWidth: 100,
      ellipsis: {
        show: true,
        tooltip: {
          scrollable: true,
          maxWidth: 300,
          showTooltip: true
        }
      }
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
        if (!row.loginTime) {
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

const { checkedRowKeys, onDeleted } = useTableOperate(data, getData);

async function handleForceLogout(id: number | string) {
  console.log(id);
  const { error } = await fetchForceLogoutMyself(id);
  if (error) {
    window.$message?.error(error.message);
    return;
  }
  onDeleted();
}

const settingItems = [
  { key: '0', label: '重置密码', action: 'resetPassword' },
  { key: '1', label: '注销账号', action: 'logout' }
];

const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const currentAction = ref('');
const handleClick = (item: { action: string }) => {
  currentAction.value = item.action;
  if (item.action === 'resetPassword') {
    modalTitle.value = '重置密码';
    modalMessage.value = '您确定要重置密码吗？';
  } else if (item.action === 'logout') {
    modalTitle.value = '注销账号';
    modalMessage.value = '您确定要注销账号吗？';
  }
  showModal.value = true;
};

const confirmAction = () => {
  if (currentAction.value === 'resetPassword') {
    // 处理重置密码逻辑
    console.log('重置密码');
  } else if (currentAction.value === 'logout') {
    // 处理注销账号逻辑
    console.log('注销账号');
  }
  showModal.value = false;
};

const cancelAction = () => {
  showModal.value = false;
};
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :title="$t('route.settings_account')" :bordered="false" class="card-wrapper">
      <NList>
        <NListItem v-for="(item, index) in settingItems" :key="index" @click="handleClick(item)">
          {{ item.label }}
        </NListItem>
      </NList>
    </NCard>

    <NCard title="在线设备" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :hide-batch-delete="true"
          :hide-add="true"
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
