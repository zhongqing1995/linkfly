// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

//加入插件
import 'normalize.css'
import iview from 'iview'
import 'iview/dist/styles/iview.css'
import store from './store/store'
import PublicData from './assets/publicData'
import bus from './utils/wg_utils/Bus'
import {
  post,
  fetch,
  fromdata,
  fromdata2
} from './utils/http'
import 'swiper/dist/css/swiper.min.css'

import zxh_commonFun from './utils/zxh_commonFun'
Vue.prototype.$zxh_fun = zxh_commonFun;

//加载全局样式文件
import './assets/commonCss.less'

//引入图片查看器
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

import global_ from './utils/global'//引用文件
Vue.prototype.global_ = global_;//挂载到vue实例上面

Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
})

//定义全局变量
Vue.prototype.$post = post;
Vue.prototype.$get = fetch;
Vue.prototype.$fromdata = fromdata;
Vue.prototype.$fromdata2 = fromdata2;
Vue.prototype.$publicdata = PublicData
Vue.prototype.$_bus = new Vue(); //引入一个新的vue实例
Vue.use(iview)
Vue.use(bus)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: {
    App
  },
  template: '<App/>'
})
