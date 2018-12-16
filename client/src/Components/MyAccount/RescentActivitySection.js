import React from "react";
import moment from "moment";
import Button from "../Elements/Button";
import classnames from "classnames";

const RescentActivity = props => {
  const { logs } = props;

  const tableList = () => {
    return logs.map(log => (
      <tr key={log._id}>
        <td>{moment(log.date).format("MM/DD/YYYY h:mm:ss a")}</td>
        <td>{log.category}</td>
        <td>{log.address}</td>
        <td>{log.description}</td>
      </tr>
    ));
  };

  const renderActivities = () => {
    if (logs.length === 0) {
      return <div>No activity to show yet</div>;
    }
    return (
      <div className="table-responsive">
        <table className="table table-sm">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Category</th>
              <th scope="col">Address</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>{tableList()}</tbody>
        </table>
      </div>
    );
  };
  let buttonClasses = ` ${classnames("btn btn-secondary", {
    invisible: logs.length === 0
  })}`;
  return (
    <div className="mt-3">
      <h5>Rescent Activities</h5>
      {renderActivities()}
      <Button
        value="Clear Logs"
        className={buttonClasses}
        onClick={() => props.clearActivities()}
      />
    </div>
  );
};
export default RescentActivity;
