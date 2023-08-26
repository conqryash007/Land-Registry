import React, { Component } from "react";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import "../App.css";
import {
  Card,
  CardImg,
  CardBody,
  CardText,
  CardTitle,
  Modal,
  ModalHeader,
  CardSubtitle,
  Input,
} from "reactstrap";
import "./AllPlotComponent.css";

class SinglePlotRender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: null,
      isModalOpen: false,
      isSuccessModalOpen: false,
      decision: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleSuccessModal = this.toggleSuccessModal.bind(this);
    this.buyItem = this.buyItem.bind(this);
    this.decision = this.decision.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  async componentDidMount() {
    var res = await this.props.contract?.methods
      .getowner(this.props.plot.plotId)
      .call();
    this.setState({
      owner: res,
    });
    console.log("ipfs", this.props.plot.imageurl);
  }
  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }
  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }
  toggleSuccessModal() {
    this.setState({
      isSuccessModalOpen: !this.state.isSuccessModalOpen,
    });
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
    console.log(this.state.decision);
  }

  buyItem = async () => {
    if (localStorage.getItem("myAadhar") != 0) {
      if (!this.props.plot.inprocess) {
        console.log("buyItem start time", Date.now());
        const res = await this.props.contract.methods
          .buyLand(this.props.plot.plotId, this.props.aadhar)
          .send({
            from: this.props.accounts,
            gas: 10000000,
          });
        this.toggleSuccessModal();
        console.log("buyItem end time", Date.now());
      } else {
        alert("Somebody's transaction already in process");
      }
      console.log(localStorage.getItem("myAadhar"));
    } else {
      alert("Please Login");
    }
  };

  decision = async () => {
    console.log("decision start time", Date.now());
    const res = await this.props.contract.methods
      .consensus(this.props.plot.plotId, this.state.decision)
      .send({
        from: this.props.accounts,
        gas: 5000000,
      });
    console.log(res);
    this.toggleSuccessModal();
    console.log("decision end time", Date.now());
  };

  render() {
    let style1 = this.props.plot?.isSelling ? "bg-danger" : "invisible";
    let style2 = this.props.plot?.isSelling ? "bg-primary text-white" : "";
    return (
      <React.Fragment>
        <Card style={{ height: "99%", width: "80%" }} className="cards1">
          <Link
            to={
              this.props.plot.plotId.includes("/")
                ? `/plot/${this.props.plot.plotId.replace("/", "-")}`
                : `/plot/${this.props.plot.plotId}`
            }
          >
            <CardImg
              top
              width="100%"
              src={`https://ipfs.io/ipfs/${this.props.plot.imageurl}`}
              alt="Card image cap"
              style={{ height: "270px" }}
            />
          </Link>
          <CardBody className={style2}>
            <CardTitle>Plot ID: {this.props.plot.plotId}</CardTitle>
            <CardText>
              <small>Plot Address: {this.props.plot.plotaddr}</small>
            </CardText>
            <CardText>
              <small>Plot Price: {this.props.plot.sellingPrice} Rupees</small>
            </CardText>
            <CardText>
              <small>Tax Percent: {this.props.plot.taxpercent}</small>
            </CardText>
            <CardText>
              <small>Plot Owner: {this.state.owner}</small>
            </CardText>
            <CardText>
              <small>Neighbours: {this.props.plot.neighbours}</small>
            </CardText>
            <CardText>
              <small>Description: {this.props.plot.typedesc}</small>
            </CardText>
            <Button
              style={{ margin: "5px" }}
              className={style1}
              type="submit"
              onClick={this.toggleModal}
            >
              Decision
            </Button>
            {!this.props.plot.inprocess ? (
              <Button
                style={{ margin: "5px", float: "right", width: "90px" }}
                className={style1}
                type="submit"
                onClick={this.buyItem}
              >
                Buy
              </Button>
            ) : null}
            <Modal
              isOpen={this.state.isModalOpen}
              toggle={this.toggleModal}
              className="modal-popup2"
            >
              <ModalHeader toggle={this.toggleModal}>Your Decision</ModalHeader>
              <Card className="artCard" style={{ height: "50%" }}>
                <CardImg
                  top
                  className="displayImage"
                  src={`https://ipfs.io/ipfs/${this.props.plot.imageurl}`}
                  alt="Card image"
                />
                <CardBody className="detail">
                  <div className="ctext" style={{ padding: "2px" }}>
                    <CardSubtitle
                      style={{
                        position: "relative",
                        fontFamily: "Gibson",
                        fontSize: "15px",
                        color: "#B3B3B3",
                      }}
                    >
                      Price
                    </CardSubtitle>
                  </div>
                  <div className="ctext" style={{ padding: "2px" }}>
                    <CardText
                      style={{
                        position: "relative",
                        fontFamily: "Gibson",
                        fontSize: "15px",
                        color: "black",
                      }}
                    >
                      {this.props.plot.sellingPrice.toString()} Rupees
                    </CardText>
                  </div>
                  <div className="ctext">
                    <p
                      style={{
                        fontFamily: "Gibson",
                        fontSize: "15px",
                        color: "black",
                        marginTop: "2%",
                        fontWeight: "bold",
                      }}
                    >
                      Buyer : {this.props.plot.newowneraadhar}
                    </p>
                  </div>
                  <div className="ctext1">
                    <p
                      style={{
                        fontFamily: "Gibson",
                        fontSize: "15px",
                        color: "black",
                        marginTop: "2%",
                      }}
                    >
                      Decision :{" "}
                    </p>
                    <p>
                      {" "}
                      <Input
                        type="text"
                        id="decision"
                        name="decision"
                        onChange={this.handleInputChange}
                      ></Input>
                    </p>
                  </div>
                  <div>
                    <div>
                      <button
                        className="abtn"
                        style={{
                          left: "32%",
                          color: "white",
                          backgroundColor: "#000000",
                        }}
                        type="submit"
                        onClick={this.decision}
                      >
                        Confirm
                      </button>{" "}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Modal>
            <Modal
              isOpen={this.state.isSuccessModalOpen}
              toggle={this.toggleSuccessModal}
              className="modal-popup2"
            >
              <ModalHeader toggle={this.toggleSuccessModal}>
                Success
              </ModalHeader>
              <span>{`  Congratulations the transaction was completed.`}</span>
            </Modal>
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }
}

class AllPlotComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docCount: 0,
      plots: [],
    };
  }

  async componentDidMount() {
    console.log("Time start plot get", Date.now());
    // plot division events
    const divisionEvents = await this.props.contract?.getPastEvents(
      "plotDivided",
      {
        fromBlock: 7726154,
      }
    );

    const divPlotIds = [];

    for (let i = 0; i < divisionEvents?.length; i++) {
      const numDiv = Number(divisionEvents[0].returnValues.divisions);
      const plotId = divisionEvents[0].returnValues.plotId;
      for (let j = 1; j <= numDiv; j++) {
        divPlotIds.push(`${plotId}/${j}`);
      }
    }

    var resPlotCount = await this.props.contract?.methods.plotCount().call();
    console.log(resPlotCount);
    var responsePlots = [];
    for (var i = 1; i <= resPlotCount; i++) {
      var resPlot = await this.props.contract?.methods
        .Plots(i.toString())
        .call();

      if (resPlot.disable === false) {
        responsePlots.push(resPlot);
      }
    }

    for (var i = 0; i < divPlotIds.length; i++) {
      let rex = await this.props.contract?.methods.Plots(divPlotIds[i]).call();
      let z = await this.props.contract?.methods.getowner(divPlotIds[i]).call();

      responsePlots.push(rex);
    }
    console.log(responsePlots);
    this.setState({
      plots: responsePlots,
    });
    console.log("Time end plot get", Date.now());
  }
  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const Plots = this.state.plots.map((x) => {
      return (
        <div key={x.plotId}>
          <SinglePlotRender
            plot={x}
            contract={this.props.contract}
            accounts={this.props.accounts}
            aadhar={this.props.aadhar}
          />
        </div>
      );
    });

    return (
      <div>
        <br />
        <h2>All Plots</h2>
        <br />
        <div className="cardrows">{Plots}</div>
        <br />
        <br />
        <br />
      </div>
    );
  }
}

export default AllPlotComponent;
