<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="loading">


      <el-table-column
        label="alerter_id"
        align="center"
        v-if="loading">
        <template slot-scope="scope">
          <i class="el-icon-admin"></i>
          <span style="text-align:center">{{ scope.row.alerter_id }}</span>
        </template>
      </el-table-column>


      <el-table-column
        label="alerter 名称"
        align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>名称: {{ scope.row.name }}</p>
            <p>创建者: {{ scope.row.creator }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column
        label="修改日期"
        align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="text-align:center">{{ scope.row.update_time }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="类型"
        align="center">
        <template slot-scope="scope">
          <i class="el-icon-email"></i>
          <span style="text-align:center">{{ scope.row.type }}</span>
        </template>
      </el-table-column>


      <el-table-column
        label="收敛时间"
        align="center">
        <template slot-scope="scope">
          <i class="el-icon-email"></i>
          <span style="text-align:center">{{ scope.row.convergence_time }}s</span>
        </template>
      </el-table-column>


      <el-table-column
        label="发送给用户"
        align="center">
        <template slot-scope="scope">
          <span style="text-align:center">{{ getUsername(scope.row.to_persons) }}</span>
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
    <el-button @click="addUser">添加Alerter</el-button>


    <el-dialog title="Alerter Edit"
               :visible.sync="dialogFormVisible"
               width="600px">

      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item
          label="Alerter name"
          required>
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="告警类型"
                      required>
          <el-input v-model="form.type"></el-input>
        </el-form-item>

        <el-form-item label="收敛时间"
                      required>
          <el-input v-model="form.convergence_time"></el-input>
        </el-form-item>

        <el-form-item label="发送给哪些用户"
                      required>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="form.to_persons">
            <el-checkbox v-for="user in userAll" :label="user.user_id" :key="user.user_id">{{user.username}}
            </el-checkbox>
          </el-checkbox-group>

        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSure">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加Alerter"
               :visible.sync="dialogUserAddVisible"
               width="600px">

      <el-form ref="userAddForm" :model="userAddForm" label-width="120px" :rules="rulesForAdd">

        <el-form-item
          label="Alerter name"
          required>
          <el-input v-model="userAddForm.name"></el-input>
        </el-form-item>

        <el-form-item label="Alerter type"
                      required>
          <el-input v-model="userAddForm.type"></el-input>
        </el-form-item>

        <el-form-item label="Alerter convergence"
                      required>
          <el-input v-model="userAddForm.convergence_time"></el-input>
        </el-form-item>

        <el-form-item label="to_persons"
                      required>

          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="userAddForm.to_persons">
            <el-checkbox v-for="user in userAll" :label="user.user_id" :key="user.user_id">
              {{ user.username }}
            </el-checkbox>
          </el-checkbox-group>

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
    name: "alerter",
    data() {
      return {
        tableData: [],
        dialogFormVisible: false,
        dialogUserAddVisible: false,
        loading: true,
        form: {
          alerter_id: "",
          name: "",
          type: "",
          convergence_time: "",
          to_persons: [],
        },
        userAddForm: {
          name: "",
          type: "",
          convergence_time: "",
          to_persons: [],
        },
        rulesForAdd: {
          name: [
            {required: true, message: '请输入登录名', trigger: 'change'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'change'}
          ],
          metrics: [
            {required: true, message: '请输入登录密码', trigger: 'change'},
            {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'change'}
          ],
          condition: [
            {required: true, message: '请输入用户名', trigger: 'change'}
          ],
        },
        formLabelWidth: "200px",
        isIndeterminate: true
      };
    },
    computed: {
      userAll() {
        console.log(this.$store.state.usersTable)
        return this.$store.state.usersTable
      }
    },
    methods: {
      handleEdit(index, row) {
        this.dialogShowChange('edit');
        (this.form.alerter_id = row.alerter_id),
          (this.form.name = row.name),
          (this.form.type = row.type),
          (this.form.convergence_time = row.convergence_time),
          (this.form.to_persons = row.to_persons);
      },
      handleEditSure() {
        this.dialogShowChange('edit');
        let req_info = JSON.stringify(this.form);
        axios
          .put("http://" + conf.apiHost + "/monitor/v1/alert/" + this.form.alerter_id, req_info, {
            headers: {
              "Content-type": "application/json",
              Accept: "*/*"
            }
          })
          .then(res => {
            this.$notify({
              title: "成功",
              message: "Alerter " + res.data.name + " 信息更新成功",
              type: "success"
            });
            this.tableSync();
          })
          .catch(err => {
            this.$notify({
              title: "失败",
              message: err.message,
              type: "error"
            });
          });
      },
      handleDelete(index, row) {
        console.log(index, row);
        axios
          .delete("http://" + conf.apiHost + "/monitor/v1/alert/" + row.alerter_id, {
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
            let req_info = JSON.stringify(this.userAddForm);
            this.dialogShowChange('add');
            axios.post('http://' + conf.apiHost + '/monitor/v1/alerts', req_info,
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
              .catch((err) => {
                this.$notify({
                  title: "失败",
                  message: err.message.to_persons,
                  type: "error"
                });
              })
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
          .get("http://" + this.$apiHost + "/monitor/v1/alerts", {
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
      getUsername(idList) {
        let res = [];
        for (let user of this.userAll) {
          if (idList.indexOf(user.user_id) !== -1) {
            res.push(user.username)
          }
        }
        return res
      }
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

<style scoped>

</style>
