<template>
  <div id="app">
    <template>
      {{value}}
      <l-form :model="model" :rules="rules" ref="loginForm">
        <l-form-item label="用户名" prop="username">
          <l-input v-model="model.username"></l-input>
        </l-form-item>
        <l-form-item label="密码" prop="password">
          <l-input v-model="model.password" type="password"></l-input>
        </l-form-item>
        <l-form-item>
          <button @click="onLogin">登录</button>
        </l-form-item>
      </l-form>
    </template>
  </div>
</template>

<script>
import LInput from "./l-form/input";
import LFormItem from "./l-form/form-item";
import LForm from "./l-form/form"; // l-form

import Notice from "./Notice";
import create from "./utils/create";

export default {
  name: "app",
  components: {
    LInput,
    LFormItem,
    LForm
  },
  data() {
    return {
      value: "",
      model: { username: "tom", password: "" },
      rules: {
        username: [
          { required: true, message: "请输入用户名" },
          { min: 6, max: 10, message: "请输入6~10的用户名" }
        ],
        password: [{ required: true, message: "请输入密码" }]
      }
    };
  },
  methods: {
    // submitForm(form) {
    //   this.$refs[form].validate(valid => {
    //     if (valid) {
    //       alert("请求登录!");
    //     } else {
    //       alert("校验失败！");
    //     }
    //   });
    // },
    onLogin() {
      // 创建弹窗实例
      let notice;

      this.$refs.loginForm.validate(isValid => {
        notice = create(Notice, {
          title: "xxx",
          message: isValid ? "登录！！！" : "有错！！！",
          duration: 10000
        });

        notice.show();
      });
    }
  }
};
</script>