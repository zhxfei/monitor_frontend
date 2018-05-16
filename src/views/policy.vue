<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="loading">


      <el-table-column
        label="monitor_id"
        align="center"
        v-if="loading">
        <template slot-scope="scope">
          <i class="el-icon-admin"></i>
          <span style="text-align:center">{{ scope.row.monitor_id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="policy 名称"
        align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>名称: {{ scope.row.name }}</p>
            <p>创建者: {{ scope.row.creator }}</p>
            <p>修改时间: {{ scope.row.update_time }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column
        label="Strategy列表"
        align="center">
        <template slot-scope="scope">
          <i class="el-icon-email"></i>
          <span style="text-align:center">{{ getItemName(scope.row.strategy_id_lst, "strategy") }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="alerter列表"
        align="center">
        <template slot-scope="scope">
          <span style="text-align:center">{{ getItemName(scope.row.alerter_id_lst, "alerter") }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="tags"
        align="center">
        <template slot-scope="scope">
          <span style="text-align:center">{{ scope.row.tags }}</span>
        </template>
      </el-table-column>


      <el-table-column
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <br>
    <br>
    <el-button @click="addUser">添加Policy</el-button>


    <el-dialog title="Policy Edit"
               :visible.sync="dialogFormVisible"
               width="1000px">

      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item
          label="Policy name"
          required>
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="Policy Strategy" required>
          <div class="dialog-transfer">
            <el-transfer
              filterable
              filter-placeholder="输入Strategy名称字段搜索"
              v-model="form.strategy_id_lst"
              :data="dialogStrategy">
            </el-transfer>
          </div>
        </el-form-item>

        <el-form-item label="Policy alerter" required>
          <div class="dialog-transfer">
            <el-transfer
              filterable
              filter-placeholder="输入Alerter名称字段搜索"
              v-model="form.alerter_id_lst"
              :data="dialogAlerter">
            </el-transfer>
          </div>
        </el-form-item>

        <el-form-item
          label="Policy tags"
          required>
          <el-input v-model="form.tags"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSure">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加 Policy"
               :visible.sync="dialogUserAddVisible"
               width="1000px">

      <el-form ref="userAddForm" :model="userAddForm" label-width="120px">
        <!--:rules="rulesForAdd"-->

        <el-form-item
          label="Policy name"
          required>
          <el-input v-model="userAddForm.name"></el-input>
        </el-form-item>

        <el-form-item label="Policy Strategy" required>
          <div class="dialog-transfer">
            <el-transfer
              filterable
              filter-placeholder="输入Strategy名称字段搜索"
              v-model="userAddForm.strategy_id_lst"
              :data="dialogStrategy">
            </el-transfer>
          </div>
        </el-form-item>

        <el-form-item label="Policy alerter" required>
          <div class="dialog-transfer">
            <el-transfer
              filterable
              filter-placeholder="输入Alerter名称字段搜索"
              v-model="userAddForm.alerter_id_lst"
              :data="dialogAlerter">
            </el-transfer>
          </div>
        </el-form-item>

        <el-form-item
          label="Policy tags"
          required>
          <el-input v-model="userAddForm.tags"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUserAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddSure">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>


<script>
  import axios from "axios";
  import conf from "../config"

  export default {
    name: "policy",
    data() {

      return {
        tableData: [],
        dialogFormVisible: false,
        dialogUserAddVisible: false,
        loading: true,
        form: {
          name: "",
          monitor_id: "",
          strategy_id_lst: [],
          alerter_id_lst: [],
          tags: "",
        },
        userAddForm: {
          name: "",
          alert_id_lst: [],
          strategy_id_lst: [],
          tags: "",
        },
        rulesForAdd: {},

        formLabelWidth: "200px",
        isIndeterminate: true
      };
    },
    computed: {
      strategyAll() {
        return this.$store.state.strategyAll
      },
      alertAll() {
        return this.$store.state.alerterAll
      },
      dialogStrategy() {
        let res = [];
        this.strategyAll.forEach((strategy, index) => {
          res.push({
            label: strategy.name,
            key: strategy.strategy_id
          })
        });
        return res
      },
      dialogAlerter() {
        let res = [];
        this.alertAll.forEach((alerter, index) => {
          res.push({
            label: alerter.name,
            key: alerter.alerter_id
          })
        });
        return res
      }
    },
    methods: {
      handleEdit(index, row) {
        this.dialogShowChange('edit');
        (this.form.name = row.name),
          (this.form.monitor_id = row.monitor_id),
          (this.form.strategy_id_lst = row.strategy_id_lst),
          (this.form.alerter_id_lst = row.alerter_id_lst),
          (this.form.tags = JSON.stringify(row.tags));
      },
      handleEditSure() {
        this.dialogShowChange('edit');

        try{
          let tmp = this.form.tags;
          this.form.tags = JSON.parse(this.form.tags);
          let req_info = JSON.stringify(this.form);
          this.form.tags = tmp;
          axios
            .put("http://" + conf.apiHost + "/monitor/v1/policy/" + this.form.monitor_id, req_info, {
              headers: {
                "Content-type": "application/json",
                Accept: "*/*"
              }
            })
            .then(res => {
              this.$notify({
                title: "成功",
                message: "Monitor " + res.data.name + " 信息更新成功",
                type: "success"
              });
              this.tableSync();
            })
            .catch(err => {
              for (let e in err){
                this.$notify({
                  title: "失败",
                  message: err[e],
                  type: "error"
                });
              }
            });
        }catch (e) {
          this.$notify({
            title: "失败",
            message: "请在tag中输入正确的JSON字符串",
            type: "error"
          });
        }
      },
      handleDelete(index, row) {
        console.log(index, row);
        axios
          .delete("http://" + conf.apiHost + "/monitor/v1/policy/" + row.monitor_id, {
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
          })
          .then(res => {
            this.$notify({
              title: "成功",
              message: "删除Alerter " + row.name + " 成功",
              type: "success"
            });
            this.tableSync()
          })
          .catch(err => {
            console.log(err);
            this.$notify({
              title: "失败",
              message: "删除Alerter " + row.name + " 失败",
              type: "error"
            });
          });
      },
      addUser() {
        this.dialogShowChange('add');
      },
      handleAddSure() {
        this.$refs.userAddForm.validate((valid) => {
          if (valid) {
            this.dialogShowChange('add');
            let tmp = this.userAddForm.tags;
            try{
              this.userAddForm.tags = JSON.parse(tmp);
              let req_info = JSON.stringify(this.userAddForm);
              this.userAddForm.tags = tmp;
              axios.post('http://' + conf.apiHost + '/monitor/v1/policies', req_info,
                {
                  headers: {
                    'Content-type': 'application/json',
                    'Accept': '*/*'
                  }
                })
                .then((res) => {
                  this.$notify({
                    title: "成功",
                    message: "添加Alerter " + this.userAddForm.name + " 成功",
                    type: "success"
                  });
                  this.tableSync()
                })
                .catch((e) => {
                  for (let err in e){
                    this.$notify({
                      title: "失败",
                      message: e[err],
                      type: "error"
                    });
                  }
                })
            }catch (e) {
              this.$notify({
                title: "失败",
                message: "请在tag中输入正确的JSON字符串",
                type: "error"
              });
            }
          } else {
            console.log('error submit!!');
          }
        });
      },
      dialogShowChange(type) {
        if (type === 'edit') {
          this.dialogFormVisible = !this.dialogFormVisible;
        } else {
          this.dialogUserAddVisible = !this.dialogUserAddVisible;
        }
      },
      tableSync() {
        axios
          .get("http://" + conf.apiHost + "/monitor/v1/policies", {
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
          })
          .then(res => {
            this.tableData = res.data;
            this.tableData.map(function (columnData) {
              let date = new Date(columnData.update_time * 1000);
              let Y = date.getFullYear() + "-";
              let M =
                (date.getMonth() + 1 < 10
                  ? "0" + (date.getMonth() + 1)
                  : date.getMonth() + 1) + "-";
              let D = date.getDate() + " ";
              let h = date.getHours() + ":";
              let m = date.getMinutes() + ":";
              let s = date.getSeconds();
              columnData.update_time = Y + M + D + h + m + s;
              return columnData;
            });
          })
          .catch(err => {
            console.log(err);
          });
      },
      getItemName(idList, type) {
        let res = [];
        let data = type === "strategy" ? this.strategyAll : this.alertAll;
        let condition = type === "strategy" ? 'strategy_id' : "alerter_id";

        for (let item of data) {
          if (idList.indexOf(item[condition]) !== -1){
            res.push(item.name)
          }
        }
        return res
      },
    },
    mounted() {
      this.tableSync();
    },
    watch: {
      tableData: {
        handler() {
          this.loading = false;
        }
      }
    }
  };
</script>

<style>
  .dialog-transfer {
    width: 800px;
  }

  .el-transfer-panel {
    width: 350px;
  }

  .el-transfer-panel__item .el-checkbox__input {
    position: absolute;
    top: 8px;
    left: 20px;
  }
</style>
