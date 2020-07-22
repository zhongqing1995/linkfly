import CryptoJS from 'crypto-js'
var commonFun = {
  draw(type,mouseTool) {
    switch (type) {
      case '距离测量': {
        mouseTool.rule({
          startMarkerOptions: { //可缺省
            icon: new AMap.Icon({
              size: new AMap.Size(19, 31), //图标大小
              imageSize: new AMap.Size(19, 31),
              image: "https://webapi.amap.com/theme/v1.3/markers/b/start.png"
            })
          },
          endMarkerOptions: { //可缺省
            icon: new AMap.Icon({
              size: new AMap.Size(19, 31), //图标大小
              imageSize: new AMap.Size(19, 31),
              image: "https://webapi.amap.com/theme/v1.3/markers/b/end.png"
            }),
            offset: new AMap.Pixel(-9, -31)
          },
          midMarkerOptions: { //可缺省
            icon: new AMap.Icon({
              size: new AMap.Size(19, 31), //图标大小
              imageSize: new AMap.Size(19, 31),
              image: "https://webapi.amap.com/theme/v1.3/markers/b/mid.png"
            }),
            offset: new AMap.Pixel(-9, -31)
          },
          lineOptions: { //可缺省
            strokeStyle: "solid",
            strokeColor: "#FF33FF",
            strokeOpacity: 1,
            strokeWeight: 2
          }
        });
        break;
      }
      case '面积测量': {
        mouseTool.measureArea({
          strokeColor: '#80d8ff',
          fillColor: '#80d8ff',
          fillOpacity: 0.3
        });
        break;
      }
      case '关闭测量': {
        mouseTool.close(true)//关闭，并清除覆盖物
        type="";
        break;
      }
    }
  },
  //区域
  region_change(region) {
    let res = "";
    switch (region.length) {
      case 2:
        res = [region.substring(0, 2)];
        break;
      case 4:
        res = [region.substring(0, 2), region.substring(0, 4)];
        break;
      case 6:
        res = [region.substring(0, 2), region.substring(0, 4), region.substring(0, 6)];
        break;
      case 9:
        res = [region.substring(0, 2), region.substring(0, 4), region.substring(0, 6), region.substring(0, 9)];
        break;
      case 12:
        res = [region.substring(0, 2), region.substring(0, 4), region.substring(0, 6), region.substring(0, 9), region.substring(0)];
        break;
    }
    return res;
  },
  encrypt(str) {
    let key = CryptoJS.enc.Utf8.parse('pxbWLL1GGfAwsMuB');
    let iv = CryptoJS.enc.Utf8.parse('');
    const encryptedStr = CryptoJS.AES.encrypt(str, key, {
      iv: iv,
      mode: CryptoJS.mode.CFB,
      padding: CryptoJS.pad.NoPadding
    });
    var result = encryptedStr.toString();
    return result;
  },
  projectTypeLists: [{
      value: "0",
      label: "文明施工类"
    },
    {
      value: "1",
      label: "工程实体类",
    },
    {
      value: "2",
      label: "安全生产类",
    },
    {
      value: "3",
      label: "其他",
    }
  ],
  getToday(val) {
    if (val) {
      var date = new Date(val);
    } else {
      var date = new Date();
    }
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
  // 一周前
  getWeek() {
    var date = new Date();
    var seperator1 = "-";
    var targetday_milliseconds = date.getTime() - 1000 * 60 * 60 * 24 * 7;
    date.setTime(targetday_milliseconds); //注意，这行是关键代码
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
  //当前月的第一天
  getMonth() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = 1;
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
  //当前年的第一天
  getYear() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = 1;
    var strDate = 1;
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
  //验证图片
  truePic(val, _that) {
    let fileSuffix = val.split('/')[1];
    const isJPG =
      fileSuffix === "png" ||
      fileSuffix === "jpg" ||
      fileSuffix === "jpeg" ||
      fileSuffix === "gif"
    if (!isJPG) {
      _that.$Message.warning("请上传png,jpg,jpeg,gif格式的图片！");
      return true;
    } else {
      return false;
    }
  }
}
export default commonFun;
