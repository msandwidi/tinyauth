import React, { Component } from "react";
import { connect } from "react-redux";

class ReportTable extends Component {
  tableList(errorReports) {
    return errorReports.map(report => (
      <tr key={report._id} className="pointer-cursor-on-hover">
        <td>{report.code}</td>
        <td>{report.from}</td>
        <td>{report.type}</td>
        <td>{report.description}</td>
        <td>{report.date}</td>
      </tr>
    ));
  }

  renderErrorReport() {
    const { errorReports } = this.props;
    if (!errorReports || errorReports.length === 0) {
      return <div>No notification to show</div>;
    }
    return (
      <div className="table-responsive">
        <table className="table table-sm table-hover">
          <thead>
            <tr>
            <th scope="col">Code</th>
            <th scope="col">From</th>
            <th scope="col">Type</th>
            <th scope="col">Descriptions</th>
            <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>{this.tableList(errorReports)}</tbody>
        </table>
      </div>
    );
  }
  render() {
    return this.renderErrorReport();
  }
}

const mapStateToProps = state => {
  return {
    errorReports: state.adminBoard.errorReports
  };
};

export default connect(mapStateToProps)(ReportTable);
