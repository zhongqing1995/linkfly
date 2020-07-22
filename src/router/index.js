import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: '登录',
      component: resolve => require(['../page/login.vue'], resolve)
    },
    {
      path: '/index',
      name: '主页',
      component: resolve => require(['../page/index.vue'], resolve),
      redirect: 'index/allManagement',
      children: [{
          path: 'allManagement',
          name: '全局管理',
          component: resolve => require(['../components/allManagement/index.vue'], resolve),
          redirect: "allManagement/allManagement",
          children: [{
              path: 'allManagement',
              name: '全局管理',
              component: resolve => require(['../components/allManagement/allManagement.vue'], resolve)
            },
            {
              path: 'uavHistory',
              name: '飞行记录',
              component: resolve => require(['../components/allManagement/uavHistory.vue'], resolve)
            },
            {
              path: 'videoLive',
              name: '实时直播',
              component: resolve => require(['../components/allManagement/videoLive.vue'], resolve)
            },
            {
              path:'showPhoto',
              name:'全景图',
              component:resolve => require(['../components/allManagement/showphoto.vue'],resolve)
            }
          ],
        }, {
          path: 'engineerManagement',
          name: '工程管理',
          component: resolve => require(['../components/engineerManagement/engineer.vue'], resolve),
        }, {
          path: 'secondEngineerManagement',
          name: '超管二级工程管理',
          component: resolve => require(['../components/engineerManagement/secondEnineer.vue'], resolve),
        },
        {
          path: 'thirdEngineerManagement',
          name: '三级工程管理',
          component: resolve => require(['../components/engineerManagement/thirdEngineer.vue'], resolve),
        },
        {
          path: 'gcEngineerManagement',
          name: '工程管理员的二级工程管理',
          component: resolve => require(['../components/engineerManagement/gcSecondEngineer.vue'], resolve),
        },
        {
          path: 'TaskManagement',
          name: '任务管理',
          component: resolve => require(['../components/TaskManagement/index.vue'], resolve),
        },
        {
          path: 'Flight',
          name: '飞行作业',
          component: resolve => require(['../components/Flight/index.vue'], resolve),
        },
        {
          path: 'UAVmanagement',
          name: '无人机管理',
          component: resolve => require(['../components/UAVmanagement/index.vue'], resolve),
          redirect: "UAVmanagement/loanReturn",
          children: [
            {
              path: 'loanReturn',
              name: '借出归还管理',
              component: resolve => require(['../components/UAVmanagement/loanReturn.vue'], resolve)
            },
            {
              path: 'uavRegister',
              name: '无人机设备登记',
              component: resolve => require(['../components/UAVmanagement/uavRegister.vue'], resolve)
            },
            {
              path: 'uavType',
              name: '无人机型号管理',
              component: resolve => require(['../components/UAVmanagement/uavType.vue'], resolve)
            },
          ],
        },
        {
          path: 'UsermanagementEngineer',
          name: '用户管理-工程管理员列表',
          component: resolve => require(['../components/Usermanagement/engineer.vue'], resolve),
        },
        {
          path: 'Usermanagement',
          name: '用户管理',
          component: resolve => require(['../components/Usermanagement/index.vue'], resolve),
        },
        {
          path: 'UpdateManagement',
          name: '版本管理',
          component: resolve => require(['../components/updateManagement/index.vue'], resolve),
        },
        {
          path: 'EngineerCommon',
          name: '一级工程列表',
          component: resolve => require(['../components/TaskManagement/engineer.vue'], resolve),
        },
        {
          path: 'bigDataManagement',
          name: '大数据管理',
          component: resolve => require(['../components/bigDataManagement/index.vue'], resolve),
        },
        {
          path: 'GPSmanagement',
          name: 'GPS管理',
          component: resolve => require(['../components/GPSmanagement/index.vue'], resolve),
          redirect: "GPSmanagement/GPSlist",
          children: [
            {
              path: 'GPSlist',
              name: 'GPS列表',
              component: resolve => require(['../components/GPSmanagement/GPSlist.vue'], resolve)
            }
          ],
        },
        {
          path: 'CopterManagement',
          name: '直升机管理',
          component: resolve => require(['../components/copterManagement/index.vue'], resolve),
          redirect: "copterManagement/copterList",
          children: [
            {
              path: 'copterList',
              name: '直升机列表',
              component: resolve => require(['../components/copterManagement/copterList.vue'], resolve)
            }
          ],
        },
      ]
    }
  ]
})
