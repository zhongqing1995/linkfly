<template>
    <div id="KML">
      <Table
        style="margin: 5px"
        :loading="loading"
        :columns="columns"
        :data="tabData"
        max-height="540"
        size="small"
      ></Table>
      <Page class="page" show-total :total="total" @on-change="changePage"></Page>
    </div>
</template>

<script>
    export default {
      name: "KML",
      data(){
          return{
            userType:'',
            userInfo:{},
            total: 0,
            page: 1,
            loading: false,
            columns: [
              {
                title: "KML名称",
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
                key: "create_time"
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
            tabData: [],
            secondData:{}
          }
      },
      mounted() {
        this.userType = sessionStorage.getItem("userType");
        this.userInfo =JSON.parse(sessionStorage.getItem("user_info"));
        this.secondData=JSON.parse(sessionStorage.getItem("secondData"));
        this.initLists();
      },
      methods:{
        initLists(){
          this.loading = true;
          this.$post("/newversion/task/newTaskKmlList", {
            first_pm_id:this.userType==0?this.secondData.pm_id:this.userInfo.pm_id,
            limit: 10,
            page: this.page
          }).then(res=> {
            this.loading = false;
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
        delete(val){
          console.log(val);
          this.$Modal.confirm({
            title: "系统提示",
            content: `是否删除该条KML?`,
            onCancel: () => {
              this.$Message.info("点击了取消");
            },
            onOk: () => {
              this.$post("/newversion/task/newTaskKmlDel", {
                task_kml_id: val.id
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
