import { Directive } from 'vue';
import loadingSvg from './loading.svg'
const loading: Directive= {
    mounted(el: HTMLElement & { _loadingSpinner: HTMLElement | null }, binding: { value: any; }) {
        // 创建加载动画容器
        const spinner = document.createElement('div');
        spinner.innerHTML = loadingSvg;
        spinner.classList.add('yk-loading-container');

        // 将加载动画插入到目标元素中
        el.appendChild(spinner);

        // 根据绑定值控制显示/隐藏
        if (binding.value) {
            el.classList.add('yk-loading-active');
        } else {
            el.classList.remove('yk-loading-active');
        }

        // 保存对加载动画的引用
        el._loadingSpinner = spinner;
    },
    updated(el: HTMLElement& { _loadingSpinner: HTMLElement | null }, binding: { value: any; }) {
        // 更新时根据绑定值切换显示/隐藏
        if (binding.value) {
            el.classList.add('yk-loading-active');
        } else {
            el.classList.remove('yk-loading-active');
        }
    },
    unmounted(el: HTMLElement& { _loadingSpinner: HTMLElement | null }, binding: { value: any; }) {
        // 清理加载动画
        if (el._loadingSpinner) {
            el.removeChild(el._loadingSpinner);
        }
    },
}
export default loading;