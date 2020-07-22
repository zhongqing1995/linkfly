

<template >
  <transition name="slide-fade">
    <div class="Live_wapper" v-if="activeLive">
      <div class="Live_content">
        <div class="Live_video">
          <span>{{name}}</span>
          <div class="oprtion_icon">
            <img src="../../../static/zhibo/close.png" alt="关闭" title="关闭" @click="CloseLive" />
            <img src="../../../static/zhibo/liaotian.png" alt="交流" title="交流" @click="commit" />
            <img src="../../../static/zhibo/hanhua.png" alt="喊话" title="喊话" @click="speak" />
            <img
              src="../../../static/zhibo/fullpage.png"
              alt="放大窗口"
              title="放大窗口"
              @click="fullpage($event)"
            />
          </div>
          <video
            id="video1"
            class="video-js vjs-default-skin vjs-big-play-centered id_test_video"
            preload="auto"
            poster
            data-setup="{}"
          >
            <source v-bind:src="videoServer" type="rtmp/mp4" />
          </video>
          <!-- <video
            id="video1"
            class="video-js vjs-default-skin vjs-big-play-centered id_test_video"
            preload="auto"
            poster
            data-setup="{}"
            controls
          >
            <source v-bind:src="videoServer" type="rtmp/mp4" />
          </video>-->
        </div>
        <div class="right_contnet" v-show="showRight">
          <span class="closex" @click="closex">X</span>
          <!-- 聊天窗口-->
          <!-- <div class="Live_chat" v-show="showChat">
            <div class="chat_name">
              <span>{{name}}</span>
            </div>
            <div class="chat_content">
              <div
                v-for="(item,index) in chatContent "
                :key="index"
                :class="[item.style=='left'?'left':'right']"
              >
                <img :src="item.src" alt="用户头像" />
                <div>
                  <span v-show="item.type=='normal'">{{item.content}}</span>
                  <audio v-show="item.type=='voice'" :src="item.content" controls="controls"></audio>
                </div>
              </div>
          </div>-->
          <div class="Live_chat" v-show="showChat">
            <div class="chat_name">
              <span>{{name}}</span>
            </div>
            <div id="chj_mapId" class="chat_content">
              <ul class="chat_content">
                <li
                  v-if="item.from_id==uid || item.target_id==uid"
                  v-for="(item,index) in chatMsgLists.record"
                  :key="index"
                  :class="[item.from_id==userInfo.user_id?'right':'left']"
                >
                  <img
                    v-if="item.from_id!=userInfo.user_id"
                    :src="item.from_id==userInfo.user_id?userInfo.head_icon:objMsg.head_icon_path"
                    alt="用户头像"
                  />
                  <span
                    v-show="item.msg_type=='normal'"
                    class="chj_map_chartext"
                  >{{item.msg_content}}</span>
                  <audio
                    v-show="item.msg_type=='voice'"
                    :src="item.msg_content"
                    controls="controls"
                  ></audio>
                  <img
                    v-if="item.from_id==userInfo.user_id"
                    :src="item.from_id==userInfo.user_id?userInfo.head_icon:objMsg.head_icon_path"
                    alt="用户头像"
                  />
                </li>
              </ul>
            </div>
            <div class="chat_foot">
              <div class="oprtion">
                <img src="../../../static/zhibo/yuyin.png" alt="语音" title="语音" @click="Recorde" />
                <i v-if="disVoice" class="span1">{{duration}}s</i>
                <span @click="sendContent">发送</span>
              </div>
              <div class="inpt_content">
                <textarea
                  :disabled="disVoice"
                  v-model="send_content"
                  cols="54"
                  style="color:#fff;"
                  placeholder="请输入聊天内容"
                ></textarea>
              </div>
            </div>
          </div>
          <!-- 喊话窗口-->
          <div class="speak" v-show="speaKChat">
            <img src="../../../static/zhibo/clac.png" alt />
            <img src="../../../static/zhibo/wurenji.png" alt style="position: absolute;" />
            <!-- <img
              src="../../../static/zhibo/send.png"
              alt
              style="position: absolute;"
              v-show="speak_send"
            />-->
            <div>
              <!-- <i-button
                v-if="!speak_send"
                @click="startMic"
                style="background:rgba(164,207,242,1);color:white;width:1.46rem;height:0.65rem;"
              >点击喊话</i-button>-->
              <span style="color:#FFFFFF">
                已向
                <span style="color:yellow;">{{name}}</span>提出喊话申请......
                <!-- <Icon
                  style="font-size: 0.3rem;cursor: pointer;"
                  type="ios-close"
                  @click="speak_send = false"
                ></Icon>-->
              </span>
              <div style="text-align:center;margin-top:20px;">
                <i-button
                  @click="stopMic"
                  style="background:rgba(164,207,242,1);color:white;width:1.46rem;height:0.65rem;"
                >点击挂断</i-button>
              </div>
            </div>
          </div>
          <div class="speak" v-show="toSpeaker">
            <img src="../../../static/zhibo/clac.png" alt />
            <img src="../../../static/zhibo/wurenji.png" alt style="position: absolute;top:2.55rem" />
            <img src="../../../static/zhibo/send.png" alt style="position: absolute;" />
            <div>
              <div style="text-align:center;margin-top:20px;">
                <i-button
                  @click="startVoice"
                  style="background:rgba(164,207,242,1);color:white;width:1.46rem;height:0.65rem;"
                >点击录音</i-button>
                <i-button
                  @click="stopMic"
                  style="background:rgba(164,207,242,1);color:white;width:1.46rem;height:0.65rem;"
                >点击挂断</i-button>
              </div>
            </div>
          </div>
          <!-- 录音窗口 -->
          <div class="speak" v-show="rec">
            <img src="../../../static/zhibo/clac.png" alt :class="{'play_keyframes':operindex==1}" />
            <img
              src="../../../static/zhibo/wurenji.png"
              alt
              style="position: absolute;top:2.45rem;"
            />
            <div class="recorde">
              <div>录音时间</div>
              <div style="text-align:center">{{duration+'s'}}</div>
            </div>
            <div>
              <!-- <i-button
                @click="startVoice"
                style="background:rgba(164,207,242,1);color:white;width:1rem;height:0.35rem;"
              >{{operation[operindex]}}</i-button>
              <i-button
                @click="cancelVoice"
                style="background:rgba(164,207,242,1);color:white;width:1rem;height:0.35rem;"
              >取消</i-button>-->
              <i-button
                @click="sendlVoice"
                style="background:rgba(164,207,242,1);color:white;margin-top:20px;"
              >发送</i-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import Recorder from "js-audio-recorder";
import "video.js/dist/video-js.min.css";
import videojs from "video.js";
import "videojs-flash";
import flvjs from "flv.js";
export default {
  props: ["websock", "speakState", "chatMsgLists"],
  data() {
    return {
      player: "",
      videoServer: "",
      disVoice: false,
      macroTimer: null,
      userInfo: {},
      objMsg: {},
      uid: "",
      name: "",
      operation: ["开始", "暂停", "继续"],
      operindex: 0,
      fullpag: 0, // 0 默认小窗口  1 网页全屏  2 全屏
      activeLive: false, // 控制弹窗是否显示
      showRight: false, // 显示右侧
      showChat: true, // 右侧聊天框
      speaKChat: false, // 喊话
      rec: false, // 录音
      duration: 0, // 录音时间
      Recorders: null,
      timer: null, // 定时器
      speak_send: true, // 喊话发送
      send_content: "", // 发送的内容
      chatContent: [],
      toSpeaker: false
    };
  },
  methods: {
    startMic() {
      this.speak_send = true;
      let that = this;
      this.websock.send(
        JSON.stringify({
          dataType: 0,
          type: "speak_control",
          to_uid: this.uid,
          to_name: this.name,
          from_uid: this.userInfo.user_id,
          from_name: this.userInfo.name
        })
      );
      let duration = 0;
      clearInterval(this.macroTimer);
      this.macroTimer = setInterval(function() {
        duration++;
        if (duration >= 60 && !that.isMicAnswer) {
          that.$Message.warning("等待时间超过60s，自动关闭!");
          // that.speak_send = false;
          that.speaKChat = false;
          // this.showRight = false;
          // that.rec = true;
          clearInterval(that.macroTimer);
          that.websock.send(
            JSON.stringify({
              dataType: 3,
              type: "speak_control",
              to_uid: that.uid,
              to_name: that.name,
              from_uid: that.userInfo.user_id,
              from_name: that.userInfo.name
            })
          );
        }
      }, 1000);
    },
    stopMic() {
      this.speaKChat = false;
      this.showRight = false;
      this.websock.send(
        JSON.stringify({
          dataType: 3,
          type: "speak_control",
          to_uid: this.uid,
          to_name: this.name,
          from_uid: this.userInfo.user_id,
          from_name: this.userInfo.name
        })
      );
    },
    //获取拉流地址
    getUrl() {
      this.$post("/base/live/getPlayUrl", {
        client: "web",
        user_id: this.uid
      })
        .then(res => {
          if (res.code == 1) {
            let flv_url = res.data.flv_url;
            let m3u8_url = res.data.m3u8_url;
            let default_url = res.data.default_url;
            this.videoServer = default_url;
            this.player = videojs("video1");
            this.player.src(this.videoServer);
            this.player.play();
            // if (flvjs.isSupported()) {
            //   var videoElement = document.getElementById("video1");
            //   this.flvPlayer = flvjs.createPlayer({
            //     type: "flv",
            //     url: this.videoServer
            //   });
            //   this.flvPlayer.attachMediaElement(videoElement);
            //   this.flvPlayer.load();
            //   this.flvPlayer.play();
            // }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    CloseLive() {
      this.activeLive = false;
      this.player.dispose();
      // this.player.destroy();
    },
    sendContent() {
      if (this.send_content == "") {
        // 输入的内容为空
        this.$Message.error("对方不想说话，并且向你抛出了一个异常");
        return;
      }
      this.$post("/admin/chat/sendText", {
        target_id: this.uid,
        msg: this.send_content.replace(/[\n\r\t]/g, ""),
        from_name: this.userInfo.name
      }).then(response => {
        if (response.code == 1) {
          this.send_content = "";
          var e = document.getElementById("chj_mapId");
          e.scrollTop = e.scrollHeight;
        }
      });
    },
    Recorde() {
      // 开启录音
      // this.rec = true;
      // this.showChat = false; // 关闭聊天窗口和喊话窗口
      // this.speaKChat = false;
      this.Recorders = new Recorder();
      this.disVoice = !this.disVoice;
    },
    closex() {
      this.showRight = false;
    },
    commit() {
      // 聊天窗口
      this.showRight = true;
      this.rec = false;
      this.showChat = true;
      this.speaKChat = false;
    },
    speak() {
      // 喊话
      this.showRight = true;
      this.rec = false;
      this.showChat = false;
      this.speaKChat = true;
      this.startMic();
    },
    fullpage(event) {
      let dom = event.target.parentElement.parentElement.parentElement;
      if (this.fullpag == 0) {
        dom.classList.add("full_live_content");
        this.fullpag = 1;
      } else if (this.fullpag == 1) {
        (dom.requestFullscreen && dom.requestFullscreen()) ||
          (dom.mozRequestFullScreen && dom.mozRequestFullScreen()) ||
          (dom.webkitRequestFullscreen && dom.webkitRequestFullscreen()) ||
          (dom.msRequestFullscreen && dom.msRequestFullscreen());
        this.fullpag = 2;
      } else if (this.fullpag == 2) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
        dom.classList.remove("full_live_content");
        this.fullpag = 0;
      }
    },
    startVoice() {
      this.rec = true;
      this.toSpeaker = false;
      this.speaKChat = false;
      let that = this;
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }
      // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia
      // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
          // 首先，如果有getUserMedia的话，就获得它
          var getUserMedia =
            navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
          // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
          if (!getUserMedia) {
            return Promise.reject(
              new Error("getUserMedia is not implemented in this browser")
            );
          }
          // 否则，为老的navigator.getUserMedia方法包裹一个Promise
          return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        };
      }
      navigator.mediaDevices
        .getUserMedia({
          audio: true
        })
        .then(stream => {
          let that = this;
          //that.srcChoose = false;
          if (this.operindex == 0) {
            this.Recorders == null ? this.creatReoverds() : this.Recorders;
            this.Recorders.start(); // 开始录音
            // this.operindex = 1; // 切换到暂停
          } else if (this.operindex == 1) {
            this.Recorders.pause(); // 暂停录音
            this.operindex = 2;
          } else if (this.operindex == 2) {
            //继续录音
            this.Recorders.resume();
            this.operindex = 1;
          }
          this.Recorders.onprocess = function(duration) {
            that.duration = Math.ceil(duration);
          };
        })
        .catch(err => {
          this.$Notice.warning({
            title: "提示",
            desc: "检测到您的电脑未连接麦克风的设备，请连接!"
          });
        });
    },
    cancelVoice() {
      //取消发送
      this.operindex = 0;
      if (this.Recorders) {
        // this.Recorders.destroy();
        this.Recorders = null;
      }
      this.duration = 0;
      this.showChat = true;
      this.rec = false;
    },
    sendlVoice() {
      // 发送
      if (this.Recorders == null) {
        this.$Notice.warning({
          title: "提示",
          desc: "录音失败，请重新点击开始录音"
        });
        return;
      }
      this.operindex = 0;
      this.Recorders.stop();
      let blob = this.Recorders.getWAVBlob();
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }; //添加请求头
      let formData = new FormData();
      formData.append("target_id", this.uid);
      formData.append("target_type", 0);
      formData.append("speaker_time", this.duration);
      formData.append("from_name", this.userInfo.name);
      formData.append("speaker[]", blob, "r" + Date.parse(new Date()) + ".m4a");
      this.$post("/admin/Speaker/sendSpeaker", formData, config).then(
        response => {
          if (response.code == 1) {
            this.$Message.success("发送成功!");
            this.rec = false;
            this.toSpeaker = true;
            this.speaKChat = false;
            this.duration = 0;
          } else {
            this.$Message.error("发送失败! ");
            this.duration = 0;
          }
          this.isSuccess = false;
        }
      );
    },
    creatReoverds() {
      this.Recorders = new Recorder({
        sampleBits: 16000, // 采样位数，范围8或16
        sampleRate: 44100, // 采样率，范围11025、16000、22050、24000、44100、48000
        numChannels: 1 // 声道，范围1或2
      });
    },
    chatStartVoice() {
      let that = this;
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }
      // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia
      // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
          // 首先，如果有getUserMedia的话，就获得它
          var getUserMedia =
            navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
          // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
          if (!getUserMedia) {
            return Promise.reject(
              new Error("getUserMedia is not implemented in this browser")
            );
          }
          // 否则，为老的navigator.getUserMedia方法包裹一个Promise
          return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        };
      }
      navigator.mediaDevices
        .getUserMedia({
          audio: true
        })
        .then(stream => {
          let that = this;
          this.Recorders == null ? this.creatReoverds() : this.Recorders;
          this.Recorders.start(); // 开始录音
          this.Recorders.onprocess = function(duration) {
            that.duration = Math.ceil(duration);
          };
        })
        .catch(err => {
          this.$Notice.warning({
            title: "提示",
            desc: "检测到您的电脑未连接麦克风的设备，请连接!"
          });
        });
    },
    chatSendlVoice() {
      // 发送
      if (this.Recorders == null) {
        this.$Notice.warning({
          title: "提示",
          desc: "录音失败，请重新点击开始录音"
        });
        return;
      }
      let blob = this.Recorders.getWAVBlob();
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }; //添加请求头
      let formData = new FormData();
      formData.append("client", "web");
      formData.append("file[]", blob, "chat" + Date.parse(new Date()) + ".m4a");
      formData.append("use_type", 3);
      formData.append("file_type", "mp3");
      this.$post("/base/common/imageUp", formData).then(response => {
        if (response.code == 1) {
          let url = response.data[0];
          this.$post(
            "/admin/chat/sendVoice",
            {
              voice: url,
              target_id: this.objMsg.uid,
              from_name: this.userInfo.name,
              voice_time: this.duration
            },
            config
          ).then(response => {
            if (response.code == 1) {
              this.$Message.success("发送成功!");
              this.duration = 0;
              this.chatContent.push({
                style: "right",
                src: this.userInfo.head_icon,
                content: url,
                type: "voice"
              });
            } else {
              this.$Message.error("发送失败! ");
              this.duration = 0;
            }
          });
        } else {
          this.duration = 0;
        }
      });
    }
  },
  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem("user_info"));
    this.$bus.on("showLive", value => {
      this.activeLive = true;
      this.uid = value.uid;
      this.name = value.name;
      this.objMsg = value;
      this.getUrl();
    });
    this.creatReoverds(); // 创建录音对象
    var that = this;
    //  事件监听
    //获取被按下的键值keydown
    var execute = true;
    document.onkeydown = function(e) {
      var keyNum = window.event ? e.keyCode : e.which;
      if (keyNum == 32) {
        if (execute && that.disVoice) {
          that.chatStartVoice();
        }
        execute = false;
      }
    };
    document.onkeyup = function(e) {
      var keyNum = window.event ? e.keyCode : e.which;
      if (keyNum == 32 && that.disVoice) {
        that.Recorders.stop();
        that.chatSendlVoice();
        execute = true;
      }
    };
  },
  created() {
    this.$bus.off("showLive");
  },
  watch: {
    speakState: {
      handler(newval, oldval) {
        if (newval == 1) {
          this.speaKChat = false;
          this.showRight = false;
        } else if (newval == 2) {
          this.speaKChat = false;
          this.toSpeaker = true;
          this.rec = false;
        } else if (newval == 3) {
          this.speak_send = false;
          this.speaKChat = false;
          this.showRight = false;
        } else if (newval == 4) {
          this.rec = true;
        }
        clearInterval(this.macroTimer);
      },
      immediate: true,
      deep: true
    },
    "chatMsgLists.record": function(newval, oldval) {
      if (newval) {
        setTimeout(function() {
          var e = document.getElementById("chj_mapId");
          e.scrollTop = e.scrollHeight;
        }, 10);
      }
    }
  },
  beforeDestroy() {
    // this.websock.close();
  }
};
</script>

<style lang="less" scoped>
.chj_map_chartext {
  padding: 10px;
  background: #ddd;
  border-radius: 5px;
}
.Live_wapper {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: auto;
  top: 0;
  left: 0px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.3);
}

.Live_content {
  width: 15.12rem;
  height: 6rem;
  position: fixed;
  left: 50%;
  top: 50%;
  overflow: hidden;
  transform: translate(-50%, -50%);
  display: flex;
  border-radius: 8px;
  .Live_chat,
  .Live_video {
    display: inline-block;
    height: 100%;
  }
}
.full_live_content {
  width: 100%;
  height: 100%;
}
.Live_video {
  flex: 1 1 70%;
  transition: all 0.3s linear;
  // background-image: url("../../../static/zxhImg/video.png");
  // background-size: 100% 100%;
  background: #000;
  position: relative;
  span {
    float: left;
    margin: 0.3rem 0px 0px 0.3rem;
    color: white;
    font-size: 0.14rem;
  }
  .id_test_video {
    width: 80%;
    height: 80%;
    position: absolute;
    top: 60px;
    left: 60px;
  }
}
.right_contnet {
  position: relative;
  flex: auto;
  background: rgba(26, 26, 26, 1);
  opacity: 1;
  audio,
  video {
    width: 230px;
    height: 20px;
  }
  .closex {
    color: #fff;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    font-weight: bold;
  }
  .chat_name {
    background: rgba(33, 33, 33, 1);
    opacity: 1;
    height: 0.5rem;
    span {
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      opacity: 0.7;
      font-size: 0.18rem;
      line-height: 0.5rem;
      margin-left: 0.19rem;
    }
  }
  .chat_content {
    height: 4.07rem;
    overflow: auto;
    .left {
      width: 100%;
      display: flex;
      margin-bottom: 0.15rem;
      justify-content: flex-start;
      align-items: center;
      img {
        margin-left: 0.23rem;
        border-radius: 50%;
        width: 0.3rem;
        height: 0.3rem;
      }
      div {
        height: 0.24rem;
        background: rgba(46, 45, 49, 1);
        border: 0px solid rgba(75, 74, 77, 1);
        opacity: 1;
        border-radius: 5px;
        margin-left: 0.15rem;
        padding: 0px 0.1rem;
        span {
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 17px;
          color: rgba(255, 255, 255, 1);
          opacity: 0.4;
        }
      }
    }
    .right {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      text-align: right;
      margin-bottom: 0.15rem;
      align-items: center;
      img {
        order: 1;
        margin-right: 0.23rem;
        border-radius: 50%;
        width: 0.3rem;
        height: 0.3rem;
      }
      div {
        padding: 0px 0.1rem;
        height: 0.24rem;
        background: rgba(235, 196, 152, 1);
        border: 0px solid rgba(245, 219, 189, 1);
        opacity: 1;
        border-radius: 5px;
        margin-right: 0.15rem;
        span {
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 17px;
          color: rgba(118, 90, 61, 1);
          opacity: 1;
        }
      }
    }
  }
  .chat_foot {
    height: 1.43rem;
    .oprtion {
      height: 0.34rem;
      background: rgba(33, 33, 33, 1);
      opacity: 1;
      cursor: pointer;
      img {
        margin-left: 0.15rem;
        margin-top: 0.04rem;
      }
      span {
        float: right;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        opacity: 0.7;
        font-size: 0.18rem;
        margin-right: 0.19rem;
        line-height: 0.34rem;
      }
      .span1 {
        margin-left: 0.2rem;
        margin-top: 0.04rem;
        line-height: 0.34rem;
        font-size: 0.18rem;
        color: rgba(255, 255, 255, 1);
      }
    }
    textarea {
      width: 100%;
      height: 1rem;
      background: black;
      border-color: rgba(33, 33, 33, 1);
      opacity: 0.7;
    }
    textarea:focus {
      outline: none;
    }
  }
}
.speak {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  img:nth-child(1) {
    width: 3.78rem;
    height: 3.79rem;
  }
  img:nth-child(2) {
    position: absolute;
    width: 2rem;
    height: 1.06rem;
    top: 2rem;
  }
  img:nth-child(3) {
    width: 1.56rem;
    height: 0.61rem;
    top: 1.75rem;
  }
}
.recorde {
  position: absolute;
  font-size: 0.2px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 28px;
  color: rgba(255, 255, 255, 1);
  opacity: 1;
  top: 1.6rem;
}
.oprtion_icon {
  display: inline-block;
  display: flex;
  flex-direction: column;
  float: right;
  justify-content: space-around;
  margin-top: 0.28rem;
  margin-right: 0.28rem;
  img {
    width: 0.3rem;
    height: 0.3rem;
    cursor: pointer;
    margin-bottom: 0.19rem;
  }
}
.play_keyframes {
  animation-duration: 0.5s;
  animation: rotate 6s linear infinite;
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
