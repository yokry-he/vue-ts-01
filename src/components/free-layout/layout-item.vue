<template>
    <div>
        
    </div>
</template>

<script setup>
const props = defineProps({
    // 列数
    colNum: {
        type: number,
        default: 6,
        validator (val) {
            return val > 1
        }
    },
    // 行数
    rowNum: {
        type: number,
        default: 6,
        validator (val) {
            return val > 1
        }
    }
})

</script>

<style lang="scss" scoped>

</style>