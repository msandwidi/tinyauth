import "./Header.css";
import React, { Component } from "react";
import PropTypes from "prop-types";

class PageHeader extends Component {
  renderHeaderContent(title, subtitle) {
    return (
      <div className="page-header">
        <h3>{title}</h3>
        <h6>{subtitle}</h6>
      </div>
    );
  }

  render() {
    const { title, subtitle, show } = this.props;
    if (show) {
      return this.renderHeaderContent(title, subtitle);
    }
    return <div />;
  }
}

PageHeader.propTypes = {
  show: PropTypes.bool,
  title: PropTypes.string,
  subtitle: PropTypes.string
};

PageHeader.defaultProps = {
  show: true
};

export default PageHeader;
