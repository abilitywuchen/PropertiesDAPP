<template>
    <el-scrollbar height="100%" style="width: 100%;">
        <div style="margin-top: 20px; margin-left: 40px; font-size: 2em; font-weight: bold; ">房产市场
            <el-input v-model="toSearch" :prefix-icon="Search"
                style=" width: 15vw;min-width: 150px; margin-left: 30px; margin-right: 30px; float: right;" clearable />
        </div>

        <div style="display: flex;flex-wrap: wrap; justify-content: start;">

            <div class="cardBox" v-for="prop in properties" v-show="String(prop.propId).includes(toSearch)"
                :key="prop.cardId">
                <div>
                    <div style="font-size: 25px; font-weight: bold;">No. {{ prop.propId }}</div>

                    <el-divider />

                    <div style="margin-left: 10px; text-align: start; font-size: 16px;">
                        <p style="padding: 2.5px;"><span style="font-weight: bold;">归属：</span>{{
                            prop.owner }}</p>
                        <p style="padding: 2.5px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                            <span style="font-weight: bold;">价格：</span>{{ prop.price }} ETH
                        </p>
                        <p style="padding: 2.5px;"><span style="font-weight: bold;">时间：</span>{{ prop.since }}</p>
                    </div>

                    <el-divider />

                    <div style="margin-top: 5px;">
                        <el-button type="success" :icon="Download" round
                            @click="ShowBuy(prop.propId, prop.owner, prop.price)">购置</el-button>
                    </div>

                </div>
            </div>

        </div>

        <el-dialog v-model="buyVisible" title="房产购置" width="30%">
            <span>确定购置<span style="font-weight: bold;">{{ toBuy }}号房产</span>吗？</span>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="buyVisible = false">取消</el-button>
                    <el-button type="danger" @click="BuyProperty">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>

    </el-scrollbar>
</template>

<script>
import { Delete, Edit, Search, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { web3, propertiesContract } from "../utils/contracts.ts";
import { useProfileStore } from "../stores/Profile"
import { shallowRef } from 'vue'

export default {
    data() {
        return {
            profile: shallowRef(useProfileStore()),
            properties: [{ // 借书证列表
                owner: '',
                propId: 1,
                price: 0,
                since: new Date()
            }
            ],
            Search,
            Download,
            toSearch: '', // 搜索内容
            buyVisible: false,
            toBuy: 0, // 待删除借书证号
        }
    },
    methods: {
        ShowBuy(id, owner, price) {
            if (owner.toLowerCase() == this.profile.account) {
                ElMessage.error("不能购置自己挂售的房屋")
                return
            }
            this.toBuy = id
            this.price = price
            this.buyVisible = true
        },
        async QueryPropertiesOnSell() {

            function formatTwoChar(n) {
                return n < 10 ? '0' + n.toString() : n.toString();
            }

            function toDate(timestamp) {
                var date = new Date(Number(timestamp) * 1000);  // 参数需要毫秒数，所以这里将秒数乘于 1000
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                var D = formatTwoChar(date.getDate()) + ' ';
                var h = formatTwoChar(date.getHours()) + ':';
                var m = formatTwoChar(date.getMinutes()) + ':';
                var s = formatTwoChar(date.getSeconds());
                var res = Y + M + D + h + m + s;
                return res;
            }

            this.properties = [] // 清空列表
            if (propertiesContract) {
                try {
                    const myprops = await propertiesContract.methods.getPropertiesOnSell().call({ from: this.profile.account })
                    console.log(myprops)
                    myprops.forEach(prop => {
                        let price = web3.utils.fromWei(prop.price.toString(), "ether");
                        this.properties.push({ owner: prop.owner, propId: prop.id, price: price, since: toDate(prop.sell_start_time) })
                    });
                } catch (err) {
                    alert(err.message)
                }
            } else {
                alert("No Contract")
            }
        },
        async BuyProperty() {
            if (propertiesContract) {
                try {
                    var price = web3.utils.toWei(this.price.toString(), "ether")
                    const res = await propertiesContract.methods.buyProperty(this.toBuy).send({ from: this.profile.account, value: price, gas: 500000 })
                    console.log(res)
                    ElMessage.success("购置成功")

                } catch (err) {
                    ElMessage.error("购置失败")
                }
            } else {
                alert("No Contract")
            }
            this.buyVisible = false
            this.QueryPropertiesOnSell()
        }
    },
    mounted() { // 当页面被渲染时
        this.QueryPropertiesOnSell()
    }
}

</script>


<style scoped>
.cardBox {
    height: 300px;
    width: 500px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    text-align: center;
    margin-top: 40px;
    margin-left: 27.5px;
    margin-right: 10px;
    padding: 7.5px;
    padding-right: 10px;
    padding-top: 15px;
}

.newCardBox {
    height: 300px;
    width: 200px;
    margin-top: 40px;
    margin-left: 27.5px;
    margin-right: 10px;
    padding: 7.5px;
    padding-right: 10px;
    padding-top: 15px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    text-align: center;
}
</style>