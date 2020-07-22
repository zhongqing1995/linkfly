import {
  mapState
} from 'vuex'
export default {
  data: function () {
    return {
      bind_num: 0,
      all_num: 0,
      uploadList: [],
      userDialog: false,
      ispm: true,
      dialogForm: false,
      dialogSpeacialUser: false,
      url: {}, // 选中的posturl 对象
      posturl: [{
          name: "工程管理员",
          add: '/admin/admin_user/userAdd',
          edit: "/admin/admin_user/userEdit",
          detail: "/admin/admin_user/userDetail"
        },
        {
          name: "app飞手",
          add: '/admin/fly_user/userAdd',
          edit: "/admin/fly_user/userEdit",
          detail: '/admin/fly_user/userDetail'
        },
        {
          name: "小程序",
          add: '/admin/mini_user/userAdd',
          edit: "/admin/mini_user/userEdit",
          detail: "/admin/mini_user/userDetail"
        },
      ],
      pm_name: '',
      team_name: '',
      user_name: '',
      columns: [{
        title: "工程名称",
        align: "center",
        key: "pm_name"
      }, {
        title: "团队名称",
        align: "center",
        key: "team_name"
      }, {
        title: "团队人数",
        align: "center",
        key: "number"
      }, {
        title: "团队成员",
        align: "center",
        key: "name"
      }, {
        title: "备注",
        align: "center",
        key: "comment"
      }, {
        title: "操作",
        key: "address",
        align: "center",
        minWidth: 40,
        render: (h, params) => {
          return h("div", [
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
                  this.editTeam(params.row);
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
                  this.deleteTeam(params.row);
                }
              }
            }, '删除'),
          ]);
        }
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
          title: "平台权限",
          align: "center",
          key: "type"
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
                borderRadius: '50%'
              }
            });
          }
        }
      ],
      columns2: [{
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
      }, {
        title: "用户名称",
        align: "center",
        key: "name"
      }, {
        title: "用户账号",
        align: "center",
        key: "account"
      }, {
        title: "体验时间",
        align: "center",
        key: "experience_time"
      }, {
        title: "创建时间",
        align: "center",
        key: "create_time"
      }, {
        title: "用户类型",
        align: "center",
        key: "type"
      }, {
        title: "权限",
        align: "center",
        key: "permission"
      }, {
        title: "是否启用",
        align: "center",
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
                "on-change": function () {
                  //值发生了改变调用方法
                  then.state(params.row);
                }
              }
            })
          ]);
        }
      }, {
        title: "操作",
        key: "address",
        align: "center",
        minWidth: 40,
        render: (h, params) => {
          return h("div", [
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
                  this.editSpecialUser(params.row);
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
                  this.deleteSpecialUser(params.row);
                }
              }
            }, '删除'),
          ]);
        }
      }],
      columnsUse: {
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
                marginRight: "5px"
              },
              on: {
                "on-change": function () {
                  //值发生了改变调用方法
                  then.state(params.row);
                }
              }
            })
          ]);
        }
      },
      columnsEdit: {
        title: "操作",
        key: "address",
        align: "center",
        minWidth: 40,
        render: (h, params) => {
          return h("div", [
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
      },
      tabActive: "name1",
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
      teamTitle: "新增团队",
      speacialUserTitle: "新增特殊工程管理员",
      dialogForm: false,
      dialogTeam: false,
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
          type: 'array',
          message: "工程名称不能为空",
          trigger: "change"
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
          // {
          //   min: 2,
          //   max: 15,
          //   message: "用户名称长度不符合要求 2,15"
          // }
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
        experience_time: [{
          required: true,
          type: 'date',
          message: "体验时间不能为空",
          trigger: "change"
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
      teamForm: {
        team_name: '',
        second_pm_id: '',
        user_id: '',
        comment: '',
        pm_first_id: ""
      },
      speacialUserForm: {
        user_id: '',
        name: '',
        account: '',
        password: '',
        head_icon: '',
      },
      speacialUserRule: {
        name: [{
            required: true,
            message: "用户名称不能为空",
            trigger: "blur"
          },
          // {
          //   min: 2,
          //   max: 15,
          //   message: "用户名称长度不符合要求 2,15"
          // }
        ],
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
          message: "密码不能为空",
          trigger: "blur"
        }],
        head_icon: [{
          required: true,
          message: "用户头像不能为空",
          trigger: "change"
        }],
      },
      teamRule: {
        team_name: [{
          required: true,
          message: "团队名称不能为空",
          trigger: "blur"
        }],
        second_pm_id: [{
          required: true,
          type: "number",
          message: "请选择所属二级工程",
          trigger: "change"
        }],
      },
      userUrls: ["/admin/uav_user_team/teamListPage", "/admin/fly_user/userListPage", "/admin/mini_user/userListPage", "/admin/special_admin_user/specialAdminUserList"],
      userType: '',
      secondLists: [], //新增团队二级工程
      userIds: [],
      userLists: [],
    };
  },
  computed: {
    ...mapState(["pm_admin_id"])
  },
  methods: {
    //工程可新建用户比例
    getBindNum() {
      this.$post("/base/common/pmUserNum", {
        user_id: this.pm_admin_id,
        client: 'web'
      }).then(res => {
        if (res.code == 1) {
          this.bind_num = res.data.bind_num;
          this.all_num = res.data.number;
        } else {
          this.$Message.error(res.msg_customer);
        }
      });
    },
    //团队详情
    editTeam(row) {
      this.$post("/admin/uav_user_team/teamDetail", {
        team_id: row.id
      }).then(res => {
        if (res.code == 1) {
          this.dialogTeam = true;
          this.teamForm = res.data;
          this.teamTitle = '编辑团队信息';
          this.initSecondGc();
          this.chooseUser(1);
        } else {
          this.$Message.error(res.msg_customer);
        }
      });
    },
    chooseUserOk() {
      this.teamForm.user_id = this.userIds.length;
    },
    initSecondGc() {
      let param = '';
      if (this.teamTitle == '新增团队') {
        param = {}
      } else {
        param = {
          pm_second_id: this.teamForm.second_pm_id
        }
      }
      this.$post("/admin/uav_user_team/teamPmList", param).then(res => {
        if (res.code == 1) {
          this.secondLists = res.data;
        } else {
          this.$Message.error(res.msg_customer);
        }
      });
    },
    chooseUser(index) {
      if (index == 1) {} else {
        this.userDialog = true;
      }
      this.$post("/admin/uav_user_team/teamUserList", {
        second_pm_id: this.teamForm.second_pm_id
      }).then(res => {
        if (res.code == 1) {
          this.userLists = res.data;
          this.userIds = [];
          this.teamForm.user_id = '';
          this.userLists.forEach(ele => {
            if (ele.is_check == 1) {
              this.userIds.push(ele.user_id);
            }
          })
          this.teamForm.user_id = this.userIds.length;
        } else {
          this.$Message.error(res.msg_customer);
        }
      });
    },
    selectUser(val) {
      if (val) {
        this.chooseUser(1);
      }
    },
    //列表切换
    tabClick(val) {
      this.page = 1;
      this.look_name = '';
      this.user_name = '';
      this.team_name = '';
      this.pm_name = '';
      if (this.userType == 0) {
        if (val == "name2" || val == "name3") {
          if (this.columns1.length >= 10) {
            this.columns1.pop();
            this.columns1.pop();
          }
          if (val == "name2") {
            this.init(this.userUrls[1]);
          } else {
            this.init(this.userUrls[2]);
          }
        } else if (val == "name4") {
          this.init(this.userUrls[3]);
        } else {
          if (this.columns1.length < 10) {
            this.columns1.push(this.columnsUse);
            this.columns1.push(this.columnsEdit);
          }
          this.init(this.userUrls[0]);
        }
      } else {
        if (val == "name2") {
          this.init(this.userUrls[1]);
        } else if (val == "name3") {
          this.init(this.userUrls[2]);
        } else if (val == "name1") {
          this.init(this.userUrls[0]);
        } else if (val == "name4") {
          this.init(this.userUrls[3]);
        }
      }
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
            if (res.data) {
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
            }
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
              "type": this.formValidate.type,
              "account": this.formValidate.account,
              "name": this.formValidate.name,
              "password": this.$zxh_fun.encrypt(this.formValidate.password),
              "company_name": this.formValidate.company_name,
              "permission": this.formValidate.permission,
              "head_icon": this.formValidate.head_icon,
              "experience_time": this.formValidate.experience_time ? this.$zxh_fun.getToday(this.formValidate.experience_time) : '0000-00-00 00:00:00',
              "pm_id": this.formValidate.pm_id,
            }).then(
              res => {
                if (res.code == 1) {
                  this.dialogForm = false;
                  this.$refs[name].resetFields();
                  this.logo = "";
                  this.$Message.success("新增成功!");
                  this.formValidate.experience_time = '';
                  if (this.tabActive == "name1") {
                    this.init(this.userUrls[0]);
                  } else if (this.tabActive == "name2") {
                    this.init(this.userUrls[1]);
                  } else {
                    this.init(this.userUrls[2]);
                  }
                } else {
                  this.$Message.error(res.msg_customer);
                }
              }
            );
          } else {
            //修改
            this.$post(this.url.edit, {
              "client": "web",
              "type": this.formValidate.type,
              "account": this.formValidate.account,
              "name": this.formValidate.name,
              "password": this.$zxh_fun.encrypt(this.formValidate.password),
              "company_name": this.formValidate.company_name,
              "permission": this.formValidate.permission,
              "head_icon": this.formValidate.head_icon,
              "experience_time": this.formValidate.experience_time ? this.$zxh_fun.getToday(this.formValidate.experience_time) : '0000-00-00 00:00:00',
              "pm_id": this.formValidate.pm_id,
              "user_id": this.formValidate.user_id,
            }).then(
              res => {
                if (res.code == 1) {
                  this.dialogForm = false;
                  this.$refs[name].resetFields();
                  this.logo = "";
                  this.formValidate.experience_time = '';
                  this.$Message.success("修改成功!");
                  if (this.tabActive == "name1") {
                    this.init(this.userUrls[0]);
                  } else if (this.tabActive == "name2") {
                    this.init(this.userUrls[1]);
                  } else {
                    this.init(this.userUrls[2]);
                  }
                } else {
                  this.$Message.error(res.msg_customer);
                }
              }
            );
          }
        }
      });
    },
    //上传用户头像
    uploadBefore(file, title) {
      let user_type = '',
        user_id = '';
      if (title == "新增工程管理员" || title == "新增小程序用户" || title == "新增APP飞手" || title == "新增特殊工程管理员") {
        user_type = 5;
      } else {
        user_type = 4;
        if (this.dialogSpeacialUser) {
          user_id = this.speacialUserForm.user_id;
        } else {
          user_id = this.formValidate.user_id;
        }
      }
      let isPic = this.$zxh_fun.truePic(file.type, this);
      if (isPic) {
        return;
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
            if (this.dialogSpeacialUser) {
              this.speacialUserForm.head_icon = res.data[0];
            } else {
              this.formValidate.head_icon = res.data[0];
            }
            this.uploadList.push(res.data[0]);
          } else {
            this.$Message.error(res.msg_customer);
          }
        });
      }
    },
    handleRemove(index) {
      this.formValidate.head_icon = "";
      this.uploadList.splice(index, 1);
    },
    //取消操作
    countermand(name) {
      this.$Message.info("取消操作");
      this.logo = "";
      this.formValidate.experience_time = '';
      this.formValidate.pm_id = [];
      this.$refs[name].resetFields();
    },
    //取消新增团队
    countermandTeam(name) {
      this.$Message.info("取消操作");
      this.userIds = [];
      this.$refs[name].resetFields();
    },
    //取消新增特殊管理员
    countermandSpeacailUser(name) {
      this.$Message.info("取消操作");
      this.$refs[name].resetFields();
    },
    //提交特殊管理员
    handleSpeacialUserSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.speacialUserTitle == "新增特殊工程管理员") {
            this.$post("/admin/special_admin_user/specialAdminUserAdd", {
              name: this.speacialUserForm.name,
              account: this.speacialUserForm.account,
              password: this.$zxh_fun.encrypt(this.speacialUserForm.password),
              head_icon: this.speacialUserForm.head_icon
            }).then(
              res => {
                if (res.code == 1) {
                  this.dialogSpeacialUser = false;
                  this.$refs[name].resetFields();
                  this.$Message.success("新增成功!");
                  this.init(this.userUrls[3]);
                } else {
                  this.$Message.error(res.msg_customer);
                }
              }
            );
          } else {
            this.$post("/admin/special_admin_user/specialAdminUserUpdate", {
              user_id: this.speacialUserForm.user_id,
              name: this.speacialUserForm.name,
              account: this.speacialUserForm.account,
              password: this.$zxh_fun.encrypt(this.speacialUserForm.password),
              head_icon: this.speacialUserForm.head_icon
            }).then(
              res => {
                if (res.code == 1) {
                  this.dialogSpeacialUser = false;
                  this.$refs[name].resetFields();
                  this.$Message.success("修改成功!");
                  this.init(this.userUrls[3]);
                } else {
                  this.$Message.error(res.msg_customer);
                }
              }
            );
          }
        }
      })
    },
    //提交新增团队
    handleTeamSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.teamTitle == "新增团队") {
            this.$post("/admin/uav_user_team/teamAdd", {
              team_name: this.teamForm.team_name,
              second_pm_id: this.teamForm.second_pm_id,
              comment: this.teamForm.comment,
              user_ids: this.userIds,
              pm_first_id: this.teamForm.pm_first_id
            }).then(
              res => {
                if (res.code == 1) {
                  this.dialogTeam = false;
                  this.$refs[name].resetFields();
                  this.userIds = [];
                  this.$Message.success("新增成功!");
                  this.init(this.userUrls[0]);
                } else {
                  this.$Message.error(res.msg_customer);
                }
              }
            );
          } else {
            this.$post("/admin/uav_user_team/teamEdit", {
              team_id: this.teamForm.id,
              team_name: this.teamForm.team_name,
              second_pm_id: this.teamForm.second_pm_id,
              comment: this.teamForm.comment,
              user_ids: this.userIds,
            }).then(
              res => {
                if (res.code == 1) {
                  this.dialogTeam = false;
                  this.$refs[name].resetFields();
                  this.userIds = [];
                  this.$Message.success("修改成功!");
                  this.init(this.userUrls[0]);
                } else {
                  this.$Message.error(res.msg_customer);
                }
              }
            );
          }
        }
      })
    },
    //打开新增修改的模态框
    openDialog() {
      this.ispm = true;
      this.pmList = [];
      if (this.tabActive == 'name2') {
        this.title = '新增APP飞手';
        this.formValidate.type = "2";
        this.url = this.posturl[1];
        this.getComMsg();
      } else if (this.tabActive == 'name3') {
        this.title = '新增小程序用户';
        this.formValidate.type = "3";
        this.url = this.posturl[2];
        this.getComMsg();
      }
      this.dialogForm = true;
      this.uploadList = [];
      this.imgName = '点击更换';
      if (this.formValidate.user_id) {
        delete this.formValidate.user_id;
      }
      let url = this.title.includes('工程管理员') ? "/admin/first_pm/pmList" : '/admin/second_pm/secondPmList'
      this.$post(url).then(res => {
        if (res.code == 1) {
          if (res.data) {
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
          }
        } else {
          this.$Message.error(res.msg_customer);
        }
      });
    },
    openTeamDialog() {
      this.teamTitle = "新增团队";
      this.dialogTeam = true;
      this.userIds = [];
      let userMsg = JSON.parse(sessionStorage.getItem('user_info'));
      this.teamForm.pm_first_id = userMsg.pm_id;
      this.teamForm.user_id = '';
      this.initSecondGc();
    },
    openSpeacialDialog() {
      this.teamTitle = "新增特殊工程管理员";
      this.dialogSpeacialUser = true;
    },
    //工程管理员获取自己的信息
    getComMsg() {
      let userMsg = JSON.parse(sessionStorage.getItem('user_info'));
      this.formValidate.company_name = userMsg.company_name;
      this.formValidate.experience_time = userMsg.experience_time != '0000-00-00 00:00:00' ? userMsg.experience_time : '';
      this.logo = userMsg.loge_image_path;
      this.formValidate.permission = userMsg.permission.split(',');
    },
    //编辑详情
    edit: function (item) {
      this.dialogForm = true;
      this.ispm = false;
      if (this.userType == 0) {
        this.title = "编辑工程管理员";
        this.url = this.posturl[0] // 获取编辑工程管理员url
      } else if (this.tabActive == 'name2') {
        this.title = '编辑APP飞手';
        this.formValidate.type = "2";
        this.url = this.posturl[1] // 获取编辑飞手url
      } else if (this.tabActive == 'name3') {
        this.title = '编辑小程序用户';
        this.formValidate.type = "3";
        this.url = this.posturl[2] // 获取编辑小程序url
      }
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
          if (this.tabActive == 'name1') {
            this.formValidate.pm_name = data.pm_name;
          } else {
            this.formValidate.pm_id = [];
            data.pm_name.forEach(ele => {
              this.formValidate.pm_id.push(ele.pm_id);
            })
            this.pmList = data.pm_name;
          }
          this.logo = data.loge_image_path;
          this.uploadList[0] = data.head_icon;
        } else {
          this.$Message.error(response.msg_customer);
        }
      });
    }, //弹出增加框和修改框
    // 编辑特殊管理员
    editSpecialUser(item) {
      this.dialogSpeacialUser = true;
      this.speacialUserTitle = "编辑特殊工程管理员";
      this.$post('/admin/special_admin_user/specialAdminUserDetail', {
        user_id: item.user_id
      }).then(response => {
        let data = response.data;
        if (response.code == 1) {
          this.speacialUserForm = data;
          this.uploadList[0] = data.head_icon;
        } else {
          this.$Message.error(response.msg_customer);
        }
      });
    },
    //删除用户
    delete(row) {
      this.$Modal.confirm({
        title: "系统提示",
        content: `是否删除该条数据?`,
        onCancel: () => {
          this.$Message.info("点击了取消");
        },
        onOk: () => {
          let url = "";
          if (this.tabActive == "name2") {
            url = "/admin/fly_user/userDel";
          } else {
            url = "/admin/mini_user/userDel"
          }
          this.$post(url, {
            user_id: row.user_id
          }).then(res => {
            if (res.code == 1) {
              this.$Message.success(res.msg_customer);
              if (this.tabActive == "name2") {
                this.init(this.userUrls[1]);
              } else {
                this.init(this.userUrls[2]);
              }
            } else {
              this.$Message.error(res.msg_customer);
            }
          });
        }
      });
    },
    //删除特殊工程管理员
    deleteSpecialUser(row) {
      this.$Modal.confirm({
        title: "系统提示",
        content: `是否删除该条数据?`,
        onCancel: () => {
          this.$Message.info("点击了取消");
        },
        onOk: () => {
          this.$post('/admin/special_admin_user/specialAdminUserDel', {
            user_id: row.user_id
          }).then(res => {
            if (res.code == 1) {
              this.$Message.success(res.msg_customer);
              this.init(this.userUrls[3]);
            } else {
              this.$Message.error(res.msg_customer);
            }
          });
        }
      })
    },
    //解散团队
    deleteTeam(row) {
      this.$Modal.confirm({
        title: "系统提示",
        content: `是否要解散这个团队?`,
        onCancel: () => {
          this.$Message.info("点击了取消");
        },
        onOk: () => {
          this.$post("/admin/uav_user_team/teamDel", {
            team_id: row.id
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
      let param = {};
      if (this.tabActive == 'name1') {
        param = {
          limit: 10,
          page: this.page,
          pm_admin_id: this.pm_admin_id,
          user_name: this.user_name,
          team_name: this.team_name,
          pm_name: this.pm_name
        }
      } else if (this.tabActive == 'name4') {
        param = {
          limit: 10,
          page: this.page,
          user_id: this.pm_admin_id
        }
      } else {
        param = {
          limit: 10,
          name: this.look_name,
          page: this.page,
          pm_admin_id: this.pm_admin_id,
        }
      }
      this.$post(params, param).then(response => {
        if (response.code == 1) {
          if (response.data.data.length > 0) {
            if (this.tabActive == 'name1') {
              then.datas = response.data.data.map(ele => {
                return {
                  ...ele,
                  number: ele.user_name ? ele.user_name.split(',').length : 0,
                  name: ele.user_name
                }
              });
            } else if (this.tabActive == 'name4') {
              then.datas = response.data.data.map(ele => {
                let type = "",
                  permissionLists = [];
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
                return {
                  ...ele,
                  type: type,
                  permission: permissionLists.toString(),
                };
              });
            } else {
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
          }
          then.total = response.data.total;
          this.loading = false;
          this.getBindNum();
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
      if (this.tabActive == 'name1') {
        this.$post("/admin/admin_user/userState", {
          user_id: item.user_id,
          state: item.state
        }).then(response => {
          if (response.code == 1) {
            this.init(this.userUrls[0]);
          }
        });
      } else if (this.tabActive == 'name2') {
        this.$post("/admin/fly_user/userState", {
          user_id: item.user_id,
          state: item.state
        }).then(response => {
          if (response.code == 1) {
            this.init(this.userUrls[1]);
          }
        });
      } else if (this.tabActive == 'name3') {
        this.$post("/admin/mini_user/userState", {
          user_id: item.user_id,
          state: item.state
        }).then(response => {
          if (response.code == 1) {
            this.init(this.userUrls[2]);
          }
        });
      } else if (this.tabActive == 'name4') {
        this.$post("/admin/special_admin_user/specialAdminUserState", {
          user_id: item.user_id,
          state: item.state
        }).then(response => {
          if (response.code == 1) {
            this.init(this.userUrls[3]);
          }
        });
      }
    },
    //分页
    changePage: function (index) {
      //点击列表切换
      this.datas = [];
      this.page = index;
      if (this.tabActive == 'name1') {
        this.init(this.userUrls[0]);
      } else if (this.tabActive == 'name2') {
        this.init(this.userUrls[1]);
      } else {
        this.init(this.userUrls[2]);
      }
    },
    //查询
    initChage() {
      this.page = 1;
      if (this.tabActive == 'name1') {
        this.init(this.userUrls[0]);
      } else if (this.tabActive == 'name2') {
        this.init(this.userUrls[1]);
      } else {
        this.init(this.userUrls[2]);
      }
    }
  },
  created: function () {
    this.columns1.push(this.columnsUse);
    this.columns1.push(this.columnsEdit);
    this.userType = sessionStorage.getItem('userType');
    if (this.userType == 0) {
      this.columns.pop();
      this.columns2.pop();
      this.columns2.pop();
    }
    this.init(this.userUrls[0]);
  },
};
