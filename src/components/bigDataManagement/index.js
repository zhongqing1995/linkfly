const echarts = require("echarts");
import MapComponent from "../allManagement/allManagement.vue";
export default {
  data() {
    return {
      isBigData: true,
      socket: null,
      isbind: false,
      websockid: 0,
      userInfo: {},
      onlineLists: [], //在线的人
      userLiveLists: [], //在直播的人
      optionNumber: {
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "6%",
          right: "4%",
          bottom: "1%",
          containLabel: true
        },
        legend: {
          data: ["飞行总次数"],
          right: "1%",
          textStyle: {
            color: "#fff"
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [],
          axisLabel: {
            color: "#fff",
            interval: 0,
            formatter: function(value) {
              var ret = ""; //拼接加\n返回的类目项
              var maxLength = 5; //每项显示文字个数
              var valLength = value.length; //X轴类目项的文字个数
              var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
              if (rowN > 1) {
                //如果类目项的文字大于3,
                for (var i = 0; i < rowN; i++) {
                  var temp = ""; //每次截取的字符串
                  var start = i * maxLength; //开始截取的位置
                  var end = start + maxLength; //结束截取的位置 //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                  temp = value.substring(start, end) + "\n";
                  ret += temp; //凭借最终的字符串
                }
                return ret;
              } else {
                return value;
              }
            }
          },
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        yAxis: {
          name: "时间（count/s）",
          type: "value",
          axisLabel: {
            color: "#fff"
          },
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        series: [
          {
            name: "飞行总次数",
            type: "line",
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#F36501"
                  },
                  {
                    offset: 0.5,
                    color: "#f36501ff"
                  },
                  {
                    offset: 1,
                    color: "#191919"
                  }
                ])
              }
            },
            data: []
          }
        ]
      }, //飞行总次数
      mychartNumber: {}, //飞行总次数
      optionTime: {
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "1%",
          right: "4%",
          bottom: "1%",
          containLabel: true
        },
        legend: {
          data: ["飞行总时间"],
          right: "1%",
          textStyle: {
            color: "#fff"
          }
        },
        xAxis: {
          type: "category",
          data: [],
          axisLabel: {
            color: "#fff",
            interval: 0,
            formatter: function(value) {
              var ret = ""; //拼接加\n返回的类目项
              var maxLength = 5; //每项显示文字个数
              var valLength = value.length; //X轴类目项的文字个数
              var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
              if (rowN > 1) {
                //如果类目项的文字大于3,
                for (var i = 0; i < rowN; i++) {
                  var temp = ""; //每次截取的字符串
                  var start = i * maxLength; //开始截取的位置
                  var end = start + maxLength; //结束截取的位置 //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                  temp = value.substring(start, end) + "\n";
                  ret += temp; //凭借最终的字符串
                }
                return ret;
              } else {
                return value;
              }
            }
          },
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        yAxis: {
          name: "时间（min/s）",
          type: "value",
          axisLabel: {
            color: "#fff"
          },
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        series: [
          {
            name: "飞行总时间",
            data: [],
            type: "bar",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#44a61e"
                  },
                  {
                    offset: 1,
                    color: "#191919"
                  }
                ])
              }
            }
          }
        ]
      },
      mychartTime: {}, //飞行总时间
      optionCount: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        // legend: {
        //   orient: 'horizontal',
        //   left: 'left',
        //   data: [
        //     "0-5min/s",
        //     "5-10min/s",
        //     "10-15min/s",
        //     "15-20min/s",
        //     "20+min/s"
        //   ],
        //   textStyle: {
        //     color: '#fff'
        //   }
        // },
        series: [
          {
            name: "历史飞行时长",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              {
                value: 335,
                name: "0-5min/s"
              },
              {
                value: 310,
                name: "5-10min/s"
              },
              {
                value: 234,
                name: "10-15min/s"
              },
              {
                value: 135,
                name: "15-20min/s"
              },
              {
                value: 1548,
                name: "20+min/s"
              }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      }, //飞行统计时长
      mychartCount: {}, //飞行统计时长
      timer: null,
      liHeight: 0,
      taskData: [], //实时任务
      release: 0, //任务发布中
      execution: 0, //任务执行中
      to_be_released: 0, //任务待审核
      completed: 0, //任务已完成
      expired: 0, //任务已过期
      rejected: 0, //任务已拒绝
      zsjMsg: {}, //直升机图表信息
      zsjMsg1: {}, //直升机图表信息
      zsjMsg2: {}, //直升机图表信息
      zsjMsg3: {}, //直升机图表信息
      zsjMsg4: {} //直升机图表信息
    };
  },
  components: {
    MapComponent: MapComponent
  },
  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem("user_info"));
    this.initMethods();
  },
  methods: {
    // 跳转到主界面
    toMain() {
      const { href } = this.$router.resolve({
        name: "全局管理",
        query: {},
        params: {}
      });
      window.open(href, "_blank");
    },
    initMethods() {
      this.InitWebsocket();
      this.newTimeTask();
      this.getTrackAllNumberData();
      this.getTrackAllTimeData();
      this.getTrackData();
      this.taskLoadInfo();
      // this.zsjInfo();
      this.zsjData(); //直升机数据
    },
    zsjData() {
      let option1 = {
        title: {
          text: "机型K-32 机号7811",
          textStyle: {
            color: "#fff",
            fontSize: "14px"
          }
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "1%",
          right: "4%",
          bottom: "1%",
          containLabel: true
        },
        legend: {
          data: ["飞行时长"],
          right: "1%",
          textStyle: {
            color: "#fff"
          }
        },
        xAxis: {
          type: "category",
          data: [],
          axisLabel: {
            color: "#fff",
            interval: 0,
            formatter: function(value) {
              var ret = ""; //拼接加\n返回的类目项
              var maxLength = 5; //每项显示文字个数
              var valLength = value.length; //X轴类目项的文字个数
              var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
              if (rowN > 1) {
                //如果类目项的文字大于3,
                for (var i = 0; i < rowN; i++) {
                  var temp = ""; //每次截取的字符串
                  var start = i * maxLength; //开始截取的位置
                  var end = start + maxLength; //结束截取的位置 //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                  temp = value.substring(start, end) + "\n";
                  ret += temp; //凭借最终的字符串
                }
                return ret;
              } else {
                return value;
              }
            }
          },
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        yAxis: {
          name: "时间（min/s）",
          type: "value",
          axisLabel: {
            color: "#fff"
          },
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        series: [
          {
            name: "飞行时长",
            data: [],
            type: "line"
            // itemStyle: {
            //   normal: {
            //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            //         offset: 0,
            //         color: "#F36501"
            //       },
            //       {
            //         offset: 0.5,
            //         color: "#f36501ff"
            //       },
            //       {
            //         offset: 1,
            //         color: "#191919"
            //       }
            //     ])
            //   }
            // },
          }
        ]
      };
      let option2 = {
        title: {
          text: "机型H-125 机号70RH",
          textStyle: {
            color: "#fff",
            align: "center",
            fontSize: "14px"
          }
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "1%",
          right: "4%",
          bottom: "1%",
          containLabel: true
        },
        legend: {
          data: ["飞行时长"],
          right: "1%",
          textStyle: {
            color: "#fff"
          }
        },
        xAxis: {
          type: "category",
          data: [],
          axisLabel: {
            color: "#fff",
            interval: 0,
            formatter: function(value) {
              var ret = ""; //拼接加\n返回的类目项
              var maxLength = 5; //每项显示文字个数
              var valLength = value.length; //X轴类目项的文字个数
              var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
              if (rowN > 1) {
                //如果类目项的文字大于3,
                for (var i = 0; i < rowN; i++) {
                  var temp = ""; //每次截取的字符串
                  var start = i * maxLength; //开始截取的位置
                  var end = start + maxLength; //结束截取的位置 //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                  temp = value.substring(start, end) + "\n";
                  ret += temp; //凭借最终的字符串
                }
                return ret;
              } else {
                return value;
              }
            }
          },
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        yAxis: {
          name: "时间（min/s）",
          type: "value",
          axisLabel: {
            color: "#fff"
          },
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        series: [
          {
            name: "飞行时长",
            data: [],
            type: "line"
          }
        ]
      };
      let option3 = {
        title: {
          text: "机型K-32 机号7811历史飞行总时长",
          textStyle: {
            color: "#fff",
            fontSize: "14px"
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            name: "历史飞行时长",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              {
                value: 335,
                name: "0-5min/s"
              },
              {
                value: 310,
                name: "5-10min/s"
              },
              {
                value: 234,
                name: "10-15min/s"
              },
              {
                value: 135,
                name: "15-20min/s"
              },
              {
                value: 1548,
                name: "20+min/s"
              }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      }; //飞行统计时长

      let option4 = {
        title: {
          text: "机型H-125 机号70RH历史飞行总时长",
          textStyle: {
            color: "#fff",
            fontSize: "14px"
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            name: "历史飞行时长",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              {
                value: 258,
                name: "0-5min/s"
              },
              {
                value: 156,
                name: "5-10min/s"
              },
              {
                value: 304,
                name: "10-15min/s"
              },
              {
                value: 67,
                name: "15-20min/s"
              },
              {
                value: 620,
                name: "20+min/s"
              }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      }; //飞行统计时长

      this.$post("/admin/helicopter_data/helicopterDataCount", {
        limit: 1000
      }).then(response => {
        if (response.code == 1) {
          //机型H-125 机号70RH
          let data = response.data["70RH"].fly_time_of_five;
          console.log("接口數據", response.data);
          let report_date2 = [];
          let fly_time2 = [];
          data.forEach((ele, index) => {
            report_date2.push(ele.report_date);
            fly_time2.push(ele.fly_time_count);
          });
          option2.xAxis.data = report_date2;
          option2.series[0].data = fly_time2;

          //机型K-32 机号7811
          let option1_data = response.data["7811"].fly_time_of_five;
          option1.series[0].data = response.data["7811"].time_stage_fly_time;
          let report_date1 = [];
          let fly_time1 = [];
          option1_data.forEach((ele, index) => {
            report_date1.push(ele.report_date);
            fly_time1.push(ele.fly_time_count);
          });
          option1.xAxis.data = report_date1;
          option1.series[0].data = fly_time1;

          // 餅圖
          let bingtu70RH = response.data["70RH"].time_stage_fly_time;
          option3.series[0].data.forEach((ele, index) => {
            option3.series[0].data[index].value = bingtu70RH[index];
          });
          let bingtu7811 = response.data["7811"].time_stage_fly_time;
          option4.series[0].data.forEach((ele, index) => {
            option4.series[0].data[index].value = bingtu7811[index];
          });

          //挂载
          this.zsjMsg1 = echarts.init(document.getElementById("zsjAllNumber"));
          this.zsjMsg1.setOption(option1);

          this.zsjMsg2 = echarts.init(document.getElementById("zsjAllTime"));
          this.zsjMsg2.setOption(option2);

          this.zsjMsg3 = echarts.init(document.getElementById("zsjAllCount1"));
          this.zsjMsg3.setOption(option3);

          this.zsjMsg4 = echarts.init(document.getElementById("zsjAllCount2"));
          this.zsjMsg4.setOption(option4);
        } else {
          this.$Message.error(response.msg_customer);
        }
      });
    },
    // 直升机数据信息
    zsjInfo() {
      let data = {
        code: 1,
        msg_customer: "直升机数据统计",
        msg_programmer: "直升机数据统计",
        data: {
          "7811": {
            guaranteed_hours: 110,
            fly_time_count: 1137
          },
          "70RH": {
            guaranteed_hours: 76,
            fly_time_count: 345
          }
        }
      };
      let jsonData = data.data;
      var type = [];
      var guaranteed_hours = [];
      var fly_time_count = [];
      for (var item in jsonData) {
        type.push(item);
        guaranteed_hours.push(jsonData[item].guaranteed_hours);
        fly_time_count.push(jsonData[item].fly_time_count);
      }
      var option = {
        title: {
          text: "直升机数据统计",
          textStyle: {
            color: "#fff"
          }
        },
        grid: {
          left: "4%",
          right: "4%",
          bottom: "1%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: type
        },
        toolbox: {
          show: true,
          feature: {
            dataView: {
              show: true,
              readOnly: false
            },
            magicType: {
              show: true,
              type: ["line", "bar"]
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true
            }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            data: type,
            axisLabel: {
              color: "#fff"
            },
            axisLine: {
              lineStyle: {
                color: "#fff"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              color: "#fff"
            },
            axisLine: {
              lineStyle: {
                color: "#fff"
              }
            }
          }
        ],
        series: [
          {
            name: "对应机型的保底小时数",
            type: "bar",
            data: guaranteed_hours,
            color: "#CC0066"
          },
          {
            name: "飞行时长（分钟）",
            type: "bar",
            data: fly_time_count,
            color: "#009999"
          }
        ]
      };
      this.zsjMsg = echarts.init(document.getElementById("zsj"));
      this.zsjMsg.setOption(option);
    },
    // 获取任务进度信息
    taskLoadInfo() {
      this.$post("/admin/the_all_data/taskLoadInfo", {
        client: "web"
      }).then(response => {
        if (response.code == 1) {
          let data = response.data;
          if (data.all > 0) {
            this.release = Math.round((data.release / data.all) * 100);
            this.execution = Math.round((data.execution / data.all) * 100);
            this.to_be_released = Math.round(
              (data.to_be_released / data.all) * 100
            );
            this.completed = Math.round((data.completed / data.all) * 100);
            this.expired = Math.round((data.expired / data.all) * 100);
            this.rejected = Math.round((data.rejected / data.all) * 100);
          }
        } else {
          this.$Message.error(response.msg_customer);
        }
      });
    },
    // 获取任务实时动态信息
    newTimeTask() {
      this.$post("/admin/the_all_data/newTimeTask", {
        client: "web"
      }).then(response => {
        if (response.code == 1) {
          this.taskData = response.data;
          if (this.taskData && this.taskData.length > 0) {
            this.taskData = this.taskData.map((ele, index) => {
              let taskState = "";
              switch (ele.state) {
                case 0:
                  taskState = "发布中";
                  break;
                case 1:
                  taskState = "执行中";
                  break;
                case 2:
                  taskState = "待审核";
                  break;
                case 3:
                  taskState = "已完成";
                  break;
                case 4:
                  taskState = "已过期";
                  break;
                case 5:
                  taskState = "已拒绝";
                  break;
                default:
                  break;
              }
              return {
                ...ele,
                taskState: taskState
              };
            });
            this.init();
          }
        } else {
          this.$Message.error(response.msg_customer);
        }
      });
    },
    // 设置表格滚动
    init() {
      if (this.taskData.length > 5) {
        //大于7滚动
        clearInterval(this.timer);
        this.$nextTick(() => {
          this.liHeight = this.$refs.li.offsetHeight;
          this.timer = setInterval(this.scroll, 50);
        });
      }
    },
    scroll() {
      //滚动
      var scrollTop = this.$refs.tbody.scrollTop;
      scrollTop += 1;
      this.$refs.tbody.scrollTop = scrollTop;
      if (scrollTop === (this.taskData.length - 5) * this.liHeight) {
        this.$refs.tbody.scrollTop = 0;
      }
    },
    // 初始化socket
    InitWebsocket() {
      const wsuri = "wss://www.linkeda.net:11086";
      // const wsuri = "wss://bigdog.redovation.com:11086";
      // const wsuri = "ws://134.175.32.185:11086";
      // const wsuri = "ws://192.168.8.9:11086";
      this.socket = new WebSocket(wsuri);
      this.socket.onmessage = this.websocketonmessage;
      this.socket.onopen = this.websocketonopen;
      this.socket.onerror = this.websocketonerror;
      this.socket.onclose = this.websocketclose;
    },
    websocketonmessage(event) {
      let data = JSON.parse(event.data);
      console.log("websocket信息", data);
      this.websockid = data.client_id;
      if (this.websockid != undefined && !this.isbind) {
        this.getData();
      }
      if (data.type == "location") {
        let permissionLists = [];
        if (data.permission) {
          let permissionArr = data.permission.split(",");
          permissionArr.forEach(element => {
            if (element == 1) {
              permissionLists.push("直播");
            } else if (element == 2) {
              permissionLists.push("巡检");
            } else if (element == 3) {
              permissionLists.push("作业");
            }
          });
          data.permissionLists = permissionLists.toString();
        } else {
          data.permissionLists = "";
        }
        let type = "";
        if (data.user_type) {
          if (data.user_type == 1) {
            type = "工程管理员";
          } else if (data.user_type == 2) {
            type = "APP飞手";
          } else if (data.user_type == 3) {
            type = "小程序用户";
          } else if (data.user_type == 0) {
            type = "超级管理员";
          }
        }
        data.userType = type;
        // 如果返回的有数据就加入到数组里
        if (this.onlineLists.length == 0) {
          // 保证数组长度不从0开始比较
          this.onlineLists.push(data);
          if (data.IsPublish == 1) {
            this.userLiveLists.push(data);
            this.getPlayUrl(data);
          }
        } else {
          let result = this.onlineLists.find((ele, index) => {
            // 数组不存在这个用户就添加进去
            if (ele.uid == data.uid) {
              if (ele.Client != data.Client) {
                this.onlineLists[index].Client = data.Client;
              }
              if (ele.IsPublish != data.IsPublish) {
                this.onlineLists[index].IsPublish = data.IsPublish;
              }
              if (ele.DroneAltitude != data.DroneAltitude) {
                this.onlineLists[index].DroneAltitude = data.DroneAltitude;
              }
              if (ele.DroneSpeed != data.DroneSpeed) {
                this.onlineLists[index].DroneSpeed = data.DroneSpeed;
              }
              if (ele.DroneSpeedH != data.DroneSpeedH) {
                this.onlineLists[index].DroneSpeedH = data.DroneSpeedH;
              }
              if (ele.DroneYaw != data.DroneYaw) {
                this.onlineLists[index].DroneYaw = data.DroneYaw;
              }
              if (ele.DroneLongitude != data.DroneLongitude) {
                this.onlineLists[index].DroneLongitude = data.DroneLongitude;
              }
              if (ele.DroneLatitude != data.DroneLatitude) {
                this.onlineLists[index].DroneLatitude = data.DroneLatitude;
              }
            }
            return ele.uid == data.uid;
          });
          if (!result) {
            this.onlineLists.push(data);
          }
          let isLive = this.userLiveLists.find((ele, index) => {
            return ele.uid == data.uid;
          });
          if (!isLive && data.IsPublish == 1) {
            this.userLiveLists.push(data);
            this.getPlayUrl(data);
          }
          if (isLive && data.IsPublish != 1) {
            this.userLiveLists.splice(data, 1);
          }
        }
      } else if (data.type == "location_logout") {
        if (data.account) {
          if (this.onlineLists.length > 0) {
            let result = this.onlineLists.filter(el => {
              return el.account == data.account;
            });
            this.onlineLists.splice(result, 1); // 用户下线 删除数组
            this.userLiveLists.splice(result, 1);
          }
        }
      }
    },
    websocketonopen() {
      // 建立连接
      console.log("开启websock成功");
    },
    websocketonerror() {
      console.log("websock 重连");
      this.InitWebsocket();
    },
    websocketclose() {
      console.log(" 关闭 websock");
    },
    getData() {
      this.$post("/base/common/bindClient", {
        client: "web",
        client_id: this.websockid,
        user_id: this.userInfo.user_id
      }).then(res => {
        if (res.code == 1) {
          this.isbind = true;
        } else {
          this.isbind = false;
        }
      });
    },
    // 统计-飞行总次数
    getTrackAllNumberData() {
      this.$post("/admin/the_all_data/flyCountOfWeek", {
        start_time: this.$zxh_fun.getWeek(),
        end_time: this.$zxh_fun.getToday()
      }).then(res => {
        if (res.code != 1) {
          return this.$Message.error(res.msg_customer);
        } else {
          let trackData = res.data;
          if (trackData) {
            this.optionNumber.series[0].data = [];
            this.optionNumber.xAxis.data = [];
            trackData.forEach(ele => {
              this.optionNumber.series[0].data.push(ele.fly_number);
              this.optionNumber.xAxis.data.push(ele.special_time);
            });
            this.createchartNumber();
          } else {
            this.optionNumber.series[0].data = [];
            this.optionNumber.xAxis.data = [];
            this.createchartNumber();
          }
        }
      });
    },
    // 绘制图表
    createchartNumber() {
      this.mychartNumber = echarts.init(
        document.getElementById("flyAllNumber")
      );
      this.mychartNumber.setOption(this.optionNumber);
    },
    // 统计-飞行总时间
    getTrackAllTimeData() {
      this.$post("/admin/the_all_data/allFlyTimeOfWeek", {
        start_time: this.$zxh_fun.getWeek(),
        end_time: this.$zxh_fun.getToday()
      }).then(res => {
        if (res.code != 1) {
          return this.$Message.error(res.msg_customer);
        } else {
          let trackData = res.data;
          if (trackData) {
            this.optionTime.series[0].data = [];
            this.optionTime.xAxis.data = [];
            trackData.forEach(ele => {
              this.optionTime.series[0].data.push(ele.day_time);
              this.optionTime.xAxis.data.push(ele.special_time);
            });
            this.createchartTime();
          } else {
            this.optionTime.series[0].data = [];
            this.optionTime.xAxis.data = [];
            this.createchartTime();
          }
        }
      });
    },
    // 绘制图表
    createchartTime() {
      this.mychartTime = echarts.init(document.getElementById("flyAllTime"));
      this.mychartTime.setOption(this.optionTime);
    },
    // 统计-时间区间表统计
    getTrackData() {
      this.$post("/admin/the_all_data/historyFlyTimesOfWeek", {
        start_time: this.$zxh_fun.getWeek(),
        end_time: this.$zxh_fun.getToday()
      }).then(res => {
        if (res.code != 1) {
          return this.$Message.error(res.msg_customer);
        } else {
          if (res.data) {
            let trackData = res.data;
            this.optionCount.series[0].data.map((item, index) => {
              item.value = trackData.time_stage_fly_time[index];
            });
            this.createchartCount();
          } else {
            this.optionCount.series[0].data = [];
          }
        }
      });
    },
    // 绘制图表
    createchartCount() {
      this.mychartCount = echarts.init(document.getElementById("flyAllCount"));
      this.mychartCount.setOption(this.optionCount);
    },
    async getPlayUrl(ele) {
      let data = await this.$post("/base/live/getPlayUrl", {
        client: "web",
        user_id: ele.uid
      });
      if (data.code == 1) {
        let url = data.data.default_url;
        ele.url = url;
        this.setVideoPlay(ele.uid, url);
      }
    },
    setVideoPlay(uid, url) {
      let width = document.getElementsByClassName("livebox")[0].offsetWidth;
      let height = document.getElementsByClassName("livebox")[0].offsetHeight;
      this.option = {
        live_url: url,
        width: width,
        height: height,
        autoplay: true,
        Wmode: "opaque"
      };
      var player = new qcVideo.Player(`${uid}`, this.option);
    }
  },
  beforeDestroy() {
    this.socket.close();
    clearInterval(this.timer);
  }
};
