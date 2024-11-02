// import {ethers} from "hardhat";
const { ethers } = require("hardhat");
async function main() {
    const Properties = await ethers.getContractFactory("properties");
    const properties = await Properties.deploy();
    await properties.waitForDeployment()
    .then(()=>{console.log(`contract properties deployed to ${properties.target}`);})
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
