<script setup name="Profile" lang="ts">
import { onMounted, ref } from 'vue';
import { NCard, NGi, NGrid, NTabPane, NTabs } from 'naive-ui';
import {  fetchGetUserProfile } from '@/service/api';
// import UserAvatar from './modules/user-avatar.vue';
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
  auths: [],
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
        <NCard class="box-card" title="个人信息" style="margin-bottom: 20px;">
          <div class="text-center">
<!--            <UserAvatar />-->
          </div>
          <ul class="list-group list-group-striped">
            <li class="list-group-item">用户名称<div class="pull-right">{{ state.user.userName }}</div></li>
            <li class="list-group-item">手机号码<div class="pull-right">{{ state.user.phonenumber }}</div></li>
            <li class="list-group-item">用户邮箱<div class="pull-right">{{ state.user.email }}</div></li>
            <li class="list-group-item">所属角色<div class="pull-right">{{ state.roleGroup }}</div></li>
            <li class="list-group-item">创建日期<div class="pull-right">{{ state.user.createTime }}</div></li>
          </ul>
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
  padding: 8px 16px;
  border-bottom: 1px solid #ebeef5;
}

.list-group-item:last-child {
  border-bottom: none;
}

.pull-right {
  text-align: right;
}
</style>
