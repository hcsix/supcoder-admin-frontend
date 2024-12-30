<script setup name="Cache" lang="ts">
import { useI18n } from 'vue-i18n';
import * as echarts from 'echarts';
import { computed, onMounted, ref } from 'vue';
import { NCard, NDescriptions, NDescriptionsItem, NGi, NGrid, NSpace } from 'naive-ui';
import { $t } from '@/locales';
import { fetchCacheDetail } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import CacheDetail = MonitorCacheApi.CacheDetail;

const { t } = useI18n();

const cache = ref<Partial<CacheDetail>>({});
const commandstats = ref();
const usedmemory = ref();

const appStore = useAppStore();

const gap = computed(() => (appStore.isMobile ? 0 : 16));

const getList = async () => {
  const res = await fetchCacheDetail();
  if (!res.data) {
    return;
  }
  cache.value = res.data;
  const commandStatsInstance = echarts.init(commandstats.value, 'macarons');
  commandStatsInstance.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    series: [
      {
        name: $t('page.monitor.cache.chart.command'),
        type: 'pie',
        roseType: 'radius',
        radius: [10, 95],
        center: ['50%', '42%'],
        data: res.data.commandStats,
        animationEasing: 'cubicInOut',
        animationDuration: 1000
      }
    ]
  });
  const usedMemoryInstance = echarts.init(usedmemory.value, 'macarons');
  usedMemoryInstance.setOption({
    tooltip: {
      formatter: `{b} <br/>{a} : ${cache.value.info?.used_memory_human}`
    },
    series: [
      {
        name: $t('page.monitor.cache.chart.peakValue'),
        type: 'gauge',
        min: 0,
        max: 1000,
        detail: {
          formatter: cache.value.info?.used_memory_human
        },
        data: [
          {
            value: Number.parseFloat(cache.value.info?.used_memory_human || '0'),
            name: $t('page.monitor.cache.chart.memoryUsage')
          }
        ]
      }
    ]
  });
  window.addEventListener('resize', () => {
    commandStatsInstance.resize();
    usedMemoryInstance.resize();
  });
};

onMounted(() => {
  getList();
});
</script>

<template>
  <NSpace vertical size="large">
    <NCard :title="t('page.monitor.cache.basicInfo')" :bordered="false" class="card-wrapper">
      <NGrid :cols="4" x-gap="12">
        <NGi>
          <NDescriptions label-placement="left" :column="1">
            <NDescriptionsItem :label="t('page.monitor.cache.redisVersion')">
              {{ cache.info?.redis_version }}
            </NDescriptionsItem>
            <NDescriptionsItem :label="t('page.monitor.cache.runMode')">
              {{cache.info?.redis_mode === 'standalone' ? t('page.monitor.cache.standalone') : t('page.monitor.cache.cluster')
              }}
            </NDescriptionsItem>
            <NDescriptionsItem :label="t('page.monitor.cache.port')">
              {{ cache.info?.tcp_port }}
            </NDescriptionsItem>

          </NDescriptions>
        </NGi>
        <NGi>
          <NDescriptions label-placement="left" :column="1">
            <NDescriptionsItem :label="t('page.monitor.cache.runTimeDays')">
              {{ cache.info?.uptime_in_days }}
            </NDescriptionsItem>
            <NDescriptionsItem :label="t('page.monitor.cache.usedMemory')">
              {{ cache.info?.used_memory_human }}
            </NDescriptionsItem>
            <NDescriptionsItem :label="t('page.monitor.cache.usedCPU')">
              {{ parseFloat(cache.info?.used_cpu_user_children || '0').toFixed(2) }}
            </NDescriptionsItem>

          </NDescriptions>
        </NGi>
        <NGi>
          <NDescriptions label-placement="left" :column="1">
            <NDescriptionsItem :label="t('page.monitor.cache.aofEnabled')">
              {{ cache.info?.aof_enabled === '0' ? t('common.yesOrNo.no') : t('common.yesOrNo.yes') }}
            </NDescriptionsItem>
            <NDescriptionsItem :label="t('page.monitor.cache.rdbSuccess')">
              {{ cache.info?.rdb_last_bgsave_status }}
            </NDescriptionsItem>
            <NDescriptionsItem :label="t('page.monitor.cache.keyCount')">
              {{ cache.dbSize }}
            </NDescriptionsItem>

          </NDescriptions>
        </NGi>
        <NGi>
          <NDescriptions label-placement="left" :column="1">
            <NDescriptionsItem :label="t('page.monitor.cache.clientCount')">
              {{ cache.info?.connected_clients }}
            </NDescriptionsItem>
            <NDescriptionsItem :label="t('page.monitor.cache.memoryConfig')">
              {{ cache.info?.maxmemory_human }}
            </NDescriptionsItem>
            <NDescriptionsItem :label="t('page.monitor.cache.networkInOut')">
              {{ cache.info?.instantaneous_input_kbps }}kps/{{ cache.info?.instantaneous_output_kbps }}kps
            </NDescriptionsItem>
          </NDescriptions>
        </NGi>
      </NGrid>
    </NCard>
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:12">
        <NCard :title="t('page.monitor.cache.commandStats')" :bordered="false" class="card-wrapper">
          <div ref="commandstats" style="height: 420px;" />
        </NCard>
      </NGi>
      <NGi span="24 s:24 m:12">
        <NCard :title="t('page.monitor.cache.usedMemory')" :bordered="false" class="card-wrapper">
          <div ref="usedmemory" style="height: 420px; " />
        </NCard>
      </NGi>
    </NGrid>
  </NSpace>
</template>
