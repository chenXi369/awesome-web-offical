import * as echarts from 'echarts'
import Vue from 'vue'

let HANDLER = "_vue_echarts_resize_handler"

function bind(el) {
    unbind(el)
    el[HANDLER] = function() {
        let chart = echarts.getInstanceByDom(el)
        if(!chart) {
            return ;
        }
        chart.resize()
    }
    window.addEventListener("resize", el[HANDLER])
}

function unbind(el) {
    window.removeEventListener("resize", el[HANDLER])
    delete el[HANDLER]
}

var directive = {
    bind: bind,
    unbind: unbind
}

const onEchartResize = Vue.directive("onEchartResize", directive)
export {onEchartResize}