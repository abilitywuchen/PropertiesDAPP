<template>
  <div>
    <div v-if="isLogin" class="main" style="overflow-y: hidden; ">
      <el-container>
        <el-header class="title">
          <div style="margin-top: 12px; display: inline-block;">
            <img src="./components/icons/logo.png" style=" margin-right: 20px; height: 40px;vertical-align: middle;" />
            <span style="font-size: large; font-family: 'Microsoft YaHei';
                color: black; font-weight: bold;">去中心化房屋购买系统</span>
          </div>
          <div style="display: inline-block;  float:inline-end; margin-top: 15px; margin-right: 15px;">
            <span style="color: black; font-size: large;">您好，
              <el-popover placement="top-start" title="账号操作" :width="300" trigger="hover">
                <el-button type="danger" text @click="profile.Logout()" style="width: 60px;">退出登录</el-button>
                <template #reference>
                  <span style="color: orange;">
                    {{ currentAccount }}
                  </span>
                </template>
              </el-popover>

            </span>
          </div>
        </el-header>
        <el-container style="width: 100%; ">
          <el-aside class="aside" style="display: flex;">
            <el-menu active-text-color="#ffd04b" background-color="#0270c1" default-active="1" text-color="#fff"
              style="height:100%; width: 100%;" :router="true">
              <el-menu-item index="myprop">
                <el-icon>
                  <House />
                </el-icon>
                <span>我的房产</span>
              </el-menu-item>
              <el-menu-item index="market">
                <el-icon>
                  <ShoppingCart />
                </el-icon>
                <span>房产市场</span>
              </el-menu-item>

            </el-menu>
          </el-aside>

          <el-main style="height: 100%; width: 100%; ">
            <el-scrollbar height="100%">
              <RouterView class="content"
                style="height: 90vh; max-height: 100%; background-color: white; color: black;" />
            </el-scrollbar>

          </el-main>
        </el-container>
      </el-container>
    </div>
    <div v-else style="text-align: center;">
      <div style="font-size: large; font-weight: bold; font-size: large; padding-bottom: 20px;">去中心化房屋购买系统</div>
      <el-button @click="loginVisible = true" type="primary">登录</el-button>
      <el-dialog v-model="loginVisible" title="用户登录" width="30%" align-center>
            <div style="margin-left: 2vw; font-weight: bold; font-size: 1rem; margin-top: 20px; ">
                用户ID：
                <el-input v-model="toLogin" style="width: 12.5vw;" clearable />
            </div>
            <template #footer>
                <span>
                    <el-button @click="loginVisible = false">取消</el-button>
                    <el-button type="primary" @click="onClickConnectWallet"
                        :disabled="toLogin.length < 4">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
  </div>



</template>

<script>
import { ShoppingCart } from '@element-plus/icons-vue';
import { RouterView } from 'vue-router'
import { web3 } from "./utils/contracts";
import { useProfileStore } from "./stores/Profile"
import { shallowRef } from 'vue'
import { ElMessage } from 'element-plus';

export default {
  data() {
    return {
      profile: shallowRef(useProfileStore()),
      GanacheTestChainId: '0x539', // Ganache默认的ChainId = 0x539 = Hex(1337)
      GanacheTestChainName: 'Localhost 8545',
      GanacheTestChainRpcUrl: 'http://127.0.0.1:8545',
      loginVisible: false,
      toLogin: ""
    }
  },
  computed: {
    isLogin() {
      return this.profile.isLogin
    },
    currentAccount() {
      return this.profile.account
    }
  },
  methods: {
    async onClickConnectWallet() {
      // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
      // @ts-ignore
      const { ethereum } = window;
      if (!Boolean(ethereum && ethereum.isMetaMask)) {
        alert('MetaMask is not installed!');
        return
      }

      try {
        // 如果当前小狐狸不在本地链上，切换Metamask到本地测试链
        if (ethereum.chainId !== this.GanacheTestChainId) {
          const chain = {
            chainId: this.GanacheTestChainId, // TODO Chain-ID
            chainName: this.GanacheTestChainName, // TODO Chain-Name
            rpcUrls: [this.GanacheTestChainRpcUrl], // TODO RPC-URL
          };

          try {
            // 尝试切换到本地网络
            await ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: chain.chainId }] })
          } catch (switchError) {
            // 如果本地网络没有添加到Metamask中，添加该网络
            if (switchError.code === 4902) {
              await ethereum.request({
                method: 'wallet_addEthereumChain', params: [chain]
              });
            }
          }
        }
        // 小狐狸成功切换网络了，接下来让小狐狸请求用户的授权
        await ethereum.request({ method: 'eth_requestAccounts' });
        // 获取小狐狸拿到的授权用户列表
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        // 如果用户存在，展示其account，否则显示错误信息
        for (var idx in accounts) {
          var user = accounts[idx]
          if (user.toLowerCase().startsWith("0x" + this.toLogin)) {
            this.profile.Login(user);
            ElMessage.success("登录成功")
            return;
          }
        }
          ElMessage.error("用户不存在")
      } catch (error) {
        alert(error.message)
      }
    },
  },
  async mounted() {
  }
}
</script>

<style scoped>
#app {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #dcdcdc;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  height: auto;
  background-color: #dcdcdc;

}

.title {
  background-color: #ffffff;
  height: 60px;
}

.aside {
  min-height: calc(100vh - 60px);
  width: 180px;
  background-color: red;
}
</style>
