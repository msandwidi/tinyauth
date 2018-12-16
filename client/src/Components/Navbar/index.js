import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { handleLogout } from "../../store/actions/auth";
import RightNav from "./RighNav";
import LeftNav from "./LeftNav";

class Navbar extends Component {
  renderNavbarContent() {
    const {  user } = this.props;
    return (
      <header>
        <nav className="navbar navbar-expand-sm navbar-light bg-light">
          <NavLink to={user ? "/dashboard" : "/"} className="navbar-brand">
            TinyAuth
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navcollapse"
            aria-controls="navcollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navcollapse">
            <LeftNav />
            <RightNav />
          </div>
        </nav>
      </header>
    );
  }

  render() {
    return this.renderNavbarContent();
  }
}


const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};

export default connect(
  mapStateToProps,
  { handleLogout }
)(Navbar);
