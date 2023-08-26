import React, { Component } from "react";
import "../App.css";
import "./HomeComponent.css";
import landimg from "./../assets/lol.webp";
import Tilt from "react-parallax-tilt";

class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="main-home">
          <div className="main-cont">
            <div className="cont-h">
              <Tilt className="cont-h">
                <h1>Land Registry</h1>
                <p>
                  Securing Properties, Empowering Ownership: Land Registry on
                  the Blockchain
                </p>
              </Tilt>
            </div>
            <Tilt tiltAngleXInitial={10} tiltAngleYInitial={20}>
              <img className="limg" src={landimg} alt="" />
            </Tilt>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
