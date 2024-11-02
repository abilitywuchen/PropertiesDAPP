<template>
    <el-scrollbar height="100%" style="width: 100%;">

        <div style="margin-top: 20px; margin-left: 40px; font-size: 2em; font-weight: bold; ">我的房产
            <el-input v-model="toSearch" :prefix-icon="Search"
                style=" width: 15vw;min-width: 150px; margin-left: 30px; margin-right: 30px; float: right;" clearable />
        </div>

        <div style="display: flex;flex-wrap: wrap; justify-content: start;">

            <div class="cardBox" v-for="prop in properties" v-show="String(prop.propId).includes(toSearch)" :key="prop.propId">
                <div>
                    <div style="font-size: 25px; font-weight: bold;">No. {{ prop.propId }}</div>

                    <el-divider />

                    <div style="margin-left: 10px; text-align: start; font-size: 18px;">
                        <p style="padding: 2.5px;"><span style="font-weight: bold;">归属：</span>您</p>
                        <p style="padding: 2.5px;"><span style="font-weight: bold;">状态：</span>{{ prop.onSell ? "挂售" : "正常" }}</p>
                       
                    </div>

                    <el-divider />
                    <div style="margin-top: 5px;">
                        <el-button type="warning" :icon="Upload" round v-if="prop.onSell"
                        @click="this.toSell = prop.propId, DoNotSell()" ><Upload />撤回</el-button>
                        <el-button type="primary" :icon="Upload" round v-else
                            @click="this.toSell = prop.propId, this.sellVisible = true" ><Upload />挂售</el-button>
                    </div>

                </div>
            </div>

            <el-button class="newCardBox" v-if="properties.length == 0"
                @click="NewProperty">
                <el-icon style="height: 50px; width: 50px;">
                    <Plus style="height: 100%; width: 100%;" />
                </el-icon>
            </el-button>
        </div>

        <el-dialog v-model="sellVisible" title="房产挂售" width="30%">
            <p style="margin-left: 2vw;font-size: 1rem;"><span style="font-weight: bold;">房屋编号：</span>{{toSell}}</p>
            <div style="margin-left: 2vw; font-weight: bold; font-size: 1rem; margin-top: 20px; ">
                挂售价格：
                <el-input v-model="price" style="width: 12.5vw;" clearable />
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="sellVisible = false">取消</el-button>
                    <el-button type="primary" @click="PutOnSell">
                        挂售
                    </el-button>
                </span>
            </template>
        </el-dialog>

    </el-scrollbar>
</template>

<script>
import { Delete, Search, Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { web3, propertiesContract } from "../utils/contracts.ts";
import { useProfileStore } from "../stores/Profile"
import { shallowRef } from 'vue'

export default {
    data() {
        return {
            profile: shallowRef(useProfileStore()),
            properties: [{ // 借书证列表
                propId: 1,
                onSell: false,
            }, {
                propId: 1,
                onSell: false,
            }
            ],
            Search,
            Upload,
            toSearch: '', // 搜索内容
            sellVisible: false,
            price: 0,
        }
    },
    methods: {
        async QueryProperties() {
            this.properties = [] // 清空列表
            if (propertiesContract) {
                try {
                    const myprops = await propertiesContract.methods.getMyProperties().call({from: this.profile.account})
                    console.log(myprops)
                    myprops.forEach(prop => {
                        this.properties.push({propId: prop.id, onSell: prop.on_sell})
                    });
                    console.log(this.properties)
                } catch (err) {
                    alert(err.message)
                }
            } else {
                alert("No Contract")
            }
        },
        async NewProperty() {
            if (propertiesContract) {
                try {
                    var myprops = await propertiesContract.methods.newProperty(this.profile.account).send({ from: this.profile.account, gas: 5000000 })
                    myprops = await propertiesContract.methods.newProperty(this.profile.account).send({ from: this.profile.account, gas: 5000000 })
                    myprops = await propertiesContract.methods.newProperty(this.profile.account).send({from: this.profile.account, gas:5000000})
                    console.log(myprops)
                } catch (err) {
                    alert(err.message)
                }
            } else {
                alert("No Contract")
            }
            this.QueryProperties()
        },
        async PutOnSell() {
            if (propertiesContract) {
                try {
                    const wei_price = web3.utils.toWei(this.price, 'ether')
                    await propertiesContract.methods.putPropertyOnSell(this.toSell, wei_price).send({ from: this.profile.account })
                    ElMessage.success("挂售成功")
                    this.sellVisible = false
                } catch (err) {
                    alert(err.message)
                }
            } else {
                alert("No Contract")
            }
            this.QueryProperties()
        },
        async DoNotSell() {
            if (propertiesContract) {
                try {
                    const wei_price = web3.utils.toWei(this.price, 'ether')
                    await propertiesContract.methods.cancelPropertySelling(this.toSell).send({ from: this.profile.account })
                    ElMessage.success("撤回成功")
                } catch (err) {
                    alert(err.message)
                }
            } else {
                alert("No Contract")
            }
            this.QueryProperties()
        }
    },
    mounted() { // 当页面被渲染时
        this.QueryProperties()
    }
}

</script>


<style scoped>
.cardBox {
    height: 300px;
    width: 200px;
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