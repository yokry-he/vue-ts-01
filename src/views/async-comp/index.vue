<template>
    <div class="flex-box-v">
        <h1>Async Component test <button @click="changeComp">change component</button></h1>
        <div class="flex-box-content">
            <component :is="currComp"></component>
        </div>
    </div>
</template>

<script setup>
// import { defineAsyncComponent } from 'vue';
// import { compile } from '@vue/compiler-dom';
import { EditorView, basicSetup } from 'codemirror';

</script>

<style lang="scss" scoped>

</style>