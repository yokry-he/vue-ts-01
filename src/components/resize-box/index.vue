<template>
    <div class="drag-resize-box" :class="{ 'drag-resize-box-disabled': disabled }" ref="container" :style="{
        width: w + 'px',
        height: h + 'px',
        left: x + 'px',
        top: y + 'px',
        zIndex: z + '',
        border: showBorder ? '1px solid ' + bgColor : '0',
    }">
        <div class="drag-resize-content" :style="{ overflow: !disabled ? 'auto' : 'hidden', background: bgColor }"
            @mousedown="mouseDown($event, 'move')">
            <slot></slot>
        </div>
        <div class="dr-re-toolbar" v-if="showToolbar && !disabled" @mousedown.prevent="mouseDown($event, 'move')">
            <div class="icon-close" v-if="showClose" @click.prevent="closeComp">
                <CloseOutlined />
            </div>
        </div>
        <div v-if="showToolbar && !disabled" class="dr-re-lt" :class="[showBorder ? 'b-show' : 'b-hide']"
            @mousedown="mouseDown($event, 'nw')"></div>
        <div v-if="showToolbar && !disabled" class="dr-re-t" @mousedown="mouseDown($event, 'n')"></div>
        <div v-if="showToolbar && !disabled" class="dr-re-rt" :class="[showBorder ? 'b-show' : 'b-hide']"
            @mousedown="mouseDown($event, 'ne')"></div>
        <div v-if="showToolbar && !disabled" class="dr-re-r" @mousedown="mouseDown($event, 'e')"></div>
        <div v-if="showToolbar && !disabled" class="dr-re-rb" :class="[showBorder ? 'b-show' : 'b-hide']"
            @mousedown="mouseDown($event, 'se')"></div>
        <div v-if="showToolbar && !disabled" class="dr-re-b" @mousedown="mouseDown($event, 's')"></div>
        <div v-if="showToolbar && !disabled" class="dr-re-lb" :class="[showBorder ? 'b-show' : 'b-hide']"
            @mousedown="mouseDown($event, 'sw')"></div>
        <div v-if="showToolbar && !disabled" class="dr-re-l" @mousedown="mouseDown($event, 'w')"></div>
    </div>
</template>
<script setup>
import { CloseOutlined } from '@ant-design/icons-vue'
import { useEventListener } from '@/hooks/useEventListener'
import { ref, onMounted, getCurrentInstance } from 'vue'
const emits = defineEmits(['close', 'dragMoved', 'dragResized'])
const props = defineProps({
    w: {
        type: [String, Number],
        default: 100,
    },
    h: {
        type: [String, Number],
        default: 100,
    },
    x: {
        type: [String, Number],
        default: 0,
    },
    y: {
        type: [String, Number],
        default: 0,
    },
    z: {
        type: [String, Number],
        default: 0,
    },
    //唯一标识
    uniqueId: {
        type: String,
        default: "",
    },
    showToolbar: {
        type: Boolean,
        default: true,
    },
    showClose: {
        type: Boolean,
        default: true,
    },
    showBorder: {
        type: Boolean,
        default: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    bgColor: {
        type: String,
        default: "#aaaaaa",
    },
})
const container = ref()
let initMousePosi = null
let currMousePosi = null
let currDragEle = null
const maxZIndex = 1000
const mouseMoveHandler = (e) => {
    if (props.disabled || !initMousePosi) {
        return
    }
    if (initMousePosi.flag === 'move') {
        dragMove(e)
    } else {
        dragResize(e)
    }
}
const mouseUpHandler = (e) => {
    if (props.disabled || !currDragEle) {
        return
    }
    let rectInfo = getCurrRect()
    let instance = getCurrentInstance()
    if (initMousePosi.flag === 'move') {
        emits('dragMoved', {
            rectInfo: rectInfo,
            comp: instance,
            container: container.value
        })
    } else {
        emits('dragResized', {
            rectInfo: rectInfo,
            comp: instance,
            container: container.value
        })
    }
    currDragEle = null
    initMousePosi = null
}
useEventListener(window, 'mousemove', mouseMoveHandler)
useEventListener(window, 'mouseup', mouseUpHandler)
onMounted(() => {
    // console.log('props.uniqueId: ', props.uniqueId)
    init()
})
function init() {
    if (!props.z) {
        setCurrDragEle()
    }
}
function mouseDown(e, flag) {
    if (props.disabled) {
        return
    }
    if (!container.value) {
        return
    }
    currDragEle = container.value
    initMousePosi = {
        x: e.pageX,
        y: e.pageY,
        flag: flag,
    }
    //设置当前元素为最上层元素
    setCurrDragEle()
}
function setCurrDragEle () {
    // 获取父元素
    let pNode = container.value.parentNode
    let childs = Array.from(pNode.children)
    let zIndex = 1;
    childs.forEach(item => {
        zIndex = Math.max(zIndex, getAttr(item, 'zIndex', true))
    })
    if (getCurrAttr('zIndex', true) < zIndex) {
        container.value.style.zIndex = String(++zIndex)
    }
    if (zIndex > maxZIndex) {
        let childNum = childs.length
        childs.forEach(item => {
            item.style.zIndex = String(getAttr(item, 'zIndex', true) + childNum - maxZIndex)
        })
    }
}
function dragMove (e) {
    if (!currDragEle) {
        return
    }
    currMousePosi = {
        x: e.pageX,
        y: e.pageY
    }
    const posi = calcPosi(initMousePosi, currMousePosi)
    container.value.style.left = (getCurrAttr('left', true) + posi.x) + 'px'
    container.value.style.top = (getCurrAttr('top', true) + posi.y) + 'px'
    initMousePosi.x = currMousePosi.x
    initMousePosi.y = currMousePosi.y
}
function dragResize(e) {
    if (!currDragEle) {
        return
    }
    currMousePosi = {
        x: e.pageX,
        y: e.pageY
    }
    const posi = calcPosi(initMousePosi, currMousePosi)
    resizeHandler(initMousePosi.flag, posi)
    initMousePosi.x = currMousePosi.x
    initMousePosi.y = currMousePosi.y
}
function resizeHandler (flag, posi) {
    const style = container.value.style
    if (flag.includes('e')) {
        style.width = getCurrAttr('width', true) + posi.x + 'px'
    }
    if (flag.includes('w')) {
        style.width = getCurrAttr('width', true) - posi.x + 'px'
        style.left = getCurrAttr('left', true) + posi.x + 'px' 
    }
    if (flag.includes('s')) {
        style.height = getCurrAttr('height', true) + posi.y + 'px' 
    }
    if (flag.includes('n')) {
        style.height = getCurrAttr('height', true) - posi.y + 'px' 
        style.top = getCurrAttr('top', true) + posi.y + 'px' 
    }
}
function closeComp () {
    emits('close', {
        uniqueId: props.uniqueId
    })
}
function calcPosi (oldPosi, newPosi) {
    return {
        x: newPosi.x - oldPosi.x,
        y: newPosi.y - oldPosi.y
    }
}
function getCurrRect () {
    return {
        width: getCurrAttr('width'),
        height: getCurrAttr('height'),
        left: getCurrAttr('left'),
        top: getCurrAttr('top'),
        zIndex: getCurrAttr('zIndex')
    }
} 
function getCurrAttr (attr, flag) {
    const ele = container.value
    return getAttr(ele, attr, flag)
}
function getAttr (ele, attr, flag) {
    const style = ele.style
    if (!style) {
        return null
    }
    return flag ? parseIntPlus(style[attr]) : (style[attr] || null)
}
function parseIntPlus (numStr) {
    return isNaN(parseInt(numStr)) ? 0 : parseInt(numStr)
}
</script>

<style lang="scss" scoped>
$bWidth: 10px;
$ofSize: -(8px-4);
$iconSize: 24px;

div {
    box-sizing: border-box;
    position: absolute;
}

.dr-re-toolbar {
    display: inline-block;
    height: $iconSize;
    line-height: $iconSize;
    right: 0px;
    z-index: 9;
    width: 100%;
    display: flex;
    justify-content: flex-end;
}

.dr-re-toolbar::after {
    content: "";
    clear: both;
    display: inline-block;
}

.icon-close {
    width: $iconSize;
    height: $iconSize;
    line-height: $iconSize;
    // background-image: url("./imgs/close.png");
    // background-size: 100%;
    text-align: center;

    &::before {
        content: "";
    }
}

.icon-close:hover {
    transform: scale(1.2);
}

.b-show {
    border: 1px solid #cccccc;
    display: block;
}

.b-hide {
    border: 0;
    display: none;
}

.drag-resize-box {
    min-width: 50px;
    min-height: 50px;
    box-sizing: border-box;
    border: 1px solid #aaaaaa;
}

.drag-resize-box-disabled {
    cursor: not-allowed;
}

.drag-resize-content {
    width: 100%;
    height: 100%;
    overflow: auto;
}

[class^="dr-re"] {
    position: absolute;
}

.dr-re-lt {
    cursor: nw-resize;
    width: $bWidth;
    height: $bWidth;
    left: $ofSize;
    top: $ofSize;
    z-index: 2;
}

.dr-re-t {
    cursor: n-resize;
    width: 100%;
    height: $bWidth;
    top: $ofSize;
    z-index: 1;
}

.dr-re-rt {
    cursor: ne-resize;
    width: $bWidth;
    height: $bWidth;
    right: $ofSize;
    top: $ofSize;
    z-index: 2;
}

.dr-re-r {
    cursor: e-resize;
    height: 100%;
    width: $bWidth;
    right: $ofSize;
    z-index: 1;
}

.dr-re-rb {
    cursor: se-resize;
    width: $bWidth;
    height: $bWidth;
    right: $ofSize;
    bottom: $ofSize;
    z-index: 2;
}

.dr-re-b {
    cursor: s-resize;
    width: 100%;
    height: $bWidth;
    bottom: $ofSize;
    z-index: 1;
}

.dr-re-lb {
    cursor: sw-resize;
    width: $bWidth;
    height: $bWidth;
    left: $ofSize;
    bottom: $ofSize;
    z-index: 2;
}

.dr-re-l {
    cursor: w-resize;
    height: 100%;
    width: $bWidth;
    left: $ofSize;
    z-index: 1;
}
</style>