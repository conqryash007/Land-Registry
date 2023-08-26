import React, { Component } from "react";
import moment from "moment";
import "./HistoryComp.css";

const ETHER = 1000000000000000000;

function Allpatrender({ plotEv, contract, accounts }) {
  const getTimeFormat = (timeCreated) => {
    let day = moment.unix(timeCreated);
    let xy = timeCreated;
    let date = new Date(xy * 1000);
    let time = day.format("MMMM Do, YYYY [at] h:mm A");
    return time;
  };
  let DeSale = "plotDeSale";
  return (
    <div className="eventbox">
      <h6>
        Event:{" "}
        {plotEv?.event === "plotSale" &&
        plotEv?.returnValues.isSelling === false
          ? DeSale
          : plotEv?.event}
      </h6>
      <div>
        {plotEv?.event === "plotAdded" ? (
          <p>Address: {plotEv?.returnValues.plotAddr}</p>
        ) : null}
      </div>
      <div>
        {plotEv?.event === "plotAdded" ? (
          <p>Owner: {plotEv?.returnValues.owner[0]}</p>
        ) : null}
      </div>
      <div>
        {plotEv?.event === "plotSale" ? (
          <p>Price: {plotEv?.returnValues.sellingPrice}</p>
        ) : null}
      </div>
      <div>
        {plotEv?.event === "plotTransferred" ? (
          <p>Old Owner: {plotEv?.returnValues.oldowner[0]}</p>
        ) : null}
      </div>
      <div>
        {plotEv?.event === "plotForBuy" ? (
          <p>New Owner: {plotEv?.returnValues.newowner}</p>
        ) : null}
      </div>
      <div>
        {plotEv?.event === "plotTransferred" ? (
          <p>New Owner: {plotEv?.returnValues.newowner}</p>
        ) : null}
      </div>
      <p>Time: {getTimeFormat(plotEv.returnValues.times)}</p>
      <br />
    </div>
  );
}

class PlotDetailsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plot: null,
      plotEvents: [],
    };
  }

  async componentDidMount() {
    var rex = await this.props.contract?.methods
      .Plots(this.props.matchId.toString())
      .call();
    this.setState({ plot: rex });
    console.log(this.props.plotAddedEvents);

    let plotEvents = [];
    this.props.plotAddedEvents.map((property) => {
      plotEvents.push(property);
    });
    this.props.plotDivisionEvent.map((property) => {
      plotEvents.push(property);
    });
    this.props.plotSaleEvents.map((property) => {
      plotEvents.push(property);
    });
    this.props.plotForBuyEvents.map((property) => {
      plotEvents.push(property);
    });
    this.props.plotTransferredEvent.map((property) => {
      plotEvents.push(property);
    });
    plotEvents.sort((a, b) => {
      return a.returnValues.times - b.returnValues.times;
    });
    console.log(plotEvents);
    this.setState({ plotEvents });
    console.log(this.state.plotEvents);
    console.log(this.state);
  }
  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const Menu = this.state.plotEvents.map((x) => {
      return (
        <div key={x.id} className="events">
          <Allpatrender
            plotEv={x}
            contract={this.props.contract}
            accounts={this.props.accounts}
          />
          <br />
          <br />
        </div>
      );
    });
    console.log(this.state.plot?.imageurl);
    return (
      <div className="body_style">
        <br />
        <h2>History</h2>
        <br />
        <img
          className="plotimage"
          src={
            this.state.plot?.imageurl
              ? `https://ipfs.io/ipfs/${this.state.plot?.imageurl}`
              : ""
          }
          alt="plot"
        />
        <div className="details">
          <p>
            <span className="column1">Plot ID</span>{" "}
            <span className="column2">: {this.state.plot?.plotId}</span>
          </p>
          <p>
            <span className="column1">Plot Address</span>{" "}
            <span className="column2">: {this.state.plot?.plotaddr}</span>
          </p>
          <p>
            <span className="column1">Plot Price</span>{" "}
            <span className="column2">: {this.state.plot?.sellingPrice}</span>
          </p>
          <p>
            <span className="column1">Tax Percent</span>{" "}
            <span className="column2">: {this.state.plot?.taxpercent}</span>
          </p>
          <p>
            <span className="column1">Neighbours</span>{" "}
            <span className="column2">: {this.state.plot?.neighbours}</span>
          </p>
          <p>
            <span className="column1">Description</span>{" "}
            <span className="column2">: {this.state.plot?.typedesc}</span>
          </p>
        </div>
        <hr />
        <h2>Events</h2>
        <br />
        <div className="eventrow">{Menu}</div>
        <br />
        <br />
      </div>
    );
  }
}

export default PlotDetailsComponent;
