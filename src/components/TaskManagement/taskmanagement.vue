<template>
  <div class="TaskManagement">
    <div class="name">
      <span>任务管理</span>
      <i-button
        v-if="userType!=0"
        class="new_task_btn"
        size="small"
        type="success"
        style="margin-left:10px;"
        @click="addTask"
      >新建任务</i-button>
      <i-button
        v-if="userType!=0"
        class="new_task_btn"
        size="small"
        type="success"
        style="margin-left:10px;"
        @click="addKML"
      >添加KML</i-button>
      <Select
        size="small"
        v-model="secondPmId"
        placeholder="请选择二级工程"
        class="new_task_btn"
        @on-change="getTaskData"
        clearable
        style="width:200px"
      >
        <Option
          v-for="item in secondPmLists"
          :value="item.pm_id"
          :key="item.pm_id"
        >{{ item.pm_name }}</Option>
      </Select>
    </div>
    <div class="ul_table">
      <ul>
        <li
          @click="ChangeTableData(index)"
          v-for="(item,index) in  list "
          :key="index"
          :class="[listIndex == index ?'active_li':'']"
        >{{item}}</li>
      </ul>
    </div>
    <Table
      :row-class-name="rowClassName"
      height="460"
      size="small"
      :columns="column"
      :data="Tabledata"
      :loading="loading"
      class="Task_table"
    >
      <template slot-scope="{ row, index }" slot="action">
        <img
          src="../../../static/publicimg/chakan.png"
          alt="查看详情"
          title="我要查看你"
          @click="detailData(row,index)"
          class="img"
        />
        <img
          v-if="listIndex != 1 && listIndex  != 2 "
          src="../../../static/publicimg/delete.png"
          alt="删除"
          title="我要删除你"
          @click="deletTaskData(row)"
          class="img"
        />
      </template>
    </Table>
    <Page class="split_page" show-total :total="total" @on-change="changePage"></Page>
    <Modal
      v-model="showTask"
      class="Modal"
      mask-closable
      :loading="loading"
      @on-cancel="handleReset('formItem')"
    >
      <div>
        <img src="../../../static/publicimg/task.png" alt /> 新建任务
      </div>
      <Form :model="formItem" :label-width="80" class="form" :rules="ruleValidate" ref="formItem">
        <Row>
          <Col span="11">
            <FormItem label="任务名称" prop="name">
              <Input v-model="formItem.name" clearable placeholder="请输入任务名称"></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="任务类型" prop="task_type_id">
              <i-select v-model="formItem.task_type_id" clearable>
                <i-option
                  v-for="item in typeList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</i-option>
              </i-select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="任务区域" prop="regions">
              <Cascader
                filterable
                placeholder="请选择区域"
                v-model="formItem.regions"
                :data="regionArr"
                :load-data="loadData"
                @on-change="getregionArr"
                change-on-select
                clearable
              ></Cascader>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="结束时间" prop="end_time">
              <DatePicker
                type="date"
                format="yyyy-MM-dd"
                placeholder="请选择时间"
                @on-change="formItem.end_time=$event"
                v-model="formItem.end_time"
                clearable
                :options="options3"
              ></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22">
            <FormItem label="地理位置" prop="locationName">
              <Input
                clearable
                v-model="formItem.locationName"
                @on-focus="mapshow=true"
                placeholder="请点击弹出地图"
              ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="selectKmlShou">
          <Col span="22">
            <FormItem label="选择kml">
              <i-select v-model="formItem.kml_Id" clearable>
                <i-option v-for="item in kmlList" :value="item.id" :key="item.id">{{ item.name }}</i-option>
              </i-select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22">
            <FormItem label="任务内容">
              <Input
                clearable
                type="textarea"
                v-model="formItem.description"
                placeholder="请手动填写任务内容"
              ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22">
            <FormItem label="指派人" prop="user_ids">
              <i-select v-model="formItem.user_ids" multiple clearable>
                <i-option
                  v-for="item in userlist"
                  :value="item.user_id"
                  :key="item.name"
                >{{ item.name }}</i-option>
              </i-select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="21" class="addimg">
            <span>添加图片&emsp;</span>
            <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
              <template>
                <img :src="item" />
                <div class="demo-upload-list-cover">
                  <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                </div>
              </template>
            </div>
            <Upload
              ref="upload"
              :show-upload-list="false"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              :on-format-error="handleFormatError"
              :before-upload="handleBeforeUpload"
              multiple
              action
              type="drag"
              style="display: inline-block;width:58px;vertical-align:top;"
            >
              <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <!-- <Button @click="handleReset('formItem')">取消</Button> -->
        <Button type="primary" @click="submit('formItem')">确认</Button>
      </div>
    </Modal>
    <Modal v-model="mapshow" title="位置选择" width="600">
      <div class="map" v-if="mapshow">
        <ChooseMap @refreshList="siteSelection"></ChooseMap>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="detailModal" title="查看详情" width="678px">
      <div class="add_text">
        <Steps v-show="state==0" :current="0" style="width: 100%;">
          <step title="发布中"></step>
          <step title="执行中"></step>
          <step title="已完成"></step>
        </Steps>
        <Steps v-show="state==1" :current="1" style="width: 100%;">
          <step title="发布中"></step>
          <step title="执行中"></step>
          <step title="已完成"></step>
        </Steps>
        <Steps v-show="state==2" :current="2" style="width: 100%;">
          <step title="发布中"></step>
          <step title="执行中"></step>
          <step title="审核中"></step>
        </Steps>
        <Steps v-show="state==3" :current="2" style="width: 100%;">
          <step title="发布中"></step>
          <step title="执行中"></step>
          <step title="已完成"></step>
        </Steps>
        <div>
          <ul class="detailLists_li">
            <li style="display: block;width: 100%">
              <Divider>任务内容</Divider>
            </li>
            <li>任务名：{{detailLists.task_name}}</li>
            <li>发布人：{{detailLists.adder_name}}</li>
            <li>
              指派人：
              <span v-for="item in detailLists.user_name" :key="item.name">{{item.name}}，</span>
            </li>
            <li>创建时间：{{detailLists.data_create_time}}</li>
            <li>结束时间：{{detailLists.end_time}}</li>
            <li>
              地址：
              <Icon
                type="ios-pin-outline"
                color="red"
                size="18"
                @click="mapdisplay(detailLists.location,detailLists.location_type)"
              />
            </li>
            <li>区域：{{detailLists.region_name}}</li>
            <li>任务类型：{{detailLists.type_name}}</li>
            <li style="display: block;width: 100%">任务内容：{{detailLists.description}}</li>
            <li style="display: block;width: 100%">
              <template>
                <viewer :images="detailLists.release_images">
                  <img
                    style="width: 100%;width:120px;display: inline-block;height: 120px;overflow: hidden;margin-right:10px;border-radius:6px;"
                    :src="item.image_path"
                    v-for="(item,index) in detailLists.release_images"
                    :key="index"
                  />
                </viewer>
              </template>
            </li>
            <li v-if="state==2 ||state==3 " style="display: block;width: 100%">
              <Divider>上传数据内容</Divider>
            </li>
            <li style="display: block;width: 100%">上报内容：{{detailLists.accomplish_description}}</li>
            <li style="display: block;width: 100%">
              <template>
                <viewer :images="detailLists.accomplish_images">
                  <img
                    v-for="item in detailLists.accomplish_images"
                    style="width: 100%;width:120px;display: inline-block;height: 120px;overflow: hidden;margin-right:10px;border-radius:6px;"
                    :src="item.image_path"
                    :key="index"
                  />
                </viewer>
              </template>
            </li>
          </ul>
        </div>
      </div>
      <div slot="footer">
        <div v-show="state==2">
          <Button type="error" @click="audit(1)">审核驳回</Button>
          <i-button type="primary" @click="audit(2)">审核通过</i-button>
        </div>
      </div>
    </Modal>
    <Modal v-model="dialogShowMap" title="查看位置" width="600">
      <LookMap v-if="dialogShowMap" :map_point="map_point" :map_type="map_type"></LookMap>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="AddKML" title="添加KML" width="500">
      <Form ref="formLeftKML" :model="formLeftKML" :rules="ruleInlineKML" label-position="top">
        <FormItem label="KML名称" prop="KMLname">
          <Input v-model="formLeftKML.KMLname"></Input>
        </FormItem>
        <FormItem label="添加此KML描述" prop="KMLdescribe">
          <Input v-model="formLeftKML.KMLdescribe"></Input>
        </FormItem>
        <FormItem label="上传KML文件" prop="KMLfile">
          <Upload
            v-if="AddKmlShou"
            multiple
            :show-upload-list="false"
            :format="['kml']"
            :max-size="2048"
            :on-format-error="handleFormatErrorKML"
            :on-exceeded-size="handleMaxSize2"
            :before-upload="uploadBeforeKML"
            type="drag"
            action
          >
            <div style="padding: 20px 0" v-if>
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击或将文件拖动到这里进行上传</p>
            </div>
          </Upload>
          <div v-if="!AddKmlShou" style="display: flex;align-items: center">
            <!-- <div v-for="(item,index) in temp" :key="index"> -->
            <div>
              <i class="ivu-icon ivu-icon-md-document" style="font-size: 18px"></i>
              <span style="margin-right: 10px;font-size: 12px;">{{formLeftKML.KMLfile.name}}</span>
              <!-- <span style="margin-right: 10px;font-size: 12px;">{{item.name}}</span> -->
            </div>
            <i
              class="ivu-icon ivu-icon-ios-trash"
              @click="removeKML"
              style="font-size: 18px;color: red"
            ></i>
          </div>
        </FormItem>
      </Form>
      <div style="text-align:center" slot="footer">
        <Button
          type="info"
          :loading="modal_loading"
          @click="Upload_KML_ok"
          style="width: 200px;letter-spacing:8px;"
        >确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import ChooseMap from "../Map/chooseMap";
import uploadImg from "../self_component/uploadImg";
import LookMap from "../Map/lookMap";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      temp: [],
      options3: {
        disabledDate(date) {
          return date && date.valueOf() <= Date.now() - 86400000;
        }
      },
      secondPmId: "",
      secondPmLists: [],
      map_point: "",
      map_type: "",
      uploadList: [],
      dialogShowMap: false,
      detailLists: {},
      detailModal: false,
      userType: null,
      listIndex: 0,
      filename: "",
      state: 0, //任务状态: 0 : 发布中 1 : 执行中 2 : 待审核 3 : 已完成 4：已过期 5：已拒绝
      loading: false,
      FormData: new FormData(), // 上传文件的表单对象
      regionArr: [], // 选择区域的数组
      mapshow: false, // 弹出位置选择地图
      showTask: false, // 任务窗口
      formItem: {
        name: "",
        locationName: "",
        location: [],
        location_type: "",
        regions: [],
        task_type_id: "",
        end_time: "",
        user_ids: [],
        file: [],
        description: "",
        kml_Id: ""
      },
      typeList: [], // 任务类型对应的数组
      userlist: [], // 指派人数组
      list: ["发布中", "执行中", "待审核", "已完成", "已过期", "已拒绝"],
      column: [
        {
          title: "任务名称",
          key: "task_name",
          align: "center"
        },
        {
          title: "任务类型",
          key: "type_name",
          align: "center"
        },
        {
          title: "发布时间",
          key: "data_create_time",
          align: "center"
        },
        {
          title: "结束时间",
          key: "end_time",
          align: "center"
        },
        {
          title: "任务区域",
          key: "region_name",
          align: "center"
        },
        {
          title: "发布人",
          key: "adder_name",
          align: "center"
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          width: 120
        }
      ],
      ruleValidate: {
        name: [
          {
            required: true,
            message: "任务名称不能为空",
            trigger: "blur"
          }
          // {
          //   min: 3,
          //   max:15,
          //   message: "请输入3-15长度的字符",
          //   trigger: "blur"
          // }
        ],
        task_type_id: [
          {
            required: true,
            message: "任务类型不能为空",
            type: "number",
            trigger: "change"
          }
        ],
        regions: [
          {
            required: true,
            message: "区域不能为空",
            type: "array",
            trigger: "change"
          }
        ],
        locationName: [
          {
            required: true,
            message: "地理位置不能为空",
            trigger: "change"
          }
        ],
        end_time: [
          {
            required: true,
            message: "结束时间不能为空",
            trigger: "blur"
          }
        ],
        locationName: [
          {
            required: true,
            message: "地理位置不能为空"
            // trigger: "blur"
          }
        ],
        user_ids: [
          {
            required: true,
            message: "指派人不能为空",
            type: "array",
            trigger: "change"
          }
        ]
      }, // 验证表单规则
      // 渲染表格数据
      Tabledata: [],
      total: 1,
      page: 1,
      // 添加kml
      AddKML: false,
      formLeftKML: {
        KMLname: "",
        KMLdescribe: "",
        KMLfile: {}
      },
      ruleInlineKML: {
        KMLname: [
          { required: true, message: "请填写KML名称", trigger: "blur" },
          { min: 4, max: 12, message: "项目名称长度 4 - 12个字符" }
        ],
        KMLdescribe: [
          { required: true, message: "请填写KML描述", trigger: "blur" },
          { min: 4, max: 30, message: "描述内容请控制在 4 - 30个字符" }
        ],
        KMLfile: [{ required: true, message: "请上传KML文件" }]
      },
      modal_loading: false,
      AddKmlShou: true,
      kmlList: [],
      selectKmlShou: false
    };
  },
  computed: {
    ...mapState(["rowData"])
  },
  components: { ChooseMap: ChooseMap, LookMap: LookMap },
  updated() {
    try {
      this.formItem.region = this.formItem.regions.slice(-1).join() * 1; // 获取数组最后一个值
    } catch (error) {}
  },
  methods: {
    ...mapActions(["getSecondData"]),
    handleFormatError(file) {
      // this.$Message.warning("图片格式不正确!");
    },
    handleMaxSize(file) {
      this.$Message.warning("图片大小不能超过2M!");
    },
    handleMaxSize2(file) {
      this.$Message.warning("kml大小不能超过2M!");
    },
    mapdisplay(loc, type) {
      this.dialogShowMap = true;
      this.map_type = type;
      this.map_point = loc;
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.showTask = false;
    },
    changePage(page) {
      this.page = page;
      this.getTaskData();
    },
    rowClassName(row, index) {
      return "line_height_row";
    },
    // 对表格行数据的删除
    deletData(row) {},
    // 点击不同的table 改变获取table表格请求接口地址
    ChangeTableData(index) {
      this.page = 1;
      this.listIndex = index;
      this.state = index;
      this.secondPmId = "";
      this.getTaskData();
    },
    siteSelection(site, data, type) {
      this.formItem.locationName = site;
      this.formItem.location = [];
      this.formItem.location = JSON.stringify(data);
      this.formItem.location_type = type;
      this.mapshow = false;
    },
    cancel() {
      // 清空提交的信息对象
      // this.FormData.delete("file[]");
      // this.formItem = {};
    },
    handleRemove(index) {
      this.formItem.file.splice(index, 1);
      this.uploadList.splice(index, 1);
    },
    submit(formname) {
      this.$refs[formname].validate(valid => {
        if (valid) {
          this.submitTaskData();
        }
      });
    }, // 提交新建任务表单
    submitTaskData() {
      let formData = new FormData();
      for (var i = 0; i < this.formItem.file.length; i++) {
        formData.append("file[]", this.formItem.file[i]);
      }
      formData.append("name", this.formItem.name);
      formData.append("task_type_id", this.formItem.task_type_id);
      formData.append("region", this.formItem.region);
      formData.append("location", this.formItem.location);
      formData.append("location_type", this.formItem.location_type);
      formData.append("end_time", this.formItem.end_time);
      formData.append("description", this.formItem.description);
      formData.append("user_ids[]", this.formItem.user_ids);
      formData.append("task_kml_data_id", this.formItem.kml_Id);
      formData.append(
        "first_pm_id",
        JSON.parse(sessionStorage.getItem("user_info")).pm_id
      );
      formData.append("second_pm_id", this.secondPmId);
      let config = { headers: { "Content-Type": "multipart/form-data" } };
      this.$post("/newversion/task/newTaskAdd", formData, config).then(res => {
        if (res.code != 1) {
          this.$Notice.warning({
            text: "系统提示",
            desc: res.msg_customer
          });
          // this.showTask = false;
        } else {
          this.$Message.success("添加成功");
          this.showTask = false;
          this.getTaskData();
          this.$refs[name].resetFields();
          this.cancel(); // 清空传参对象的值
        }
        this.FormData = new FormData(); // 清空表单中的值
      });
    },
    //详情
    detailData(row) {
      this.detailModal = true;
      this.$post("/admin/new_task/taskDetail", {
        task_id: row.id
      }).then(res => {
        if (res.code == 1) {
          this.detailLists = res.data;
          this.detailLists.region_name = row.region_name;
        } else {
          this.$Message.error(res.msg_customer);
        }
      });
    },
    //    审核
    audit: function(index) {
      let reason = "";
      if (index == 1) {
        this.$Modal.confirm({
          render: h => {
            return h("Input", {
              props: {
                value: this.value,
                autofocus: true,
                placeholder: "请输入审核驳回原因"
              },
              on: {
                input: val => {
                  reason = val;
                }
              }
            });
          },
          onOk: () => {
            if (reason) {
              this.$post("/admin/new_task/taskCheckRefuse", {
                task_id: this.detailLists.id,
                comment: reason
              }).then(res => {
                if (res.code == 1) {
                  this.$Message.success(res.msg_customer);
                  this.ChangeTableData(5);
                  this.detailModal = false;
                } else {
                  this.$Message.error(res.msg_customer);
                }
              });
            } else {
              this.$Message.info("请输入驳回理由");
            }
          }
        });
      } else {
        this.$Modal.confirm({
          title: "系统提示",
          content: `是否审核通过此任务?`,
          onCancel: () => {},
          onOk: () => {
            this.$post("/admin/new_task/taskCheckPass", {
              task_id: this.detailLists.id
            }).then(res => {
              if (res.code == 1) {
                this.$Message.success(res.msg_customer);
                this.ChangeTableData(3);
                this.detailModal = false;
              } else {
                this.$Message.error(res.msg_customer);
              }
            });
          }
        });
      }
    },
    //删除
    deletTaskData(row) {
      this.$Modal.confirm({
        title: "系统提示",
        content: `是否删除任务名称为${row.task_name}的任务?`,
        onCancel: () => {
          this.$Message.info("点击了取消");
        },
        onOk: () => {
          this.$post("/admin/new_task/taskDelete", {
            task_id: row.id
          }).then(res => {
            if (res.code != 1) {
              return this.$Message.error(res.msg_customer);
            } else {
              this.$Message.success(res.msg_customer);
              this.getTaskData();
            }
          });
        }
      });
    },
    getTaskData() {
      this.loading = true;
      this.$post("/admin/new_task/taskList", {
        page: this.page,
        limit: 10,
        state: this.state,
        first_pm_id: this.rowData.pm_id,
        second_pm_id: this.secondPmId
      }).then(res => {
        if (res.code != 1) {
          this.$Message.error(res.msg_customer);
        } else {
          this.total = res.data.total;
          this.Tabledata = res.data.data;
        }
        this.loading = false;
      });
    },
    addTask() {
      if (!this.secondPmId) {
        this.$Message.warning("请选择二级工程");
        return;
      }
      this.showTask = true;
      this.formItem = {
        name: "",
        locationName: "",
        location: [],
        location_type: "",
        regions: [],
        task_type_id: "",
        end_time: "",
        user_ids: [],
        file: [],
        description: ""
      };
      this.uploadList = [];
      this.$post("/newversion/task/newTaskKmlLists").then(res => {
        console.log(res);
        if (res.code == 1) {
          if (res.data == []) {
            this.selectKmlShou = false;
          } else {
            this.selectKmlShou = true;
            this.kmlList = res.data;
          }
        } else {
          this.$Message.error(res.msg_customer);
        }
      });
    },
    handleBeforeUpload(file) {
      // truePic()验证图片方法
      let isPic = this.$zxh_fun.truePic(file.type, this);
      if (isPic) {
        return;
      }
      if (window.createObjectURL != undefined) {
        // basic
        file.url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        file.url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        file.url = window.webkitURL.createObjectURL(file);
      }
      this.uploadList.push(file.url);
      this.formItem.file.push(file);
      return false;
    },
    getregionArr() {
      // 获取区域列表
      this.$publicdata.getAreaName("").then(data => {
        data.forEach(item => {
          this.regionArr.push({
            value: item.code,
            label: item.name,
            children: [],
            loading: false
          });
        });
      });
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
    getuserList() {
      this.$publicdata.getDataList("base/common/userList").then(res => {
        if (res) {
          // res.forEach(item => {
          //   this.userlist.push({
          //     value: item.user_id,
          //     label: item.name
          //   });
          // });
          this.userlist = res;
        } else {
          this.userlist = [];
          // this.$Notice.warning({
          //   title: "系统提示",
          //   desc: "指派人列表为空"
          // });
        }
      });
    },
    getTasktype() {
      this.$publicdata
        .getDataList("/admin/task_type/taskTypeList")
        .then(res => {
          if (res) {
            res.forEach(item => {
              this.typeList.push({
                value: item.id,
                label: item.name
              });
            });
          } else {
            this.$Notice.warning({
              title: "系统提示",
              desc: "任务类型列表为空"
            });
          }
        });
    },
    //获取二级工程列表
    getSecondPmLists() {
      this.$post("/admin/new_task/taskSearchSecondPmList", {
        first_pm_id: this.rowData.pm_id
          ? this.rowData.pm_id
          : JSON.parse(this.rowData).pm_id
      }).then(res => {
        if (res.code != 1) {
          this.$Message.error(res.msg_customer);
        } else {
          this.secondPmLists = res.data;
        }
      });
    },
    addKML() {
      this.AddKML = true;
    },
    handleFormatErrorKML(file) {
      this.$Notice.warning({
        title: "文件格式不正确",
        desc: "请选择kml文件."
      });
    },
    uploadBeforeKML(file) {
      // console.log(file);
      this.temp.push(file); //ysq修改
      this.formLeftKML.KMLfile = file;
      this.AddKmlShou = false;
    },
    removeKML() {
      this.AddKmlShou = true;
      this.formLeftKML.KMLfile = {};
    },
    Upload_KML_ok() {
      var _this = this;
      this.$refs["formLeftKML"].validate(valid => {
        if (valid) {
          let pm_id = JSON.parse(sessionStorage.getItem("user_info")).pm_id;
          let fm = new FormData();
          fm.append("kml[]", this.formLeftKML.KMLfile);
          fm.append("name", this.formLeftKML.KMLname);
          fm.append("comment", this.formLeftKML.KMLdescribe);
          fm.append("first_pm_id", pm_id);
          this.$fromdata2("/newversion/task/newTaskKmlAdd", fm).then(res => {
            console.log(res);
            if (res.code == 1) {
              this.$Message.info(res.msg_customer);
              _this.AddKML = false;
              _this.AddKmlShou = true;
              _this.formLeftKML = {
                KMLname: "",
                KMLdescribe: "",
                KMLfile: {}
              };
            } else {
              this.$Message.error(res.msg_customer);
            }
          });
        }
      });
    }
  },
  created() {
    this.userType = JSON.parse(sessionStorage.getItem("userType"));
    if (this.userType == 1) {
      sessionStorage.setItem(
        "secondData",
        JSON.stringify(sessionStorage.getItem("user_info"))
      );
      this.getSecondData(sessionStorage.getItem("user_info"));
    }
    this.getTaskData(); // 获取任务数据
    this.getTasktype(); // 获取下拉任务类型
    this.getregionArr(); // 获取区域信息
    this.getuserList(); //获取指派人 工程管理员才有数显示
    this.getSecondPmLists(); //获取二级工程列表
  }
};
</script>

<style lang="less" scoped>
@import url("./task.less");
.TaskManagement {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 12px rgba(1, 0, 55, 0.15);
  opacity: 1;
  border-radius: 20px;
  margin-top: 0.16rem;
  overflow: hidden;
  padding: 0px 0.62rem;
}
.ul_table {
  ul {
    width: 65%;
    display: flex;
    height: 0.4rem;
    margin: 0.1rem 0px;
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
.Task_table {
  margin-top: 0.1rem;
}
.addimg {
  cursor: pointer;
  margin-left: 35px;
  padding: 10px 0px;
  border-top: 1px solid rgba(234, 236, 238, 1);
  border-bottom: 1px solid rgba(234, 236, 238, 1);
}
.detailLists_li li {
  display: inline-block;
  width: 45%;
  margin-bottom: 5px;
  line-height: 20px;
}
.add_text {
  margin: 20px;
}
.demo-upload-list {
  vertical-align: top;
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
