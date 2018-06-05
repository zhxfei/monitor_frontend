<template>
  <div>
    <h1><span @click="changeDialogShow">Login Component</span></h1>
    <el-dialog title="登录"
               :visible.sync="dialogUserLogin"
               width="500px">

      <el-form ref="rulesUserLogin" :model="userLoginForm" label-width="80px" :rules="rulesUserLogin">

        <el-form-item
          label="登录名"
          required
          prop="login_name">
          <el-input v-model="userLoginForm.login_name"></el-input>
        </el-form-item>

        <el-form-item
          label="密码"
          required
          prop="password">
          <el-input type="password" auto-complete="off" v-model="userLoginForm.password"></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUserLogin = false">取 消</el-button>
        <el-button type="primary" @click="handleLogin">确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>


<script>
  import * as types from '../store/types'

  export default {
    name: 'login',
    data() {
      return {
        dialogUserLogin: true,
        loading: true,
        userLoginForm: {
          login_name: "",
          password: "",
        },
        rulesUserLogin: {
          login_name: [
            {required: true, message: '请输入登录名', trigger: 'change'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'change'}
          ],
          password: [
            {required: true, message: '请输入登录密码', trigger: 'change'},
            {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'change'}
          ],
        },

        formLabelWidth: "200px"
      };
    },
    methods: {
      changeDialogShow() {
        this.dialogUserLogin = !this.dialogUserLogin
      },
      handleLogin() {

        this.$refs.rulesUserLogin.validate((valid) => {
          if (valid) {

            this.axios.get('http://' + this.$apiHost + '/monitor/v1/token',
              {
                auth: {
                  username: this.userLoginForm.login_name,
                  password: this.userLoginForm.password
                },
              })
              .then((res) => {
                console.log(res)
                this.$notify({
                  title: "成功",
                  message: "用户 " + this.userLoginForm.login_name + " 登录成功",
                  type: "success"
                });
                let token = res.data.token;
                if (token) {
                  this.$store.commit(types.LOGIN, token);

                  this.$store.commit(types.USERS, token);
                  this.$store.commit(types.STRATEGY, token);
                  this.$store.commit(types.ALERTER, token);

                  let redirect = decodeURIComponent(this.$route.query.redirect || '/');
                  this.$router.push({
                    path: redirect
                  })
                }
              })
              .catch((err) => {
                this.$notify({
                  title: "失败",
                  message: "用户 " + this.userLoginForm.login_name + " 登录失败",
                  type: "error"
                });
                console.log(err)
              })
          } else {
            console.log('error submit!!');
          }
        });
      },
    },
  };
</script>


<style scoped>

</style>
