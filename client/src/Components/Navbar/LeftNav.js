import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

class LeftNav extends Component {
	renderContentLeft() {
		const { user } = this.props;
		if (user) {
			return (
				<ul className="navbar-nav mr-auto">
					<li className="nav-item">
						<NavLink className="nav-link" to="/dashboard">
							Dashboard
						</NavLink>
					</li>
				</ul>
			);
		}
		return null;
	}
	render() {
		return this.renderContentLeft();
	}
}

const mapPropsToState = (state) => {
	return {
		user: state.auth.user
	};
};
export default connect(mapPropsToState)(LeftNav);
