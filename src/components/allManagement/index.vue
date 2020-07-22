<template>
  <div class="allManagement">
    <div class="all_content" :style="{flex:navBar_active!=1&&isShowOnline?'0.8':'1'}">
      <div class="wrapper" style="background: url('/static/linkFly/bg1.png') no-repeat 0 -30px;">
        <div class="all_navBar">
          <router-link
            @click.native="changeNav($event,index)"
            v-for="(item,index) in all_navBar"
            :key="index"
            :to="item.path"
          >
            <span :class="[index == navBar_active?'navBar_active':'']">{{item.name}}</span>
          </router-link>
          <img
            src="/static/linkFly/dataTo.png"
            alt
            srcset
            title="大数据界面"
            @click="toBigData"
            style="margin-left:30px;"
          />
        </div>
        <div class="all_serch" v-if="navBar_active == 0">
          <!--工程选择-->
          <div class="Project_selection">
            <Dropdown trigger="click">
              <Button type="primary" style="width: 150px">
                工程选择
                <Icon type="ios-arrow-down"></Icon>
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem trigger="click" placement="right-start">
                  <span @click="click_Project_2()" style="color: #4C98FF">全部工程</span>
                </DropdownItem>
                <Dropdown
                  trigger="click"
                  placement="right-start"
                  v-for="item in ProjectList"
                  :key="item.pm_id"
                >
                  <span class="Project" @click="click_Project_1(item.pm_id)">{{item.pm_name}}</span>
                  <DropdownMenu slot="list">
                    <DropdownItem v-for="item2 in Project_2_List" :key="item2.pm_id">
                      <span
                        style="display:inline-block;width: 120px;height: 25px;line-height:25px;white-space: nowrap;overflow: hidden;text-overflow:ellipsis;"
                        @click="click_Project_2(item2.pm_id)"
                      >{{item2.pm_name}}</span>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </DropdownMenu>
            </Dropdown>
          </div>
          <FormOrganization :organization="region" v-model="serch_city"></FormOrganization>
          <img
            style="vertical-align:middle;cursor:pointer;background:#131415;"
            @click="searchPm"
            src="/static/publicimg/search.png"
            alt
            srcset
          />
        </div>
      </div>
      <router-view
        :userData="userData"
        :chatMsgLists="chatMsgLists"
        @clickChat="clickChat"
        :websock="websock"
        :speakState="speakState"
        @isOnline="isOnline"
      ></router-view>
    </div>
    <div class="right_wapper" v-if="navBar_active!=1&&isShowOnline">
      <onlineCollaspe @clickChat="clickChat" :userData="userData" :chatMsgLists="chatMsgLists"></onlineCollaspe>
    </div>
    <Live :websock="websock" :speakState="speakState" :chatMsgLists="chatMsgLists"></Live>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import SubMenu from "../subMenu/index";
import onlineCollaspe from "../self_component/online_Collapse";
import Menu from "../self_component/Menu";
import Live from "../self_component/Live";
import FormOrganization from "../self_component/FormOrganization";
import region from "../../../static/region(1)";
export default {
  components: {
    SubMenu,
    onlineCollaspe,
    Menu,
    Live,
    FormOrganization
  },
  data() {
    return {
      isShowOnline: true,
      chatMsgLists: {
        list: [],
        record: []
      },
      speakState: "",
      showLive: false, //开启直播弹窗
      selectImg: 0,
      websockid: 0,
      websock: null,
      isbind: false,
      userData: [], // 存放用户数据的数组
      navBar_active: 0, // 默认的索引值
      defult_online: ["1", "2"], // 默认展开的面板，
      all_navBar: [
        // 全局管理下的导航路径
        {
          name: "全局管理",
          path: "allManagement"
        },
        {
          name: "飞行记录",
          path: "uavHistory"
        },
        {
          name: "实时直播",
          path: "videoLive"
        }
      ],
      userInfo: {},
      timer: null,
      closeWebsocket: false,
      region: region,
      serch_city: [], // 搜索的城市名字
      ProjectList: [], //搜索工程的列表
      Project_2_List: [] //二级工程列表
    };
  },
  methods: {
    ...mapActions(["getSocket"]),
    // 跳转大数据界面
    toBigData() {
      const { href } = this.$router.resolve({
        name: "大数据管理",
        query: {},
        params: {}
      });
      window.open(href, "_blank");
    },
    // 是否显示人员在线
    isOnline(val) {
      if (val == 1) {
        this.isShowOnline = true;
      } else {
        this.isShowOnline = false;
      }
      sessionStorage.setItem("isOnline", val);
    },
    //聊天
    clickChat(val) {
      if (this.chatMsgLists.list.length > 0) {
        let result = this.chatMsgLists.list.filter(ele => {
          return ele.from_id == val.uid;
        });
        if (result.length <= 0) {
          this.chatMsgLists.list.push({
            from_name: val.name,
            from_id: val.uid,
            uid: val.uid,
            name: val.name,
            head_icon_path: val.head_icon_path
          });
        }
      } else {
        this.chatMsgLists.list.push({
          from_name: val.name,
          from_id: val.uid,
          uid: val.uid,
          name: val.name,
          head_icon_path: val.head_icon_path
        });
      }
    },
    searchPm() {
      var city = [];
      region.forEach(item => {
        if (item.value == this.serch_city[0]) {
          city.push({
            value: this.serch_city[0],
            label: item.label
          });
          if (this.serch_city.length > 1) {
            item.children.forEach(item2 => {
              if (item2.value == this.serch_city[1]) {
                city.push({
                  value: this.serch_city[1],
                  label: item2.label
                });
                if (this.serch_city.length > 2) {
                  item2.children.forEach(item3 => {
                    if (item3.value == this.serch_city[2]) {
                      city.push({
                        value: this.serch_city[2],
                        label: item3.label
                      });
                    }
                  });
                }
              }
            });
          }
        }
      });
      this.$_bus.$emit("pmRegion", city);
    },
    loadData(item, callback) {
      var address = [];
      item.loading = true;
      this.$post("/base/common/regionChoose", {
        code: item.value,
        client: "web"
      }).then(response => {
        if (response.code == 1) {
          address = response.data;
          for (var i = 0; i < address.length; i++) {
            if (item.value.toString().length < 6) {
              item.children.push({
                value: address[i].code,
                label: address[i].name,
                children: [],
                loading: false
              });
            } else {
              item.children.push({
                value: address[i].code,
                label: address[i].name,
                children: []
              });
            }
          }
          item.loading = false;
          callback();
        } else {
          this.$Message.error(response.msg_customer);
        }
      });
    },
    changeNav(e, index) {
      this.navBar_active = index;
    },
    InitWebsocket() {
      const wsuri = "wss://www.linkeda.net:11086";
      // const wsuri = "ws://134.175.32.185:11086";
      // const wsuri = "wss://bigdog.redovation.com:11086";
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
      this.global_.websocket = this.websock;
    },
    websocketonmessage(webevent) {
      // 接受消息
      let data = JSON.parse(webevent.data);
      // console.log("websocket信息",data);
      this.websockid = data.client_id;
      if (this.websockid != undefined && !this.isbind) {
        this.getData();
      }
      if (data.type == "location") {
        // console.log("用户在线", data.account);
        // 如果返回的有数据就加入到数组里
        if (this.userData.length == 0) {
          // 保证数组长度不从0开始比较
          this.userData.push(data);
          if (data.IsPublish == 1) {
            this.$_bus.$emit("updateUser", {
              uid: data.uid,
              name: data.name,
              IsPublish: data.IsPublish,
              fullpage: false,
              type: "location",
              head_icon_path: data.head_icon_path
            });
          }
        } else {
          let result = this.userData.find((ele, index) => {
            // 数组不存在这个用户就添加进去
            if (ele.uid == data.uid) {
              if (ele.Client != data.Client) {
                this.userData[index].Client = data.Client;
              }
              if (ele.IsPublish != data.IsPublish) {
                this.userData[index].IsPublish = data.IsPublish;
              }
              if (ele.DroneAltitude != data.DroneAltitude) {
                this.userData[index].DroneAltitude = data.DroneAltitude;
              }
              if (ele.DroneSpeed != data.DroneSpeed) {
                this.userData[index].DroneSpeed = data.DroneSpeed;
              }
              if (ele.DroneSpeedH != data.DroneSpeedH) {
                this.userData[index].DroneSpeedH = data.DroneSpeedH;
              }
              if (ele.DroneYaw != data.DroneYaw) {
                this.userData[index].DroneYaw = data.DroneYaw;
              }
              if (ele.DroneLongitude != data.DroneLongitude) {
                this.userData[index].DroneLongitude = data.DroneLongitude;
              }
              if (ele.DroneLatitude != data.DroneLatitude) {
                this.userData[index].DroneLatitude = data.DroneLatitude;
              }
              this.$_bus.$emit("updateUser", {
                uid: data.uid,
                name: data.name,
                IsPublish: data.IsPublish,
                fullpage: false,
                type: "location",
                head_icon_path: data.head_icon_path
              });
            }
            return ele.uid == data.uid;
          });
          if (!result) {
            this.userData.push(data);
            if (data.IsPublish == 1) {
              this.$_bus.$emit("updateUser", {
                uid: data.uid,
                name: data.name,
                IsPublish: data.IsPublish,
                fullpage: false,
                type: "location",
                head_icon_path: data.head_icon_path
              });
            }
          }
        }
      } else if (data.type == "location_logout") {
        if (data.account) {
          let result = this.userData.findIndex(el => {
            return el.account == data.account;
          });
          this.$_bus.$emit("updateUser", {
            uid: data.uid,
            IsPublish: 0,
            fullpage: false,
            type: "logout"
          });
          this.userData.splice(result, 1); // 用户下线 删除数组
        }
      } else if (data.type == "speak_control") {
        if (data.dataType == 1) {
          this.$Message.warning("申请喊话已被拒绝!");
          this.speakState = 1;
        } else if (data.dataType == 2) {
          this.speakState = 2;
        } else if (data.dataType == 3) {
          this.$Message.warning("喊话已被挂断!");
          this.speakState = 3;
        } else if (data.dataType == 4) {
          this.$Message.warning("喊话已被接收!");
          this.speakState = 4;
        }
      } else if (data.msg == "user_msg") {
        let datas = data.data[0];
        if (datas.from_id != this.userInfo.user_id) {
          if (this.chatMsgLists.list.length > 0) {
            let result = this.chatMsgLists.list.filter(ele => {
              return ele.from_id == datas.from_id;
            });
            if (result.length <= 0) {
              this.chatMsgLists.list.push(datas);
            }
          } else {
            this.chatMsgLists.list.push(datas);
          }
        }
        this.chatMsgLists.record.push(datas);
      }
    },
    websocketonopen() {
      // 建立连接
      // console.log("开启websock成功");
      let actions = { test: "12345" };
      this.websocksend(JSON.stringify(actions));
    },
    websocketonerror() {
      // 错误信息
      console.log("websock 重连");
      // this.InitWebsocket();
    },
    websocketclose() {
      console.log(" 关闭 websock");
    }, // 关闭连接
    websocksend(data) {
      this.websock.send(data);
    },
    getData() {
      this.$post("/base/common/bindClient", {
        client: "web",
        client_id: this.websockid,
        user_id: this.userInfo.user_id
      }).then(res => {
        // console.log(res);
        if (res.code == 1) {
          this.isbind = true;
          // sessionStorage.setItem('isbind',true) // 绑定一次 存到session 里
          // this.InitWebsocket();
        } else {
          this.isbind = false;
        }
      });
    },
    click_Project_1(pm_id) {
      this.$post("/base/common/pmWebCommonList", {
        pm_first_id: pm_id,
        client: "web"
      }).then(res => {
        console.log("搜索二级工程列表数据", res);
        if (res.code == 1) {
          this.Project_2_List = res.data;
          if (res.data == undefined) {
            this.Project_2_List = [{ pm_name: "暂无数据" }];
          }
        } else {
          this.$Message.error(res.msg_customer);
        }
      });
    },
    click_Project_2(pm_id) {
      console.log("点击了二级工程");
      this.$_bus.$emit("pmProject", pm_id);
    }
  },
  watch: {
    $route(to, from) {
      this.navBar_active =
        this.$route.name == "全局管理"
          ? 0
          : this.$route.name == "飞行记录"
          ? 1
          : 2;
    }
  },
  mounted() {
    this.$_bus.$off("closeSocket");
    this.$_bus.$on("closeSocket", val => {
      this.closeWebsocket = true;
    });
    this.userInfo = JSON.parse(sessionStorage.getItem("user_info"));
    this.InitWebsocket();
    this.navBar_active =
      this.$route.name == "全局管理"
        ? 0
        : this.$route.name == "飞行记录"
        ? 1
        : 2;
    let that = this;
    this.timer = setInterval(function() {
      that.websock.send(
        JSON.stringify({
          type: "location", //消息标识
          sb: "0",
          uid: that.userInfo.user_id,
          name: that.userInfo.name,
          account: that.userInfo.account,
          user_type: that.userInfo.type,
          head_icon_path: that.userInfo.head_icon_path,
          DroneLatitude: "",
          DroneLongitude: "",
          DroneYaw: "",
          DroneAltitude: "",
          HomeLatitude: "",
          HomeLongitude: "",
          PUBLISH_NAME: "",
          UserLatitude: "",
          UserLongitude: "",
          PointLongitude: "",
          PointLatitude: "",
          DRONETYPE: "",
          DRONEMODEL: "",
          pm_first_id: "",
          Client: "1",
          address: "",
          pm_second_id: "",
          track_tag: 0,
          track_id: 0,
          highly: "",
          distance: "",
          PM: "",
          vertical_speed: "",
          horizontal_velocity: "",
          power: "",
          PM10: "",
          Wendu: "",
          Shidu: "",
          Jiaquan: "",
          TVOC: "",
          IsPublish: 0,
          sendIndex: 0,
          run_time: "",
          satellite_signal: 0,
          team_id: "",
          run_time: "",
          permission: that.userInfo.permission,
          company_name: that.userInfo.company_name
        })
      );
    }, 1000);

    // 获取列表数据
    let _this = this;
    this.$post("/base/common/pmWebCommonList", {
      // pm_first_id: this.userInfo.type==0?"":this.userInfo.pm_id,
      pm_first_id: "",
      client: "web"
    }).then(res => {
      console.log("搜索列表数据", res);
      if (res.code == 1) {
        _this.ProjectList = res.data;
      } else {
        _this.$Message.error(res.msg_customer);
      }
    });
    console.log("搜索的一级列表数据", this.ProjectList);
  },
  beforeDestroy() {
    if (this.closeWebsocket) {
      this.websock.close();
      if (this.timer) {
        clearInterval(this.timer);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.allManagement {
  display: flex;
  .all_content {
    position: relative;
    flex: 0.8;
    padding: 0px 0.52rem;
    height: 87vh;
  }
}
.all_navBar {
  height: 0.52rem;
  padding-left: 0.2rem;
  background: #000;
  opacity: 1;
  border-radius: 1000px;
  width: 4.51rem;
  display: inline-flex;
  align-items: center;
  a {
    margin-right: 0.1rem;
  }
  a span {
    display: block;
    width: 1.2rem;
    height: 0.4rem;
    line-height: 0.36rem;
    font-size: 0.2rem;
    font-family: PingFang SC;
    font-weight: 400;
    text-align: center;
    color: #acacac;
    opacity: 1;
    margin-right: 0.1rem;
    border: 1px solid #444;
    border-radius: 1000px;
  }
}

.all_navBar .navBar_active {
  width: 1.2rem;
  height: 0.4rem;
  font-size: 0.2rem;
  border: 1px solid rgba(255, 255, 255, 1);
  color: white;
  opacity: 1;
  border-radius: 1000px;
}
.all_serch {
  float: right;
  border-radius: 0.2rem;
  position: relative;
  /deep/.ivu-dropdown-menu {
    max-height: 400px;
    overflow-x: auto;
  }
  .Project_selection {
    position: absolute;
    top: 3px;
    left: -160px;
    .Project {
      cursor: pointer;
      display: inline-block;
      width: 150px;
      height: 25px;
      line-height: 25px;
      padding: 0 16px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .Project:hover {
      background-color: #eee;
    }
  }
}
.ivu-input-wrapper {
  padding-left: 0.2rem;
  /deep/.ivu-cascader .ivu-input {
    width: 75%;
    background: transparent !important;
    border-radius: 0.2rem;
    border: 1px solid transparent;
    color: white;
    font-size: 0.14rem;
  }
  /deep/.ivu-input:focus {
    box-shadow: 0 0 0 0px;
  }
}
.warpper_content_map {
  position: relative;
  width: 100%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 12px rgba(1, 0, 55, 0.15);
  opacity: 1;
  border-radius: 20px;
  margin-top: 0.15rem;
}

.right_wapper {
  flex: 0.23;
  color: white;
  background: rgba(255, 255, 255, 1);
  box-shadow: -1px 0px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 30px 0px 30px 30px;
}

.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
