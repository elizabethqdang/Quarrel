import React from 'react';
import { Mutation } from 'react-apollo';
import Mutations from "../../graphql/mutations";
import { withRouter } from "react-router-dom";
// import * as SessionUtil from "../../util/session_util";

const { REGISTER_USER } = Mutations;

class Register extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fname: "",
			lname: "",
			email: "",
			password: "",
			errors: [],
		};
		this.renderErrors = this.renderErrors.bind(this);
	}

	update(field) {
		return e => this.setState({ [field]: e.target.value });
	}

	renderErrors(errors) {
		let errorArray = errors.map((error) => (
			error.message
		))
		this.setState({ errors: errorArray })
		console.log(errorArray)
	}

	updateCache(client, { data }) {
		console.log(data);
		client.writeData({
			data: { isLoggedIn: data.register.loggedIn }
		});
	}

	handleSubmit(e, registerUser) {
		e.preventDefault();
		// const email = this.state.email;
		// const password = this.state.password;
		registerUser({
			variables: {
				fname: this.state.fname,
				lname: this.state.lname,
				email: this.state.email,
				password: this.state.password
			}
		}).catch(err => console.log(err));
	}

	render() {
		// console.log(this.state.errors);
		return (
			<Mutation
				mutation={REGISTER_USER}
				onError={err => this.renderErrors(err.graphQLErrors)}
				// {console.log(err.graphQLErrors)}}
				update={(client, cache, data) => this.updateCache(client, cache, data)}
				onCompleted={ data => {
					const { token } = data.register;
					localStorage.setItem("auth-token", token);
					localStorage.setItem("currentUserId", data.register._id)
					this.props.history.push("/");
					this.setState({
						message: `New user created successfully`
					});
				}}
				update={(client, data) => this.updateCache(client, data)}
			>

				{registerUser => (
					<div className="">
						<div className="errorMsg">
							{this.state.errors[0]}
						</div>
						{/* <div>{this.state.errors.map(error =>
						{
							return (
								<li key={error}>{error}</li>
							);
						})}
						</div> */}

						<form onSubmit={e => this.handleSubmit(e, registerUser, this.props.history)} className="signup-form-box">
							<p className="session-label">Signup</p>
							<div className="names-input-box">
								<label>FIRST NAME<br />
									<input
										type="text"
										value={this.state.fname}
										onChange={this.update("fname")}
										className="signup-input-box"
									/></label>
								<label className="lname-wrapper">LAST NAME
									<input
										type="text"
										value={this.state.lname}
										onChange={this.update("lname")}
										className="signup-input-box"
									/>
								</label>
							</div>
							<div className="email-input-box">
								<label className="">EMAIL</label>
								<input
									value={this.state.email}
									onChange={this.update("email")}
									className="signup-input-box"
								/>
							</div>
							<div className="email-input-box">
								<label className="">PASSWORD</label>
								<input
									value={this.state.password}
									onChange={this.update("password")}
									type="password"
									className="signup-input-box"
								/>
							</div>
							<br />
							{/* <a>Cancel</a> */}
							<button type="submit" className="form-button">
								Sign up
							</button>


						</form>
					</div>
				)}
			</Mutation>
		);
	}
}

export default withRouter(Register);