import { onMounted, onUnmounted } from 'vue';

// 自定义组合函数，用于添加和移除事件监听器
export function useEventListener(target: HTMLElement, event: keyof HTMLElementEventMap, listener: any) {
    target = target || window
    // 在组件挂载时添加事件监听器
    onMounted(() => {
        target.addEventListener(event, listener);
    });
    // 在组件销毁时移除事件监听器
    onUnmounted(() => {
        target.removeEventListener(event, listener);
    });
}
