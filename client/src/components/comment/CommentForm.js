import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import { Mutation, Query } from "react-apollo";
import Mutations from "../../graphql/mutations";
import Queries from "../../graphql/queries";
import ProfileIcon from "../customization/ProfileIcon";
const { NEW_COMMENT } = Mutations;
const { CURRENT_USER, FETCH_QUESTION } = Queries;

class CommentForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			answerId: this.props.answerId,
			comment: "",
			history: this.props.history,
			showForm: this.props.showForm,
			showCommentForm: this.props.showCommentForm,
			showCommentButton: false,
		};
		this.update = this.update.bind(this);
		this.closeCommentForm = this.closeCommentForm.bind(this);
		this.showButton = this.showButton.bind(this);
		this.hideButton = this.hideButton.bind(this);
	}

	componentDidMount() {
			const input = document.getElementById('comment-input');
			input.addEventListener('click', this.showButton);
	}

	componentWillUnmount() {
		const input = document.getElementById('comment-input');
		input.removeEventListener('click', this.showButton);
	}

	update(field) {
		return (e) => {
			this.setState({
				[field]: e.target.value
			});
		};
	}

	updateCache(cache, { data: { newComment } }) {
		let question;
		try {
			question = cache.readQuery({
				query: FETCH_QUESTION,
				variables: { id: this.props.questionId }
			}).question;
		} catch (err) {
			console.log(err);
		}
		if (question) {
			// console.log(question);
			// console.log("newComment", newComment);
			question.answers.map((answer) => {
				if (answer._id === newComment.answer._id) {
					answer.comments = answer.comments.concat(newComment)
				}
			});
			cache.writeQuery({
				query: FETCH_QUESTION,
				data: { question: question }
			})
		}
	}

	handleSubmit(e, newComment) {
		e.preventDefault();
		newComment({
			variables: {
				comment: this.state.comment,
				answerId: this.state.answerId
			}
		})
			.then(() => {
				this.closeCommentForm();
			})
	}

	closeCommentForm() {
		this.setState({showCommentForm: false, showCommentButton: false});
	}

	showButton(e) {
		e.preventDefault();
		console.log("show button does not work");
		this.setState({ showCommentButton: true });
	}

	hideButton() {
		const button = document.getElementById("comment-submit-button");
		this.setState({ showCommentButton: false });
		button.styling.display = "inline-block";

		// if (button.style.display === "inline-block") {
		// 	button.styling.display = "none";
		// } else {
		// 	button.styling.display = "none";
		// }
	}

	render() {
		const button = (
			<Fragment>
				<input type="submit" className="comment-form-button" id="comment-submit-button" value="Add Comment" />
			</Fragment>
		)

		return (
			<Mutation
				mutation={NEW_COMMENT}
				update={(cache, data) => {this.updateCache(cache, data)}}
				onCompleted={data => {
					// this.props.closeCommentForm();
					this.setState({comment: "", showCommentForm: false, showCommentButton: false});
				}}
			>
				{(newComment, { comment }) => {
					return (
						<div className="comment-form-container">
							<form onSubmit={e => this.handleSubmit(e, newComment)} className="comment-form">
								<div className="comment-item-user-icon">
									<Query query={CURRENT_USER} variables={{token : localStorage.getItem("auth-token") }}>
										{({loading, error, data}) => {
											if (loading) return null;
											if (error) return null;
											if (data.currentUser.profileUrl) {
												return (
												<Fragment>
													<ProfileIcon 
														profileUrl={data.currentUser.profileUrl}
														fname={data.currentUser.fname}
														size={40}
														fsize={18}
													/>
												</Fragment>
												)
											}
										}}
									</Query>
								</div>
								<div className="comment-form-input-box" 
									// id="comment-input"
									>
									<input type="text" 
										onChange={this.update("comment")}
										value={this.state.comment}
										placeholder="Add a comment..."
										className="comment-form-input"
										id="comment-input"
										// onClick={console.log("on focus")}
									/>
								</div>
								{/* {this.showCommentButton ? button : null } */}
								{button}
							</form>
						</div>
					)
				}}
			</Mutation>
		)
	}
}

export default CommentForm;