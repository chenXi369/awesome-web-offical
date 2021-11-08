<template>
  <section>
    <template>
      <div
        v-if="idNumFrontImg"
        class="idCardImg"
        @mouseenter="mouseInFrontImg"
        @mouseleave="mouseOutFrontImg"
      >
        <div
          v-if="frontImgVisible"
          class="pictrue-overlay"
          @click="amplifyIdNum(0)"
        >
          <i class="el-icon-zoom-in" style="color: #fff; font-size: 32px"></i>
        </div>
        <img :src="idNumFrontImg" class="avatar" style="margin-right: 10px" />
      </div>
    </template>

    <el-upload
      action="#"
      class="avatar-uploader"
      :auto-upload="true"
      :show-file-list="false"
      :before-upload="beforeuploadIdNum"
      :on-success="successUploadIdNumFront"
    >
      <el-button
        v-if="idNumFrontImg !== ''"
        size="small"
        type="text"
        style="width: 120px"
        >重新上传</el-button
      >
      <i v-else slot="default" class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </section>
</template>

<script>
export default {};
</script>

<style>
</style>