<template>
  <div id="Copter" class="topDIV" style="margin-top: 0">
    <div class="Top">
      <h1 class="name">直升机列表</h1>
      <div>
        <Button type="error" :disabled="disabled1" @click="DeleteData">删除选中数据</Button>
        <Button v-if="userType==0?false:true" type="primary" @click="addCopterBox=!addCopterBox">导入直升机数据</Button>
      </div>
    </div>
    <!--列表区-->
    <div>
      <Table
        style="margin-bottom: 20px"
        :loading="loading"
        :columns="columns"
        :data="listData"
        :height="528"
        @on-selection-change="selectDelete"
      ></Table>
      <Page class="page" show-total :total="total" @on-change="changePage"></Page>
    </div>
    <!--弹框区-->
    <!--添加直升机数据-->
    <Modal
      title="导入直升机数据"
      v-model="addCopterBox"
      width="500"
    >
      <p slot="header" style="color:#409EFF;text-align:center">
        <span style="font-size: 16px">导入直升机数据</span>
      </p>
      <Form
        ref="addCopterform"
        :model="addCopterData"
        :rules="addCopterDataRule"
        label-position="top"
        style="margin: 0 50px"
      >
        <FormItem label="上传excel文件 (仅支持 .xls .xlsx 尾缀文件)" prop="ime">
          <Upload
            v-if="UploadExcelShou"
            multiple
            :format="['xls','xlsx']"
            :on-format-error="handleFormatError"
            :before-upload="uploadBeforeExcel"
            type="drag"
            action>
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击或拖动文件到此区域进行上传</p>
            </div>
          </Upload>
          <div v-if="!UploadExcelShou" style="display: flex;align-items: center">
            <i class="ivu-icon ivu-icon-md-document" style="font-size: 18px"></i>
            <span style="margin-right: 10px;font-size: 12px;">{{addCopterData.file.name}}</span>
            <i class="ivu-icon ivu-icon-ios-trash" @click="removeExcel" style="font-size: 18px;color: red"></i>
          </div>
        </FormItem>
      </Form>
      <div style="text-align:center" slot="footer">
        <Button
          type="info"
          @click="addCopter_ok"
          style="width: 200px;letter-spacing:4px;"
        >确认添加</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
    export default {
      name: "Copterlist",
      components: {
        // PastRoute: resolve => {
        //   require(["./pastRoute.vue"], resolve);
        // }
      },
      data(){
        return{
          userType:'',
          userInfo:{},
          total: 0,
          page: 1,
          loading: false,
          columns:[
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              title: '#',
              key: 'id',
              width: 60,
              align: 'center'
            },
            {
              title: '直升机机号',
              key: 'uav_number',
              align: 'center'
            },
            {
              title: '直升机机型',
              key: 'uav_model',
              align: 'center'
            },
            {
              title: '直升机任务',
              key: 'uav_task',
              align: 'center'
            },
            {
              title: '上报时间',
              key: 'report_date',
              align: 'center'
            },
            {
              title: '所属航站',
              key: 'belong_terminal',
              align: 'center'
            },
            {
              title: '飞行时间',
              key: 'fly_time',
              align: 'center'
            },
            {
              title: '观察者',
              key: 'observer',
              align: 'center'
            },
            {
              title: '航线',
              key: 'air_route',
              align: 'center'
            },
            {
              title: '上报人',
              key: 'reporter',
              align: 'center'
            },
            {
              title: '审核标志',
              key: 'check',
              align: 'center'
            },
            // {
            //   title: "操作",
            //   align: "center",
            //   render: (h, params) => {
            //     return h("div", [
            //       h(
            //         "img",
            //         {
            //           attrs: {
            //             src: "../../../static/publicimg/chakan.png",
            //             title: "查看"
            //           },
            //           style: {
            //             width: "0.19rem",
            //             height: "0.2rem"
            //           },
            //           on: {
            //             click: () => {
            //               this.details(params.row);
            //             }
            //           }
            //         },
            //         "查看"
            //       )
            //     ]);
            //   }
            // }
          ],
          listData:[],
          secondData:{},
          timer:null,
          pastRoute:false,
          tcp_device_id:null,
          // 添加直升机数据
          addCopterBox:false,
          addCopterData:{
            file:{}
          },
          addCopterDataRule:{
            file: [
              { required: true, message: '请上传数据文件'}
            ]
          },
          selectionID:[],
          disabled1:true,
          UploadExcelShou:true,

        }
      },
      mounted() {
        this.userType = sessionStorage.getItem("userType");
        this.userInfo =JSON.parse(sessionStorage.getItem("user_info"));
        this.secondData=JSON.parse(sessionStorage.getItem("secondData"));
        this.initLists();
        this.timer=setInterval(this.initLists(),180000);
      },
      beforeDestroy(){
        clearInterval(this.timer);
      },
      methods:{
        // 加载列表
        initLists(){
          this.loading = true;
          this.$post("/admin/helicopter_data/helicopterDataList", {
            limit: 10,
            page: this.page
          }).then(res=> {
            this.loading = false;
            console.log(res);
            if (res.code == 1) {
              // console.log(res);
              this.listData=[];
              res.data.data.forEach(item=>{
                if(item.check_tag==0){
                  item.check="未通过"
                }else {
                  item.check="通过"
                }
                this.listData.push(item)
              });
              // this.listData = res.data.data;
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
        // 查看历史轨迹
        details(val){
          console.log(val);
          // this.tcp_device_id=val.id;
          // this.pastRoute=true;
        },
        // 选中
        selectDelete(selection){
          console.log("选中改变",selection);
          this.selectionID=[];
          selection.forEach(item=>{
            this.selectionID.push(item.id)
          });
          console.log("选中改变的id",this.selectionID);
        },
        //删除选中数据
        DeleteData(){
          let _this=this;
          this.$post("/admin/helicopter_data/helicopterDataDel", {
            ids:this.selectionID
          }).then(res=> {
            if (res.code == 1) {
              this.$Message.info(res.msg_customer);
              _this.initLists();
              this.selectionID=[];
            } else {
              this.$Message.error(res.msg_customer);
            }
          });
        },
        handleFormatError(file){
          this.$Notice.warning({
            title: '文件格式不正确',
            desc: '仅支持 .xls .xlsx 尾缀文件.'
          });
        },
        uploadBeforeExcel(file){
          console.log(file);
          this.addCopterData.file=file;
          this.UploadExcelShou=false;
        },
        // 添加直升机数据
        addCopter_ok(){
          var _this=this;
          this.$refs["addCopterform"].validate((valid) => {
            if(valid){
              let fm = new FormData();
              fm.append("file", this.addCopterData.file);
              this.$post("/admin/helicopter_data/saveHelicopterData",fm).then(res=> {
                if (res.code == 1) {
                  this.$Message.info(res.msg_customer);
                  this.addCopterData.file={};
                  _this.addCopterBox=false;
                  this.UploadExcelShou=true;
                  _this.initLists();
                } else {
                  this.$Message.error(res.msg_customer);
                }
              });
            }
          })
        },
        // 删除上传文件
        removeExcel(){
          this.addCopterData.file={};
          this.UploadExcelShou=true;
        }
      },
      watch: {
        selectionID (val) {
          console.log(JSON.stringify(val));
          if(JSON.stringify(val)=="[]"){
            this.disabled1=true;
            return
          }
          this.disabled1=false;
        }
      }
    }
</script>

<style scoped lang="less">
  #Copter{
    .Top{
      display: flex;
      justify-content:space-between;
      align-items:center;
    }
  }
</style>
