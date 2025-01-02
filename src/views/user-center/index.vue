<script setup name="Profile" lang="ts">
import { onMounted, ref } from 'vue';
import { NCard, NGi, NGrid, NTabPane, NTabs } from 'naive-ui';
import { fetchGetUserProfile } from '@/service/api';
import UserInfo from './modules/user-info.vue';
import ResetPwd from './modules/reset-pwd.vue';
import OnlineDevice from './modules/online-device.vue';
import UserVO = SystemUserApi.UserVO;

const activeTab = ref('userinfo');

interface State {
  user: Partial<UserVO>;
  roleGroup: string;
  auths: any;
  // devices: any;
}

const state = ref<State>({
  user: {},
  roleGroup: '',
  auths: []
  // devices: []
});

const userForm = ref({});

async function getUserProfile() {
  const res = await fetchGetUserProfile();
  if (res.data?.user) {
    state.value.user = res.data.user;
    userForm.value = { ...res.data.user };
    state.value.roleGroup = res.data.roleGroup;
  }
};


onMounted(() => {
  getUserProfile();
  // getOnlineDevices();
});
</script>


<template>
  <div class="p-2">
    <NGrid :cols="24" :xGap="20">
      <NGi :span="6" :xs="24">
        <NCard class="box-card" title="个人信息"
               style="margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <div class="align-mid d-flex justify-center mt-16px">
            <NAvatar round
                     :src="state.user.avatar || '/src/assets/imgs/avatar.png'"
                     :size="156"
                     :style="{
                        backgroundColor: '#F7F8FA',
                        border: '2px solid #EAECEF',
                     }"
            />
          </div>
          <NText type="secondary"
                 :style="{ fontSize: '1.6em', marginTop: '24px' }"
                 strong>{{ state.user.nickName }}
          </NText>
          <div>
            <NText type="secondary"
                   :style="{ fontSize: '1em', marginTop: '5px', color: '#6C757D' }"
            >{{ state.user.userName }}
            </NText>
          </div>

          <div class="list-group-item d-flex align-items-center">
            <span>{{ state.user.phonenumber }}</span>
          </div>

          <div class="list-group-item d-flex align-items-center">
            <span>{{ state.user.email }}</span>
          </div>

          <div class="list-group-item d-flex align-items-center">
            <span>{{ state.user.createTime }}</span>
          </div>

          <NTag type="default" round :bordered="true"
                :style="{ fontSize: '1em', marginTop: '16px' }"
          >{{ state.roleGroup }}
            <template #avatar>
              <n-avatar
                src="https://cdnimg103.lizhi.fm/user/2017/02/04/2583325032200238082_160x160.jpg"
              />
            </template>
          </NTag>
        </NCard>
      </NGi>
      <NGi :span="18" :xs="24">
        <NCard title="基本资料" style="margin-bottom: 20px;">
          <NTabs v-model:value="activeTab">
            <NTabPane name="userinfo" tab="基本资料">
              <UserInfo :user="userForm" />
            </NTabPane>
            <NTabPane name="resetPwd" tab="修改密码">
              <ResetPwd />
            </NTabPane>
            <NTabPane name="onlineDevice" tab="在线设备">
              <OnlineDevice :devices="state.devices" />
            </NTabPane>
          </NTabs>
        </NCard>
      </NGi>
    </NGrid>
  </div>
</template>

<style scoped>
.list-group {
  list-style-type: none;
  padding: 0;
}

.list-group-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 6px;
  border-bottom: 1px solid #ebeef5;
}

.list-group-item:last-child {
  border-bottom: none;
}

.d-flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}

.pull-right {
  text-align: right;
}
</style>
