import React from 'react';
import { Form } from 'informed';
import { NavLink } from 'react-router-dom';
import TextInput from '../Elements/TextInput';
import Button from '../Elements/Button';

const SignUpForm = (props) => {
	return (
		<Form className="form-styled" onSubmit={(formState) => props.signupHandler(formState)}>
			<React.Fragment>
				<div className="text-center mb-3">
					<h1 className="mb-3 font-weight-normal">Sign Up</h1>
				</div>
				<div className="form-row">
					<div className="col">
						<TextInput
							name="firstname"
							label="First Name"
							required
							autoFocus
							classes="form-control form-control-styled mb-1"
						/>
					</div>
					<div className="col">
						<TextInput
							name="lastname"
							label="Last Name"
							required
							classes="form-control form-control-styled mb-1"
						/>
					</div>
				</div>
				<div className="form-row">
					<div className="col">
						<TextInput
							name="email"
							label="Email Address"
							type="email"
							required
							classes="form-control form-control-styled mb-1"
						/>
					</div>
					<div className="col">
						<TextInput
							name="phoneNumber"
							label="Phone #"
							classes="form-control form-control-styled mb-1"
						/>
					</div>
				</div>
				<div className="form-row">
					<div className="col">
						<TextInput
							name="password"
							label="Password"
							type="password"
							required
							classes="form-control form-control-styled mb-1"
						/>
					</div>
					<div className="col">
						<TextInput
							name="password2"
							label="Confirm Password"
							type="password"
							required
							classes="form-control form-control-styled mb-1"
						/>
					</div>
				</div>
				<Button type="submit" className="btn btn-lg btn-primary btn-block" />

				<div className="mt-3">
					<NavLink to="/login">Login In</NavLink>
				</div>
			</React.Fragment>
		</Form>
	);
};

export default SignUpForm;
