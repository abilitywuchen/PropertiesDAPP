import Address from './contract-address.json'
import Properties from './properties.json'
import Web3 from 'web3';
var web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
// @ts-ignore
// 创建web3实例
// 可以阅读获取更多信息https://docs.metamask.io/guide/provider-migration.html#replacing-window-web3
console.log(web3)

// if (!window.web3.currentProvider)
//     window.web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));

// let web3 = new Web3(window.web3.currentProvider)
// 修改地址为部署的合约地址
const propertiesAddress = Address.properties
const propertiesABI = Properties.abi
console.log(Properties.abi)

// 获取合约实例
const propertiesContract = new web3.eth.Contract(propertiesABI, propertiesAddress);

// 导出web3实例和其它部署的合约
export { web3, propertiesContract}