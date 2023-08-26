import React, { Component } from "react";
import { Link } from "react-router-dom";
//import moment from 'moment';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardImg,
  CardBody,
  CardImgOverlay,
  CardSubtitle,
  CardText,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import Axios from "axios";
import "./MyArtComponent.css";
import "./MyPlotComponent.css";

const REACT_APP_PINATA_API_KEY = "4e974bf92628a2a22d81";
const REACT_APP_PINATA_API_SECRET =
  "b174f7aeb7aeb0cf7e98d5f23ccd2045bf69321216e6e9a7fefc721c94ecfde9";

// const ipfsClient = require("ipfs-http-client");
// const ipfs = ipfsClient.create({
//   host: "ipfs.infura.io",
//   port: 5001,
//   protocol: "https",
// });

class AllPlotRender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      art: [],
      isModalOpen: false,
      sellPrice: 0,
      owner: null,
      isSuccessModalOpen: false,
      putForSaleLoading: false,
      delistLoading: false,
      listForSaleSuccess: false,
      isModalOpenDivison: false,
      numPlotDivision: 2,
      loadingError: false,
      uploadSuccess: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleModalDivision = this.toggleModalDivision.bind(this);

    //this.toggleListForSale = this.toggleListForSale.bind(this);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.toggleSuccessModal = this.toggleSuccessModal.bind(this);
    this.buyItem = this.buyItem.bind(this);
    this.putForSale = this.putForSale.bind(this);
    this.DeSale = this.DeSale.bind(this);
    this.dividePlot = this.dividePlot.bind(this);
    this.handleDivisionChange = this.handleDivisionChange.bind(this);
    this.fileSelectHandler = this.fileSelectHandler.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.toggleModal2 = this.toggleModal2.bind(this);
  }
  buyItem = async () => {
    // const res = await this.props.contract.methods
    //   .buyToken(this.props.art.tokenIdentifier)
    //   .send({
    //     from: this.props.accounts,
    //     value: this.props.art.tokenSellPrice,
    //     gas: 10000000,
    //   });
    // console.log(res);
  };
  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }
  toggleModal2() {
    this.setState({
      uploadSuccess: !this.state.uploadSuccess,
    });
  }
  toggleModalDivision() {
    this.setState({
      isModalOpenDivison: !this.state.isModalOpenDivison,
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
  }
  handleDivisionChange(e, i) {
    console.log(e.target);
    if (e.target) {
      const { value, name } = e.target;
      this.setState((state) => ({
        [i]: { ...state[i], [name]: value },
      }));
    }
  }

  putForSale = async () => {
    console.log("Time start putforsale", Date.now());
    this.setState({ putForSaleLoading: true });
    var y = this.state.sellPrice;
    const res = await this.props.contract.methods
      .putForSale(this.props.art.plotId, y.toString(), this.props.aadhar)
      .send({ from: this.props.accounts, gas: 1000000 });
    console.log(res);
    this.setState({ putForSaleLoading: false, isSuccessModalOpen: true });
    this.toggleModal();
    console.log("Time end putforsale", Date.now());
  };
  DeSale = async () => {
    console.log("Time start desale", Date.now());
    this.setState({ delistLoading: true });
    const res = await this.props.contract.methods
      .desale(this.props.art.plotId, this.props.aadhar)
      .send({ from: this.props.accounts, gas: 1000000 });
    console.log(res);
    this.setState({ delistLoading: false });
    this.toggleSuccessModal();
    console.log("Time end desale", Date.now());
  };

  // file Upload
  fileSelectHandler = (event, i) => {
    event.preventDefault();
    const file = event.target.files[0];

    this.setState((state) => ({
      [i]: { ...state[i], imgBuffer: file },
    }));
  };

  uploadImage = async (i) => {
    console.log("Time start file to ipfs", Date.now());
    console.log("Submitting file to ipfs...");

    try {
      const formData = new FormData();
      formData.append("file", this.state[i].imgBuffer);

      const resFile = await Axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: REACT_APP_PINATA_API_KEY,
          pinata_secret_api_key: REACT_APP_PINATA_API_SECRET,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(resFile.data.IpfsHash);
      return resFile.data.IpfsHash;
    } catch (err) {
      console.log(err);
    }
  };
  dividePlot = async (e) => {
    e.preventDefault();

    console.log("Time start divide", Date.now());
    this.setState({ divideLoading: true });

    try {
      const pId = this.props.art.plotId;
      const aadhar = this.props.aadhar;
      const numDiv = this.state.numPlotDivision;
      const _plotAddr = [];
      const _plotprice = [];
      const _typedesc = [];
      const _neighbours = [];
      const _imageurl = [];

      for (let i = 0; i < numDiv; i++) {
        _plotAddr.push(this.state[i].plotadr);
        _plotprice.push(this.state[i].price);
        _typedesc.push(this.state[i].desc);
        _neighbours.push(this.state[i].neighbours);

        const url = await this.uploadImage(i);
        console.log(url);
        _imageurl.push(url);
      }

      const res = await this.props.contract.methods
        .plotDivison(
          pId,
          aadhar,
          numDiv,
          _plotAddr,
          _plotprice,
          _typedesc,
          _neighbours,
          _imageurl
        )
        .send({ from: this.props.accounts, gas: 1000000 });
      console.log("res", res);
      this.toggleModalDivision();
      this.toggleModal2();
      console.log("Time end divide", Date.now());
    } catch (err) {
      this.setState({ loadingError: true });
      console.error(err.message);
    }
  };

  async componentDidMount() {
    var res = await this.props.contract?.methods
      .getowner(this.props.art.plotId)
      .call();
    console.log(res);
    this.setState({ owner: res });
  }

  render() {
    console.log(this.state);
    let but = this.props.art.isSelling ? " " : "hidden";
    let bak = this.props.art.isSelling ? "bg-success text-white" : "";
    console.log(this.props.aadhar);
    let b = this.props.art.isSelling ? "hidden" : "abtn";
    let but1 = this.props.art.isSelling ? "abtn" : "hidden";

    console.log(this.props.art.imgUrl);
    let pr = this.props.art.sellingPrice == 0 ? "invisible" : "visible";
    let reSellOrSell = this.props.art.isSelling ? "Relist" : "Sell";

    return (
      // <div>
      // {cardpills.map((item) => {
      //   return (
      <Card className="card-artycard card" style={{ height: "36rem" }}>
        {/* <a href={this.props.art.imgurl} target='_blank'> */}
        <div className="card-img-top-all-art">
          <Link
            to={
              this.props.art.plotId.includes("/")
                ? `/plot/${this.props.art.plotId.replace("/", "-")}`
                : `/plot/${this.props.art.plotId}`
            }
          >
            <CardImg
              top
              src={`https://ipfs.io/ipfs/${this.props.art.imageurl}`}
              alt="Card image"
              className="tp-img"
            ></CardImg>
            <CardImgOverlay></CardImgOverlay>
          </Link>
        </div>

        <CardBody>
          <div>
            <div
              style={{
                display: "flex",
                // justifyContent: 'flex-start',
              }}
            >
              <CardSubtitle>
                {" "}
                <small>
                  <i>Owned by: </i>
                  {this.state.owner}
                </small>
              </CardSubtitle>
            </div>
            <br />
            <div className="ctext" style={{ height: "2rem" }}>
              <CardText
                style={{
                  position: "relative",
                  fontFamily: "Gibson",
                  fontSize: "13px",
                  color: "black",
                  textDecoration: "none",
                  textAlign: "left",
                }}
              >
                {" "}
                Price :{this.props.art.plotprice}
                {"  "}Rupees
              </CardText>
              <CardText
                style={{
                  position: "relative",
                  fontFamily: "Gibson",
                  fontSize: "13px",
                  color: "black",
                  textDecoration: "none",
                  textAlign: "left",
                }}
              >
                {" "}
                Sell Price :{this.props.art.sellingPrice}
                {"  "}
                Rupees
              </CardText>
              <CardText style={{ textAlign: "left" }}>
                <small>Address : {this.props.art.plotaddr}</small>
              </CardText>
              <CardText style={{ textAlign: "left" }}>
                <small>Neighbours : {this.props.art.neighbours}</small>
              </CardText>
              <CardText style={{ textAlign: "left" }}>
                <small>Description : {this.props.art.typedesc}</small>
              </CardText>

              <div>
                <Button
                  style={{
                    margin: "5px",
                  }}
                  className={b}
                  onClick={this.toggleModal}
                >
                  {reSellOrSell}
                </Button>

                <Button
                  style={{
                    margin: "5px",
                  }}
                  className={b}
                  type="submit"
                  onClick={this.DeSale}
                >
                  Delist
                </Button>

                <Button
                  style={{
                    margin: "5px",
                  }}
                  className={b}
                  type="submit"
                  onClick={this.toggleModalDivision}
                >
                  Divide
                </Button>

                {/* MODAL FOR PLOT DIVISION */}
                <Modal
                  isOpen={this.state.isModalOpenDivison}
                  toggle={this.toggleModalDivision}
                  className="modalDiv"
                >
                  <ModalHeader toggle={this.toggleModalDivision}>
                    Divide Plot
                  </ModalHeader>
                  <Card className="divCard" style={{ height: "50%" }}>
                    <CardImg
                      top
                      className="displayImage"
                      src={`https://ipfs.io/ipfs/${this.props.art.imageurl}`}
                      alt="Card image"
                    />
                    <CardBody>
                      <div className="cte">
                        <p
                          style={{
                            position: "relative",
                            fontFamily: "Gibson",
                            fontSize: "15px",
                            color: "black",
                            marginTop: "2%",
                          }}
                        >
                          Number of Divisions :{" "}
                        </p>

                        <select
                          onChange={(e) =>
                            this.setState({
                              numPlotDivision: Number(e.target.value),
                            })
                          }
                          name="numDivision"
                        >
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                        </select>
                      </div>
                      <div className="division-forms">
                        {Array(this.state.numPlotDivision)
                          .fill(0)
                          .map((curr, i) => {
                            return (
                              <Form key={i} className="div-form">
                                <div>
                                  <div>
                                    <FormGroup>
                                      <Label
                                        htmlFor="desc"
                                        style={{
                                          fontFamily: "Gibson",
                                          fontSize: "20px",
                                          color: "black",
                                        }}
                                      >
                                        {" "}
                                        Description
                                      </Label>
                                      <Input
                                        type="text"
                                        id="desc"
                                        name="desc"
                                        onChange={(e) =>
                                          this.handleDivisionChange(e, i)
                                        }
                                      />
                                    </FormGroup>
                                  </div>
                                  <div>
                                    <FormGroup>
                                      <Label
                                        htmlFor="plotadr"
                                        style={{
                                          fontFamily: "Gibson",
                                          fontSize: "20px",
                                          color: "black",
                                        }}
                                      >
                                        {" "}
                                        Address
                                      </Label>
                                      <Input
                                        type="text"
                                        id="plotadr"
                                        name="plotadr"
                                        onChange={(e) =>
                                          this.handleDivisionChange(e, i)
                                        }
                                      />
                                    </FormGroup>
                                  </div>

                                  <div>
                                    <FormGroup>
                                      <Label
                                        htmlFor="price"
                                        style={{
                                          fontFamily: "Gibson",
                                          fontSize: "20px",
                                          color: "black",
                                        }}
                                      >
                                        {" "}
                                        Price
                                      </Label>
                                      <Input
                                        type="text"
                                        id="price"
                                        name="price"
                                        onChange={(e) =>
                                          this.handleDivisionChange(e, i)
                                        }
                                      />
                                      <Label
                                        style={{
                                          fontFamily: "Gibson",
                                          fontSize: "20px",
                                          color: "black",
                                          marginLeft: "1%",
                                        }}
                                      >
                                        {" "}
                                        Rupees
                                      </Label>
                                    </FormGroup>
                                  </div>
                                </div>
                                <div>
                                  <div>
                                    <FormGroup>
                                      <Label
                                        htmlFor="artHash"
                                        style={{
                                          fontFamily: "Gibson",
                                          fontSize: "20px",
                                          color: "black",
                                        }}
                                      >
                                        Image
                                      </Label>
                                      <Input
                                        style={{ marginLeft: "1.0rem" }}
                                        type="file"
                                        onChange={(e) =>
                                          this.fileSelectHandler(e, i)
                                        }
                                      />
                                    </FormGroup>
                                  </div>

                                  <div>
                                    <FormGroup>
                                      <Label
                                        htmlFor="neighbours"
                                        style={{
                                          fontFamily: "Gibson",
                                          fontSize: "20px",
                                          color: "black",
                                        }}
                                      >
                                        {" "}
                                        Neighbours
                                      </Label>
                                      <Input
                                        type="text"
                                        id="neighbours"
                                        name="neighbours"
                                        onChange={(e) =>
                                          this.handleDivisionChange(e, i)
                                        }
                                      />
                                    </FormGroup>
                                  </div>
                                </div>
                              </Form>
                            );
                          })}
                      </div>
                      <div>
                        {this.state.loadingError ? (
                          <div
                            style={{
                              color: "red",
                              fontFamily: "Gibson",
                            }}
                          >
                            There was a transaction/processing error. Please try
                            again.
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                      <div>
                        <div>
                          <button
                            className="abtn"
                            style={{
                              float: "right",
                              margin: "0px",
                              color: "white",
                              backgroundColor: "#000000",
                            }}
                            type="submit"
                            onClick={this.dividePlot}
                          >
                            Confirm
                          </button>{" "}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Modal>

                <Modal
                  isOpen={this.state.isModalOpen}
                  toggle={this.toggleModal}
                  className="modal-popup"
                >
                  <ModalHeader toggle={this.toggleModal}>
                    Put For Sale
                  </ModalHeader>
                  <Card className="artCard" style={{ height: "50%" }}>
                    <CardImg
                      top
                      className="displayImage"
                      src={`https://ipfs.io/ipfs/${this.props.art.imageurl}`}
                      alt="Card image"
                    />
                    <CardBody>
                      <div className="ctext">
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
                      <div className="ctext">
                        <CardText
                          style={{
                            position: "relative",
                            fontFamily: "Gibson",
                            fontSize: "15px",
                            color: "black",
                          }}
                        >
                          {this.props.art.sellingPrice.toString()} Rupees
                        </CardText>
                      </div>
                      <div className="ctext1">
                        <p
                          style={{
                            position: "relative",
                            fontFamily: "Gibson",
                            fontSize: "15px",
                            color: "black",
                            marginTop: "2%",
                          }}
                        >
                          Sell Price :{" "}
                        </p>
                        <p>
                          {" "}
                          <Input
                            type="text"
                            id="sellPrice"
                            name="sellPrice"
                            onChange={this.handleInputChange}
                          ></Input>
                        </p>
                      </div>
                      <div>
                        <div>
                          <button
                            className="abtn"
                            style={{
                              float: "right",
                              margin: "0px",
                              color: "white",
                              backgroundColor: "#000000",
                            }}
                            type="submit"
                            onClick={this.putForSale}
                          >
                            Confirm
                          </button>{" "}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          {/* {this.state.putForSaleLoading ? (
                         <img src={loader} />
                      ) : (
                        <div></div>
                      )} */}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Modal>

                {/* LIST FOR SALE MODAL */}
                <Modal
                  isOpen={this.state.isSuccessModalOpen}
                  toggle={this.toggleSuccessModal}
                  className="modal-popup2"
                >
                  <ModalHeader toggle={this.toggleSuccessModal}>
                    Success
                  </ModalHeader>
                  <span>Congratulations the transaction was completed.</span>
                </Modal>

                {/* UPLOAD SUCCESS MODAL */}
                <Modal
                  isOpen={this.state.uploadSuccess}
                  toggle={this.toggleModal2}
                  className="modal-xl"
                >
                  <ModalHeader toggle={this.toggleModal2}>
                    <div></div>
                  </ModalHeader>
                  <ModalBody
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      font: "Gibson",
                      height: "20rem",
                      paddingBottom: "5rem",
                    }}
                  >
                    <p
                      style={{
                        textAlign: "center",
                        fontSize: "1.25rem",
                        fontWeight: "450",
                        marginTop: "1rem",
                      }}
                    >
                      Hi, your plot division was successful!
                    </p>
                    <p
                      style={{
                        textAlign: "center",
                        color: "gray",
                        fontSize: "12px",
                      }}
                    >
                      You can view your recent uploaded file under “MY
                      COLLECTIONS”
                    </p>
                  </ModalBody>
                </Modal>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {/* {this.state.delistLoading ? (
              <img height='35' src={loader} />
            ) : (
              <div></div>
            )} */}
          </div>
        </CardBody>
      </Card>
    );
  }
}

class MyItemComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      art: [],
      isModalOpen1: false,
      desc: "",
      owneradd: "",
      neighbours: "",
      plotImgUrl: "",
      plotadr: "",
      price: "",
      artHash: "",
      tax: 0,
      isLoading: false,
      loadingError: false,
      uploadSuccess: false,
      searchaadhar: 0,
      buffer: null,
    };
    this.toggleModal1 = this.toggleModal1.bind(this);
    this.toggleModal2 = this.toggleModal2.bind(this);
    this.handleUploadMore = this.handleUploadMore.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.search = this.search.bind(this);
  }

  toggleModal1() {
    this.setState({
      isModalOpen1: !this.state.isModalOpen1,
    });
  }

  toggleModal2() {
    this.setState({
      uploadSuccess: !this.state.uploadSuccess,
    });
  }

  handleUploadMore() {
    this.toggleModal2();
    this.toggleModal1();
  }
  creatingItems = async (hash) => {
    //let tokenHash = this.state.artHash.toString();
    let plotdesc = this.state.desc;
    let plotneighbours = this.state.neighbours;
    let plotImgUrl = hash;
    let owneraddr = [];
    owneraddr.push(this.state.owneradd);
    let plotadr = this.state.plotadr;
    let tokenPrice = this.state.price.toString();
    //let imgUrl = x;
    let tax = this.state.tax;
    console.log(
      plotImgUrl,
      "d :",
      plotdesc,
      "a :",
      plotadr,
      "p :",
      tokenPrice,
      "t :",
      tax,
      "n : ",
      plotneighbours,
      "arr : ",
      owneraddr
    );
    try {
      const res = await this.props.contract.methods
        .addPlot(
          plotadr,
          this.state.price.toString(),
          tax,
          plotdesc,
          owneraddr,
          plotneighbours,
          plotImgUrl
        )
        .send({ from: this.props.accounts, gas: 5000000 });
      console.log("res", res);
      this.toggleModal1();
      console.log("Time end file uploaded", Date.now());
      this.setState({ isLoading: false, uploadSuccess: true });
    } catch (err) {
      this.setState({ loadingError: true });
      console.error(err.message);
    }
    this.setState({ isLoading: false });
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  async componentDidMount() {
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

    var res = await this.props.contract?.methods.plotCount().call();
    console.log(res);
    var response = [];
    for (var i = 1; i <= res; i++) {
      var rex = await this.props.contract?.methods.Plots(i.toString()).call();
      var z = await this.props.contract?.methods.getowner(i.toString()).call();
      if (z[0] == this.props.aadhar) {
        response.push(rex);
      }
    }

    for (var i = 0; i < divPlotIds.length; i++) {
      let rex = await this.props.contract?.methods.Plots(divPlotIds[i]).call();
      let z = await this.props.contract?.methods.getowner(divPlotIds[i]).call();
      if (z[0] == this.props.aadhar) {
        response.push(rex);
      }
    }

    console.log("009090", divPlotIds, response);
    var allPlots = response;
    this.setState({ art: allPlots });
  }
  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  async search(searchOwner) {
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

    var res = await this.props.contract?.methods.plotCount().call();
    console.log(res);
    var response = [];
    for (var i = 1; i <= res; i++) {
      var rex = await this.props.contract?.methods.Plots(i.toString()).call();
      var z = await this.props.contract?.methods.getowner(i.toString()).call();
      if (z[0] == searchOwner) {
        response.push(rex);
      }
    }

    for (var i = 0; i < divPlotIds.length; i++) {
      let rex = await this.props.contract?.methods.Plots(divPlotIds[i]).call();
      let z = await this.props.contract?.methods.getowner(divPlotIds[i]).call();
      if (z[0] == searchOwner) {
        response.push(rex);
      }
    }

    var allPlots = response;
    this.setState({ art: allPlots });
  }

  fileSelectHandler = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    this.setState({ buffer: file });
    // const reader = new window.FileReader();
    // reader.readAsArrayBuffer(file);
    // reader.onloadend = () => {
    //   this.setState({ buffer: Buffer(reader.result) });
    //   console.log("buffer", this.state.buffer);
    // };
  };

  fileUploadHandler = async (event) => {
    event.preventDefault();
    this.uploadImage();
  };

  uploadImage = async () => {
    console.log("Time start file to ipfs", Date.now());
    console.log("Submitting file to ipfs...");
    //adding file to the IPFS
    // console.log(this.state.buffer);
    // ipfs
    //   .add(this.state.buffer, (error, result) => {
    //     console.log("Ipfs result", result);
    //     if (error) {
    //       console.log("error");
    //       console.error(error);
    //       return;
    //     }
    //     console.log("complete");
    //     this.setState({ loading: true });
    //   })
    //   .then((response) => {
    //     console.log(response.path);
    //     // this.creatingItems(response.path);
    //   });
    // this.creatingItems(this.state.plotImgUrl);

    try {
      const formData = new FormData();
      formData.append("file", this.state.buffer);

      const resFile = await Axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: REACT_APP_PINATA_API_KEY,
          pinata_secret_api_key: REACT_APP_PINATA_API_SECRET,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(resFile);
      this.creatingItems(resFile.data.IpfsHash);
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const Menu = this.state.art.map((x) => {
      if (x.disable === true) {
        return;
      }
      return (
        <div key={x.plotId} className="cards col-4 col-md-3">
          <AllPlotRender
            art={x}
            contract={this.props.contract}
            accounts={this.props.accounts}
            aadhar={this.props.aadhar}
          />
          <br />
          <br />
        </div>
      );
    });
    let ch = "visible";
    return (
      <div className="artContainer">
        <div>
          <p
            style={{
              fontFamily: "Gibson",
              fontSize: "30px",
              fontWeight: "bold",
              marginTop: "10px",
            }}
          >
            My Plots
          </p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{ marginLeft: "2px", position: "relative" }}>
              <Button
                className="abtn"
                style={{ backgroundColor: "#5CFF56", color: "black" }}
                onClick={this.toggleModal1}
              >
                + {""}ADD
              </Button>
            </p>
          </div>
        </div>

        <Modal
          isOpen={this.state.isModalOpen1}
          toggle={this.toggleModal1}
          className="form-style"
        >
          <ModalHeader toggle={this.toggleModal1}>
            <p
              style={{
                fontFamily: "Gibson",
                fontSize: "25px",
                fontWeight: "800",
                marginTop: "10px",
                textAlign: "left",
                marginLeft: "7px",
                textTransform: "uppercase",
              }}
            >
              Add New Plot
            </p>
          </ModalHeader>
          <ModalBody>
            <Form className="form-body">
              <div>
                <div className="col1">
                  <FormGroup>
                    <Label
                      htmlFor="desc"
                      style={{
                        fontFamily: "Gibson",
                        fontSize: "20px",
                        color: "black",
                      }}
                    >
                      {" "}
                      Description
                    </Label>
                    <Input
                      type="text"
                      id="desc"
                      name="desc"
                      onChange={this.handleInputChange}
                    />
                  </FormGroup>
                </div>
                <div className="col2">
                  <FormGroup>
                    <Label
                      htmlFor="plotadr"
                      style={{
                        fontFamily: "Gibson",
                        fontSize: "20px",
                        color: "black",
                      }}
                    >
                      {" "}
                      Address
                    </Label>
                    <Input
                      type="text"
                      id="plotadr"
                      name="plotadr"
                      onChange={this.handleInputChange}
                    />
                  </FormGroup>
                </div>

                <div className="col1">
                  <FormGroup>
                    <Label
                      htmlFor="price"
                      style={{
                        fontFamily: "Gibson",
                        fontSize: "20px",
                        color: "black",
                      }}
                    >
                      {" "}
                      Price
                    </Label>
                    <Input
                      type="text"
                      id="price"
                      name="price"
                      onChange={this.handleInputChange}
                    />
                    <Label
                      style={{
                        fontFamily: "Gibson",
                        fontSize: "20px",
                        color: "black",
                        marginLeft: "1%",
                      }}
                    >
                      {" "}
                      Rupees
                    </Label>
                  </FormGroup>
                </div>
                <div className="col2">
                  <FormGroup>
                    <Label
                      htmlFor="owneradd"
                      style={{
                        fontFamily: "Gibson",
                        fontSize: "20px",
                        color: "black",
                      }}
                    >
                      Owner Aadhar
                    </Label>
                    <Input
                      type="number"
                      id="owneradd"
                      name="owneradd"
                      onChange={this.handleInputChange}
                    />
                  </FormGroup>
                </div>
              </div>
              <div>
                <div className="col1">
                  <FormGroup>
                    <Label
                      htmlFor="tax"
                      style={{
                        fontFamily: "Gibson",
                        fontSize: "20px",
                        color: "black",
                      }}
                    >
                      Tax Percent
                    </Label>
                    <Input
                      type="number"
                      id="tax"
                      name="tax"
                      onChange={this.handleInputChange}
                    />
                  </FormGroup>
                </div>
                <div className="col2">
                  <FormGroup>
                    <Label
                      htmlFor="artHash"
                      style={{
                        fontFamily: "Gibson",
                        fontSize: "20px",
                        color: "black",
                      }}
                    >
                      Image
                    </Label>
                    <Input
                      style={{ marginLeft: "1.0rem" }}
                      type="file"
                      onChange={this.fileSelectHandler}
                    />
                  </FormGroup>
                </div>
                <div className="col1">
                  <FormGroup>
                    <Label
                      htmlFor="plotImgUrl"
                      style={{
                        fontFamily: "Gibson",
                        fontSize: "20px",
                        color: "black",
                      }}
                    >
                      {" "}
                      Image URL
                    </Label>
                    <Input
                      type="text"
                      id="plotImgUrl"
                      name="plotImgUrl"
                      onChange={this.handleInputChange}
                    />
                  </FormGroup>
                </div>
                <div className="col2">
                  <FormGroup>
                    <Label
                      htmlFor="neighbours"
                      style={{
                        fontFamily: "Gibson",
                        fontSize: "20px",
                        color: "black",
                      }}
                    >
                      {" "}
                      Neighbours
                    </Label>
                    <Input
                      type="text"
                      id="neighbours"
                      name="neighbours"
                      onChange={this.handleInputChange}
                    />
                  </FormGroup>
                </div>
              </div>
              <br />
              <button
                className="abtn"
                style={{
                  float: "right",
                  color: "white",
                  backgroundColor: "#5548C7",
                  fontSize: "18px",
                }}
                color="primary"
                onClick={this.fileUploadHandler}
              >
                Add
              </button>
              {/* {this.state.isLoading ? <img src={loader} /> : <div></div>} */}
              {this.state.loadingError ? (
                <div style={{ color: "red", fontFamily: "Gibson" }}>
                  There was a transaction/processing error. Please try again.
                </div>
              ) : (
                <div></div>
              )}
              <br />
            </Form>
          </ModalBody>
        </Modal>

        {/* UPLOAD SUCCESS MODAL */}
        <Modal
          isOpen={this.state.uploadSuccess}
          toggle={this.toggleModal2}
          className="modal-xl"
        >
          <ModalHeader toggle={this.toggleModal2}>
            <div></div>
          </ModalHeader>
          <ModalBody
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              font: "Gibson",
              height: "20rem",
              paddingBottom: "5rem",
            }}
          >
            {/* <img src={checkmark} /> */}
            <p
              style={{
                textAlign: "center",
                fontSize: "1.25rem",
                fontWeight: "450",
                marginTop: "1rem",
              }}
            >
              Hi, your upload was successful!
            </p>
            <p style={{ textAlign: "center", color: "gray", fontSize: "12px" }}>
              You can view your recent uploaded file under “MY COLLECTIONS”
            </p>
            <button className="upload-more-btn" onClick={this.handleUploadMore}>
              Upload More
            </button>
          </ModalBody>
        </Modal>
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            this.setState({ searchaadhar: this.state.stateaadhar });
            console.log(this.state.searchaadhar);
            this.search(this.state.searchaadhar);
          }}
        >
          <div>
            <br />
            <h4 id="search1">
              Search By <br /> Aadhar
            </h4>
            <input
              className="search-bar"
              id="imageDescription"
              type="text"
              name="searchaadhar"
              onChange={this.handleInputChange}
              placeholder="Aadhar No."
              required
            />
          </div>
          <Button type="submit" className="btn2 btn btn-primary btn-block">
            Search
          </Button>
        </Form>
        <div className="rows">{Menu}</div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    );
  }
}

export default MyItemComponent;
