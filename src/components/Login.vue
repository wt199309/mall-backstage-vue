<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 表单区 -->
      <el-form ref="loginFormRef" :model="loginForm" class="login_form" :rules="loginFormRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入账户"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            prefix-icon="iconfont icon-3702mima"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      //表单验证规则对象
      loginFormRules: {
        // 验证用户名
        username: [
          { required: true, message: '此项不能为空', trigger: 'blur' },
          {
            min: 3,
            max: 18,
            message: '请输入长度在 3 到 18 个字符之间的用户名',
            trigger: 'blur',
          },
        ],
        //验证密码
        password: [
          { required: true, message: '此项不能为空', trigger: 'blur' },
          {
            min: 6,
            max: 18,
            message: '请输入长度在 6 到 18 个字符之间的密码',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    //点击重置按钮，重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    //表单预验证
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        // 发起请求 {data: res}=object 是对象的解构赋值，只将object中的data赋值给 res
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200)
          return this.$message.error('用户名或密码错误')
        this.$message.success('登录成功')
        console.log(res)
        //将登录成功之后的 token 保存到客户端的 sessionStorage 中
        //项目中的其他 API 接口要在登录以后才能访问
        //token 只应该在当前网站打开期间生效，所以 token 保存在 sessionStorage
        window.sessionStorage.setItem('token', res.data.token)
        //通过编程式导航跳转到后台主页面，路由地址是 /home
        this.$router.push('/home')
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    // margin-top: -150px;
    // margin-left: -225px;
    transform: translate(-50%, -50%);
    .avatar_box {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      // overflow: hidden;
      padding: 10px;
      border: 1px solid #ccc;
      box-shadow: 0 0 10px #ccc;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #ccc;
      }
    }
    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      .btn {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>