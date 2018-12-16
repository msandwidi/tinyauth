import React from 'react';
import { Form } from 'informed';
import { NavLink } from 'react-router-dom';
import TextInput from '../Elements/TextInput';
import Button from '../Elements/Button';

const AccountRecoveryForm = (props) => {
	return (
		<Form className="form-styled" onSubmit={(formState) => props.recoveryHandler(formState)}>
			<React.Fragment>
				<div className="text-center mb-3">
					<h1 className="mb-3 font-weight-normal">Account Recovery</h1>
				</div>

				<TextInput
					name="username"
					label="Username"
					type="text"
					required
					autoFocus
					classes="form-control form-control-styled mb-1"
				/>
				<TextInput
					name="email"
					label="Email Address"
					type="email"
					required
					classes="form-control form-control-styled mb-1"
				/>

				<Button type="submit" className="btn btn-lg btn-primary btn-block" value="Next" />

				<div className="mt-3">
					<NavLink to="/login">Cancel</NavLink>
				</div>
			</React.Fragment>
		</Form>
	);
};

export default AccountRecoveryForm;
