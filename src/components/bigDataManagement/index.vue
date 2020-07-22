<template>
  <div class="bigData">
    <div class="title">
      <!-- <img src="/static/linkFly/bigdata.png" alt /> -->
      <span v-if="userInfo.type==1">{{userInfo.pm_name}}</span>
      <span v-else>无人机大数据智慧管家云平台</span>
      <img
        class="toMain"
        title="跳转到主界面"
        @click="toMain"
        src="/static/linkFly/toMain.png"
        alt
        srcset
      />
    </div>
    <div class="content clearfix">
      <div class="leftContent">
        <div class="live">
          <div class="titleStyle">
            <!-- <img src="/static/linkFly/shishizhibo.png" alt /> -->
            <span class="onlineUser">实时直播</span>
          </div>
          <Row class="publish">
            <Col span="12" class="livebox" v-for="(item,index) in 3" :key="'live'+index">
              <div
                v-if="userLiveLists.length>0&&userLiveLists[index]"
                :id="userLiveLists[index].uid"
              ></div>
            </Col>
          </Row>
        </div>
        <div class="map">
          <div>
            <img style="float:left;" src="/static/linkFly/view.png" alt />
            <img style="float:right;" src="/static/linkFly/view.png" alt />
            <div style="clear:both;"></div>
          </div>
          <MapComponent class="container" :userData="onlineLists" :isBigData="isBigData"></MapComponent>
        </div>
        <div style="clear:both;padding-bottom:10px;"></div>
        <div class="task">
          <Row>
            <Col span="12">
              <div class="titleStyle">
                <img src="/static/linkFly/renwu.png" alt />
              </div>
              <section class="box">
                <ul class="thead">
                  <li ref="li">
                    <p class="ellipsis">任务名称</p>
                    <p class="ellipsis">任务进度</p>
                    <p class="ellipsis">负责人</p>
                    <p class="ellipsis">操作时间</p>
                  </li>
                </ul>
                <div class="tbody" ref="tbody">
                  <ul class="tbodyInner">
                    <li v-for="(item, index) in taskData" :key="index">
                      <p class="ellipsis" :title="item.task_name">{{item.task_name}}</p>
                      <p class="ellipsis" :title="item.taskState">{{item.taskState}}</p>
                      <p class="ellipsis" :title="item.user_name">{{item.user_name}}</p>
                      <p class="ellipsis" :title="item.data_update_time">{{item.data_update_time}}</p>
                    </li>
                  </ul>
                </div>
              </section>
            </Col>
            <Col span="12">
              <div class="titleStyle">
                <img src="/static/linkFly/renwu2.png" alt />
                <Row class="renwu2">
                  <Col span="8">
                    <i-circle
                      :percent="release"
                      :size="60"
                      trail-color="#2D294A"
                      stroke-color="#b24753"
                    >
                      <span class="demo-Circle-inner" style="font-size:16px">{{release}}%</span>
                    </i-circle>
                    <p>
                      <span style="background-color: #b24753;"></span>发布中
                    </p>
                  </Col>
                  <Col span="8">
                    <i-circle
                      :percent="execution"
                      :size="60"
                      trail-color="#123555"
                      stroke-color="#0DA5B2"
                    >
                      <span class="demo-Circle-inner" style="font-size:16px">{{execution}}%</span>
                    </i-circle>
                    <p>
                      <span style="background-color: #0DA5B2;"></span>执行中
                    </p>
                  </Col>
                  <Col span="8">
                    <i-circle
                      :percent="to_be_released"
                      :size="60"
                      trail-color="#4A4629"
                      stroke-color="#4BA917"
                    >
                      <span class="demo-Circle-inner" style="font-size:16px">{{to_be_released}}%</span>
                    </i-circle>
                    <p>
                      <span style="background-color: #4BA917;"></span>待审核
                    </p>
                  </Col>
                  <Col span="8">
                    <i-circle
                      :percent="completed"
                      :size="60"
                      trail-color="#483229"
                      stroke-color="#476FB2"
                    >
                      <span class="demo-Circle-inner" style="font-size:16px">{{completed}}%</span>
                    </i-circle>
                    <p>
                      <span style="background-color: #476FB2;"></span>已完成
                    </p>
                  </Col>
                  <Col span="8">
                    <i-circle
                      :percent="expired"
                      :size="60"
                      trail-color="#5E5F19"
                      stroke-color="#740CB2"
                    >
                      <span class="demo-Circle-inner" style="font-size:16px">{{expired}}%</span>
                    </i-circle>
                    <p>
                      <span style="background-color: #740CB2;"></span>已过期
                    </p>
                  </Col>
                  <Col span="8">
                    <i-circle
                      :percent="rejected"
                      :size="60"
                      trail-color="#142960"
                      stroke-color="#AF901A"
                    >
                      <span class="demo-Circle-inner" style="font-size:16px">{{rejected}}%</span>
                    </i-circle>
                    <p>
                      <span style="background-color: #AF901A;"></span>已拒绝
                    </p>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
        <div class="user">
          <div class="titleStyle">
            <!-- <img src="/static/linkFly/yonghuxinxi.png" alt /> -->
            <span class="onlineUser">在线用户（{{onlineLists.length}}）人</span>
          </div>
          <div class="table">
            <table class="tableStyle" border="0" cellpadding="0" cellspacing="0">
              <tr class="trStyle">
                <td>用户名</td>
                <td>公司名称</td>
                <td>平台权限</td>
                <td>功能权限</td>
              </tr>
              <tr v-for="(item,index) in onlineLists" :key="'online'+index">
                <td>{{item.name}}</td>
                <td>{{item.company_name}}</td>
                <td>{{item.userType}}</td>
                <td>{{item.permissionLists}}</td>
              </tr>
            </table>
          </div>
        </div>
        <div style="clear:both;"></div>
      </div>
      <div class="rightContent">
        <div class="flyState">
          <div style="padding:10px 20px;">
            <Tabs value="name1">
              <TabPane label="无人机" name="name1">
                <div>
                  <img src="/static/linkFly/flyAllNumber.png" alt />
                  <div class="flyAllNumber" id="flyAllNumber"></div>
                  <img class="marginTop" src="/static/linkFly/flyAllTime.png" alt />
                  <div class="flyAllNumber" id="flyAllTime"></div>
                  <img class="marginTop" src="/static/linkFly/flyAllCount.png" alt />
                  <div class="flyAllNumber" id="flyAllCount"></div>
                </div>
              </TabPane>
              <TabPane label="直升机" name="name2">
                <div>
                  <!-- <div class="flyAllNumber" id="zsj"></div> -->
                  <div class="flyAllNumber" id="zsjAllNumber"></div>
                  <div class="flyAllNumber" id="zsjAllTime"></div>
                  <div class="flyAllNumber1" id="zsjAllCount1"></div>
                  <div class="flyAllNumber1" id="zsjAllCount2"></div>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
      <div style="clear:both;"></div>
    </div>
  </div>
</template>
<script src='./index.js'></script>
<style lang="less" scoped>
.bigData {
  width: 100vw;
  height: 100%;
  background: url("/static/linkFly/bg.png") no-repeat;
  background-size: cover;
  .titleStyle {
    margin: 20px 20px 0px 20px;
    .onlineUser {
      font-size: 15px;
      font-weight: bold;
      background-image: -webkit-linear-gradient(bottom, #32a3e1, #fff, #fff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .marginTop {
    margin-top: 20px;
  }
  .box {
    width: 100%;
    height: 23vh;
    padding: 10px;
    ul {
      font-size: 14px;
      li {
        display: flex;
        text-align: center;
        align-items: center;
        p {
          color: #76b6ff;
        }
        p:nth-child(1),
        p:nth-child(4),
        p:nth-child(2) {
          width: 28%;
        }
        p:nth-child(3) {
          width: 16%;
        }
      }
    }
    .thead {
      height: 13%;
      // height: 25%;
      border-bottom: 1px solid #fff;
      li {
        height: 100%;
      }
    }
    .tbody {
      height: 100%;
      overflow: hidden;
    }
    .tbodyInner {
      height: 100%;
      li {
        height: 20%;
        border-bottom: 1px solid #fff;
        border-top: none;
        padding: 0 2px;
        p {
          color: #fff;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          height: 50%;
          line-height: 100%;
        }
      }
    }
  }
  .tableStyle {
    color: #fff;
    width: 96%;
    text-align: left;
    margin: 0px 10px;
    padding: 0px 10px;
    .trStyle {
      color: #76b6ff;
      font-weight: bold;
    }
    td {
      border-bottom: 1px solid #6d6e6d;
      line-height: 30px;
    }
  }
  & > .title {
    background: url("/static/linkFly/datatitle.png") no-repeat -8px 0px;
    background-size: 100% 100%;
    text-align: center;
    span {
      font-size: 40px;
      line-height: 65px;
      color: #fff;
      letter-spacing: 4px;
      text-shadow: 2px 2px 2px #eee;
      margin: 0px 0px 10px 40px;
    }
    .toMain {
      float: right;
      margin-top: 20px;
      margin-right: 10px;
    }
  }
  & > .content {
    height: 90%;
    padding: 0px 20px;
    & > .leftContent {
      width: 74%;
      height: 100%;
      float: left;
      overflow-y: auto;
      & > .live {
        width: 15%;
        height: 60vh;
        float: left;
        background: url("/static/linkFly/biglive.png") no-repeat;
        background-size: 100% 100%;
        .publish {
          height: 100%;
        }
        .livebox {
          border: 1px solid #6d6e6d;
          width: 100%;
          height: 28%;
        }
      }
      & > .map {
        width: 84%;
        height: 60vh;
        float: right;
        .container {
          width: 100%;
          height: 96%;
          border: 1px solid #6d6e6d;
          border-radius: 10px;
          margin-top: 6px;
        }
      }
      & > .task {
        width: 60%;
        height: 30vh; //ysq修改61vh
        overflow-y: auto; //ysq修改
        float: left;
        background: url("/static/linkFly/bigtask.png") no-repeat;
        background-size: 100% 100%;
        .table {
          height: 33vh;
          overflow: hidden;
        }
        .renwu2 {
          .ivu-col {
            // margin-top: 40px;
            color: #fff;
            text-align: center;
            p span {
              display: inline-block;
              width: 10px;
              height: 10px;
              border-radius: 10px;
              margin-right: 6px;
            }
          }
        }
      }
      & > .user {
        width: 39%;
        height: 30vh; //ysq修改61vh
        overflow-y: auto; //ysq修改
        float: right;
        background: url("/static/linkFly/biguser.png") no-repeat;
        background-size: 100% 100%;
        .table {
          width: 100%;
          height: 80%;
          overflow: hidden;
        }
      }
    }
    & > .rightContent {
      width: 25%;
      height: 91vh; //ysq修改124vh
      overflow-y: auto; //ysq修改
      float: right;
      & > .flyState {
        width: 100%;
        // height: 123vh;
        height: 91vh;
        background: url("/static/linkFly/bigfly.png") no-repeat;
        background-size: 100% 100%;
        .flyAllNumber {
          width: 100%;
          // height: 32vh;
          height: 22vh;
        }
        .flyAllNumber1 {
          width: 100%;
          // height: 20vh;
          height: 18.5vh;
        }
      }
    }
  }
}
</style>