import React, { Component } from "react";
import BNContract from "../contracts/LandRecord2.json";
import getWeb3 from "../getWeb3";
import "../App.css";
import Header from "./HeaderComponent";
import Home from "./HomeComponent";
import SignUp from "./SignupComponent";
import { Switch, Route, Redirect } from "react-router-dom";
import Footer from "./FooterComponent";
import AllPlotComponent from "./AllPlotComponent";
import AllMemComponent from "./AllMemComponent";
import MyItemComponent from "./MyPlotComponent";
import PlotDetailsComponent from "./HistoryComp";

import ReactDOM from "react-dom";
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      balance: 0,
      contract: null,
      res: null,
      registered: 0,
      plotAddedEvents: [],
      plotSaleEvents: [],
      plotForBuyEvents: [],
      plotTransferredEvent: [],
      plotDivisionEvent: [],
      aadhar: localStorage.getItem("myAadhar"),
    };
    this.changeAadhar = this.changeAadhar.bind(this);
  }

  changeAadhar = async (aad) => {
    this.setState({ aadhar: aad });
    console.log(aad);
  };

  componentDidMount = async () => {
    try {
      // reload on connected metamask address change
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", function (accounts) {
          window.location.reload();
        });
      }
      console.log("Time start application load", Date.now());
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const balance = await web3.eth.getBalance(accounts[0]);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = BNContract.networks[networkId];
      const instance = new web3.eth.Contract(
        BNContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      this.setState({
        web3,
        accounts: accounts[0],
        contract: instance,
        balance,
      });
      localStorage.setItem("wallet", accounts[0]);
      var plotAddedEvents = [];
      console.log("Time start event get", Date.now());
      var res = await this.state.contract.getPastEvents("plotAdded", {
        fromBlock: 7726154,
      });
      plotAddedEvents = res;
      res = await this.state.contract.getPastEvents("plotSale", {
        fromBlock: 7726154,
      });
      var plotSaleEvents = res;
      res = await this.state.contract.getPastEvents("plotForBuy", {
        fromBlock: 7726154,
      });
      var plotForBuyEvents = res;
      res = await this.state.contract.getPastEvents("plotTransferred", {
        fromBlock: 7726154,
      });
      var plotTransferredEvent = res;

      res = await this.state.contract.getPastEvents("plotDivided", {
        fromBlock: 7726154,
      });
      let plotDivisionEvent = res;

      this.setState({
        plotAddedEvents,
        plotSaleEvents,
        plotForBuyEvents,
        plotTransferredEvent,
        plotDivisionEvent,
      });
      console.log("Time end app load", Date.now());
      console.log(this.state);
    } catch (error) {}
  };

  render() {
    const CardWithId = ({ match }) => {
      if (match.params.id.includes("-")) {
        match.params.id = match.params.id.replace("-", "/");
      }
      console.log(match);
      return (
        <PlotDetailsComponent
          contract={this.state.contract}
          accounts={this.state.accounts}
          matchId={match.params.id}
          plotAddedEvents={this.state.plotAddedEvents?.filter(
            (token) => token.returnValues.plotId === match.params.id
          )}
          plotSaleEvents={this.state.plotSaleEvents?.filter(
            (token) => token.returnValues.plotId === match.params.id
          )}
          plotForBuyEvents={this.state.plotForBuyEvents?.filter(
            (token) => token.returnValues.plotId === match.params.id
          )}
          plotTransferredEvent={this.state.plotTransferredEvent?.filter(
            (token) => token.returnValues.plotId === match.params.id
          )}
          plotDivisionEvent={this.state.plotDivisionEvent?.filter(
            (token) => token.returnValues.plotId === match.params.id
          )}
        />
      );
    };

    return (
      <div className="App">
        <Header />
        <Switch>
          <Route
            exact
            path="/home"
            component={() => (
              <Home
                contract={this.state.contract}
                accounts={this.state.accounts}
              />
            )}
          />
          <Route
            exact
            path="/allplots"
            component={() => (
              <AllPlotComponent
                contract={this.state.contract}
                accounts={this.state.accounts}
                aadhar={localStorage.getItem("myAadhar")}
              />
            )}
          />
          <Route
            exact
            path="/signup"
            component={() => (
              <SignUp
                contract={this.state.contract}
                accounts={this.state.accounts}
                changeAadhar={this.changeAadhar}
              />
            )}
          />
          <Route
            exact
            path="/myplots"
            component={() => (
              <MyItemComponent
                contract={this.state.contract}
                accounts={this.state.accounts}
                aadhar={localStorage.getItem("myAadhar")}
              />
            )}
          />
          <Route
            exact
            path="/allmem"
            component={() => (
              <AllMemComponent
                contract={this.state.contract}
                accounts={this.state.accounts}
              />
            )}
          />
          <Route path="/plot/:id" component={CardWithId} />
          <Redirect to="/home" />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default Main;
