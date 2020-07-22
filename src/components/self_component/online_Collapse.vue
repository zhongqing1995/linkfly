<template>
  <div class="wapper">
    <div class="description">
      <div class="d_left">
        <img src="../../../static/zxhImg/online.png" alt />
        <span>在线人员</span>
      </div>
      <div class="d_right">
        <!-- <img src="../../../static/zxhImg/refresh.png" alt="刷新" /> -->
      </div>
    </div>
    <div class="wapper_content" v-for="item in userData" :key="item.account">
      <div class="description">
        <div class="d_left" @click="toggle($event)">
          <img :src="item.head_icon_path" alt />
          <span>{{item.name}}</span>
        </div>
        <div class="d_right">
          <img
            v-if="item.IsPublish == 1"
            src="../../../static/zxhImg/zhibo.png"
            alt="直播"
            @click="ShowLive(item)"
          />
          <img src="../../../static/zxhImg/commit.png" alt="聊天" @click="toChat(item)" />
          <img v-if="item.Client == 1" src="../../../static/zxhImg/app.png" alt="app在线" />
          <img v-else-if="item.Client == 2" src="../../../static/zxhImg/small.png" alt="小程序在线" />
        </div>
      </div>
      <transition name="slide-fade">
        <div class="content">
          <Row>
            <Col span="12">
              <span>高度：</span>
              {{item.DroneAltitude?item.DroneAltitude:'0(m)'}}
            </Col>
            <Col span="12">
              <span>水平速度：</span>
              {{item.DroneSpeed?item.DroneSpeed:'0(m/s)'}}
            </Col>
            <Col span="12">
              <span>垂直速度：</span>
              {{item.DroneSpeedH?item.DroneSpeedH:'0(m/s)'}}
            </Col>
            <Col span="12">
              <span>角度：</span>
              {{item.DroneYaw?item.DroneYaw:'0(°)'}}
            </Col>
            <Col span="12">
              <span>经度：</span>
              {{item.DroneLongitude?item.DroneLongitude:'0'}}
            </Col>
            <Col span="12">
              <span>纬度：</span>
              {{item.DroneLatitude?item.DroneLatitude:'0'}}
            </Col>
          </Row>
        </div>
      </transition>
    </div>
    <Chat
      v-if="isChat"
      @currentChange="currentChange"
      :currentUser="currentUser"
      :chatMsgLists="chatMsgLists"
      @closeChat="closeChat"
    ></Chat>
  </div>
</template>

<script>
import Chat from "./chat";
export default {
  props: ["userData", "chatMsgLists"],
  data() {
    return {
      currentUser: {},
      isChat: false,
      userInfo: {},
      isLive: false
    };
  },
  components: {
    Chat
  },
  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem("user_info"));
    this.$bus.off("showLive");
    this.$bus.on("showLive", value => {
      this.isLive = true;
    });
  },
  methods: {
    currentChange(val) {
      this.currentUser = val;
    },
    closeChat(val) {
      this.isChat = false;
    },
    toChat(item) {
      this.currentUser = item;
      this.isChat = true;
      this.$emit("clickChat", this.currentUser);
    },
    toggle(e) {
      // 点击用户名称显示详细内容
      let parent =
        e.target.nodeName == "IMG" || e.target.nodeName == "SPAN"
          ? e.target.parentElement.parentElement
          : e.target.parentElement;
      // 得到 .description 的父类
      let sibling = parent.nextElementSibling; // 得到contentDOM 元素
      sibling.classList.toggle("content_none");
    },
    ShowLive(item) {
      // 开启直播弹窗
      this.$bus.emit("showLive", item);
    }
  },
  watch: {
    "chatMsgLists.record"(newval, oldval) {
      if (newval) {
        if (this.isLive) {
        } else {
          this.isChat = true;
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.wapper {
  width: 100%;
  margin-top: 0.2rem;
  padding: 0px 0.3rem;
  height: 100%;
  max-height: 660px;
  overflow: auto;
}
.description {
  display: flex;
  justify-content: space-between;
  height: 0.35rem;
  width: 100%;
  align-items: center;
  .d_left {
    img {
      width: 0.24rem;
      height: 0.24rem;
    }
    span {
      color: #010037;
      font-size: 0.24rem;
      line-height: 0.27rem;
      width: 1.4rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  .d_right {
    img {
      margin-right: 0.12rem;
      transform: scale(0.8);
      cursor: pointer;
    }
  }
}

.wapper_content {
  margin: 0.1rem 0px;
  cursor: pointer;
}
.wapper_content .description {
  .d_left {
    img {
      border-radius: 50%;
      vertical-align: sub;
    }
  }
  span {
    font-size: 0.18rem;
    line-height: 0.18rem;
  }
}
.content {
  transition: all 0.3s linear;
  background: rgba(0, 0, 0, 0.02);
  .ivu-col {
    color: rgba(1, 0, 55, 1);
    height:26px;
    line-height: 26px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
.content_none {
  transition: all 0.3s linear;
  max-height: 0px;
  // opacity: 0;
  display: none;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.5s;
  display: none;
}
.slide-fade-enter, .slide-fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>