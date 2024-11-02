require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    hardhat: {},
    ganache: {
      url: 'http://127.0.0.1:8545',
      accounts: [
        '0x603dd056f841af11a0d8e785f5b835f56f99e8b430eb61b4831b0340e533a800',
        '0x46fb31717b903259d51d934029b6a3cc6456a5305551c407518320f79de6c2f5',
        '0x227394bc6f79e30a9cdee7814728931fbb0a878d5de9fd409608c362ff66da65',
        '0xe2af566bf725f6e46e117bb7b82e357df92249ab843358b02c26260e7e8081f0',
        '0x0ab1e04835ca79f9cb379812431c7da1e3493397143516c07b968fe3249c1563',
        "0xdcee97645f688177eaff877704db8318b557b5aa1452b9e32ba7016f52a79764",
        "0xcddbdc070cf62966a98f312c86caa1e550965f63ad622f0f30a3fd2a54859772"
      ]
    }
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts'
  }
};
