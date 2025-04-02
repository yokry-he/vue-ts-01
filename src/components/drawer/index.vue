<template>
    <div class="yk-drawer" :class="{ 'yk-drawer-fixed': fixed }">
    </div>
</template>

<script setup>
const props = defineProps({
    // 列数
    fixed: {
        type: Boolean,
        default: false
    },

})

function getTopWindow() {
    try {
        // 尝试访问父窗口的 location 对象
        const parentOrigin = window.top.location.href;
        return window.top; // 如果没有抛出异常，则同源
    } catch (error) {
        // 捕获安全异常，说明不同源
        return window;
    }
}

</script>

<style lang="scss" scoped>
.yk-drawer {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    .yk-drawer-header {
        display: flex;
        align-items: center;
        height: 50px;
        line-height: 50px;
    }
    .yk-drawer-body {
        flex: 1;
        height: 0;
        padding: 10px;
        overflow: auto;
    }
    .yk-drawer-footer {
        display: flex;
        align-items: center;
        height: 50px;
        line-height: 50px;
    }
}
</style>
