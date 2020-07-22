<template>
  <div class="uavHistory">
    <!-- <Spin size="large" fix v-if="spinShow"></Spin> -->
    <!-- 飞行记录 -->
    <div class="bg F_recorders">
      <Row style="margin-top:0.33rem">
        <Col span="24" offset="3" class="typeChoose">
          <span @click="typaChange(1)" :class="[listType == 1 ?'active_li':'']">无人机</span>
          <span @click="typaChange(2)" :class="[listType == 2 ?'active_li':'']">直升机</span>
          <span @click="typaChange(3)" :class="[listType == 3 ?'active_li':'']">GPS</span>
        </Col>
        <Col span="24">
          <p class="h1">飞行记录</p>
          <div class="currentTitle" v-if="admin">
            <span>
              当前工程记录 > 一级工程:
              <strong style="color:#2d8cf0;">{{pm_info.pm_name}}</strong>
              <span v-if="pm_id">> 所属团队</span>
              <Select
                v-if="pm_id"
                v-model="team_id"
                @on-change="toSwitch1(pm_id,team_id)"
                @on-clear="clearTeam"
                size="small"
                style="width:200px;"
                clearable
              >
                <Option
                  v-for="(item ,index) in teamLists"
                  :key="index"
                  :value="item.team_id"
                >{{ item.team_name }}</Option>
              </Select>
              <span v-if="team_id">> 团队成员</span>
              <Select
                v-if="team_id"
                v-model="user_id"
                @on-change="toSwitch2(pm_id,team_id,user_id)"
                size="small"
                style="width:200px;"
                clearable
              >
                <Option
                  v-for="(item ,index) in userLists"
                  :key="index"
                  :value="item.user_id"
                >{{ item.name }}</Option>
              </Select>
            </span>
          </div>
          <div class="currentTitle" v-else>
            <span>当前工程记录 > 一级工程</span>
            <Select
              v-model="pm_id"
              @on-change="getProinfo(pm_id,'index')"
              size="small"
              style="width:200px;"
            >
              <Option
                v-for="(item ,index) in pro_list"
                :key="index"
                :value="item.pm_id"
              >{{ item.pm_name }}</Option>
            </Select>
            <span v-if="pm_id">> 所属团队</span>
            <Select
              v-if="pm_id"
              v-model="team_id"
              @on-change="toSwitch1(pm_id,team_id)"
              @on-clear="clearTeam"
              size="small"
              style="width:200px;"
              clearable
            >
              <Option
                v-for="(item ,index) in teamLists"
                :key="index"
                :value="item.team_id"
              >{{ item.team_name }}</Option>
            </Select>
            <span v-if="team_id">> 团队成员</span>
            <Select
              v-if="team_id"
              v-model="user_id"
              @on-change="toSwitch2(pm_id,team_id,user_id)"
              size="small"
              style="width:200px;"
              clearable
            >
              <Option
                v-for="(item ,index) in userLists"
                :key="index"
                :value="item.user_id"
              >{{ item.name }}</Option>
            </Select>
          </div>
        </Col>
      </Row>
      <div v-if="admin" class="admin">
        <!--  工管 -->
        <Row style="margin-top:0.2rem">
          <Col span="24">
            <!-- @mouseenter.native="getTeamList(pm_info.pm_id,1)" -->
            <Dropdown>
              <Button @click="getProinfo(pm_info,index)" type="primary">{{pm_info.pm_name}}</Button>
              <!-- <DropdownMenu slot="list">
                <Dropdown placement="right-start" v-for="(value,key1) in teamLists" :key="key1">
                  <DropdownItem
                    @click.native="toSwitch1(pm_info.pm_id,value.team_id)"
                    @mouseenter.native="getTeamList(value.team_id,2,pm_info.pm_id)"
                  >{{value.team_name}}</DropdownItem>
                  <DropdownMenu slot="list">
                    <DropdownItem
                      @click.native="toSwitch2(pm_info.pm_id,value.team_id,val.user_id)"
                      v-for="(val,key) in userLists"
                      :key="key"
                    >{{val.name}}</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </DropdownMenu>-->
            </Dropdown>
          </Col>
        </Row>
        <Row style="margin-top:0.14rem">
          <Col span="5">
            <p class="h3">建立时间：{{pm_info.start_time}}</p>
          </Col>
          <Col span="5">
            <p class="h3">区域：{{pm_info.areaName}}</p>
          </Col>
          <!-- <Col span="5">
            <p class="h3">项目类型：</p>
          </!-->
          <Col span="5">
            <p class="h3">负责人：{{pm_info.pm_administrator}}</p>
          </Col>
        </Row>
      </div>
      <div class="superadmin" v-else>
        <div :class="['panel_one',openName=='收起'?'open_panel':'']" style=" margin-top: 0.18rem;">
          <Dropdown v-for="(item ,index) in pro_list" :key="index">
            <!-- @mouseenter.native="getTeamList(item.pm_id,1)" -->
            <Button
              @click="getProinfo(item,index)"
              :class="['btn',index == activeIndex?'blue_btn':'white_btn']"
            >{{item.pm_name}}</Button>
            <!-- <DropdownMenu slot="list">
              <Dropdown placement="right-start" v-for="(value,key1) in teamLists" :key="key1">
                <DropdownItem
                  @click.native="toSwitch1(item.pm_id,value.team_id)"
                  @mouseenter.native="getTeamList(value.team_id,2,item.pm_id)"
                >{{value.team_name}}</DropdownItem>
                <DropdownMenu slot="list">
                  <DropdownItem
                    @click.native="toSwitch2(item.pm_id,value.team_id,val.user_id)"
                    v-for="(val,key) in userLists"
                    :key="key"
                  >{{val.name}}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </DropdownMenu>-->
          </Dropdown>
        </div>
        <p @click="open">{{openName}}</p>
      </div>
      <!-- 超管 -->
    </div>
    <!-- 图表-->
    <div class="search" v-show="listType<=2">
      <label for>日期：</label>
      <DatePicker
        type="daterange"
        show-week-numbers
        placement="bottom-end"
        placeholder="请选择查看时间段"
        style="width: 200px"
        v-model="currentDate"
        @on-change="currentChange"
      ></DatePicker>
      <label for :style="{color:!currentTime?'red':'#515a6e'}">本月</label>
      <i-switch v-model="currentTime" @on-change="changeTime" />
      <label for :style="{color:currentTime?'red':'#515a6e'}">本年</label>
    </div>
    <div style="clear:both;"></div>
    <!-- <div class="F_echarts">
      <div class="bg F_left" id="F_left"></div>
      <div class="bg F_content" id="F_content"></div>
      <div class="bg F_right" id="F_right"></div>
    </div>-->
    <Row type="flex" justify="center" v-show="listType==1">
      <Col :span="7">
        <div class="bg F_flex" id="F_left"></div>
      </Col>
      <Col :span="7" offset="1">
        <div class="bg F_flex" id="F_content"></div>
      </Col>
      <Col :span="7" :offset="1">
        <div class="bg F_flex" id="F_right"></div>
      </Col>
    </Row>
    <Row type="flex" justify="center" v-show="listType==2">
      <Col :span="11">
        <div class="bg F_flex" id="t_left"></div>
      </Col>
      <Col :span="11" offset="1">
        <div class="bg F_flex" id="t_content"></div>
      </Col>
      <Col :span="11">
        <div class="bg F_flex" id="t_right"></div>
      </Col>
      <Col :span="11" offset="1">
        <div class="bg F_flex" id="t_right1"></div>
      </Col>
    </Row>
    <Row type="flex" justify="center" v-show="listType==3" style="margin-top:0.3rem">
      <Col :span="24">
        <GPSlist></GPSlist>
      </Col>
    </Row>
    <!-- 表格 -->
    <div class="bg Table_content">
      <div class="border_left pro_name">轨迹回放列表</div>
      <!-- <div style="float:right">
        <Form :model="formItem" :label-width="80" class="form" :rules="ruleValidate" ref="form">
          <Row>
            <Col span="10">
              <FormItem label="飞手姓名：" prop="name">
                <Input size="small" v-model="formItem.name" placeholder="飞手姓名" style="width:200px;"></Input>
              </FormItem>
            </Col>
            <Col offset="4" span="4">
              <FormItem>
                <i-button size="small" type="primary" @click="serch('form')">查询</i-button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>-->
      <div class="ul_table" style="margin-top:20px;">
        <ul v-if="admin">
          <li
            @click="ChangeTableData(index)"
            v-for="(item,index) in  list "
            :key="index"
            :class="[listIndex == index ?'active_li':'']"
          >{{item}}</li>
          <li>
            <Button type="primary" @click="exportData()">导出</Button>
          </li>
        </ul>
      </div>
      <div style="clear:both;"></div>
      <Table
        :loading="loading"
        :row-class-name="rowClassName"
        :columns="admin?column:column.slice(0,7)"
        :data="Tabledata"
        class="Task_table"
        height="460"
        size="small"
        ref="table"
      >
        <template slot-scope="{ row }" slot="track">
          <img
            src="../../../static/publicimg/play.png"
            alt="播放"
            title="我要播放你"
            @click="play(row)"
            class="img"
          />
        </template>
        <template slot-scope="{ row }" slot="action" v-if="admin">
          <!-- 当点击已删除轨迹列表时显示两个操作按钮 -->
          <img
            v-if="listIndex==1"
            src="../../../static/publicimg/recovey.png"
            alt="恢复"
            title="我要恢复你"
            @click="handelete(row,0)"
            class="img"
          />
          <img
            v-if="listIndex==1"
            src="../../../static/publicimg/delete.png"
            alt="删除"
            title="删除后不可恢复"
            @click="handeletes(row)"
            class="img"
          />
          <img
            v-else
            src="../../../static/publicimg/delete.png"
            alt="删除"
            title="我要删除你"
            @click="handelete(row,1)"
            class="img"
          />
        </template>
      </Table>
      <Page class="page" show-total :total="total" @on-change="changePage"></Page>
    </div>
    <Modal v-model="uavHisModal" fullscreen title="轨迹回放">
      <UavHisPlay :hisId="hisId"></UavHisPlay>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
const echarts = require("echarts");
import UavHisPlay from "./uavHisPlay";
import GPSlist from "../GPSmanagement/GPSlist";
export default {
  data() {
    return {
      listType: 1,
      mychart1: null,
      mychart: null,
      mycharts: null,
      start_time: "",
      end_time: "",
      currentTime: false,
      currentDate: [],
      hisId: "",
      uavHisModal: false,
      formItem: {}, // 查询的form表单
      ruleValidate: {},
      // spinShow: true, // 加载动画
      list: ["轨迹列表", "已删除列表"],
      pm_id: 0, // 工程管理员需要一个id
      trackurl: ["/admin/track/trackListsNew", "admin/track/trackDeleteList"], // 超管切换轨迹列表的url 轨迹回放列表和已删除列表
      listIndex: 0, // 切换 轨迹列表和已删除列表默认索引
      admin: true, // false  -超管登录页面  改为true  显示工管页面
      pm_info: {}, // 工管显示的工程信息对象
      openName: "展开",
      trackData: {}, // 轨迹统计的数据
      pro_list: [],
      activeIndex: 0, // 超管 工程按钮默认高亮索引
      Tabledata: [],
      column: [
        {
          title: "机型",
          key: "DRONEMODEL",
          align: "center"
        },
        {
          title: "飞手",
          key: "name",
          align: "center"
        },
        {
          title: "序列号",
          key: "DRONETYPE",
          align: "center"
        },
        {
          title: "完成时间",
          key: "end_time",
          align: "center"
        },
        {
          title: "最大高度/h",
          key: "max_height",
          align: "center"
        },
        {
          title: "飞行时长/s",
          key: "fly_time",
          align: "center"
        },
        {
          title: "轨迹回放",
          slot: "track",
          align: "center"
        },
        {
          title: "操作",
          slot: "action",
          align: "center"
        }
      ],
      option1: {
        title: {
          left: "left",
          text: "飞行总次数",
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {},
        xAxis: {
          name: "时间(min/s)",
          nameLocation: "center",
          nameTextStyle: {
            color: "#2C8CF0",
            fontSize: "12px",
            lineHeight: 36
          },
          axisLabel: {
            color: "#2C8CF0"
          },
          type: "category",
          data: []
        },
        yAxis: {
          type: "value",
          nameTextStyle: {
            color: "#2C8CF0"
          },
          axisLabel: {
            color: "#2C8CF0"
          }
        },
        series: [
          {
            name: "飞行次数",
            data: [],
            type: "line",
            color: "#2C8CF0",
            smooth: true
          }
        ]
      },
      option: {
        title: {
          left: "left",
          text: "飞行总时间",
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {},
        xAxis: {
          name: "时间(min/s)",
          nameLocation: "center",
          nameTextStyle: {
            color: "#2C8CF0",
            fontSize: "12px",
            lineHeight: 36
          },
          axisLabel: {
            color: "#2C8CF0"
          },
          data: []
        },
        yAxis: {
          nameTextStyle: {
            color: "#2C8CF0"
          },
          axisLabel: {
            color: "#2C8CF0"
          }
        },
        series: [
          {
            name: "飞行时间",
            type: "line",
            smooth: true,
            data: [],
            barWidth: 11 + "rem",
            color: "#2C8CF0"
          }
        ]
      },
      options: {
        tooltip: {
          //提示框，可以在全局也可以在
          trigger: "item", //提示框的样式
          formatter: "{a} <br/>{b}: {c} ({d}%)",
          color: "#000", //提示框的背景色
          textStyle: {
            //提示的字体样式
            color: "black"
          }
        },
        legend: {
          //图例
          orient: "vertical", //图例的布局，竖直    horizontal为水平
          x: "left", //图例显示在右边
          data: [
            "0-5min/s",
            "5-10min/s",
            "10-15min/s",
            "15-20min/s",
            "20+min/s"
          ],
          textStyle: {
            //图例文字的样式
            color: "#535455", //文字颜色
            fontSize: 12, //文字大小
            left: "30px"
          }
        },
        series: [
          {
            name: "",
            type: "pie", //环形图的type和饼图相同
            radius: ["50%", "70%"], //饼图的半径，第一个为内半径，第二个为外半径
            avoidLabelOverlap: false,
            color: ["#3580FF", "#5394FF", "#84BEFD", "#BBD9FF", "#E4F0FE"],
            label: {
              normal: {
                //正常的样式
                show: false,
                position: "center"
              },
              emphasis: {
                //选中时候的样式
                show: true,
                textStyle: {
                  fontSize: "20",
                  fontWeight: "bold"
                }
              }
            }, //提示文字
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 335, name: "0-5min/s" },
              { value: 310, name: "5-10min/s" },
              { value: 234, name: "10-15min/s" },
              { value: 135, name: "15-20min/s" },
              { value: 1548, name: "20+min/s" }
            ]
          }
        ]
      },
      total: 0,
      page: 1,
      loading: false,
      team_id: "",
      user_id: "",
      teamLists: [],
      userLists: [],
      zsjMsg: null,
      zsjMsg1: null,
      zsjMsg2: null,
      zsjMsg3: null
    };
  },
  methods: {
    // 数据导出
    exportData() {
      this.$refs.table.exportCsv({
        filename: this.listIndex == 1 ? "已删除列表数据" : "轨迹列表数据"
      });
    },
    typaChange(val) {
      this.listType = val;
      if (val == 2) {
        setTimeout(() => {
          this.getTrackAllTimeData();
        }, 1000);
      } else {
        setTimeout(() => {
          this.getTrackList();
        }, 1000);
      }
    },
    //团队列表
    getTeamList(id, index, preId) {
      let param = {};
      if (index == 1) {
        param = {
          pm_first_id: id
        };
      } else {
        param = {
          team_id: id,
          pm_first_id: preId
        };
      }
      this.$post("/admin/uav_user_team/teamList", param).then(res => {
        if (res.code != 1) {
          return this.$Message.error(res.msg_customer);
        } else {
          if (index == 1) {
            if (res.data) {
              this.teamLists = res.data;
            } else {
              this.teamLists = [];
            }
          } else {
            if (res.data) {
              this.userLists = res.data;
            } else {
              this.userLists = [];
            }
          }
        }
      });
    },
    //选择日期
    currentChange(val) {
      if (val[0] && val[1]) {
        this.start_time = val[0];
        this.end_time = val[1];
        this.getTrackList();
      } else {
        this.changeTime(this.currentTime);
      }
    },
    //选择本月或本年
    changeTime(val) {
      if (val) {
        this.start_time = this.$zxh_fun.getYear();
        this.end_time = this.$zxh_fun.getToday();
      } else {
        this.end_time = this.$zxh_fun.getToday();
        this.start_time = this.$zxh_fun.getMonth();
      }
      this.getTrackList();
    },
    open() {
      this.openName = this.openName == "展开" ? "收起" : "展开";
    },
    ChangeTableData(index) {
      // 在角色是 工管时改变列表数据
      this.listIndex = index;
      // 重新获取请求
      let dex = index;
      this.page = 1;
      this.getTrackList({ dex: dex }); // 0 轨迹列表 1 已删除列表
    },
    play(row, index) {
      this.hisId = row.id;
      this.uavHisModal = true;
    },
    rowClassName(row, index) {
      return "line_height_row";
    },
    //点击一级工程
    getProinfo(item, index) {
      if (index == "index") {
        this.pro_list.forEach((ele, index) => {
          if (ele.pm_id == item) {
            this.activeIndex = index;
            this.pm_id = ele.pm_id;
          }
        });
        this.getTeamList(item, 1);
      } else {
        this.activeIndex = index;
        this.pm_id = item.pm_id;
        this.getTeamList(item.pm_id, 1);
      }
      this.team_id = "";
      this.user_id = "";
      this.getTrackList();
    },
    //清空团队的值
    clearTeam() {
      this.user_id = "";
    },
    //点击一级工程下面的团队
    toSwitch1(pm_id, team_id) {
      this.pm_id = pm_id;
      this.team_id = team_id;
      this.user_id = "";
      this.getTrackList();
      this.getTeamList(team_id, 2, pm_id);
    },
    //点击团队下面的用户
    toSwitch2(pm_id, team_id, user_id) {
      this.pm_id = pm_id;
      this.team_id = team_id;
      this.user_id = user_id;
      this.getTrackList();
    },
    getTrackList({
      page = this.page,
      limit = 10,
      pm_first_id = this.pm_id,
      team_id = this.team_id,
      user_id = this.user_id,
      dex = 0,
      name = this.formItem.name,
      start_time = this.start_time,
      end_time = this.end_time
    } = {}) {
      // 获取 0 轨迹回放列表信息 和  1 -已删除列表信息
      // this.spinShow = true;
      this.loading = true;
      this.$post(this.trackurl[dex], {
        page: page,
        limit: limit,
        pm_first_id: pm_first_id,
        name: name,
        team_id: team_id,
        user_id: user_id,
        start_time: start_time,
        end_time: end_time
      })
        .then(res => {
          if (res.code != 1) {
            return this.$Message.error(res.msg_customer);
          } else {
            this.Tabledata = res.data.data;
            this.total = res.data.total;
            this.getTrackData(); //获取轨迹数据统计信息
            this.getTrackAllTimeData();
            this.getTrackAllNumberData();
          }
          this.loading = false;
        })
        .catch(error => {
          // this.spinShow = false;
          this.Tabledata = [];
        });
    },
    // 统计-飞行总时间
    getTrackAllTimeData() {
      if (this.listType == 1) {
        this.option = null;
        this.option = {
          title: {
            left: "left",
            text: "飞行总时间",
            textStyle: {
              fontSize: 14
            }
          },
          tooltip: {},
          xAxis: {
            name: "时间(min/s)",
            nameLocation: "center",
            nameTextStyle: {
              color: "#2C8CF0",
              fontSize: "12px",
              lineHeight: 36
            },
            axisLabel: {
              color: "#2C8CF0"
            },
            data: []
          },
          yAxis: {
            nameTextStyle: {
              color: "#2C8CF0"
            },
            axisLabel: {
              color: "#2C8CF0"
            }
          },
          series: [
            {
              name: "飞行时间",
              type: "line",
              smooth: true,
              data: [],
              barWidth: 11 + "rem",
              color: "#2C8CF0"
            }
          ]
        };
        this.$post("/base/data_count/trackAllTimeCount", {
          client: "web",
          pm_first_id: this.pm_id,
          team_id: this.team_id,
          start_time: this.start_time,
          end_time: this.end_time,
          user_id: this.user_id
        }).then(res => {
          if (res.code != 1) {
            return this.$Message.error(res.msg_customer);
          } else {
            let trackData = res.data;
            let number = 0;
            if (trackData) {
              this.option.series[0].data = [];
              this.option.xAxis.data = [];
              trackData.forEach(ele => {
                this.option.series[0].data.push(ele.day_time);
                this.option.xAxis.data.push(ele.special_time);
                number += Number(ele.day_time);
              });
              this.option.title.text = "飞行总时间：" + number;
            } else {
              this.option.series[0].data = [];
              this.option.xAxis.data = [];
              number = 0;
              this.option.title.text = "飞行总时间：" + number;
            }
            this.mychart = echarts.init(document.getElementById("F_content"));
            this.mychart.clear();
            this.mychart.setOption(this.option);
          }
        });
      } else {
        this.zsjInfo();
      }
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
      this.option = {
        title: {
          text: "直升机数据统计"
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
        xAxis: [
          {
            type: "category",
            data: type
          }
        ],
        yAxis: [
          {
            type: "value"
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
      let option1 = {
        title: {
          text: "机型K-32 机号7811",
          textStyle: {
            fontSize: 14
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
          right: "1%"
        },
        xAxis: {
          type: "category",
          data: [
            "2020-02-21",
            "2020-02-22",
            "2020-02-23",
            "2020-02-24",
            "2020-02-25"
          ],
          axisLabel: {
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
          }
        },
        yAxis: {
          name: "时间（min/s）",
          type: "value"
        },
        series: [
          {
            name: "飞行时长",
            data: [0, 320, 0, 0, 140],
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
            fontSize: 14
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
          right: "1%"
        },
        xAxis: {
          type: "category",
          data: [
            "2020-02-21",
            "2020-02-22",
            "2020-02-23",
            "2020-02-24",
            "2020-02-25"
          ],
          axisLabel: {
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
          }
        },
        yAxis: {
          name: "时间（min/s）",
          type: "value"
        },
        series: [
          {
            name: "飞行时长",
            data: [140, 240, 80, 0, 50],
            type: "line"
          }
        ]
      };
      let option3 = {
        title: {
          text: "机型K-32 机号7811历史飞行总时长",
          textStyle: {
            fontSize: 14
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
            fontSize: 14
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
          //机型K-32 机号7811
          let option1_data = response.data["7811"].fly_time_of_five;
          // console.log(option1_data)
          let report_date1 = [];
          let fly_time1 = [];
          option1_data.forEach((ele, index) => {
            report_date1.push(ele.report_date);
            fly_time1.push(ele.fly_time_count);
          });
          option1.xAxis.data = report_date1;
          option1.series[0].data = fly_time1;

          //机型H-125 机号70RH
          let data = response.data["70RH"].fly_time_of_five;
          // console.log("接口數據", response.data);
          let report_date2 = [];
          let fly_time2 = [];
          data.forEach((ele, index) => {
            report_date2.push(ele.report_date);
            fly_time2.push(ele.fly_time_count);
          });
          option2.xAxis.data = report_date2;
          option2.series[0].data = fly_time2;

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
          this.zsjMsg = echarts.init(document.getElementById("t_right1"));
          this.zsjMsg.clear();
          this.zsjMsg.setOption(option4);
          this.zsjMsg1 = echarts.init(document.getElementById("t_content"));
          this.zsjMsg1.clear();
          this.zsjMsg1.setOption(option1);
          this.zsjMsg2 = echarts.init(document.getElementById("t_left"));
          this.zsjMsg2.clear();
          this.zsjMsg2.setOption(option2);
          this.zsjMsg3 = echarts.init(document.getElementById("t_right"));
          this.zsjMsg3.clear();
          this.zsjMsg3.setOption(option3);
        } else {
          this.$Message.error(response.msg_customer);
        }
      });
    },
    // 统计-飞行总次数
    getTrackAllNumberData() {
      if (this.listType == 2) {
        return;
      }
      this.$post("/base/data_count/trackAllNumberCount", {
        client: "web",
        pm_first_id: this.pm_id,
        team_id: this.team_id,
        start_time: this.start_time,
        end_time: this.end_time,
        user_id: this.user_id
      }).then(res => {
        if (res.code != 1) {
          return this.$Message.error(res.msg_customer);
        } else {
          let trackData = res.data;
          let number = 0;
          if (trackData) {
            this.option1.series[0].data = [];
            this.option1.xAxis.data = [];
            trackData.forEach(ele => {
              this.option1.series[0].data.push(ele.fly_number);
              this.option1.xAxis.data.push(ele.special_time);
              number += Number(ele.fly_number);
            });
            this.option1.title.text = "飞行总次数：" + number;
          } else {
            number = 0;
            this.option1.title.text = "飞行总次数：" + number;
            this.option1.series[0].data = [];
            this.option1.xAxis.data = [];
          }
          this.mychart1 = echarts.init(document.getElementById("F_left"));
          this.mychart1.clear();
          this.mychart1.setOption(this.option1);
        }
      });
    },
    //分页
    changePage(val) {
      this.page = val;
      this.getTrackList();
    },
    handeletes(row) {
      // 物理删除后不可恢复
      let track_id = row.id;
      this.$Modal.confirm({
        title: "系统提示",
        content: "删除后,该轨迹不可恢复,是否继续?",
        onCancel: () => {
          this.$Message.info("点击了取消");
        },
        onOk: () => {
          this.$post("/admin/track/trackRealDelete", {
            track_id: track_id
          }).then(res => {
            if (res.code != 1) {
              return this.$Message.error(res.msg_customer);
            } else {
              this.$Message.success(res.msg_customer);
              setTimeout(() => {
                this.getTrackList({ dex: 1 }); //dex 代表请求的是已删除的轨迹列表
              }, 10);
            }
          });
        }
      });
    },
    handelete(row, is_delete) {
      let track_id = row.id;
      this.$post("/admin/track/trackSoftChange", {
        track_id: track_id,
        is_delete: is_delete
      }).then(res => {
        if (res.code != 1) {
          return this.$Message.error(res.msg_customer);
        } else {
          this.$Message.success(res.msg_customer);
          setTimeout(() => {
            let dex = is_delete == 0 ? 1 : 0;
            this.getTrackList({ dex: dex });
          }, 10);
        }
      });
    },
    // 统计-时间区间表统计
    getTrackData() {
      if (this.listType == 2) {
        return;
      }
      this.$post("/base/data_count/trackTestCount", {
        client: "web",
        pm_first_id: this.pm_id,
        team_id: this.team_id,
        start_time: this.start_time,
        end_time: this.end_time,
        user_id: this.user_id
      }).then(res => {
        if (res.code != 1) {
          return this.$Message.error(res.msg_customer);
        } else {
          if (res.data) {
            this.trackData = res.data;
            this.options.series[0].data.map((item, index) => {
              item.value = this.trackData.time_stage_fly_time[index];
            });
            this.mycharts = echarts.init(document.getElementById("F_right"));
            this.mycharts.clear();
            this.mycharts.setOption(this.options);
          } else {
          }
        }
      });
    },
    serch() {
      this.getTrackList({
        name: this.formItem.name
      });
    }
  },
  components: {
    UavHisPlay,
    GPSlist
  },
  mounted() {
    this.end_time = this.$zxh_fun.getToday();
    this.start_time = this.$zxh_fun.getMonth();
    if (this.admin) {
      // 工管和超管调用不同接口在此判断
      //
      this.$publicdata.getPmData(this.pm_id).then(res => {
        // 获取工管登录用户绑定的工程信息 公共接口
        this.pm_info = res;
        this.$publicdata.getAreaName(this.pm_info.region).then(res => {
          this.pm_info.areaName = res[0].name;
        });
        this.getTrackList(); //获取轨迹回放列表信息  异步请求等获取完工程信息后再进行请求
        this.getTeamList(this.pm_id, 1);
      });
    } else {
      this.$post("/base/data_count/firstPmList", {
        client: "web"
      })
        .then(res => {
          if (res.code == 1) {
            this.pro_list = res.data;
            this.pm_id = this.pro_list[0].pm_id; // 默认取值一个工程id
            this.getTrackList(); //获取轨迹回放列表信息
            this.getTeamList(this.pm_id, 1);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    let user_info = this.$publicdata.CheckuserLogin(); // 验证用户是否登录,公共接口
    this.pm_id = user_info.pm_id ? user_info.pm_id : null; // 判断pm_id
    user_info.type == 0 ? (this.admin = false) : (this.admin = true); //等于0为超管  等于 1 为工管
  },
  watch: {
    pm_id(newval, oldval) {
      if (newval) {
      }
    }
  }
};
</script>

<style lang="less" scoped>
.typeChoose {
  span {
    font-size: 18px;
    margin-right: 10px;
    cursor: pointer;
  }
}
.uavHistory {
  margin-top: 0.15rem;
  background-color: #fbfbfb;
  border-radius: 6px;
}
.border_left {
  border-left: solid 2px rgba(44, 140, 240, 1);
  padding-left: 0.1rem;
}
.bule_color {
  color: #2c8cf0;
  font-size: 0.24rem;
  margin-top: 0.25rem;
}
.btn {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 1;
  border-radius: 6px;
  color: white;
}
.bule_btn {
  background: rgba(44, 140, 240, 1);
  font-size: 0.18rem;
}
.white_btn {
  border: 1px solid rgba(198, 209, 227, 1);
  color: #010037;
  font-size: 0.18rem;
}
.bg_bule {
  padding: 0.05rem 0.1rem;
  background: rgba(44, 140, 240, 0.15);
  border-radius: 4px;
  margin: 0.12rem;
}

.pro_name {
  height: 0.22rem;
  font-size: 0.16rem;
  font-family: PingFang SC;
  font-weight: 500;
  line-height: 0.22rem;
  color: rgba(64, 64, 64, 1);
  opacity: 1;
}
.bg {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 12px rgba(1, 0, 55, 0.15);
  opacity: 1;
  border-radius: 0.2rem;
  margin-top: 10px;
}
.h1 {
  width: 100px;
  height: 0.54rem;
  font-size: 0.3rem;
  line-height: 0.54rem;
  display: inline-block;
}
.currentTitle {
  display: inline-block;
  line-height: 0.54rem;
  height: 0.54rem;
  text-indent: 4em;
}
.h2 {
  height: 0.25rem;
  font-size: 0.18rem;
  line-height: 0.25rem;
}
.h3 {
  font-family: PingFang SC;
  font-weight: 500;
  height: 0.2rem;
  font-size: 0.14rem;
  line-height: 0.2rem;
}
.F_recorders {
  height: auto;
  padding-left: 0.43rem;
  // overflow: hidden;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(1, 0, 55, 1);
  opacity: 1;
}
.admin {
  height: 1rem;
}
.F_flex {
  height: 3.1rem;
  width: 100%;
}
.superadmin {
  position: relative;
  p {
    position: absolute;
    color: #2c8cf0;
    top: 10px;
    right: 20px;
    cursor: pointer;
  }
}
.panel_one {
  transition: all 0.3s linear;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(1.14rem, 1.45rem));
  grid-template-rows: 0.56rem;
  grid-auto-rows: 0.56rem;
  grid-column-gap: 1rem;
  grid-row-gap: 0.4rem;
  height: 0.8rem;
  padding-bottom: 0.1rem;
  overflow: hidden;
  width: 95%;
  .ivu-btn {
    padding: 4px;
    width: 95%;
  }
  .ivu-btn:hover {
    color: white;
    background: rgba(44, 140, 240, 1);
  }
  .panelBtn {
    position: relative;
  }
  .teamStyle {
    position: absolute;
    left: 95%;
    top: 0px;
    border: 1px solid #ccc;
    z-index: 9999999999999;
    text-align: center;
    li {
      line-height: 20px;
    }
  }
}
.open_panel {
  transition: all 0.3s linear;
  height: auto;
}
.Table_content {
  margin-top: 0.3rem;
  padding: 0.25rem 0.35rem;
  /deep/ .ivu-table {
    height: auto;
  }
  .Task_table {
  }
}

.search {
  margin-top: 20px;
  margin-bottom: 10px;
  margin-right: 5px;
  float: right;
}

.ul_table {
  ul {
    width: 20%;
    display: flex;
    height: 0.4rem;
    margin: 0.5rem 0px;
    align-items: center;
  }
  li {
    cursor: pointer;
    line-height: 0.22rem;
    flex: 1 0 1rem;
    text-align: center;
    padding-bottom: 0.08rem;
    border-bottom: 2px solid white;
  }
}
.active_li {
  transition: all 0.3s linear;
  border-bottom: 2px solid #2c8cf0 !important;
  color: #2c8cf0;
}
</style>