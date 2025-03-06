<template>
  <n-space class="yok-nav" align="center" :style="{
    padding: '6px 24px',
    boxShadow: '0 5px 10px #81DEEE',
    backgroundImage:
      'linear-gradient(to right, #0DD2D7, #81DEEE, #DDFBD2 100%)',

  }">
    <n-avatar class="yok-avatar" round size="large" src="/public/profile/avatar.png"
      fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" @click="onAvatarClick" />
    <n-text>Yokry(前端工程师)</n-text>
  </n-space>
  <n-space class="yok-main" vertical :style="{
    padding: '24px',
    marginTop: '60px'
  }">
    <!-- <n-slider v-model:value="hsla.h" :step="10" :max="360" :min="0" />
    <n-slider v-model:value="hsla.s" :step="1" :max="100" :min="0" />
    <n-slider v-model:value="hsla.l" :step="1" :max="100" :min="0" />
    <n-slider v-model:value="hsla.a" :step="0.01" :max="1" :min="0" /> -->

    <n-slider v-model:value="rgb.r" :step="1" :max="255" :min="0" />
    <n-slider v-model:value="rgb.g" :step="1" :max="255" :min="0" />
    <n-slider v-model:value="rgb.b" :step="1" :max="255" :min="0" />
    <n-slider v-model:value="rgb.a" :step="0.01" :max="1" :min="0" />
    <n-space justify="space-around" :wrap-item="false">
      <div :style="{
        width: '400px',
        height: '400px',
        background: rgbBg
      }"></div>
      <div :style="{
        width: '400px',
        height: '400px',
        background: rgb2Bg
      }"></div>
    </n-space>


  </n-space>


  <img-preview url="/public/profile/avatar.png" v-model:show="visible"></img-preview>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import ImgPreview from "@comps/img-preview/index.vue";
import { rgbToHsl } from "../../utils";
const visible = ref(false);
const hsla = reactive(
  {
    h: 0,
    s: 0,
    l: 0,
    a: 1
  }
);
const rgb = reactive({ r: 0, g: 0, b: 0, a: 1 });

const rgbBg = computed(() => {
  // return `hsla(${hsla.h}, ${hsla.a}%, ${hsla.l}%, ${hsla.a})`;
  // return `hsl(${hsla.h}, ${hsla.a}%, ${hsla.l}%)`;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
});
const rgb2Bg = computed(() => {
  return rgbToHsl(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`)?.toRgbaString();
});

function onAvatarClick() {
  visible.value = true;
}

</script>

<style lang="scss" scoped>
.yok-nav {
  position: fixed;
  width: 100%;
  left: 0;
}

.yok-avatar {
  img {
    vertical-align: middle;
  }
}
</style>
