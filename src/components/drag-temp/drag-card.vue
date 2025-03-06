<template>
    <VueDraggableResizable :x="card.x" :y="card.y" :w="card.width" :h="card.height" :parent="true" :snap="true"
        :resizable="true" @dragging="onDrag" @resizing="onResize" @activated="activateCard(card.id)"
        class="draggable-card">
        <div class="card-content">
            <span>{{ card.title }}</span>
        </div>
    </VueDraggableResizable>
</template>

<script setup>
import { ref, computed } from 'vue';
import VueDraggableResizable from 'vue-draggable-resizable';
import 'vue-draggable-resizable/style.css';
const props = defineProps({
    card: {
        type: Object,
        required: true,
    },
    activateCard: {
        type: Function,
        required: true,
    },
    activeCardId: {
        type: Number,
        required: true,
    }
})

const onDrag = (x, y) => {
    props.card.x = x;
    props.card.y = y;
};

const onResize = (x, y, width, height) => {
    props.card.x = x;
    props.card.y = y;
    props.card.width = width;
    props.card.height = height;
};
</script>

<style scoped>
.draggable-card {
    position: absolute;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
</style>