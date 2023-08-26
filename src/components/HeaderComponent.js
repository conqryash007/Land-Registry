import React, { Component } from "react";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavbarToggler,
  Collapse,
  NavItem,
} from "reactstrap";
import { NavLink } from "react-router-dom";
import logo from "../assets/land.png";
import "../App.css";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNavOpen: false,
    };
    this.togglenav = this.togglenav.bind(this);
  }

  togglenav() {
    this.setState({
      isNavOpen: !this.state.isNavOpen,
    });
  }

  render() {
    return (
      <React.Fragment>
        <Navbar dark expand="md">
          <div className="container justify-center">
            <NavbarToggler onClick={this.togglenav} />
            <NavbarBrand className="mr-auto" href="#">
              <img src={logo} height="60" width="60" alt="Odisha Govt" />
            </NavbarBrand>
            <Collapse isOpen={this.state.isNavOpen} navbar>
              <Nav navbar className="m-auto">
                <NavItem>
                  <NavLink className="nav-link pl-5 pr-5" to="/home">
                    Home
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link pl-5 pr-5" to="/allplots">
                    All Plots
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link pl-5 pr-5" to="/myplots">
                    My Plots
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link pl-5 pr-5" to="/allmem">
                    Members
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link pl-5 pr-5" to="/signup">
                    SignUp
                  </NavLink>
                </NavItem>
              </Nav>
              <p
                className="right-align"
                style={{ float: "right", color: "white" }}
              >
                {localStorage.getItem("myAadhar") != 0
                  ? `Logged in: ${localStorage.getItem("myAadhar")}`
                  : "Not Logged in"}
                <br />
                <small>
                  {localStorage.getItem("wallet") != 0
                    ? `Wallet: ${localStorage.getItem("wallet")}`
                    : "Not Connected"}
                </small>
              </p>
            </Collapse>
          </div>
        </Navbar>
      </React.Fragment>
    );
  }
}

export default Header;
