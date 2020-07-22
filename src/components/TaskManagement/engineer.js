import {
  mapActions
} from "vuex";
export default {
  data() {
    return {
      projectName: '', //查询项目名
      regionArr: [], //查询区域
      region: [],
      dateTime: '', //查询时间
      total: 0, //列表总数
      page: 1,
      pm_id: '',
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
            ]);
          }
        }
      ], //一级列表标题
      tabData: [], //列表数据
      loading: false, //表格加载
    }
  },
  components: {},
  mounted() {
    this.search();
    this.getRegion();
  },
  methods: {
    ...mapActions(["getSecondData"]),
    //进入二级工程
    toNextEngineer(data) {
      sessionStorage.setItem('secondData', JSON.stringify(data));
      this.getSecondData(data);
      let name = localStorage.getItem("selectName");
      if (name == "任务管理") {
        this.$router.push('/index/TaskManagement');
      } else if (name == "飞行作业") {
        this.$router.push('/index/Flight');
      } else if (name == "无人机管理") {
        this.$router.push('/index/UAVmanagement');
      } else if (name == "GPS管理") {
        this.$router.push('/index/GPSmanagement');
      }
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
      var address = [];
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

  },
  beforeDestroy() {}
};
