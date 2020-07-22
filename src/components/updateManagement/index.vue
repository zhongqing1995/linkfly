<template>
  <div class="update commonStyle">
    <div class="content">
      <Row>
        <Col
          :span="4"
          style="display: inline-block;
                font-size: 0.3rem;
                color: #151314;
                font-family: PingFang SC;
                font-weight: 500;"
        >历史版本下载</Col>
        <Col :offset="14" :span="4">
          <Select
            size="small"
            v-model="type"
            style="width:180px"
            placeholder="ios/安卓"
            @on-change="initLists"
          >
            <Option :value="0">IOS</Option>
            <Option :value="1">Android</Option>
          </Select>
        </Col>
        <Col :span="2">
          <Button size="small" type="success" @click="toAdd">上传新版本</Button>
        </Col>
      </Row>
      <div class="table">
        <Table :loading="loading" :columns="columns" :data="tabData" height="500" size="small"></Table>
        <Page class="page" show-total :total="total" @on-change="changePage"></Page>
      </div>
    </div>
    <!-- 编辑新增 -->
    <Modal
      v-model="modal"
      title="上传新版本"
      width="600"
      :mask-closable="false"
      @on-cancel="handleReset('formInline')"
    >
      <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="100">
        <Row>
          <Col span="24">
            <form-item label="版本号" prop="version">
              <Input type="text" placeholder="请输入版本号" v-model="formInline.version" clearable></Input>
            </form-item>
          </Col>
          <Col span="24">
            <form-item label="版本说明" prop="remark">
              <Input type="text" placeholder="请输入版本说明" v-model="formInline.remark" clearable></Input>
            </form-item>
          </Col>
          <Col span="24">
            <form-item label="上传文件" prop="file">
              <Upload action :before-upload="uploadBefore">
                <Button icon="ios-cloud-upload-outline" style="width:460px;">{{fileName}}</Button>
              </Upload>
            </form-item>
          </Col>
          <Col span="24">
            <form-item label="是否强制更新" prop="is_force">
              <i-switch v-model="formInline.is_force" size="small" />
            </form-item>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="handleReset('formInline')">取消</Button>
        <Button type="primary" @click="handleSubmit('formInline')">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      type: 1,
      loading: false,
      total: 0,
      page: 1,
      modal: false,
      tabData: [],
      columns: [
        {
          title: "时间",
          key: "create_time",
          align: "center"
        },
        {
          title: "版本号",
          key: "version",
          align: "center"
        },
        {
          title: "说明",
          key: "remark",
          align: "center"
        },
        {
          title: "下载",
          align: "center",
          render: (h, params) => {
            return h("img", {
              attrs: {
                src: "/static/publicimg/download.png"
              },
              style: {
                marginRight: "8px",
                width: "0.19rem",
                height: "0.2rem"
              },
              on: {
                click: () => {
                  window.open(params.row.url);
                }
              }
            });
          }
        },
        {
          title: "删除",
          align: "center",
          render: (h, params) => {
            return h("img", {
              attrs: {
                src: "/static/publicimg/delete.png"
              },
              style: {
                width: "0.19rem",
                height: "0.2rem"
              },
              on: {
                click: () => {
                  this.delete(params.row);
                }
              }
            });
          }
        }
      ],
      formInline: {
        remark: "",
        type: 1,
        is_force: true,
        file: []
      },
      fileName: "点击上传",
      ruleInline: {
        version: [
          {
            required: true,
            message: "请输入版本号",
            trigger: "blur"
          }
        ],
        remark: [
          {
            required: true,
            message: "请输入版本说明",
            trigger: "blur"
          }
        ],
        file: [
          {
            required: true,
            message: "请上传文件"
          }
        ]
      }
    };
  },
  mounted() {
    this.initLists();
  },
  methods: {
    uploadBefore(file) {
      if (file) {
        if (file.name.indexOf(".apk") > -1) {
          this.formInline.file = file;
          this.fileName = file.name;
        } else {
          this.$Message.error("上传合理的版本文件！");
        }
      }
    },
    toAdd() {
      this.modal = true;
      this.fileName = "点击上传";
      this.formInline = {
        remark: "",
        type: 1,
        is_force: true,
        file: []
      };
    },
    initLists() {
      this.loading = true;
      this.$post("/admin/app_sys_version/versionList", {
        limit: 10,
        type: this.type,
        page: this.page
      }).then(res => {
        if (res.code == 1) {
          this.tabData = res.data.data;
          this.total = res.data.total;
          this.loading = false;
        } else {
          this.$Message.error(res.msg_customer);
          this.loading = false;
        }
      });
    },
    changePage(val) {
      this.page = val;
      this.initLists();
    },
    delete(item) {
      this.$Modal.confirm({
        title: "系统提示",
        content: `是否删除此条数据?`,
        onCancel: () => {
          this.$Message.info("点击了取消");
        },
        onOk: () => {
          this.$post("/admin/app_sys_version/versionDel", {
            id: item.id
          }).then(res => {
            if (res.code == 1) {
              this.initLists();
            } else {
              this.$Message.error(res.msg_customer);
            }
          });
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.modal = false;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let fm = new FormData();
          fm.append("file[]", this.formInline.file);
          fm.append("remark", this.formInline.remark);
          fm.append("type", 1);
          fm.append("is_force", this.formInline.is_force);
          fm.append("version", this.formInline.version);
          this.$fromdata("/admin/app_sys_version/versionAdd", fm).then(res => {
            if (res.code == 1) {
              this.$Message.success(res.msg_customer);
              this.modal = false;
              this.initLists();
              this.$refs[name].resetFields();
            } else {
              this.$Message.error(res.msg_customer);
            }
          });
        } else {
        }
      });
    }
  }
};
</script>