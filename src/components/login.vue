<template>
  <div class="login-card">
    <div class="left-block">
      <el-image class="bot-icon" :src="bot_icon" />
    </div>
    <div class="line-1"></div>
    <div class="right-block">
      <p class="close-button">x</p>
      <div class="right-block-content-container">
        <div class="right-block-content">
          <el-text class="title">賬號登入</el-text>
          <div class="login-wrap">
            <div class="login-input-wrap">
              <el-input
                class="login-input"
                placeholder="請輸入帳號"
                prefix-icon="el-icon-user-solid"
                clearable
                disabled="true"
              />
              <el-input
                class="login-input"
                placeholder="請輸入密碼"
                prefix-icon="el-icon-lock"
                clearable
                disabled="true"
              />
            </div>
          </div>
          <div class="login-input-button-wrap">
            <div class="signup-button">
              <p>登入</p>
            </div>
            <div class="login-button">
              <p>註冊</p>
            </div>
          </div>
          <p>其他方式登入</p>
          <div class="discord-login-wrap">
            <el-image class="discord-icon" :src="discord_icon" />
            <p class="discord-login-text">登入Discord</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import bot_icon from "@/assets/bot_icon.png"
import discord_icon from "@/assets/discordLogin_icon.gif"
import { ref, reactive, computed, defineProps } from "vue"
</script>

<style scoped>
.login-card {
  display: inline-flex;
  padding: 1rem 1.25rem;
  align-items: center;
  gap: 1rem;
  border-radius: 0.625rem;
  background: #fff;
}

.login-card .left-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
}

.login-card .left-block .bot-icon {
  width: 15.75rem;
  height: 15.125rem;
  border-radius: 0.625rem;
  background: lightgray 50% / cover no-repeat;
}
.login-card .login-card .line-1 {
  width: 0.0625rem;
  height: 21.0625rem;
  background: #858585;
}
.login-card .right-block .right-block-content .close-button {
  display: flex;
  width: 2.1875rem;
  height: 2.1875rem;
  flex-direction: column;
  justify-content: center;
  color: #000;
  text-align: center;
  font-family: Fusion Pixel 12px Monospaced zh_hant;
  font-size: 2.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.login-card .right-block .right-block-content-container {
  display: flex;
  width: 27.25rem;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.625rem;
}

.login-card .right-block .right-block-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;
}

.login-card .right-block .right-block-content .title {
  display: flex;
  width: 7.8125rem;
  height: 2.375rem;
  flex-direction: column;
  justify-content: center;
  color: #7fd6f5;
  text-align: center;
  font-family: Fusion Pixel 12px Monospaced zh_hant;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.login-card .right-block .right-block-content .login-wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.9375rem;
}

.login-card .right-block .right-block-content .login-wrap .login-input-wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  border: 1px solid #e3e5e7;
}

.login-input-button-wrap {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  border-radius: 0.75rem;
}

.signup-button {
  display: flex;
  padding: 0.5rem 1rem;
  align-items: flex-start;
  gap: 0.625rem;
  border-radius: 0.75rem;
  border: 1px solid #e3e5e7;
  color: #212427;
  text-align: center;
  font-family: Fusion Pixel 12px Monospaced zh_hant;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.login-button {
  display: flex;
  padding: 0.5rem 1rem;
  align-items: flex-start;
  gap: 0.625rem;
  border-radius: 0.625rem;
  background: #7fd6f5;
  color: #fff;
  text-align: center;
  font-family: Fusion Pixel 12px Monospaced zh_hant;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.discord-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}
.discord-login-wrap {
  display: flex;
  width: 7rem;
  padding: 0.3125rem 0.5625rem 0.3125rem 0.625rem;
  justify-content: center;
  align-items: flex-start;
  gap: 0.125rem;
  border-radius: 1.25rem;
  background: #7289da;
}

.discord-login-text {
  display: flex;
  width: 4.4375rem;
  height: 1.0625rem;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
  text-align: center;
  font-family: Fusion Pixel 12px Monospaced zh_hant;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
</style>
