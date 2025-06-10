// import * as TronWeb from "tronweb";
import { BigNumber } from "bignumber.js";

export const getBalance = async (address) => {
  const CONTRACT_USDT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
  const tronWeb = new window.TronWeb({
    fullHost: "https://api.trongrid.io",
    headers: { "TRON-PRO-API-KEY": "77b95273-b566-41bc-a8cc-09709c98ad5f" },
  });
  tronWeb.setAddress(CONTRACT_USDT);
  const contract = await tronWeb.contract().at(CONTRACT_USDT);
  const usdtBalance = await contract.balanceOf(address).call();
  // const tronBalance = await tronWeb.trx.getBalance(address);
  // Database.wallet.balanceTron = tronBalance / 1000000;

  return {
    balance: BigNumber(usdtBalance._hex).toFixed() / 1000000,
  };
};
