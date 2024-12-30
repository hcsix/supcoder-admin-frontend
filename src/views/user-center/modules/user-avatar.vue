<!--<script setup lang="ts">-->
<!--import 'vue-cropper/dist/index.css';-->
<!--import { getCurrentInstance, reactive, ref } from 'vue';-->
<!--import { NButton, NCard, NGi, NGrid, NIcon, NModal, NUpload, useMessage } from 'naive-ui';-->
<!--import { MinusOutlined, PlusOutlined, RotateLeftOutlined, RotateRightOutlined, UploadOutlined } from '@vicons/antd';-->
<!--import { fetchUploadAvatar } from '@/service/api';-->
<!--import { useAuthStore } from '@/store/modules/auth';-->

<!--defineOptions({-->
<!--  name: 'UserAvatar'-->
<!--});-->

<!--interface Options {-->
<!--  img: string | any; // 裁剪图片的地址-->
<!--  autoCrop: boolean; // 是否默认生成截图框-->
<!--  autoCropWidth: number; // 默认生成截图框宽度-->
<!--  autoCropHeight: number; // 默认生成截图框高度-->
<!--  fixedBox: boolean; // 固定截图框大小 不允许改变-->
<!--  fileName: string;-->
<!--  previews: any; // 预览数据-->
<!--  outputType: string;-->
<!--  visible: boolean;-->
<!--}-->

<!--const userStore = useAuthStore();-->
<!--// eslint-disable-next-line @typescript-eslint/no-unused-vars-->
<!--const { proxy } = getCurrentInstance() as any;-->
<!--const message = useMessage();-->

<!--const open = ref(false);-->
<!--const visible = ref(false);-->
<!--const title = ref('修改头像');-->

<!--const cropper = ref<any>({});-->
<!--// 图片裁剪数据-->
<!--const options = reactive<Options>({-->
<!--  img: userStore.userInfo.user.avatar,-->
<!--  autoCrop: true,-->
<!--  autoCropWidth: 200,-->
<!--  autoCropHeight: 200,-->
<!--  fixedBox: true,-->
<!--  outputType: 'png',-->
<!--  fileName: '',-->
<!--  previews: {},-->
<!--  visible: false-->
<!--});-->

<!--/** 编辑头像 */-->
<!--const editCropper = () => {-->
<!--  open.value = true;-->
<!--};-->
<!--/** 打开弹出层结束时的回调 */-->
<!--const modalOpened = () => {-->
<!--  visible.value = true;-->
<!--};-->
<!--/** 覆盖默认上传行为 */-->
<!--const requestUpload = ({ file }: { file: File }) => {-->
<!--  if (!file.type.includes('image/')) {-->
<!--    message.error('文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。');-->
<!--    return false;-->
<!--  } else {-->
<!--    const reader = new FileReader();-->
<!--    reader.readAsDataURL(file);-->
<!--    reader.onload = () => {-->
<!--      options.img = reader.result;-->
<!--      options.fileName = file.name;-->
<!--    };-->
<!--  }-->
<!--  return false; // 阻止默认上传行为-->
<!--};-->
<!--/** 向左旋转 */-->
<!--const rotateLeft = () => {-->
<!--  cropper.value.rotateLeft();-->
<!--};-->
<!--/** 向右旋转 */-->
<!--const rotateRight = () => {-->
<!--  cropper.value.rotateRight();-->
<!--};-->
<!--/** 图片缩放 */-->
<!--const changeScale = (num: number) => {-->
<!--  num = num || 1;-->
<!--  cropper.value.changeScale(num);-->
<!--};-->
<!--/** 上传图片 */-->
<!--const uploadImg = async () => {-->
<!--  cropper.value.getCropBlob(async (data: any) => {-->
<!--    const formData = new FormData();-->
<!--    formData.append('avatarfile', data, options.fileName);-->
<!--    const res = await fetchUploadAvatar(formData);-->
<!--    open.value = false;-->
<!--    options.img = res.data.imgUrl;-->
<!--    userStore.userInfo.user.avatar = options.img;-->
<!--    message.success('修改成功');-->
<!--    visible.value = false;-->
<!--  });-->
<!--};-->
<!--/** 实时预览 */-->
<!--const realTime = (data: any) => {-->
<!--  options.previews = data;-->
<!--};-->
<!--/** 关闭窗口 */-->
<!--const closeDialog = () => {-->
<!--  options.img = userStore.userInfo.user.avatar;-->
<!--  options.visible = false;-->
<!--};-->
<!--</script>-->

<!--<template>-->
<!--  <div class="user-info-head" @click="editCropper()">-->
<!--    <img :src="options.img" title="点击上传头像" class="img-circle img-lg" />-->
<!--    <NModal v-model:show="open" :title="title" preset="dialog" style="width: 800px;" @after-show="modalOpened" @close="closeDialog">-->
<!--      <NCard style="height: 450px;">-->
<!--        <NGrid :cols="24" :x-gap="16">-->
<!--          <NGi :span="12" style="height: 350px;">-->
<!--            <vue-cropper-->
<!--              v-if="visible"-->
<!--              ref="cropper"-->
<!--              :img="options.img"-->
<!--              :info="true"-->
<!--              :auto-crop="options.autoCrop"-->
<!--              :auto-crop-width="options.autoCropWidth"-->
<!--              :auto-crop-height="options.autoCropHeight"-->
<!--              :fixed-box="options.fixedBox"-->
<!--              :output-type="options.outputType"-->
<!--              @real-time="realTime"-->
<!--            />-->
<!--          </NGi>-->
<!--          <NGi :span="12" style="height: 350px;">-->
<!--            <div class="avatar-upload-preview">-->
<!--              <img :src="options.previews.url" :style="options.previews.img" />-->
<!--            </div>-->
<!--          </NGi>-->
<!--        </NGrid>-->
<!--        <br />-->
<!--        <NGrid :cols="24" :x-gap="16">-->
<!--          <NGi :span="2">-->
<!--            <NUpload action="#" :on-upload="requestUpload" :before-upload="requestUpload">-->
<!--              <NButton>-->
<!--                选择-->
<!--                <template #icon>-->
<!--                  <NIcon>-->
<!--                    <UploadOutlined />-->
<!--                  </NIcon>-->
<!--                </template>-->
<!--              </NButton>-->
<!--            </NUpload>-->
<!--          </NGi>-->
<!--          <NGi :span="1" :offset="2">-->
<!--            <NButton @click="changeScale(1)">-->
<!--              <template #icon>-->
<!--                <NIcon>-->
<!--                  <PlusOutlined />-->
<!--                </NIcon>-->
<!--              </template>-->
<!--            </NButton>-->
<!--          </NGi>-->
<!--          <NGi :span="1" :offset="1">-->
<!--            <NButton @click="changeScale(-1)">-->
<!--              <template #icon>-->
<!--                <NIcon>-->
<!--                  <MinusOutlined />-->
<!--                </NIcon>-->
<!--              </template>-->
<!--            </NButton>-->
<!--          </NGi>-->
<!--          <NGi :span="1" :offset="1">-->
<!--            <NButton @click="rotateLeft()">-->
<!--              <template #icon>-->
<!--                <NIcon>-->
<!--                  <RotateLeftOutlined />-->
<!--                </NIcon>-->
<!--              </template>-->
<!--            </NButton>-->
<!--          </NGi>-->
<!--          <NGi :span="1" :offset="1">-->
<!--            <NButton @click="rotateRight()">-->
<!--              <template #icon>-->
<!--                <NIcon>-->
<!--                  <RotateRightOutlined />-->
<!--                </NIcon>-->
<!--              </template>-->
<!--            </NButton>-->
<!--          </NGi>-->
<!--          <NGi :span="2" :offset="6">-->
<!--            <NButton type="primary" @click="uploadImg()">提 交</NButton>-->
<!--          </NGi>-->
<!--        </NGrid>-->
<!--      </NCard>-->
<!--    </NModal>-->
<!--  </div>-->
<!--</template>-->

<!--<style lang="scss" scoped>-->
<!--.user-info-head {-->
<!--  position: relative;-->
<!--  display: inline-block;-->
<!--  height: 120px;-->
<!--}-->

<!--.user-info-head:hover:after {-->
<!--  content: '+';-->
<!--  position: absolute;-->
<!--  left: 0;-->
<!--  right: 0;-->
<!--  top: 0;-->
<!--  bottom: 0;-->
<!--  color: #eee;-->
<!--  background: rgba(0, 0, 0, 0.5);-->
<!--  font-size: 24px;-->
<!--  font-style: normal;-->
<!--  -webkit-font-smoothing: antialiased;-->
<!--  -moz-osx-font-smoothing: grayscale;-->
<!--  cursor: pointer;-->
<!--  line-height: 110px;-->
<!--  border-radius: 50%;-->
<!--}-->

<!--.avatar-upload-preview {-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  overflow: hidden;-->
<!--  border-radius: 50%;-->
<!--  position: relative;-->
<!--  background: #f8f8f8;-->
<!--}-->

<!--.avatar-upload-preview img {-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  object-fit: cover;-->
<!--}-->
<!--</style>-->
