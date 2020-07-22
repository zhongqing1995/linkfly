<template>
  <div class="tasktype">
    <div class="name">
      <span>任务类型</span>
      <i-button size="small" class="new_task_btn" type="success" @click="showTask = true">新建任务类型</i-button>
    </div>
    <Table
      style="margin-top:30px;"
      :row-class-name="rowClassName"
      :columns="column"
      :data="Tabledata"
      :loading="loading"
      height="480"
      size="small"
    >
      <template slot-scope="{ row}" slot="action">
        <img
          src="../../../static/publicimg/delete.png"
          alt="删除"
          title="我要删除你"
          @click="deleteTask(row)"
          class="img"
        />
      </template>
    </Table>
    <Page class="split_page" show-total :total="total" @on-change="changePage"></Page>
    <Modal v-model="showTask" class="Modal" mask-closable :loading="loading">
      <div>
        <img src="../../../static/publicimg/task.png" alt /> 新建任务类型
      </div>
      <Form :model="formItem" :label-width="80" class="form" :rules="ruleValidate" ref="form">
        <Row>
          <Col span="11">
            <FormItem label="任务名称" prop="name">
              <Input v-model="formItem.name" placeholder="请输入任务名称"></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="创建时间" prop="crete_time">
              <DatePicker
                type="date"
                format="yyyy-MM-dd"
                placeholder="请选择时间"
                @on-change="formItem.create_time=$event"
                v-model="formItem.create_time"
              ></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22">
            <FormItem label="备注">
              <Input v-model="formItem.description" placeholder="请输入备注"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="handleReset('form')">取消</Button>
        <Button type="primary" @click="submit('form')">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "tasktype",
  data() {
    return {
      total: 0,
      pre_page: 1,
      showTask: false, //新建任务类型弹窗口
      loading: true,
      formItem: {}, // 提交的表单
      ruleValidate: {
        name: [
          {
            required: true,
            message: "任务名称不能为空",
            trigger: "blur"
          }
        ],
        create_time: [
          {
            required: true,
            message: "时间不能为空",
            trigger: "blur"
          }
        ]
      },
      column: [
        {
          title: "创建时间",
          key: "data_create_time",
          align: "center"
        },
        {
          title: "任务名称",
          key: "name",
          align: "center"
        },
        {
          title: "说明",
          key: "description",
          align: "center"
        },
        {
          title: "操作",
          slot: "action",
          width: 120,
          align: "center"
        }
      ],
      Tabledata: []
    };
  },
  updated() {
    console.log(this.formItem);
  },
  methods: {
    rowClassName(row, index) {
      return "line_height_row";
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.showTask = false;
    },
    submit(formname) {
      this.$refs[formname].validate(valid => {
        if (valid) {
          this.addTaskData();
        } else {
          this.$Message.error("请完成所有必填项好吗");
        }
      });
    }, // 提交新建任务表单
    addTaskData() {
      let parms = this.formItem;
      this.$post("/admin/task_type/taskTypeAdd", parms).then(res => {
        if (res.code != 1) {
          this.$Notice.warning({
            title: "系统提示",
            desc: res.msg_customer
          });
          this.showTask = true;
        } else {
          this.$Message.success(res.msg_customer);
          this.showTask = false;
          this.getTasktpe();
        }
      });
    },
    deleteTask(row) {
      this.$Modal.confirm({
        title: "系统提示",
        content: `确认删除任务名称为 '${row.name}' 的信息？`,
        onCancel: () => {
          this.$Message.info("点击了取消");
        },
        onOk: () => {
          this.$post("/admin/task_type/taskTypeDelete", {
            task_type_id: row.id
          }).then(res => {
            if (res.code > 0) {
              this.$Message.success("删除成功");
              this.getTasktpe();
            } else {
              this.$Notice.warning({
                title: "系统提示",
                desc: res.msg_customer
              });
            }
          });
        }
      });
    },
    getTasktpe() {
      // 获取任务类型的数据
      this.loading = true;
      this.$post("/admin/task_type/taskTypeListPage", {
        page: this.pre_page,
        limit: 10
      }).then(res => {
        if (res.code > 0) {
          this.Tabledata = res.data.data;
          this.total = res.data.total;
          this.loading = false; // 关闭加载框
        } else {
          this.$Notice.warning({
            title: "系统提示",
            desc: res.msg_customer
          });
          this.loading = false;
        }
      });
    },
    changePage(page) {
      this.pre_page = page;
      this.getTasktpe();
    }
  },
  created() {
    this.getTasktpe();
  }
};
</script>

<style lang="less" scoped>
@import url("./task.less");
.tasktype {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 12px rgba(1, 0, 55, 0.15);
  opacity: 1;
  border-radius: 20px;
  margin-top: 0.16rem;
  overflow: hidden;
  padding: 0px 0.62rem;
}
</style>