import axios from 'axios'
import {
  Notice
} from 'iview'
let Data = {
  oprtion_menu: [
    // 地图的操作图标
    {
      defult_index: 2,
      src: "../../../static/zxhImg/Standard chart.png",
      alt: "标准图",
      select: "../../../static/zxhImg/Standard chart1.png"
    },
    {
      defult_index: 1,
      src: "../../../static/zxhImg/Satellite imagery.png",
      alt: "卫星图",
      select: "../../../static/zxhImg/Satellite imagery1.png "
    },
    {
      defult_index: 1,
      src: "../../../static/zxhImg/Road map.png",
      select: "../../../static/zxhImg/Road map1.png",
      alt: "路况图"
    },
    {
      defult_index: 1,
      src: "../../../static/zxhImg/Road network diagram.png",
      select: "../../../static/zxhImg/Road network diagram1.png",
      alt: "路况图"
    },
    {
      defult_index: 1,
      src: "../../../static/zxhImg/Third party map.png",
      select: "../../../static/zxhImg/Third party map1.png",
      alt: "第三方地图"
    }
  ],
  getProjectData({
    page = 1,
    number = 10,
    dex = 0
  } = {}) {
    var urls = ['/admin/first_pm/pmListPage', '/admin/second_pm/secondPmListPage']
    return new Promise((resolve, reject) => {
      var token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';
      axios.post(urls[dex] + token, {
        client: 'web',
        page: page,
        limit: number
      }).then((res) => {
        if (res.data.code != 1) {
          return Notices(res.data.msg_customer)
        } else {
          resolve(res.data.data)
        }
      }).catch((err) => {
        reject(err)
      })
    })
  },
  getPmData(pm_id) {
    return new Promise((resolve, reject) => {
      var token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';
      axios.post('/admin/first_pm/firstPmDetail' + token, {
        pm_id: pm_id
      }).then((res) => {
        if (res.data.code != 1) {
          return Notices(res.data.msg_customer)
        } else {
          resolve(res.data.data)
        }
      }).catch((err) => {
        reject(err)
      })
    })

  },
  getAreaName(region) { // 获取区域信息
    return new Promise((resolve, reject) => {
      var token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';
      axios.post('/base/common/regionChoose' + token, {
        client: 'web',
        code: region
      }).then((res) => {
        if (res.data.code != 1) {
          return Notices(res.data.msg_customer)
        } else {
          resolve(res.data.data)
        }
      }).catch((err) => {
        reject(err)
      })
    })

  },

  getuserList() { // 获取用户列表 飞手和小程序
    return new Promise((resolve, reject) => {
      var token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';
      axios.post('base/common/userList' + token, {
        client: 'web'
      }).then((res) => {
        if (res.data.code != 1) {
          return Notices(res.data.msg_customer)
        } else {
          resolve(res.data.data)
        }
      }).catch((err) => {
        reject(err)
      })
    })
  },

  getDataList(url,parm={client:'web'}) { // 公共获取数据
    return new Promise((resolve, reject) => {
      var token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';
      axios.post(url + token,parm).then((res) => {
        if (res.data.code != 1) {
          return Notices(res.data.msg_customer)
        } else {
          resolve(res.data.data)
        }
      }).catch((err) => {
        reject(err)
      })
    })
  },
  CheckuserLogin() {
    var user_info = sessionStorage.getItem('user_info') ? sessionStorage.getItem('user_info') : '';
    if (user_info) {
      return JSON.parse(user_info)
    } else {
      Notices('用户尚未登录')
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    }

  }
}

function Notices(text) {
  Notice.warning({
    title: '系统提醒',
    desc: text
  });
  if (text.includes('用户尚未登录')) {
    window.location.href = '/'
  }

}
export default Data
