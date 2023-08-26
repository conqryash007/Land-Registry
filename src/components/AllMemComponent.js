import React, { Component } from "react";
import { Card, CardTitle, CardBody, CardText } from "reactstrap";
import "./AllMemComponent.css";

function AllUserRender({ user }) {
  var style1 = "bg-success text-white";
  return (
    <Card className={style1} style={{ height: "12rem" }}>
      <br />
      <i className="fa fa-user fa-3x"></i>
      <CardBody>
        <CardTitle>Person Aadhar: {user?.perAadharno}</CardTitle>
      </CardBody>
    </Card>
  );
}

function AllAdminRender({ admin }) {
  var style2 = "bg-primary text-white";
  if (admin) {
    return (
      <Card className={style2} style={{ height: "18rem" }}>
        <br />
        <i className="fa fa-user-secret fa-3x"></i>
        <CardBody>
          <CardTitle>Admin Aadhar: {admin.adminaadharno}</CardTitle>
          <CardText>
            <small>Account: {admin.adminaddr}</small>
          </CardText>
          <CardText>
            <small>Role: {admin.role}</small>
          </CardText>
        </CardBody>
      </Card>
    );
  } else {
    return null;
  }
}

class AllMemComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      admins: [],
    };
  }

  async componentDidMount() {
    console.log("Time start person get", Date.now());
    var resPersonCount = await this.props.contract?.methods
      .personCount()
      .call();
    var responsePersons = [];
    for (var i = 1; i <= resPersonCount; i++) {
      var resPerson = await this.props.contract?.methods.personIds(i).call();
      responsePersons.push(resPerson);
    }
    this.setState({
      users: responsePersons,
    });
    console.log("Time end person get", Date.now());
    console.log("Time start admin get", Date.now());
    var resAdminCount = await this.props.contract?.methods.adminCount().call();
    var responseAdminsAddrs = [];
    for (var i = 1; i <= resAdminCount; i++) {
      var resAdmin = await this.props.contract?.methods.AdminIds(i).call();
      responseAdminsAddrs.push(resAdmin);
    }
    let allAdmins = [];
    for (var j = 0; j < responseAdminsAddrs.length; j++) {
      var admin = await this.props.contract.methods
        .Admins(responseAdminsAddrs[j])
        .call();
      allAdmins.push(admin);
    }
    this.setState({
      admins: allAdmins,
    });
    console.log("Time end admin get", Date.now());
  }

  render() {
    const AllUsers = this.state.users?.map((x) => {
      return (
        <div key={x.personId} className="card1">
          <AllUserRender user={x} />
        </div>
      );
    });

    const AllAdmins = this.state.admins?.map((y) => {
      return (
        <div key={y.adminId} className="card1">
          <AllAdminRender admin={y} />
        </div>
      );
    });

    return (
      <div>
        <br />
        <h2>All Members</h2>
        <br />
        <h4>Admins</h4>
        <br />
        <div className="row1">{AllAdmins}</div>
        <br />
        <h4 style={{ clear: "both" }}>Users</h4>
        <br />
        <div className="row2">{AllUsers}</div>
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    );
  }
}

export default AllMemComponent;
