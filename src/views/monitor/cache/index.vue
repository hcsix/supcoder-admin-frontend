<template>
  <n-space vertical size="large">
    <n-card title="基本信息" hoverable>
      <n-grid :cols="4" x-gap="12">
        <n-gi>
          <n-descriptions label-placement="left" :column="1">
            <n-descriptions-item label="Redis版本">
              {{ cache.info?.redis_version }}
            </n-descriptions-item>
            <n-descriptions-item label="运行模式">
              {{ cache.info?.redis_mode === 'standalone' ? '单机' : '集群' }}
            </n-descriptions-item>
            <n-descriptions-item label="端口">
              {{ cache.info?.tcp_port }}
            </n-descriptions-item>
            <n-descriptions-item label="客户端数">
              {{ cache.info?.connected_clients }}
            </n-descriptions-item>
          </n-descriptions>
        </n-gi>
        <n-gi>
          <n-descriptions label-placement="left" :column="1">
            <n-descriptions-item label="运行时间(天)">
              {{ cache.info?.uptime_in_days }}
            </n-descriptions-item>
            <n-descriptions-item label="使用内存">
              {{ cache.info?.used_memory_human }}
            </n-descriptions-item>
            <n-descriptions-item label="使用CPU">
              {{ parseFloat(cache.info?.used_cpu_user_children || '0').toFixed(2) }}
            </n-descriptions-item>
            <n-descriptions-item label="内存配置">
              {{ cache.info?.maxmemory_human }}
            </n-descriptions-item>
          </n-descriptions>
        </n-gi>
        <n-gi>
          <n-descriptions label-placement="left" :column="1">
            <n-descriptions-item label="AOF是否开启">
              {{ cache.info?.aof_enabled === '0' ? '否' : '是' }}
            </n-descriptions-item>
            <n-descriptions-item label="RDB是否成功">
              {{ cache.info?.rdb_last_bgsave_status }}
            </n-descriptions-item>
            <n-descriptions-item label="Key数量">
              {{ cache.dbSize }}
            </n-descriptions-item>
            <n-descriptions-item label="网络入口/出口">
              {{ cache.info?.instantaneous_input_kbps }}kps/{{ cache.info?.instantaneous_output_kbps }}kps
            </n-descriptions-item>
          </n-descriptions>
        </n-gi>
      </n-grid>
    </n-card>

    <n-space :size="12" align="center">
      <n-card title="命令统计" hoverable>
        <div ref="commandstats" style="height: 420px" />
      </n-card>
      <n-card title="内存信息" hoverable>
        <div ref="usedmemory" style="height: 420px" />
      </n-card>
    </n-space>
  </n-space>
</template>

<script setup name="Cache" lang="ts">
import { getCache } from '@/api/monitor/cache';
import * as echarts from 'echarts';
import { CacheVO } from '@/api/monitor/cache/types';
import { ref, onMounted, getCurrentInstance, ComponentInternalInstance } from 'vue';
import { NSpace, NCard, NGrid, NGi, NDescriptions, NDescriptionsItem } from 'naive-ui';

const cache = ref<Partial<CacheVO>>({});
const commandstats = ref();
const usedmemory = ref();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const getList = async () => {
  proxy?.$modal.loading('正在加载缓存监控数据，请稍候！');
  const res = await getCache();
  proxy?.$modal.closeLoading();
  cache.value = res.data;
  const commandstatsIntance = echarts.init(commandstats.value, 'macarons');
  commandstatsIntance.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    series: [
      {
        name: '命令',
        type: 'pie',
        roseType: 'radius',
        radius: [15, 95],
        center: ['50%', '38%'],
        data: res.data.commandStats,
        animationEasing: 'cubicInOut',
        animationDuration: 1000
      }
    ]
  });
  const usedmemoryInstance = echarts.init(usedmemory.value, 'macarons');
  usedmemoryInstance.setOption({
    tooltip: {
      formatter: '{b} <br/>{a} : ' + cache.value.info?.used_memory_human
    },
    series: [
      {
        name: '峰值',
        type: 'gauge',
        min: 0,
        max: 1000,
        detail: {
          formatter: cache.value.info?.used_memory_human
        },
        data: [
          {
            value: parseFloat(cache.value.info?.used_memory_human || '0'),
            name: '内存消耗'
          }
        ]
      }
    ]
  });
  window.addEventListener('resize', () => {
    commandstatsIntance.resize();
    usedmemoryInstance.resize();
  });
};

onMounted(() => {
  getList();
});
</script>
