<template>
  <div class="videoLive">
    <div class="video_wrapper" v-for="(item,index) in uidLists" :key="index">
      <div class="top">
        <span>{{item.name}}</span>
      </div>
      <div class="video">
        <div :id="item.uid"></div>
      </div>
      <div class="foot">
        <div class="foot_left"></div>
        <div class="foot_right">
          <img
            src="../../../static/zhibo/to chat with@2x.png"
            alt="消息"
            title="消息"
            @click="toChat(item)"
          />
          <img
            @click="toSpeaker(item)"
            src="../../../static/zhibo/Megaphone@2x.png"
            alt="喊话器"
            title="喊话器"
          />
          <img
            :src="item.fullpage?'../../../static/zhibo/Zoom out@2x.png':'../../../static/zhibo/amplification@2x.png'"
            @click="fullpage($event,item)"
            alt="全屏"
            title="全屏"
          />
        </div>
      </div>
    </div>
    <!--提示-->
    <Modal
      class="addless"
      :z-index="zindex"
      title="谷歌浏览器手动开启flash"
      v-model="chj_versions"
      width="500px"
      :mask-closable="false"
    >
      <span style="font-family:Microsoft YaHei;">
        <div>
          <object
            classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
            codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0"
            width="490"
            height="390"
            id="Untitled-1"
            align="middle"
          >
            <param name="allowScriptAccess" value="sameDomain" />
            <param name="movie" value="cam.swf" />
            <param name="quality" value="high" />
            <param name="bgcolor" value="#ffffff" />
            <embed
              src="cam.swf"
              quality="high"
              bgcolor="#ffffff"
              width="490"
              height="390"
              name="cam"
              align="middle"
              allowScriptAccess="sameDomain"
              type="application/x-shockwave-flash"
              pluginspage="http://www.macromedia.com/go/getflashplayer"
            />
          </object>
        </div>
      </span>
      <div slot="footer"></div>
    </Modal>
    <Chat
      v-if="isChat"
      @currentChange="currentChange"
      :currentUser="currentUser"
      :chatMsgLists="chatMsgLists"
      @closeChat="closeChat"
    ></Chat>
    <Speaker
      @closeSpeaker="closeSpeaker"
      v-if="isSpeaker"
      :websock="websock"
      :speakState="speakState"
      :currentUser="currentUser"
    ></Speaker>
  </div>
</template>
<script>
import Chat from "../self_component/chat";
import Speaker from "../self_component/speaker";
import Recorder from "js-audio-recorder";
export default {
  props: ["userData", "chatMsgLists", "websock", "speakState"],
  data() {
    return {
      uidLists: [],
      zindex: 10000,
      chj_versions: false,
      option: {},
      isChat: false,
      currentUser: {},
      isSpeaker: false,
      url: "",
      playerLists: []
    };
  },
  components: {
    Chat,
    Speaker
  },
  created() {
    var fls = this.flashChecker();
    var s = "";
    if (fls.f) {
    } else {
      this.chj_versions = true;
    }
  },
  mounted() {
    this.$_bus.$on("updateUser", val => {
      if (this.$route.path == "/index/allManagement/videoLive") {
        var isP = this.uidLists.filter((ele, index) => {
          ele.index = index;
          if (val.type == "logout") {
            return ele.uid == val.uid.split("_")[0];
          } else {
            return ele.uid == val.uid;
          }
        });
        if (isP.length <= 0 && val.IsPublish == 1) {
          this.uidLists.push(val);
          this.getPlayUrl(val.uid);
        }
        if (isP.length > 0 && val.IsPublish == 0) {
          this.playerLists.forEach((ele, key) => {
            if (ele.__targetId == isP[0].uid) {
              this.playerLists.splice(key, 1);
            }
          });
          this.uidLists.splice(isP[0].index, 1);
        }
      }
    });
  },
  methods: {
    async getPlayUrl(uid) {
      let data = await this.$post("/base/live/getPlayUrl", {
        client: "web",
        user_id: uid
      });
      if (data.code == 1) {
        let url = data.data.default_url;
        this.uidLists.forEach(ele => {
          if (ele.uid == uid) {
            ele.url = url;
          }
        });
        this.setVideoPlay(uid, url);
      }
    },
    setVideoPlay(uid, url) {
      this.option = {
        live_url: url,
        width: 300,
        height: 280,
        autoplay: true,
        Wmode: "opaque"
      };
      var player = new qcVideo.Player(`${uid}`, this.option);
      this.playerLists.push(player);
    },
    closeSpeaker(val) {
      this.isSpeaker = false;
    },
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
    toSpeaker(item) {
      this.currentUser = item;
      this.isSpeaker = true;
    },
    fullpage(e, item) {
      // 继续还是 静音 用于切换图标
      item.fullpage = !item.fullpage;
      e.target.parentElement.parentElement.parentElement.classList.toggle(
        "full_video_wrapper"
      );
      if (item.fullpage) {
        this.option = {
          live_url: item.url,
          width: 900,
          height: 560,
          autoplay: true
        };
        var player = new qcVideo.Player(`${item.uid}`, this.option);
      } else {
        this.option = {
          live_url: item.url,
          width: 300,
          height: 280,
          autoplay: true
        };
        var player = new qcVideo.Player(`${item.uid}`, this.option);
      }
    },
    //获取拉流地址
    getUrl(ele, index) {
      this.$post("/base/live/getPlayUrl", {
        client: "web",
        user_id: ele.uid
      })
        .then(res => {
          if (res.code == 1) {
            let flv_url = res.data.flv_url;
            let m3u8_url = res.data.m3u8_url;
            let default_url = res.data.default_url;
            let flvSrc = flv_url;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    flashChecker() {
      var hasFlash = 0; //是否安装了flash
      var flashVersion = 0; //flash版本
      if (document.all) {
        var swf = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
        if (swf) {
          hasFlash = 1;
          VSwf = swf.GetVariable("$version");
          flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
        }
      } else {
        if (navigator.plugins && navigator.plugins.length > 0) {
          var swf = navigator.plugins["Shockwave Flash"];
          if (swf) {
            hasFlash = 1;
            var words = swf.description.split(" ");
            for (var i = 0; i < words.length; ++i) {
              if (isNaN(parseInt(words[i]))) continue;
              flashVersion = parseInt(words[i]);
            }
          }
        }
      }
      return { f: hasFlash, v: flashVersion };
    }
  },
  watch: {
    chatMsgLists(newval, oldval) {
      if (newval) {
        this.isChat = true;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.videoLive {
  display: flex;
  // justify-content: space-around;
  flex-wrap: wrap;
}
.videoLive .full_video_wrapper {
  transition: all 0.3s linear;
  position: absolute;
  width: 95%;
  height: 90%;
  z-index: 9999999999999999;
}
.video_wrapper {
  transition: all 0.3s linear;
  display: flex;
  flex-basis: 26%;
  flex-grow: 0.1;
  flex-shrink: 1;
  flex-direction: column;
  margin-top: 0.16rem;
  margin-right: 20px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 12px rgba(1, 0, 55, 0.15);
  opacity: 1;
  border-radius: 0.2rem;
  .top {
    flex: 0 1 0.42rem;
    padding-left: 0.2rem;
    line-height: 0.42rem;
    font-size: 0.14rem;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(1, 0, 55, 1);
  }
  .video {
    background: rgba(60, 60, 60, 1);
    opacity: 1;
    flex: 1;
    .id_test_video {
      width: 100%;
      height: 100%;
    }
  }
  .foot {
    flex: 0 0 0.42rem;
    cursor: pointer;
    padding: 0rem 0.2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      width: 0.21rem;
      height: 0.24rem;
      line-height: 0.32rem;
    }
  }
  .foot_left {
    display: flex;
    align-items: center;
  }
  .foot_right {
    display: inline-flex;
    justify-content: space-around;
    width: 1.5rem;
  }
}
</style>