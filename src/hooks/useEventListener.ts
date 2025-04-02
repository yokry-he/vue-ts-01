import { debounce } from '@/utils';
import { onMounted, onUnmounted, Ref } from 'vue';

// 自定义组合函数，用于添加和移除事件监听器
export function useEventListener(ele: any, event: keyof HTMLElementEventMap, listener: any, options: { debounce: boolean, debounceWait: number } = { debounce: false, debounceWait: 100 }) {
    ele = ele || window;
    let target: HTMLElement
    // 在组件挂载时添加事件监听器
    onMounted(() => {
        target = ele.addEventListener ? ele : ele.value;
        if (options.debounce) {
            listener = debounce(listener, options.debounceWait);
        }
        target.addEventListener && target.addEventListener(event, listener);
    });
    // 在组件销毁时移除事件监听器
    onUnmounted(() => {
        target.removeEventListener(event, listener);
    });
}
