<template>
  <div class="image-preview-mask" @click="close" v-if="show">
    <div class="image-preview-icon-close">
      <CloseOutlined />
    </div>
    <div class="image-preview-content" :class="[show ? 'image-preview-content-show' : '']">
      <img :src="url" alt="加载中..." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { CloseOutlined } from '@ant-design/icons-vue';
const emit = defineEmits(['update:show']);
const props = defineProps<{ url: string, show: boolean }>();
function close() {
  emit('update:show', false);
}
</script>

<style scoped lang="scss">
.image-preview-mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.35);

  .image-preview-icon-close {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .image-preview-content {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    max-width: 80%;
    max-height: 80%;
    img {
      display: block;
      margin: auto;
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
    }
  }


}
</style>
