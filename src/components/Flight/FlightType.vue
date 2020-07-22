<template>
  <div class="topDIV">
    <div class="name">
      <span>作业类型</span>
      <i-button size="small" class="new_task_btn" type="success" @click="showTask = true">新建作业类型</i-button>
    </div>
    <Table style="margin-top:30px;" :row-class-name="rowClassName" :columns="column" :data="Tabledata" :loading="loading" height='480' size='small'>
      <template slot-scope="{ row }" slot="action">
        <img
          src="../../../static/publicimg/delete.png"
          alt="删除"
          title="我要删除你"
          @click="deleteTask(row)"
          class="img"
        >
      </template>
    </Table>
    <Page class="split_page" show-total :total="total" @on-change="changePage"></Page>
    <Modal v-model="showTask" class="Modal" mask-closable :loading="loading">
      <div>
        <img src="../../../static/publicimg/task.png" alt> 新建作业类型
      </div>
      <Form :model="formItem" :label-width="80" class="form" :rules="ruleValidate" ref="form">
        <Row>
          <Col span="11">
            <FormItem label="作业类型" prop="name">
              <Input v-model="formItem.name" placeholder="请输入任务名称"></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="创建时间">
              <DatePicker
                type="date"
                format="yyyy-MM-dd"
                placeholder="请选择时间"
                v-model="formItem.dates"
              ></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22">
            <FormItem label="描述" prop="description">
              <Input v-model="formItem.description" placeholder="请输入描述信息"></Input>
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
      per_page: 1,
      showTask: false, //新建任务类型弹窗口
      loading: true,
      loading: false,
      formItem: {
        // 提交的表单
        dates: ""
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "名称不能为空",
            trigger: "blur"
          }
        ],
        description: [
          {
            required: true,
            message: "描述不能为空",
            trigger: "blur"
          }
        ]
      },
      column: [
        {
          title: "创建时间",
          key: "data_create_time",
          align:'center'
        },
        {
          title: "类型名称",
          key: "name",
          align:'center'
        },
        {
          title: "描述",
          key: "description",
          align:'center'
        },
        {
          title: "操作",
          slot: "action",
          width: 120,
          align:'center'
        }
      ],
      Tabledata: []
    };
  },
  updated() {
    console.log(this.formItem);
  },
  methods: {
    handleReset(name) {
      this.$refs[name].resetFields();
      this.showTask = false;
    },
    changePage(page) {
      this.per_page = page;
      this.getTaskTypeData();
    },
    rowClassName(row, index) {
      return "line_height_row";
    },
    submit(formname) {
      this.$refs[formname].validate(valid => {
        if (valid) {
          this.addtaskType();
        } else {
          this.$Message.error("请完成所有必填项好吗");
        }
      });
    }, // 提交新建任务表单
    addtaskType() {
      // 添加任务类型
      let parms = this.formItem;
      this.$post("/admin/flight_task_type/taskTypeAdd", parms).then(res => {
        if (res.code != 1) {
          this.$Notice.warning({
            text: "系统提示",
            desc: res.msg_customer
          });
          this.showTask = true; //
        } else {
          this.$Message.success(res.msg_customer);
          this.showTask = false;
          this.getTaskTypeData();
        }
      });
    },
    deleteTask(row) {
      this.$Modal.confirm({
        title: "系统提示",
        content: `确认删除类型名称为 '${row.name}' 的信息？`,
        onCancel: () => {
          this.$Message.info("点击了取消");
        },
        onOk: () => {
          this.$post("/admin/flight_task_type/taskTypeDel", {
            task_type_id: row.id
          }).then(res => {
            if (res.code > 0) {
              this.$Message.success("删除成功");
              this.getTaskTypeData();
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
    getTaskTypeData() {
      // 获取任务类型的列表
      this.loading = true;
      this.$post("/admin/flight_task_type/taskTypeListPage", {
        page: this.per_page,
        limit: 10
      }).then(res => {
        this.loading = false;
        if (res.code != 1) {
          this.$Message.warning(res.msg_customer);
          return false;
        } else {
          this.Tabledata = res.data.data;
          this.total = res.data.total;
        }
      });
    }
  },
  mounted() {
    this.getTaskTypeData();
  }
};
</script>

<style lang="less" scoped>
@import url("./Flight.less");
</style>