let LandContract = require("./contracts/LandRecord.json");
let Web3 = require("web3");
var instance;
var accounts;
var aadhar1 = 7544511245;
var aadhar2 = 144147454145;
let role = "admin";
let plotaddr = "maidan";
let plotprice = 150000000000;
let taxpercent = 15;
var typedesc = "";
var neighbours = "Plot A; Plot B; Plot C;Plot D;";

var inch = ["0x30d68DbE5936087E372B7aC2d7ee67A4d8AfE93c"];
Mount = async () => {
  const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
  const web3 = new Web3(provider);
  accounts = await web3.eth.getAccounts();
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = LandContract.networks[networkId];
  instance = new web3.eth.Contract(
    LandContract.abi,
    deployedNetwork && deployedNetwork.address
  );
  console.log(instance);
  console.log(accounts);
  // console.log("gfsd",instance);
  // console.log("gd",accounts);
  //   addingManufacturer("Kole",751002);
  //getshipevents(instance);
  //addingPerson(aadhar1,inch);
  //addingAdmin(aadhar2,role);
  //addingPlot(plotaddr,plotprice,taxpercent,typedesc,[accounts[1]],neighbours);
  //putingForSale(1,10000000000000);
  //deSelling(1);
  buyingLand(1);
};

Mount();

addingPerson = async (aadhar1, inch) => {
  const res = await instance.methods
    .addPerson(aadhar1, inch)
    .send({ from: accounts[3], gas: 1000000 });
  console.log(res);
};
addingAdmin = async (name, pinc) => {
  const res = await instance.methods
    .addAdmin(name, pinc)
    .send({ from: accounts[2], gas: 1000000 });
  console.log(res);
};

putingForSale = async (plotId, price) => {
  const res = await instance.methods
    .putForSale(plotId, price)
    .send({ from: accounts[1], gas: 1000000 });
  console.log(res);
};

deSelling = async (plotId) => {
  const res = await instance.methods
    .desale(plotId)
    .send({ from: accounts[1], gas: 1000000 });
  console.log(res);
};

addingTax = async (plotId, taxpercent) => {
  const res = await instance.methods
    .addTax(plotId, taxpercent)
    .send({ from: accounts[2], gas: 1000000 });
  console.log(res);
};

// updatingCustomer = async(name,pinc) => {
//     const res = await instance.methods.modifyCustomer(name,pinc).send({from: accounts[1],gas : 1000000});
//     console.log(res);
// }

addingPlot = async (
  plotaddr,
  plotprice,
  taxpercent,
  typedesc,
  owneraddr,
  neighbours
) => {
  const res = await instance.methods
    .addPlot(plotaddr, plotprice, taxpercent, typedesc, owneraddr, neighbours)
    .send({ from: accounts[0], gas: 1000000 });
  console.log(res);
};

buyingLand = async (plotid) => {
  const res = await instance.methods
    .buyLand(plotid)
    .send({ from: accounts[3], gas: 1000000, value: 10000000000000 });
  console.log(res);
};

// updateShipstate = async(shipid,shipstate) => {
//     const res = await instance.methods.updateShstate(shipid,shipstate).send({from: accounts[1],gas : 1000000});
//     console.log(res);
// }

// updateShipstatus = async(shipid,paystatus) => {
//     const res = await instance.methods.updateShstate(shipid,paystatus).send({from: accounts[1],gas : 1000000});
//     console.log(res);
// }

// conver = async (x) => {
//     console.log(Web3.utils.toWei(x, 'milli'));
// }

// converb = async (x) => {
//     console.log(Web3.utils.fromWei(x, 'milli'));
// }

// // conver('1000');
// // converb('1000000000000000000');

// getshipevents = async(instance) => {
//     const req = await instance.getPastEvents('processchange', {
//         filter: { ship_id: 1 },
//         fromBlock: 0,
//     });
//     req.forEach(async (ele) => {

//         const ship_id = (ele.returnValues.ship_id);
//         const shstate = (ele.returnValues.shstate);
//         const times = (ele.returnValues.times);
//         console.log("item : ",ship_id,shstate,times);
//     });

// }
// getpayevents = async(instance) => {
//     const req1 = await instance.getPastEvents('processpay', {

//         fromBlock: 0,
//     });
//     req1.forEach(async (ele) => {

//          const ship_id = (ele.returnValues.ship_id);
//          const paystate = (ele.returnValues.pay);
//          const times = (ele.returnValues.times);
//         console.log("item : ",ship_id,paystate,times);
//     });
// }

// }

//  dopayment = async(totalamt,shipid,totalamt) => {
//      const res = await instance.methods.payitem(totalamt,shipid).send({from: accounts,value:totalamt,gas : 1000000});
//      console.log(res);
//  }
