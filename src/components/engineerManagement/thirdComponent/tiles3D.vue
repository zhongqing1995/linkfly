<template>
    <div id="tiles3D">

      <Row v-if="userType==1">
        <Button
          style="float:right;margin-bottom: 10px;"
          size="small"
          @click="clickCreate"
          type="success"
        >新增三维模型</Button>
      </Row>

      <Table
        style="margin: 5px"
        :loading="loading"
        :columns="columns"
        :data="tabData"
        max-height="540"
        size="small"
      ></Table>

      <Page class="page" show-total :total="total" @on-change="changePage"></Page>

      <!--添加3D模型-->
      <Modal v-model="Add3D" title="添加3Dtiles模型" width="500">
        <Form ref="form3D" :model="form3D" :rules="ruleInline3D" label-position="top" >
          <FormItem label="模型名称" prop="name">
            <Input v-model="form3D.name"></Input>
          </FormItem>
          <FormItem label="添加此模型描述" prop="comment">
            <Input v-model="form3D.comment"></Input>
          </FormItem>
          <Row>
            <Col span="11">
              <FormItem label="区域" prop="regions">
                <Cascader
                  filterable
                  placeholder="请选择区域"
                  v-model="form3D.regions"
                  :data="regionArr"
                  :load-data="loadData"
                  @on-change="getregionArr"
                  change-on-select
                  clearable
                ></Cascader>
              </FormItem>
            </Col>
            <Col span="11" offset="2">
              <FormItem label="地理位置" prop="locationName">
                <Input
                  clearable
                  v-model="form3D.locationName"
                  @on-focus="mapshow=true"
                  placeholder="请点击弹出地图"
                ></Input>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="上传3Dtiles模型压缩包 ( 只支持zip ) " prop="file3D">
            <Upload
              v-if="Upload3DShou"
              multiple
              :format="['zip','ZIP']"
              :on-format-error="handleFormatError"
              :before-upload="uploadBefore3D"
              type="drag"
              action>
              <div style="padding: 20px 0" v-if="" >
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>点击或将文件拖动到这里进行上传</p>
              </div>
            </Upload>
            <div v-if="!Upload3DShou" style="display: flex;align-items: center">
              <i class="ivu-icon ivu-icon-md-document" style="font-size: 18px"></i>
              <span style="margin-right: 10px;font-size: 12px;">{{form3D.file3D.name}}</span>
              <i class="ivu-icon ivu-icon-ios-trash" @click="remove3D" style="font-size: 18px;color: red"></i>
            </div>
          </FormItem>
        </Form>
        <div style="text-align:center" slot="footer">
          <Button
            type="info"
            :loading="modal_loading"
            @click="Upload_3D_ok"
            style="width: 200px;letter-spacing:8px;"
          >确认</Button>
        </div>
      </Modal>
      <!--地图位置选择-->
      <Modal v-model="mapshow" title="位置选择" width="600">
        <div class="map" v-if="mapshow">
          <ChooseMap @refreshList="siteSelection"></ChooseMap>
        </div>
        <div slot="footer"></div>
      </Modal>
      <!--查看模型所在位置-->
      <Modal v-model="dialogShowMap" title="查看位置" width="600">
        <div v-if="dialogShowMap">
          <LookMap :map_point="map_point" :map_type="map_type"></LookMap>
        </div>
        <div slot="footer"></div>
      </Modal>

    </div>
</template>

<script>
    export default {
      name: "tiles3D",
      data(){
          return{
            userType:'',
            userInfo:{},
            Add3D:false,
            Add3DShou:true,
            modal_loading:false,
            form3D:{
              name:"",
              comment:"",
              regions:[],
              locationName: "",
              location:"",
              location_type: "",
              lon: "",
              lat: "",
              first_pm_id:"",
              second_pm_id:"",
              file3D:{}
            },
            ruleInline3D:{
              name: [
                { required: true, message: '请填写3D模型名称',trigger: 'blur'},
                { min: 4,max:12, message: '3D模型名称长度 4 - 12个字符' }
              ],
              comment: [
                { required: true, message: '请填写3D模型描述',trigger: 'blur'},
                { min: 4, max:30, message: '描述内容请控制在 4 - 30个字符'}
              ],
              regions: [
                { required: true, message: '请选择区域'}
              ],
              locationName: [
                { required: true, message: '请选择地理位置'}
              ],
              file3D:[
                { required: true, message: '请上传3Dtiles文件'}
              ]
            },
            Upload3DShou:true,
            regionArr: [], // 选择区域的数组
            mapshow: false, // 弹出位置选择地图
            total: 0,
            page: 1,
            loading: false,
            columns: [
              {
                title: "3D模型名称",
                align: "center",
                key: "name"
              },
              {
                title: "备注",
                align: "center",
                key: "comment"
              },
              {
                title: "创建时间",
                align: "center",
                key: "data_create_time"
              },
              {
                title: "位置",
                align: "center",
                render: (h, params) => {
                  return h("div", [
                    h(
                      "Icon",
                      {
                        props: {
                          type: "md-pin"
                        },
                        style: {
                          fontSize: "20px",
                          color: "red"
                        },
                        on: {
                          click: () => {
                            this.dialogShowMap = true;
                            this.map_point = JSON.stringify([
                              [Number(params.row.lon), Number(params.row.lat)]
                            ]);
                            this.map_type = Number(1);
                          }
                        }
                      },
                      ""
                    )
                  ]);
                }
              },
              {
                title: "操作",
                align: "center",
                render: (h, params) => {
                  return h("div", [
                    h(
                      "img",
                      {
                        attrs: {
                          src: "../../../static/publicimg/chakan.png",
                          title: "查看详情"
                        },
                        style: {
                          marginRight: "8px",
                          width: "0.19rem",
                          height: "0.2rem"
                        },
                        on: {
                          click: () => {
                            this.lookThree(params.row);
                          }
                        }
                      },
                      "查看详情"
                    ),
                    h(
                      "img",
                      {
                        attrs: {
                          src: "../../../static/publicimg/delete.png",
                          title: "删除"
                        },
                        style: {
                          width: "0.19rem",
                          height: "0.2rem",
                          display: this.userType == 1 ? "inline-block" : "none"
                        },
                        on: {
                          click: () => {
                            this.delete(params.row);
                          }
                        }
                      },
                      "删除"
                    )
                  ]);
                }
              }
            ],
            dialogShowMap: false,
            map_point: "",
            map_type: 0,
            tabData: [],
            secondData:{},
            threeData:{}
          }
      },
      components: {
        ChooseMap: resolve => {
          require(["../../Map/chooseMap.vue"], resolve);
        },
        LookMap: resolve => {
          require(["../../Map/lookMap.vue"], resolve);
        }
      },
      mounted() {
        this.userType = sessionStorage.getItem("userType");
        this.userInfo =JSON.parse(sessionStorage.getItem("user_info"));
        this.secondData=JSON.parse(sessionStorage.getItem("secondData"));
        this.threeData=JSON.parse(sessionStorage.getItem("threeData"));
        this.initLists();
        this.getregionArr(); // 获取区域信息
      },
      methods:{
        // 新增模型
        clickCreate(){
          this.Add3D=true;
        },
        handleFormatError(file){
          this.$Notice.warning({
            title: '文件格式不正确',
            desc: '请选择zip文件.'
          });
        },
        uploadBefore3D(file){
          this.form3D.file3D=file;
          this.Upload3DShou=false;
        },
        Upload_3D_ok(){
          var _this=this;
          this.$refs["form3D"].validate((valid) => {
            if(valid){
              let pm_id1=JSON.parse(sessionStorage.getItem("user_info")).pm_id;
              let pm_id2=JSON.parse(this.threeData).pm_id;
              let fm = new FormData();
              // console.log(this.form3D);
              fm.append("zip[]", this.form3D.file3D);
              fm.append("name", this.form3D.name);
              fm.append("comment", this.form3D.comment);
              fm.append("region", this.form3D.regions[this.form3D.regions.length - 1]);
              fm.append("lon", this.form3D.lon);
              fm.append("lat", this.form3D.lat);
              fm.append("first_pm_id", pm_id1);
              fm.append("second_pm_id", pm_id2);
              this.modal_loading = true;

              this.$fromdata2("/admin/three_dimensional/threeDimensionalAdd", fm).then(res => {
                console.log(res);
                if (res.code == 1) {
                  this.$Message.info(res.msg_customer);
                  _this.modal_loading = true;
                  _this.Add3D=false;
                  _this.Upload3DShou=true;
                  _this.form3D= {
                    name:"",
                    comment:"",
                    regions:[],
                    locationName: "",
                    location:"",
                    location_type: "",
                    lon: "",
                    lat: "",
                    first_pm_id:"",
                    second_pm_id:"",
                    file3D:{}
                  };

                } else {
                  this.$Message.error(res.msg_customer);
                }
              });
            }
          })
        },
        remove3D(){
          this.Add3DShou=true;
          this.form3D.file3D={};
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
          console.log(item.value.toString().length);
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
        siteSelection(site, data, type) {
          this.form3D.locationName = site;
          this.form3D.location = JSON.stringify(data);
          this.form3D.location_type = type;
          this.form3D.lon = data[0][0];
          this.form3D.lat = data[0][1];
          this.mapshow = false;
        },
        // 加载列表数据
        initLists(){
          this.loading = true;
          this.$post("/admin/three_dimensional/threeDimensionalList", {
            first_pm_id:this.userType==0?this.secondData.pm_id:this.userInfo.pm_id,
            second_pm_id:this.userType==0?this.threeData.pm_id:this.threeData.pm_id,
            limit: 10,
            page: this.page
          }).then(res=> {
            this.loading = false;
            console.log(res);
            if (res.code == 1) {
              this.tabData = res.data.data;
              this.total = res.data.total;
            } else {
              this.$Message.error(res.msg_customer);
            }
          });
        },
        // 分页
        changePage(val) {
          this.page = val;
          this.initLists();
        },
        // 查看模型
        lookThree(e) {
          console.log(e);
          window.open(e.path + "&name=" + e.name, "_blank");
        },
        // 删除数据
        delete(val){
          console.log(val);
          this.$Modal.confirm({
            title: "系统提示",
            content: `是否删除该3D模型?`,
            onCancel: () => {
              this.$Message.info("点击了取消");
            },
            onOk: () => {
              this.$post("/admin/three_dimensional/threeDimensionalDel", {
                three_data_id: val.id
              }).then(res => {
                if (res.code == 1) {
                  this.$Message.success(res.msg_customer);
                  this.initLists();
                } else {
                  this.$Message.error(res.msg_customer);
                }
              });
            }
          });
        }
      }
    }
</script>

<style scoped>

</style>
