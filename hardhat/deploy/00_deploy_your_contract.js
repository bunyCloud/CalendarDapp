const { ethers } = require("hardhat");


/// Deploy CalendarDailyTelos
// Deploy BunyERC6551Registry with calendar address in arguments
/// Deploy BunyERC6551Account

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  //
let calendar = 'input calendar address'
  // Deploy
  await deploy("CalendarDailyTelos", {
    from: deployer,
    args: [calendar],
    log: true,
    waitConfirmations: 2,
  });

};
module.exports.tags = ["CalendarDailyTelos"];
