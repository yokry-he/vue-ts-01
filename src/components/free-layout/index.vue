<template>
    <table class="yk-free-layout" :style="{ borderSpacing: borderSpacing }">
        <tr class="yk-free-layout-tr" v-for="row in tableRenderData" :key="row._key">
            <td class="yk-free-layout-td" v-for="col in row.cols.filter(item => item._show)" :key="col._key" :rowspan="col.rowspan" :colspan="col.colspan">
                <div class="yk-free-layout-td-wrapper">
                    <div class="yk-free-layout-td-toolbar">
                        <div class="label">行：</div>
                        <div class="input">
                            <input type="number" min="1" :max="col._rowspanMax" v-model="col.rowspan" @input="rowspanChange($event.target.value, col)">
                        </div>
                        <div class="label">列：</div>
                        <div class="input">
                            <input type="number" min="1" :max="col._colspanMax" v-model="col.colspan" @input="colspanChange($event.target.value, col)">
                        </div>
                    </div>
                    <span>
                        {{ col._key }}
                    </span>
                </div>
            </td>
        </tr>
    </table>
</template>

<script setup>
import { watch, reactive } from 'vue'
const props = defineProps({
    // 列数
    colNum: {
        type: Number,
        default: 6,
        validator (val) {
            return val > 1
        }
    },
    // 行数
    rowNum: {
        type: Number,
        default: 6,
        validator (val) {
            return val > 1
        }
    },
    borderSpacing: {
        type: String,
        default: '10px 10px'
    }
})
const tableRenderData = reactive([])
// 监听行和列改变，重新渲染表格数据
watch(props.colNum, (newVal, oldVal) => {
    generateTableData()
}, { immediate: true })
watch(props.rowNum, (newVal, oldVal) => {
    generateTableData()
}, { immediate: true })
// 根据行数和列数初始化生成table渲染数据
function generateTableData () {
    tableRenderData.length = 0
    for (const row of createArrayWithNum(props.rowNum)) {
        const rowData = reactive({
            _rowIndex: row - 1,
            _key: row - 1,
            cols: reactive([])
        })
        for (const col of createArrayWithNum(props.colNum)) {
            rowData.cols.push(reactive({
                _rowIndex: row - 1,
                _colIndex: col - 1,
                _rowspanMax: props.rowNum - (row - 1), // 行最大允许合并数
                _colspanMax: props.colNum - (col - 1), // 列最大允许合并数
                _key: `${row - 1}::${col - 1}`,
                _show: true,
                rowspan: 1,
                colspan: 1,
                component: {},
            }))
        }
        tableRenderData.push(rowData)
    }
}
// 合并行数据改变
function rowspanChange (val, col) {
    spanDataHandler(val, col, 'row')
}
// 合并列数据改变
function colspanChange (val, col) {
    spanDataHandler(val, col, 'col')
}
// 合并数据处理
function spanDataHandler (val, col, type) {
    if (val === '' || isNaN(parseInt(val))) {
        return
    }
    const maxSpanKey = type === 'row' ? '_rowspanMax' : '_colspanMax'
    const spanKey = type === 'row' ? 'rowspan' : 'colspan'
    // 如果大于当前位置可合并的最大值，则自动置为当前允许最大值
    val = parseInt(val) <= 1 ? 1 : val
    const oldSpanVal = col[spankey]
    const newSpanVal = Math.min(col[maxSpanKey], val)
    col[spanKey] = newSpanVal
    const cValArr = createArrayWithNum(newSpanVal - oldSpanVal)
    
}
// 根据数字创建数组  入参 5 返回 [1,2,3,4,5]
function createArrayWithNum (n) {
    return Array.from({length: n}, (_, index) => index + 1)
}


</script>

<style lang="scss" scoped>
$border-color: #CCCCCC;
.yk-free-layout {
    width: 100%;
    height: 100%;
    border-collapse: separate;
    border-collapse: separate; /* 设置td之间间隔 必须设置为 separate */
    border-spacing: 10px 5px; /* 水平间距10px，垂直间距5px */
    border: 1px dashed $border-color;
    .yk-free-layout-td {
        position: relative;
        border: 1px dashed $border-color;
        border-radius: 8px;
        color: red;
        text-align: center;
    }
}
</style>