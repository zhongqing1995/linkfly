import ChooseMap from "../Map/chooseMap";
import LookMap from "../Map/lookMap"
import FormOrganization from "../self_component/FormOrganization"
import region from "../../../static/region(1)"
import {
  mapActions
} from "vuex";
export default {
  data() {
    return {
      uploadList: [],
      projectName: '', //查询项目名
      regionArr: [], //查询区域
      region: [],
      dateTime: '', //查询时间
      total: 0, //列表总数
      page: 1,
      pm_id: '',
      pm_name: '',
      isLocation: true,
      columns: [{
          title: '工程名称',
          key: 'pm_name',
          align: 'center'
        },
        {
          title: '区域',
          key: 'region_name',
          align: 'center'
        },
        {
          title: '成立时间',
          key: 'start_time',
          align: 'center'
        },
        {
          title: '用户数量',
          key: 'bind_num',
          align: 'center'
        },
        {
          title: '公司名称',
          key: 'company_name',
          align: 'center'
        },
        {
          title: '公司logo',
          render: (h, params) => {
            return h("img", {
              attrs: {
                src: params.row.loge_image_path
              },
              style: {
                width: "30px",
                height: "30px",
                borderRadius: '50%'
              }
            });
          },
          align: 'center'
        },
        {
          title: '位置',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'md-pin',
                },
                style: {
                  fontSize: '20px',
                  color: "red"
                },
                on: {
                  click: () => {
                    this.dialogShowMap = true;
                    this.map_point = params.row.location;
                    this.map_type = params.row.location_type;
                  }
                }
              }, ''),
            ]);
          }
        },
        {
          title: "是否启用",
          render: (h, params) => {
            var then = this;
            return h("div", [
              h("i-switch", {
                props: {
                  value: params.row.state == 1 ? true : false,
                  size: "small"
                },
                style: {
                  marginRight: "5px",
                  color: 'red'
                },
                on: {
                  "on-change": function () {
                    //值发生了改变调用方法
                    then.changeState(params.row);
                  }
                }
              })
            ]);
          },
          align: 'center'
        },
        {
          title: '备注',
          key: 'comment',
          align: 'center'
        },
        {
          title: '操作',
          width: 120,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: '../../../static/publicimg/chakan.png',
                  title: '查看详情'
                },
                style: {
                  marginRight: '8px',
                  width: '0.19rem',
                  height: '0.2rem',
                },
                on: {
                  click: () => {
                    this.toNextEngineer(params.row)
                  }
                }
              }, '查看'),
              h('img', {
                attrs: {
                  src: '../../../static/zxhImg/edit.png',
                  title: '修改'
                },
                style: {
                  marginRight: '8px',
                  width: '0.19rem',
                  height: '0.2rem',
                },
                on: {
                  click: () => {
                    this.detail(params.row.pm_id, params.row.region_name)
                  }
                }
              }, '修改'),
              h('img', {
                attrs: {
                  src: '../../../static/publicimg/delete.png',
                  title: '删除'
                },
                style: {
                  width: '0.19rem',
                  height: '0.2rem',
                },
                on: {
                  click: () => {
                    this.delete(params.row)
                  }
                }
              }, '删除')
            ]);
          }
        }
      ], //一级列表标题
      tabData: [], //列表数据
      loading: false, //表格加载
      dialogShowMap: false, //查看区域弹框
      title: '新增一级工程',
      modal: false,
      formInline: {
        loge_image_path: '',
        pm_name: '',
        region: [],
        start_time: '',
        location: '',
        location_type: '',
        company_name: '',
        bind_num: '',
        comment: '',
        locationArr: [],
        regionName: '',
      },
      map_type: null, //选择其中一个地图点类型
      map_point: '', //选择其中一个地图点展示
      pic: '',
      uploadPic: false,
      mapshow: false,
      ruleInline: {
        pm_name: [{
          required: true,
          message: "请输入工程名称"
        },{
          min: 1,
          max: 20,
          message: "工程名称在1-20个字符之间",
          trigger: "blur"
        }],
        location: [{
          required: true,
          message: "请输入地图位置"
        }],
        region: [{
          required: true,
          message: "请输入所属区域"
        }],
        start_time: [{
          required: true,
          message: "请输入成立时间"
        }],
        company_name: [{
          required: true,
          message: "请输入公司名称"
        }],
        bind_num: [{
          required: true,
          message: "请输入新建用户数"
        }],
        loge_image_path: [{
          required: true,
          message: "请上传公司logo"
        }]
      },
      regionMsg:region,
    }
  },
  components: {
    LookMap,
    ChooseMap,
    FormOrganization,
  },
  mounted() {
    this.search();
    this.getRegion();
  },
  methods: {
    ...mapActions(["getSecondData"]),
    handleRemove(index) {
      this.formInline.loge_image_path = '';
      this.uploadList.splice(index, 1);
    },
    delete(row) {
      this.$Modal.confirm({
        title: "系统提示",
        content: `是否删除该条数据?`,
        onCancel: () => {
          this.$Message.info("点击了取消");
        },
        onOk: () => {
          this.$post("/admin/first_pm/firstPmDel", {
            pm_first_id: row.pm_id
          }).then(res => {
            if (res.code == 1) {
              this.$Message.success(res.msg_customer);
              this.search();
            } else {
              this.$Message.error(res.msg_customer);
            }
          });
        }
      });
    },
    //进入二级工程
    toNextEngineer(data) {
      this.$router.push('/index/secondEngineerManagement');
      sessionStorage.setItem('secondData',JSON.stringify(data));
      this.getSecondData(data);
    },
    //工程详情
    detail(id, name) {
      this.pm_id = id;
      this.$post("/admin/first_pm/firstPmDetail", {
        pm_id: this.pm_id
      }).then(res => {
        if (res.code == 1) {
          this.formInline = res.data;
          this.pic = res.data.loge_image_path;
          this.uploadList[0] = res.data.loge_image_path;
          this.formInline.region = [res.data.region]
          this.modal = true;
          this.title = '修改一级工程';
          let location = JSON.parse(res.data.location);
          this.formInline.locationArr = location;
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
          });
          this.isLocation = false;
          this.formInline.regionName = name;
          let then = this;
          geocoder.getAddress(location[0], function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              then.formInline.location = result.regeocode.formattedAddress;
            }
          });
        }
      });
    },
    //状态值的变化
    changeState(item) {
      //状态
      if (item.state == "1") {
        item.state = 0;
      } else if (item.state == "0") {
        item.state = 1;
      }
      this.$post("/admin/first_pm/firstPmState", {
        pm_first_id: item.pm_id,
        state: item.state
      }).then(response => {
        if (response.code == 1) {
          this.search();
        }
      });
    },
    //区域列表
    getRegion() {
      this.$post('/base/common/regionChoose', {
          code: '',
          client: 'web'
        })
        .then((response) => {
          if (response.code == 1) {
            let addre = response.data;
            for (var i = 0; i < addre.length; i++) {
              this.regionArr.push({
                value: addre[i].code,
                label: addre[i].name,
                children: [],
                loading: false
              })
            }
          } else {
            this.$Message.error(response.msg_customer);
          }
        })
    },
    //加载区域下一级
    loadData(item, callback) {
      var address = []
      item.loading = true;
      this.$post('/base/common/regionChoose', {
          code: item.value,
          client: 'web'
        })
        .then((response) => {
          if (response.code == 1) {
            address = response.data
            for (var i = 0; i < address.length; i++) {
              if (item.value.toString().length < 6) {
                item.children.push({
                  value: address[i].code,
                  label: address[i].name,
                  children: [],
                  loading: false
                })
              } else {
                item.children.push({
                  value: address[i].code,
                  label: address[i].name,
                  children: [],
                })
              }

            }
            item.loading = false;
            callback();
          } else {
            this.$Message.error(response.msg_customer);
          }
        })
    },
    //查询以及工程
    search(index) {
      if (index) {
        this.page = 1;
      }
      this.loading = true;
      this.$post('/admin/first_pm/pmListPage', {
          "pm_name": this.projectName,
          "start_time": this.dateTime,
          "region": this.region[this.region.length - 1],
          "limit": 10,
          "page": this.page,
        })
        .then(response => {
          this.loading = false;
          if (response.code == 1) {
            this.tabData = response.data.data;
            this.total = response.data.total;
          } else {
            this.$Message.error(response.msg_customer);
          }
        })
    },
    //分页
    changePage(val) {
      this.page = val;
      this.search();
    },
    //点击新建工程
    clickPro() {
      this.modal = true;
      this.title = '新增一级工程';
      this.pic = '';
      this.uploadList = [];
      this.formInline = {
        loge_image_path: '',
        pm_name: '',
        region: [],
        start_time: '',
        location: '',
        location_type: '',
        company_name: '',
        bind_num: '',
        comment: '',
        locationArr: []
      }
    },
    //新建一级工程
    handleReset(name) {
      this.$refs[name].resetFields();
      this.modal = false;
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.title == '新增一级工程') {
            this.$post("/admin/first_pm/pmAdd", {
              client: 'web',
              loge_image_path: this.formInline.loge_image_path,
              pm_name: this.formInline.pm_name,
              region: this.formInline.region[this.formInline.region.length - 1],
              start_time: this.$zxh_fun.getToday(this.formInline.start_time),
              location: JSON.stringify(this.formInline.locationArr),
              location_type: this.formInline.location_type,
              company_name: this.formInline.company_name,
              bind_num: Number(this.formInline.bind_num),
              comment: this.formInline.comment,
            }).then(res => {
              if (res.code == 1) {
                this.$Message.success("新增成功!");
                this.modal = false;
                this.search();
                this.$refs[name].resetFields();
              } else {
                this.$Message.error(res.msg_customer);
              }
            });
          } else {
            this.$post("/admin/first_pm/firstPmEdit", {
              pm_id: this.pm_id,
              loge_image_path: this.formInline.loge_image_path,
              pm_name: this.formInline.pm_name,
              region: this.formInline.region[this.formInline.region.length - 1],
              start_time: this.$zxh_fun.getToday(this.formInline.start_time),
              location: JSON.stringify(this.formInline.locationArr),
              location_type: this.formInline.location_type,
              company_name: this.formInline.company_name,
              bind_num: Number(this.formInline.bind_num),
              comment: this.formInline.comment,
            }).then(res => {
              if (res.code == 1) {
                this.$Message.success("修改成功!");
                this.modal = false;
                this.search();
                this.$refs[name].resetFields();
              } else {
                this.$Message.error(res.msg_customer);
              }
            });
          }

        }
      })
    },
    //上传公司logo
    uploadBefore(file) {
      let isPic = this.$zxh_fun.truePic(file.type, this);
      if (isPic) {
        return;
      }
      if (file) {
        let fm = new FormData();
        fm.append("file[]", file);
        fm.append("client", "web");
        fm.append("use_type", 1);
        this.$post("/base/common/imageUp", fm).then(res => {
          if (res.code == 1) {
            this.uploadList.push(res.data[0]);
            this.formInline.loge_image_path = res.data[0];
          } else {
            this.$Message.error(res.msg_customer);
          }
        });
      }
    },
    //取消上传图片
    cancelPic() {
      this.pic = '';
      this.formInline.loge_image_path = this.pic;
    },
    subPic() {
      this.uploadPic = false;
      this.formInline.loge_image_path = this.pic;
    },
    //选择的地址返回
    siteSelection(site, data, type) {
      this.formInline.location = site;
      this.formInline.locationArr = data;
      this.formInline.location_type = type;
      this.mapshow = false;
    },
  },
  beforeDestroy() {
    // 销毁监听事件
    this.$bus.$off('lookMap');
  },
  watch: {

  }
};
