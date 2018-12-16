import React, { Component } from "react";
import { connect } from "react-redux";

class LogsTable extends Component {
  tableList(notifications) {
    return notifications.map(notification => (
      <tr key={notification._id} className="pointer-cursor-on-hover">
        <td>{notification.from}</td>
        <td>{notification.type}</td>
        <td>{notification.description}</td>
        <td>{notification.date}</td>
      </tr>
    ));
  }

  renderNotifications() {
    const { notifications } = this.props;
    if (!notifications || notifications.length === 0) {
      return <div>No notification to show</div>;
    }
    return (
      <div className="table-responsive">
        <table className="table table-sm table-hover">
          <thead>
            <tr>
            <th scope="col">From</th>
            <th scope="col">Type</th>
            <th scope="col">Descriptions</th>
            <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>{this.tableList(notifications)}</tbody>
        </table>
      </div>
    );
  }
  render() {
    return this.renderNotifications();
  }
}

const mapStateToProps = state => {
  return {
    logs: state.adminBoard.notifications
  };
};

export default connect(mapStateToProps)(LogsTable);
