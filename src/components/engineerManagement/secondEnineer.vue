<template>
  <div class="commonStyle">
    <!-- 超级管理员的二级工程 -->
    <div class="content">
      <div class="header">
        <Breadcrumb class="titleName" style="display:inline-block;">
          <BreadcrumbItem to="/index/engineerManagement">工程项目管理</BreadcrumbItem>
          <BreadcrumbItem>{{rowData.pm_name}}</BreadcrumbItem>
        </Breadcrumb>
        <div class="search">
          <label for>项目名：</label>
          <Input
            size="small"
            v-model="projectName"
            placeholder="请输入项目名"
            style="width: 150px"
            clearable
          />
          <label for>项目类型：</label>
          <Cascader
            class="zxh_cascader"
            size="small"
            :data="projectTypeLists"
            v-model="pm_type"
            style="width:150px;display: inline-block"
            change-on-select
            placeholder="请选择项目类型"
          ></Cascader>
          <label for>日期：</label>
          <Date-picker
            size="small"
            format="yyyy-MM-dd"
            type="date"
            placeholder="请选择日期"
            @on-change="dateTime=$event"
            style="width: 150px"
          ></Date-picker>
          <Button size="small" @click="search(1)" type="primary">查询</Button>
        </div>
      </div>
      <div class="table">
        <Table :loading="loading" :columns="columns" :data="tabData" max-height="540" size="small"></Table>
        <Page class="page" show-total :total="total" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal v-model="dialogShowMap" title="查看位置" width="600">
      <LookMap v-if="dialogShowMap" :map_point="map_point" :map_type="map_type"></LookMap>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import ChooseMap from "../Map/chooseMap";
import LookMap from "../Map/lookMap";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      projectName: "",
      map_point: "",
      map_type: "",
      dialogShowMap: false,
      dateTime: "",
      pm_type: [],
      page: 1,
      total: 0,
      tabData: [],
      loading: false,
      columns: [
        {
          title: "工程名称",
          key: "pm_name",
          align: "center"
        },
        {
          title: "成立时间",
          key: "start_time",
          align: "center"
        },
        {
          title: "项目类型",
          key: "pm_type",
          align: "center"
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
                      this.map_point = params.row.location;
                      this.map_type = params.row.location_type;
                    }
                  }
                },
                ""
              )
            ]);
          },
          align: "center"
        },
        {
          title: "负责人",
          key: "pm_administrator",
          align: "center"
        },
        {
          title: "备注",
          key: "comment",
          align: "center"
        },
        {
          title: "操作",
          width: 120,
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
                    width: "0.19rem",
                    height: "0.2rem"
                  },
                  on: {
                    click: () => {
                      this.toNextEngineer(params.row);
                    }
                  }
                },
                "查看"
              )
            ]);
          }
        }
      ], //二级列表
      projectTypeLists: []
    };
  },
  computed: {
    ...mapState(["rowData"])
  },
  components: {
    LookMap,
    ChooseMap
  },
  mounted() {
    this.projectTypeLists = this.$zxh_fun.projectTypeLists;
    this.search();
  },
  methods: {
    ...mapActions(["getThreeData"]),
    //列表
    search(index) {
      if (index) {
        this.page = 1;
      }
      this.loading = true;
      this.$post("/admin/first_pm/secondPmListFirst", {
        pm_type: this.pm_type[this.pm_type.length - 1],
        pm_name: this.projectName,
        start_time: this.dateTime,
        pm_first_id: this.rowData.pm_id,
        limit: 10,
        page: this.page
      }).then(response => {
        this.loading = false;
        if (response.code == 1) {
          this.tabData = response.data.data;
          this.tabData = this.tabData.map(ele => {
            let type = "";
            switch (ele.pm_type) {
              case 1:
                type = "工程实体";
                break;
              case 2:
                type = "安全生产";
                break;
              case 3:
                type = "其他";
                break;
              default:
                type = "文明施工";
                break;
            }
            return {
              ...ele,
              pm_type: type
            };
          });
          this.total = response.data.total;
        } else {
          this.$Message.error(response.msg_customer);
        }
      });
    },
    //分页
    changePage(val) {
      this.page = val;
      this.search();
    },
    toNextEngineer(data) {
      this.$router.push("/index/thirdEngineerManagement");
      sessionStorage.setItem('threeData', JSON.stringify(data));
      this.getThreeData(data);
    }
  },
  watch: {},
  beforeDestroy() {}
};
</script>
<style lang="less" scoped>
</style>
