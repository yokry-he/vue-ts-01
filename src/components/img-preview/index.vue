<template>
  <div class="image-preview-mask" @click="close" v-if="show">
    <div class="image-preview-toolbar">
    </div>
    <div class="image-preview-content" :class="[show ? 'image-preview-content-show' : '']">
      <img :src="url" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
const emit = defineEmits(['update:show']);
const props = defineProps<{ url: string, show: boolean }>();
function close() {
  emit('update:show', false);
}
</script>

<style scoped lang="scss">
.image-preview-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;

  .image-preview-icon-close {}

  .image-preview-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 0;
    transition: all 0.5s ease-in;

    img {
      display: block;
      width: 100%;
      height: 100%;
    }

    &.image-preview-content-show {
      width: auto;
      height: auto;
      max-width: 80%;
      max-height: 80%;
      margin: auto;
    }
  }


}
</style>
