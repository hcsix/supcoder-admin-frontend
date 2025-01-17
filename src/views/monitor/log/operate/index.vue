<script setup lang="tsx">
import { NButton, NPopconfirm } from 'naive-ui';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchGetOperateLogList } from '@/service/api/monitor/operlog';
import OperateSearch from './modules/operate-search.vue';

const appStore = useAppStore();

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
  immediate: undefined,
  apiFn: fetchGetOperateLogList,
  showTotal: true,
  apiParams: {
    pageNum: 1,
    pageSize: 10
  },
  //   日志编号
  // 系统模块
  // 操作类型
  // 操作人员
  // 操作地址
  // 操作状态
  // 操作日期
  // 消耗时间
  // 操作

  columns: () => [
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 64
    },
    {
      key: 'operId',
      title: '日志编号',
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
      key: 'title',
      title: '系统模块',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'businessType',
      title: '操作类型',
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
      key: 'operName',
      title: '操作人员',
      align: 'center',
      width: 80
    },
    {
      key: 'operIp',
      title: '操作IP',
      align: 'center',
      minWidth: 150
    },
    {
      key: 'status',
      title: '操作状态',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'operTime',
      title: '操作日期',
      align: 'center',
      minWidth: 60
    },
    {
      key: 'costTime',
      title: '消耗时间',
      align: 'center',
      minWidth: 80
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="info" ghost size="small">
            {$t('common.detail')}
          </NButton>
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
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <OnlineSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
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
          :hide-add="true"
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
