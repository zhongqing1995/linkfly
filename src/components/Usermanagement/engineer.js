import {
  mapActions
} from 'vuex';
export default {
  data: function () {
    return {
      uploadList: [],
      ispm: true,
      dialogForm: false,
      url: {}, // 选中的posturl 对象
      posturl: [{
        name: "工程管理员",
        add: '/admin/admin_user/userAdd',
        edit: "/admin/admin_user/userEdit",
        detail: "/admin/admin_user/userDetail"
      }],
      columns1: [{
          title: "用户头像",
          align: "center",
          render: (h, params) => {
            return h("img", {
              attrs: {
                src: params.row.head_icon
              },
              style: {
                width: "30px",
                height: "30px",
                borderRadius: '50%'
              }
            });
          }
        },
        {
          title: "用户名",
          align: "center",
          key: "name"
        },
        {
          title: "工程名称",
          // tooltip: true,
          align: "center",
          key: "pm_name"
        },
        {
          title: "体验时间",
          align: "center",
          key: "experience_time"
        },
        {
          title: "功能权限",
          align: "center",
          key: "permission"
        },
        {
          title: "账号",
          align: "center",
          key: "account"
        },
        {
          title: "公司名称",
          align: "center",
          tooltip: true,
          key: "company_name"
        },
        {
          title: "公司logo",
          align: "center",
          render: (h, params) => {
            return h("img", {
              attrs: {
                src: params.row.loge_image_path
              },
              style: {
                width: "30px",
                height: "30px",
                borderRadius: '50%',
              }
            });
          }
        },
        {
          title: "是否启用",
          align: 'center',
          render: (h, params) => {
            var then = this;
            return h("div", [
              h("i-switch", {
                props: {
                  value: params.row.state == 1 ? true : false,
                  size: "small"
                },
                style: {
                  marginRight: "5px"
                },
                on: {
                  "on-change": () => {
                    //值发生了改变调用方法
                    then.state(params.row);
                  }
                }
              })
            ]);
          }
        },
        {
          title: "操作",
          key: "address",
          align: "center",
          minWidth: 40,
          render: (h, params) => {
            return h("div", [
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
                    sessionStorage.setItem('adminId',JSON.stringify(params.row.user_id));
                    this.getAdminId(params.row.user_id);
                    this.$router.push('/index/Usermanagement');
                  }
                }
              }, '查看详情'),
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
                    this.edit(params.row);
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
                    this.delete(params.row);
                  }
                }
              }, '删除'),
            ]);
          }
        }
      ],
      page: 1,
      total: 0,
      datas: {},
      look_name: "",
      indeterminate: true,
      checkAll: false,
      remove: false, //删除
      loading: false,
      pmList: [],
      logo: "",
      title: "新增工程管理员",
      dialogForm: false,
      imgName: "点击更换",
      cityList: [{
          value: "1",
          label: "工程管理员"
        },
        {
          value: "2",
          label: "APP飞手"
        },
        {
          value: "3",
          label: "小程序用户"
        }
      ],
      formValidate: {
        client: "web",
        type: "1",
        account: "",
        name: "",
        password: "",
        company_name: "",
        pm_id: "",
        permission: [],
        head_icon: "",
        experience_time: "",
        pm_name: ""
      },
      ruleValidate: {
        pm_id: [{
          required: true,
          message: "工程名称不能为空"
        }],
        type: [{
          required: true,
          message: "平台权限不能为空",
          trigger: "change"
        }],
        name: [{
            required: true,
            message: "用户名不能为空",
            trigger: "blur"
          },
        ],
        company_name: [{
          required: true,
          message: "公司名称不能为空",
          trigger: "blur"
        }],
        permission: [{
          required: true,
          message: "请选择功能权限",
        }],
        password: [{
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          },
          // {
          //   min: 8,
          //   max: 12,
          //   message: "用户密码长度不符合要求 8,12"
          // }
        ],
        experience_time: [{
          required: true,
          message: "体验时间不能为空",
          trigger: "change"
        }],
        account: [{
            required: true,
            message: "账号不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            pattern: /^[\w]{1,20}$/,
            message: "请输入有效的账号",
            trigger: "blur"
          }
        ],
        password: [{
          required: true,
          message: "用户密码不能为空",
          trigger: "blur"
        }],
        head_icon: [{
          required: false,
          message: "用户头像不能为空",
          trigger: "blur"
        }]
      },
      userUrls: ["/admin/admin_user/userList"],
      userType: '',
    };
  },
  methods: {
    ...mapActions(["getAdminId"]),
    handleBeforeUpload(file) {
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
    //工程模糊搜索
    remoteMethod(query) {
      if (query !== "") {
        // 新增工程管理员是一级工程，其他是二级工程
        let url = this.title.includes('工程管理员') ? "/admin/first_pm/pmList" : '/admin/second_pm/secondPmList'
        let params = this.title.includes('工程管理员') ? {
          pm_name: query
        } : undefined
        this.$post(url).then(res => {
          if (res.code == 1) {
            const list = res.data.map(item => {
              if (url == '/admin/first_pm/pmList') {
                return {
                  pm_id: item.pm_id,
                  pm_name: item.pm_name,
                  company_name: item.company_name,
                  loge_image_path: item.loge_image_path
                };
              } else {
                return {
                  pm_id: item.pm_id,
                  pm_name: item.pm_name
                };
              }
            });
            this.pmList = list.filter(
              item =>
              item.pm_name.toLowerCase().indexOf(query.toLowerCase()) > -1
            );
          } else {
            this.$Message.error(res.msg_customer);
          }
        });
      } else {
        this.pmList = [];
      }
    },
    //根据工程获得公司名称与公司logo
    pmChange(val) {
      let list = this.pmList.filter(item => {
        return item.pm_id == val;
      });
      this.formValidate.company_name = list[0].company_name;
      this.logo = list[0].loge_image_path;
    },
    // 新增验证
    handleSubmit(name, ispm) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (ispm) {
            this.$post(this.url.add, {
              "client": "web",
              "type": "1",
              "account": this.formValidate.account,
              "name": this.formValidate.name,
              "password": this.$zxh_fun.encrypt(this.formValidate.password),
              "company_name": this.formValidate.company_name,
              "pm_id": this.formValidate.pm_id,
              "permission": this.formValidate.permission,
              "head_icon": this.formValidate.head_icon,
              "experience_time": this.formValidate.experience_time ? this.$zxh_fun.getToday(this.formValidate.experience_time) : '0000-00-00 00:00:00',
            }, ).then(
              res => {
                if (res.code == 1) {
                  this.dialogForm = false;
                  this.$refs[name].resetFields();
                  this.logo = "";
                  this.$Message.success("新增成功!");
                  this.formValidate.experience_time = '';
                  this.init(this.userUrls[0]);
                } else {
                  this.$Message.error(res.msg_customer);
                }
              }
            );
          } else {
            //修改
            this.$post(this.url.edit, {
              "client": "web",
              "type": "1",
              "account": this.formValidate.account,
              "name": this.formValidate.name,
              "password": this.$zxh_fun.encrypt(this.formValidate.password),
              "company_name": this.formValidate.company_name,
              "permission": this.formValidate.permission,
              "head_icon": this.formValidate.head_icon,
              "experience_time": this.formValidate.experience_time ? this.$zxh_fun.getToday(this.formValidate.experience_time) : '0000-00-00 00:00:00',
              "user_id": this.formValidate.user_id,
              "pm_name": this.formValidate.pm_name
            }).then(
              res => {
                if (res.code == 1) {
                  this.dialogForm = false;
                  this.$refs[name].resetFields();
                  this.logo = "";
                  this.formValidate.experience_time = '';
                  this.$Message.success("修改成功!");
                  this.init(this.userUrls[0]);

                } else {
                  this.$Message.error(res.msg_customer);
                }
              }
            );
          }
        }
      });
    },
    handleRemove(index) {
      this.formValidate.head_icon = "";
      this.uploadList.splice(index, 1);
    },
    //上传用户头像
    uploadBefore(file, title) {
      let user_type = '',
        user_id = '';
      if (title == "新增工程管理员") {
        user_type = 5;
      } else {
        user_type = 4;
        user_id = this.formValidate.user_id;
      }
      if (file) {
        this.imgName = file.name;
        let fm = new FormData();
        fm.append("file[]", file);
        fm.append("client", "web");
        fm.append("use_type", user_type);
        if (user_id) {
          fm.append("user_id", user_id);
        }
        this.$post("/base/common/imageUp", fm).then(res => {
          if (res.code == 1) {
            this.formValidate.head_icon = res.data[0];
            this.uploadList.push(res.data[0]);
          } else {
            this.$Message.error(res.msg_customer);
          }
        });
      }
    },
    //取消操作
    countermand(name) {
      this.$Message.info("取消操作");
      this.logo = "";
      this.formValidate.experience_time = '';
      this.formValidate.pm_id = [];
      this.$refs[name].resetFields();
    },
    //打开新增修改的模态框
    openDialog() {
      this.ispm = true;
      this.pmList = [];
      this.title = '新增工程管理员';
      this.url = this.posturl[0]
      this.dialogForm = true;
      this.uploadList = [];
      this.imgName = '点击更换';
      if (this.formValidate.user_id) {
        delete this.formValidate.user_id;
      }
      let url = this.title.includes('工程管理员') ? "/admin/first_pm/pmList" : '/admin/second_pm/secondPmList'
      this.$post(url).then(res => {
        if (res.code == 1) {
          const list = res.data.map(item => {
            if (url == '/admin/first_pm/pmList') {
              return {
                pm_id: item.pm_id,
                pm_name: item.pm_name,
                company_name: item.company_name,
                loge_image_path: item.loge_image_path
              };
            } else {
              return {
                pm_id: item.pm_id,
                pm_name: item.pm_name
              };
            }
          });
          this.pmList = list;
        } else {
          this.$Message.error(res.msg_customer);
        }
      });
    },
    //编辑详情
    edit: function (item) {
      this.dialogForm = true;
      this.ispm = false;
      this.title = "编辑工程管理员";
      this.url = this.posturl[0] // 获取编辑工程管理员url
      this.$post(this.url.detail, {
        user_id: item.user_id
      }).then(response => {
        let data = response.data;
        if (response.code == 1) {
          this.formValidate = {
            client: "web",
            type: data.type.toString(),
            account: data.account,
            name: data.name,
            password: data.password,
            company_name: data.company_name,
            permission: data.permission.split(','),
            head_icon: data.head_icon,
            experience_time: data.experience_time != '0000-00-00 00:00:00' ? data.experience_time : '',
            user_id: data.user_id,
          }
          this.formValidate.pm_name = data.pm_name;
          this.logo = data.loge_image_path;
          this.imgName = data.head_icon.substr(data.head_icon.lastIndexOf("\\") + 1);
          this.uploadList[0] = data.head_icon;
        } else {
          this.$Message.error(response.msg_customer);
        }
      });
    }, //弹出增加框和修改框
    //删除用户
    delete(row) {
      this.$Modal.confirm({
        title: "系统提示",
        content: `是否删除该条数据?若删除，数据将无法找回!`,
        onCancel: () => {
          this.$Message.info("点击了取消");
        },
        onOk: () => {
          this.$post("/admin/admin_user/userDel", {
            user_id: row.user_id
          }).then(res => {
            if (res.code == 1) {
              this.$Message.success(res.msg_customer);
              this.init(this.userUrls[0]);
            } else {
              this.$Message.error(res.msg_customer);
            }
          });
        }
      });
    },
    //获取列表 
    init: function (params) {
      let then = this;
      then.datas = [];
      this.loading = true;
      this.$post(params, {
        limit: 10,
        name: this.look_name,
        page: this.page
      }).then(response => {
        if (response.code == 1) {
          if (response.data.data.length > 0) {
            then.datas = response.data.data.map(ele => {
              let type = "",
                permissionLists = [],
                pm_name = [];
              if (ele.type == 1) {
                type = "工程管理员";
              } else if (ele.type == 2) {
                type = "APP飞手";
              } else if (ele.type == 3) {
                type = "小程序用户";
              }
              let permission = ele.permission.split(",");
              permission.forEach(element => {
                if (element == 1) {
                  permissionLists.push("直播");
                } else if (element == 2) {
                  permissionLists.push("巡检");
                } else if (element == 3) {
                  permissionLists.push("作业");
                }
              });
              if (typeof ele.pm_name === 'object') {
                ele.pm_name.forEach(ele => {
                  pm_name.push(ele.pm_name);
                })
                pm_name = pm_name.join()
              } else {
                pm_name = ele.pm_name
              }
              return {
                ...ele,
                type: type,
                permission: permissionLists.toString(),
                pm_name: pm_name.toString(),
              };
            });
          }
          then.total = response.data.total;
          this.loading = false;
        } else {
          this.$Message.error(response.msg_customer);
          this.loading = false
        }
      });
    },
    //状态更改
    state: function (item) {
      if (item.state == "1") {
        item.state = 0;
      } else if (item.state == "0") {
        item.state = 1;
      }
      this.$post("/admin/admin_user/userState", {
        user_id: item.user_id,
        state: item.state
      }).then(response => {
        if (response.code == 1) {
          this.init(this.userUrls[0]);
        }
      });
    },
    //分页
    changePage: function (index) {
      this.page = index;
      this.init(this.userUrls[0]);
    },
    //查询
    initChage() {
      this.page = 1;
      this.init(this.userUrls[0]);
    }
  },
  created: function () {
    this.init(this.userUrls[0]);
  },
};
