<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="loading">


      <el-table-column
        label="strategy_id"
        align="center"
        v-if="loading">
        <template slot-scope="scope">
          <i class="el-icon-admin"></i>
          <span style="text-align:center">{{ scope.row.strategy_id }}</span>
        </template>
      </el-table-column>


      <el-table-column
        label="策略名称"
        align="center">
        <template slot-scope="scope">
          <!--<i class="el-icon-phone"></i>-->
          <span style="text-align:center">{{ scope.row.name }}</span>
        </template>
      </el-table-column>


      <el-table-column
        label="指标名称"
        align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>指标: {{ scope.row.metrics }}</p>
            <p>创建者: {{ scope.row.creator }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.metrics }}</el-tag>
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
        label="表达式"
        align="center">
        <template slot-scope="scope">
          <i class="el-icon-admin"></i>
          <span style="text-align:center">{{ scope.row.condition }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="指标等级"
        align="center">
        <template slot-scope="scope">
          <!--<i class="el-icon-message"></i>-->
          <span style="text-align:center">{{ scope.row.grade }}</span>
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
    <el-button @click="addUser">添加Strategy</el-button>


    <el-dialog title="Strategy Edit"
               :visible.sync="dialogFormVisible"
               width="600px">

      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item
          label="Strategy name"
          required>
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="item name"
                      required>
          <el-input v-model="form.metrics"></el-input>
        </el-form-item>

        <el-form-item label="condition"
                      required>
          <el-input v-model="form.condition"></el-input>
        </el-form-item>

        <el-form-item label="grade">
          <el-input v-model="form.grade"></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSure">确 定</el-button>
      </div>

    </el-dialog>


    <el-dialog title="添加Strategy"
               :visible.sync="dialogUserAddVisible"
               width="600px">

      <el-form ref="userAddForm" :model="userAddForm" label-width="120px" :rules="rulesForAdd">

        <el-form-item
          label="Strategy name"
          required>
          <el-input v-model="userAddForm.name"></el-input>
        </el-form-item>

        <el-form-item label="item name"
                      required>
          <el-input v-model="userAddForm.metrics"></el-input>
        </el-form-item>

        <el-form-item label="condition"
                      required>
          <el-input v-model="userAddForm.condition"></el-input>
        </el-form-item>

        <el-form-item label="grade">
          <el-input v-model="userAddForm.grade"></el-input>
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
  import qs from "qs";
  import axios from "axios";

  export default {
    name: "strategy",
    data() {
      return {
        tableData: [],
        dialogFormVisible: false,
        dialogUserAddVisible: false,
        loading: true,
        form: {
          strategy_id: "",
          name: "",
          metrics: "",
          condition: "",
          grade: "",
        },
        userAddForm: {
          name: "",
          metrics: "",
          condition: "",
          grade: "",
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

        formLabelWidth: "200px"
      };
    },
    methods: {
      handleEdit(index, row) {
        this.dialogShowChange('edit');
        (this.form.strategy_id = row.strategy_id),
          (this.form.name = row.name),
          (this.form.metrics = row.metrics),
          (this.form.condition = row.condition),
          (this.form.grade = row.grade);
      },
      handleEditSure() {
        this.dialogShowChange('edit');
        let req_info = qs.stringify(this.form);
        axios
          .put("http://" + this.$apiHost + "/monitor/v1/strategy/" + this.form.strategy_id, req_info, {
            headers: {
              "Content-type": "application/x-www-form-urlencoded",
              Accept: "*/*"
            }
          })
          .then(res => {
            this.$notify({
              title: "成功",
              message: "Strategy " + res.data.name + " 信息更新成功",
              type: "success"
            });
            this.tableSync();
          })
          .catch(err => {
            this.$notify({
              title: "失败",
              message: err.message.grade,
              type: "error"
            });
          });
      },
      handleDelete(index, row) {
        console.log(index, row);
        axios
          .delete("http://" + this.$apiHost + "/monitor/v1/strategy/" + row.strategy_id, {
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
          })
          .then(res => {
            this.$notify({
              title: "成功",
              message: "删除Strategy " + row.name + " 成功",
              type: "success"
            });
            this.tableSync()
          })
          .catch(err => {
            console.log(err);
            this.$notify({
              title: "失败",
              message: "删除Strategy " + row.name + " 失败",
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
            let req_info = qs.stringify(this.userAddForm);
            this.dialogShowChange('add');
            axios.post('http://' + this.$apiHost + '/monitor/v1/strategies', req_info,
              {
                headers: {
                  'Content-type': 'application/x-www-form-urlencoded',
                  'Accept': '*/*'
                }
              })
              .then((res) => {
                this.$notify({
                  title: "成功",
                  message: "添加Strategy " + this.userAddForm.name + " 成功",
                  type: "success"
                });
                this.tableSync()
              })
              .catch((err) => {
                this.$notify({
                  title: "失败",
                  message: err.message.grade,
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
          .get("http://" + this.$apiHost + "/monitor/v1/strategies", {
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
