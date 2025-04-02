<template>
    <div class="yk-free-layout-wrapper" ref="layoutWrapperRef">
        <table class="yk-free-layout" :style="{ borderSpacing: borderSpacing }">
            <tbody>
                <tr class="yk-free-layout-tr" v-for="(rowTds, index) in tableRenderData" :key="'row:' + index">
                    <td class="yk-free-layout-td-hidden" :style="{ height: tdItemHeight }"></td>
                    <td class="yk-free-layout-td"
                        :class="{'is-editing': isEditing}"
                        v-for="col in rowTds.filter(item => item._show)"
                        :data-key="col._key"
                        :data-colspan="col.colspan"
                        :data-rowspan="col.rowspan"
                        :key="col._key"
                        :rowspan="col.rowspan"
                        :colspan="col.colspan">
                        <div
                            class="yk-free-layout-td-wrapper"
                            :class="{'yk-free-layout-td-wrapper-selected': col.selected}"
                            :style="{margin: `${interval / 2}px`}">
                            <div v-show="isEditing" class="yk-free-layout-td-toolbar">
                                <div class="yk-free-layout-td-toolbar-content">
                                    <div class="label">列：</div>
                                    <div class="control">
                                        <input class="input" type="number" min="1" :max="col._colspanMax" v-model="col.colspan" @input="colspanChange($event.target.value, col)">
                                    </div>
                                    <div class="label">行：</div>
                                    <div class="control">
                                        <input class="input" type="number" min="1" :max="col._rowspanMax" v-model="col.rowspan" @input="rowspanChange($event.target.value, col)">
                                    </div>
                                </div>
                                <div class="yk-free-layout-td-toolbar-icon"></div>
                            </div>
                            <div
                                class="yk-free-layout-td-content"
                                :data-key="col._key"
                                :data-colspan="col.colspan"
                                :data-rowspan="col.rowspan">
                                {{ col._key }}
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-show="selectionShow" class="yk-free-layout-mask-selection" :style="{left: `${selectionRect.x}px`, top: `${selectionRect.y}px`, width: `${selectionRect.width}px`, height: `${selectionRect.height}px`}">
            <div class="yk-free-layout-mask-toobar">
            </div>
        </div>
    </div>
</template>

<script setup>
import { watch, reactive, ref, computed, onMounted, onUnmounted } from 'vue'
import { useEventListener } from '@/hooks/useEventListener'
import { first } from 'lodash'
const props = defineProps({
    // 列数
    colNum: {
        type: Number,
        default: 10,
        validator (val) {
            return val > 1
        }
    },
    // 行数
    rowNum: {
        type: Number,
        default: 10,
        validator (val) {
            return val > 1
        }
    },
    // 间隔
    interval: {
        type: Number,
        default: 10,
        validator (val) {
            return val >= 0
        }
    },
    // 选中区域允许的误差值
    selectionError: {
        type: Number,
        default: 15,
        validator (val) {
            return val >= 0
        }
    },
    borderSpacing: {
        type: String,
        default: '10px 10px'
    }
})
const isDragging = ref(false)
const selectionShow = ref(false)
const mouseFlag = ref(false)
const layoutWrapperRef = ref()
const colNumInner = ref(props.colNum)
const rowNumInner = ref(props.rowNum)
const selectedData = reactive({
    rowspan: 0,
    colspan: 0,
    startKey: '',
    endKey: '',
    selectedTdList: reactive([])
})
const tdItemHeight = computed(() => {
    return `${(100 / rowNumInner.value)}%`
})
const isEditing = ref(false)
const tableRenderData = reactive([])
const startPoint = reactive({
    x: 0,
    y: 0
})
const endPoint = reactive({
    x: 0,
    y: 0
})
const selectionRect = reactive({
    x: 0,
    y: 0,
    width: 0,
    height:0
})
// 监听开始和结束点变化，计算选中区域的位置和大小
watch([startPoint, endPoint], () => {
    selectionRect.x = Math.min(startPoint.x, endPoint.x)
    selectionRect.y = Math.min(startPoint.y, endPoint.y)
    selectionRect.width = Math.abs(endPoint.x - startPoint.x)    
    selectionRect.height = Math.abs(endPoint.y - startPoint.y)
})
// 监听行和列改变，重新渲染表格数据
watch(colNumInner, (newVal, oldVal) => {
    generateTableData()
}, { immediate: true })
watch(rowNumInner, (newVal, oldVal) => {
    generateTableData()
}, { immediate: true })
// 隐藏鼠标选中区域时重置开始和结束点
watch(selectionShow, (newVal, oldVal) => {
    if (!newVal) {
        startPoint.x = 0
        startPoint.y = 0
        endPoint.x = 0
        endPoint.y = 0
        selectionRect.x = 0
        selectionRect.y = 0
        selectionRect.width = 0
        selectionRect.height = 0
    }
})
// 给window绑定鼠标事件
useEventListener(layoutWrapperRef, 'mousedown', handleMouseDown)
useEventListener(layoutWrapperRef,'mousemove', handleMouseMove)
useEventListener(window, 'mouseup', handleMouseUp)
useEventListener(window, 'mousedown', handleWinMouseDown)
// 添加选择区域相关事件监听
// 鼠标按下事件
function handleMouseDown (e) {
    e.preventDefault()
    e.stopPropagation()
    resetSelection()
    // if (!validateAllowMerge(e.target)) {
    //     return
    // }
    mouseFlag.value = true
    selectionShow.value = true
    const rectInfo = e.target.getBoundingClientRect()
    endPoint.x = startPoint.x = (rectInfo.x + e.offsetX)
    endPoint.y = startPoint.y = (rectInfo.y + e.offsetY)
}
// 鼠标移动事件
function handleMouseMove (e) {
    if (!mouseFlag.value) {
        return
    }
    const rectInfo = e.target.getBoundingClientRect()
    endPoint.x = rectInfo.x + e.offsetX
    endPoint.y = rectInfo.y + e.offsetY
    const { itemWidth, itemHeight } = getItemSize()
    if (Math.abs(endPoint.x - startPoint.x) > itemWidth / 2 || Math.abs(endPoint.y - startPoint.y) > itemHeight / 2) {
        isDragging.value = true
    }
}
function handleMouseUp (e) {
    console.log('isDragging: ', isDragging)
    if (!mouseFlag.value || !isDragging.value) {
        resetSelection()
        return
    }
    mouseFlag.value = false
    isDragging.value = false
    const rectInfo = e.target.getBoundingClientRect()
    endPoint.x = rectInfo.x + e.offsetX
    endPoint.y = rectInfo.y + e.offsetY
    // 处理选中区域数据
    handleSelectionArea()
}
// 校验事件开始的单元格是否允许合并
function validateAllowMerge (target) {
    // const targetKey = target.getAttribute('data-key')
    // const targetTdData = getTdDataByKey(targetKey)
    const colspan = target.getAttribute('data-colspan')
    const rowspan = target.getAttribute('data-rowspan')
    if (colspan > 1 || rowspan > 1) {
        return false
    }
    return true
}
function resetSelection () {
    selectionShow.value && (selectionShow.value = false)
    selectedData.selectedTdList.forEach(tdData => {
        tdData.selected = false
    })
    selectedData.selectedTdList.length = 0
}
function handleSelectionArea() {
    resetSelection()
    selectedData.selectedTdList.length = 0
    const { selectedKeys, rowspan, colspan, startKey, endKey } = getSelectedDataBySelectionRect()
    console.log('selectedKeys, rowspan, colspan, startKey, endKey: ', selectedKeys, rowspan, colspan, startKey, endKey);
    if (selectedKeys.length < 1) {
        return
    }
    // 获取第一个单元格数据
    let firstTdData = getTdDataByKey(startKey)
    let mergedFirstData = firstTdData
    if (!mergedFirstData._show) {
        mergedFirstData = getTdDataByKey(firstTdData._mergedKey)
    }
    if (mergedFirstData.colspan >= colspan && mergedFirstData.rowspan >= rowspan) {
        return
    }
    // 获取最后一个单元格数据
    let endTdData = getTdDataByKey(endKey)
    if (!endTdData._show) {
        endTdData = getTdDataByKey(endTdData._mergedKey)
    }
    if (endTdData.colspan > 1 || endTdData.rowspan > 1) {
        endTdData = getEndTdDataByTd(endTdData)
    }
    console.log('endTdData: ', endTdData);
    // let lastTdData = getTdDataByKey(selectedKeys[selectedKeys.length - 1])
    // if (!lastTdData._show) {
    //     lastTdData = getTdDataByKey(lastTdData._mergedKey)
    // }
    // let colspanTotal = 0
    // let rowspanTotal = 0
    selectedKeys.forEach(key => {
        const tdData = getTdDataByKey(key)
        if (!tdData._show && tdData._mergedKey) {
            const mergedTdData = getTdDataByKey(tdData._mergedKey)
            restoreTdSpanData(mergedTdData)
        }
        tdData.selected = true
        selectedData.selectedTdList.push(tdData)
    })
    if (rowspan < firstTdData.rowspan && colspan < firstTdData.colspan) {
        return 
    } else {
        restoreTdSpanData(firstTdData)
    }
    spanDataHandler(rowspan, firstTdData, 'row')
    spanDataHandler(colspan, firstTdData, 'col')
}
function getItemSize () {
    const wrapperRect = layoutWrapperRef.value.getBoundingClientRect()
    return {
        itemWidth: wrapperRect.width / colNumInner.value,
        itemHeight: wrapperRect.height / rowNumInner.value
    }
}

// 根据选中的大致区域获取真实（已经有单元格合并情况下）应该选中的单元格区域
function getRealSelectedDataBySelectionRect () {
    const { selectedKeys, rowspan, colspan, startKey, endKey } = getSelectedDataBySelectionRect()
    // 获取第一个单元格数据
    let firstTdData = getTdDataByKey(startKey)
    let mergedFirstData = firstTdData
    if (!mergedFirstData._show) {
        mergedFirstData = getTdDataByKey(firstTdData._mergedKey)
    }
    if (mergedFirstData.colspan >= colspan && mergedFirstData.rowspan >= rowspan) {
        return
    }
    // 获取最后一个单元格数据
    let endTdData = getTdDataByKey(endKey)
    if (!endTdData._show) {
        endTdData = getTdDataByKey(endTdData._mergedKey)
    }
    if (endTdData.colspan > 1 || endTdData.rowspan > 1) {
        endTdData = getEndTdDataByTd(endTdData)
    }
    console.log('endTdData: ', endTdData);
    return {
        startKey: ``,
        endKey: ``,
    }
}

// 根据选中区域获取选择的单元格key
function getSelectedDataBySelectionRect () {
    const { x , y, width, height } = selectionRect
    const { itemWidth, itemHeight } = getItemSize()
    const startColIndex = Math.floor((x + props.interval + props.selectionError) / itemWidth)
    const startRowIndex = Math.floor((y + props.interval + props.selectionError)  / itemHeight)
    const endColIndex = Math.floor((x + width - props.interval - props.selectionError) / itemWidth)
    const endRowIndex = Math.floor((y + height - props.interval - props.selectionError) / itemHeight)
    const keyArr = []
    for (let i = startRowIndex; i <= endRowIndex; i++) {
        for (let j = startColIndex; j <= endColIndex; j++) {
            keyArr.push(`${i}::${j}`)
        }
    }
    return {
        selectedKeys: keyArr,
        startKey: `${startRowIndex}::${startColIndex}`,
        endKey: `${endRowIndex}::${endColIndex}`,
        rowspan: endRowIndex - startRowIndex + 1,
        colspan: endColIndex - startColIndex + 1
    }
}
function getEndTdDataByTd (td) {
    const [row, col] = td._key.split('::') 
    const endTdKey = `${parseInt(row) + td.rowspan - 1}::${parseInt(col) + td.colspan - 1}`
    return getTdDataByKey(endTdKey)
}
function getEndKeyByTd (td) {
    const [row, col] = td._key.split('::') 
    const endTdKey = `${parseInt(row) + td.rowspan - 1}::${parseInt(col) + td.colspan - 1}`
    return getTdDataByKey(endTdKey)
}
// 根据key获取选择的单元格数据
function getTdDataByKey (key) {
    const [row, col] = key.split('::')
    return tableRenderData[row][col]
}
// 根据行数和列数初始化生成table渲染数据
function generateTableData (rowNum, colNum) {
    rowNum = rowNum || rowNumInner.value
    colNum = colNum || colNumInner.value
    // 清空表格数据
    tableRenderData.length = 0
    // 遍历行
    for (const row of createArrayWithNum(rowNum)) {
        const rowData = reactive([])
        // 遍历列
        for (const col of createArrayWithNum(colNum)) {
            rowData.push(reactive({
                _rowIndex: row,
                _colIndex: col,
                _rowspanMax: rowNum - row, // 行最大允许合并数
                _colspanMax: colNum - col, // 列最大允许合并数
                _key: `${row}::${col}`,
                _show: true,
                _mergedKey: '',
                rowspan: 1,
                oldRowspan: 1,
                colspan: 1,
                oldColspan: 1,
                selected: false,
                // components: reactive([]), // 单元格内部放置的组件，多个，可调整层级（可编辑），可控制是否撑满展示
            }))
        }
        tableRenderData.push(rowData)
    }
}
function reset () {
    generateTableData()
}
// 合并行数据改变
function rowspanChange (val, col) {
    spanDataHandler(val, col, 'row')
}
// 合并列数据改变
function colspanChange (val, col) {
    spanDataHandler(val, col, 'col')
}
/**
 * 合并数据处理
 * @param {*} val 合并的行数或者列数
 * @param {*} cell 当前合并数据改变的 单元格 的数据
 * @param {*} type  区分行改变还是列改变 行改变为 row，列改变为 col
 */
function spanDataHandler (val, cell, type) {
    if (val === '' || isNaN(parseInt(val))) {
        return
    }
    const maxSpanKey = type === 'row' ? '_rowspanMax' : '_colspanMax'
    const spanKey = type === 'row' ? 'rowspan' : 'colspan'
    const oldSpankey = type === 'row' ? 'oldRowspan' : 'oldColspan'
    // 如果大于当前位置可合并的最大值，则自动置为当前允许最大值
    val = parseInt(val) <= 1 ? 1 : val
    const newSpanVal = Math.min(cell[maxSpanKey], val)
    cell[spanKey] = newSpanVal
    // 如果合并数据没有变化，则不处理
    if (cell[spanKey] === cell[oldSpankey]) {
        return
    }
    
    // 差异数据处理
    const oldSpanVal = cell[oldSpankey] || 1
    const spanDiff = newSpanVal - oldSpanVal
    const spanAbsDiff = Math.abs(spanDiff)
    const flag = spanDiff < 0
    const effectRowIndexArr = type === 'row' ? createArrayWithNum(spanAbsDiff, 1) : createArrayWithNum(cell.rowspan) 
    const effectColIndexArr = type === 'row' ? createArrayWithNum(cell.colspan) : createArrayWithNum(spanAbsDiff, 1)
    effectRowIndexArr.forEach(index => {
        const rowNum = type === 'row' ? (cell._rowIndex + Math.min(newSpanVal, oldSpanVal) - 1 + index) : (cell._rowIndex + index)
        const trData = tableRenderData[rowNum]
        effectColIndexArr.forEach(index2 => {
            const colNum = type === 'row' ? (cell._colIndex + index2) : (cell._colIndex + Math.min(newSpanVal, oldSpanVal) - 1 + index2)
            const tdData = trData[colNum]
            if (tdData.colspan > 1 || tdData.rowspan > 1) {
                restoreTdSpanData(tdData)
            }
            tdData._show = flag
            if (flag) {
                tdData._mergedKey = ''
            } else {
                tdData._mergedKey = cell._key
            }
        })
    })
    // 记录上次行或者列合并的数据
    cell[oldSpankey] = cell[spanKey]
}

function handleWinMouseDown (e) {
    selectionShow.value && (selectionShow.value = false)
}
function restoreTdSpanData (td) {
    if (td.colspan > 1 ) {
        spanDataHandler(1, td, 'col')
    }
    if (td.rowspan > 1 ) {
        spanDataHandler(1, td, 'row')
    }
}
// 根据数字创建数组  入参 5 返回 [0,1,2,3,4]  startIndex 控制开始的下标，默认从0开始
function createArrayWithNum (n, startIndex = 0) {
    return Array.from({ length: n }, (_, index) => index + startIndex)
}
</script>
<style lang="scss" scoped>
// $theme-color: skyblue;
$theme-color: #5798ed;
$selection-color: skyblue;
$table-border-space: 10px;
$border-color: #CCCCCC;
.yk-free-layout-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    user-select: none;
    .yk-free-layout {
        border-collapse: collapse;
        table-layout: fixed;
        width: 100%;
        height: 100%;
        border: 1px dashed $border-color;
        .yk-free-layout-td {
            position: relative;
            overflow: hidden;
            border: 1px dashed transparent;
            color: $theme-color;
            .yk-free-layout-td-wrapper {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: 5px;
                border: 1px dashed $border-color;
                border-radius: 8px;
                overflow: hidden;
                &.yk-free-layout-td-wrapper-selected {
                    background-color: $selection-color;
                }
            }
            .yk-free-layout-td-toolbar {
                position: absolute;
                top: 0;
                z-index: 999;
                background-color: #FFF;
                width: 100%;
                transform: translateY(-100%);
                transition: transform .3s ease-in-out;
                .yk-free-layout-td-toolbar-content {
                    display: flex;
                    padding: 3px 12px;
                    align-items: center;
                    font-size: 12px;
                    line-height: 1.2;
                    .label {
                        display: inline-block;
                        padding: 0 3px;
                        font-size: 12px;
                    }
                    .control {
                        display: flex;
                        align-items: center;
                        .input {
                            width: auto;
                            outline: none;
                            padding: 3px 6px;
                            border: 1px solid #E6E6E6;
                            border-radius: 999px;
                            
                        }
                    }
                }
                .yk-free-layout-td-toolbar-icon {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    transform: translate(10%, 100%);
                    width: 0;
                    height: 0;
                    border-left: 10px solid transparent;
                    border-right: 10px solid transparent;
                    border-top: 10px solid $theme-color;
                    cursor: pointer;
                    margin: 0 auto;
                }
                &:hover {
                    transform: translateY(0);
                    box-shadow: 0 2px 1px 0px #f6f6f6;
                }
            }
            .yk-free-layout-td-content {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                overflow: auto;
            }
            &.is-editing:hover {
                .yk-free-layout-td-toolbar {
                    transform: translateY(0);
                    box-shadow: 0 2px 1px 0px #f6f6f6;
                }
            }
        }
        .yk-free-layout-td-hidden {
            width: 0;
            border: none;
            padding: 0;
            margin: 0;
        }
    }
    .yk-free-layout-mask-selection {
        position: absolute;
        background: rgba(0, 0, 0, 0.08);
    }
}
</style>