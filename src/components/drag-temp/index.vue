<template>
    <div id="app">
        <div class="cards-container">
            <!-- <drag-card v-for="card in cards" :key="card.id" :card="card" :active-card-id="activeCardId"
                @activated="activateCard" /> -->
                <resize-box uniqueId="111"></resize-box>
                <resize-box uniqueId="222" :x="200" :y="200"></resize-box>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DragCard from './drag-card.vue';
import ResizeBox from '../resize-box/index.vue'

// const activeCardId = ref(null);
// const cards = ref([
//     { id: 1, title: 'Card 1', x: 50, y: 50, width: 200, height: 150 },
//     { id: 2, title: 'Card 2', x: 300, y: 50, width: 200, height: 150 },
//     { id: 3, title: 'Card 3', x: 50, y: 250, width: 200, height: 150 },
// ]);
// const activateCard = (id) => {
//     activeCardId.value = id;
// };
</script>
<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

.cards-container {
    position: relative;
    width: 100%;
    height: 80vh;
    border: 1px solid #ccc;
    padding: 10px;
}
</style>