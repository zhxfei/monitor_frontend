<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="loading">


      <el-table-column
        label="user_id"
        align="center"
        v-if="loading">
        <template slot-scope="scope">
          <i class="el-icon-admin"></i>
          <span style="text-align:center">{{ scope.row.user_id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="姓名"
        align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>姓名: {{ scope.row.username }}</p>
            <p>备注: {{ scope.row.comments }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.username }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column
        label="修改日期"
        align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="text-align:center">{{ scope.row.add_time }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="是否为管理员"
        align="center">
        <template slot-scope="scope">
          <i class="el-icon-admin"></i>
          <span style="text-align:center">{{ scope.row.is_admin }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="邮箱"
        align="center">
        <template slot-scope="scope">
          <i class="el-icon-message"></i>
          <span style="text-align:center">{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="电话"
        align="center">
        <template slot-scope="scope">
          <i class="el-icon-phone"></i>
          <span style="text-align:center">{{ scope.row.phone }}</span>
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
    <el-button @click="addUser">添加用户</el-button>


    <el-dialog title="用户编辑"
               :visible.sync="dialogFormVisible"
               width="500px">

      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item
          label="用户名"
          required>
          <el-input v-model="form.username"></el-input>
        </el-form-item>

        <el-form-item label="is admin"
                      required>
          <el-switch v-model="form.admin"></el-switch>
        </el-form-item>

        <el-form-item label="email"
                      required>
          <el-input v-model="form.email"></el-input>
        </el-form-item>

        <el-form-item label="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>

        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.comments"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSure">确 定</el-button>
      </div>

    </el-dialog>


    <el-dialog title="添加用户"
               :visible.sync="dialogUserAddVisible"
               width="500px">

      <el-form ref="userAddForm" :model="userAddForm" label-width="80px" :rules="rulesForAdd">

        <el-form-item
          label="用户名"
          required
          prop="username">
          <el-input v-model="userAddForm.username"></el-input>
        </el-form-item>

        <el-form-item
          label="登录名"
          required
          prop="login_name">
          <el-input v-model="userAddForm.login_name"></el-input>
        </el-form-item>

        <el-form-item
          label="密码"
          required
          prop="password">
          <el-input type="password" auto-complete="off" v-model="userAddForm.password"></el-input>
        </el-form-item>


        <el-form-item
          label="is admin"
          required>
          <el-switch
            v-model="userAddForm.admin"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>

        <el-form-item
          label="email"
          required
          prop="email">
          <el-input v-model="userAddForm.email"></el-input>
        </el-form-item>

        <el-form-item label="phone">
          <el-input v-model="userAddForm.phone"></el-input>
        </el-form-item>

        <el-form-item label="备注">
          <el-input type="textarea" v-model="userAddForm.comments"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUserAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddSure">确 定</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<style>

</style>


<script>
  import qs from "qs";
  import axios from "axios";

  export default {
    data() {
      return {
        tableData: [],
        dialogFormVisible: false,
        dialogUserAddVisible: false,
        loading: true,
        form: {
          user_id: "",
          username: "",
          admin: false,
          email: "",
          phone: "",
          comments: ""
        },
        userAddForm: {
          login_name: "",
          password:"",
          username: "",
          admin: false,
          email: "",
          phone: "",
          comments: ""
        },
        rulesForAdd: {
          login_name: [
            { required: true, message: '请输入登录名', trigger: 'change' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'change' }
          ],
          password: [
            { required: true, message: '请输入登录密码', trigger: 'change' },
            { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'change' }
          ],
          username: [
            { required: true, message: '请输入用户名', trigger: 'change' }
          ],
          email: [
            {type: "email", required: true},
          ],
        },

        formLabelWidth: "200px"
      };
    },
    methods: {
      handleEdit(index, row) {
        this.dialogShowChange('edit');
        (this.form.user_id = row.user_id),
          (this.form.username = row.username),
          (this.form.admin = row.is_admin),
          (this.form.email = row.email),
          (this.form.phone = row.phone),
          (this.form.comments = row.comments);
      },
      handleEditSure() {
        this.dialogShowChange('edit');
        let req_info = qs.stringify(this.form);
        axios
          .put("http://" + this.$apiHost + "/monitor/v1/user/" + this.form.user_id, req_info, {
            headers: {
              "Content-type": "application/x-www-form-urlencoded",
              Accept: "*/*"
            }
          })
          .then(res => {
            this.$notify({
              title: "成功",
              message: "用户 " + res.data.username + " 信息更新成功",
              type: "success"
            });
            this.tableSync();
          })
          .catch(err => {
            console.log(err);
          });
      },
      handleDelete(index, row) {
        console.log(index, row);
        axios
          .delete("http://" + this.$apiHost + "/monitor/v1/user/" + row.user_id, {
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
          })
          .then(res => {
            this.$notify({
              title: "成功",
              message: "删除用户 " + row.username + " 成功",
              type: "success"
            });
            this.tableSync()
          })
          .catch(err => {
            console.log(err);
            this.$notify({
              title: "失败",
              message: "删除用户 " + row.username + " 失败",
              type: "error"
            });
          });
      },
      addUser(){
        this.dialogShowChange('add');
      },
      handleAddSure(){

        this.$refs.userAddForm.validate((valid) => {
          if (valid) {
            let req_info = qs.stringify(this.userAddForm);
            this.dialogShowChange('add');
            axios.post('http://' + this.$apiHost + '/monitor/v1/users', req_info,
              {
                headers: {
                  'Content-type': 'application/x-www-form-urlencoded',
                  'Accept': '*/*'
                }
              })
              .then((res) => {
                this.$notify({
                  title: "成功",
                  message: "添加用户 " + this.userAddForm.username + " 成功",
                  type: "success"
                });
                this.tableSync()
              })
              .catch((err) => {
                this.$notify({
                  title: "失败",
                  message: "添加用户 " + this.userAddForm.username + " 失败",
                  type: "error"
                });
                console.log(err)
              })
          } else {
            console.log('error submit!!');
          }
        });
      },
      dialogShowChange(type) {
        if (type === 'edit'){
          this.dialogFormVisible = !this.dialogFormVisible;
        }else{
          this.dialogUserAddVisible = !this.dialogUserAddVisible;
        }
      },
      tableSync() {
        axios
          .get("http://" + this.$apiHost + "/monitor/v1/users", {
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
          })
          .then(res => {
            this.tableData = res.data;
            this.tableData.map(function (columnData) {
              let date = new Date(columnData.add_time * 1000);
              let Y = date.getFullYear() + "-";
              let M =
                (date.getMonth() + 1 < 10
                  ? "0" + (date.getMonth() + 1)
                  : date.getMonth() + 1) + "-";
              let D = date.getDate() + " ";
              let h = date.getHours() + ":";
              let m = date.getMinutes() + ":";
              let s = date.getSeconds();
              columnData.add_time = Y + M + D + h + m + s;
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
