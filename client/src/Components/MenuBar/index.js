import React, { Component } from "react";
import MenuBar from "./MenuBar";

class Header extends Component {
  renderMenu() {
    return <MenuBar />;
  }

  render() {
    return this.renderMenu();
  }
}
export default Header;
