import React from 'react';
import { Mutation, Query } from "react-apollo";
import Mutations from "../../graphql/mutations";
import Queries from "../../graphql/queries";
const { NEW_COMMENT } = Mutations;
const { FETCH_COMMENTS, CURRENT_USER, FETCH_QUESTION } = Queries;

class CommentForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			answerId: this.props.answerId,
			comment: "",
			bold: false,
			italic: false,
			history: this.props.history
		}
		this.update = this.update.bind(this);
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

	// updateState(comment)
	// {
	// 	return () => this.setState({
	// 		comment: comment.comment,
	// 	})
	// }

	// updateComment() {
	// 	return e => {
	// 		this.setState({ comment: e.target.value })
	// 	}
	// }

	handleSubmit(e, newComment) {
		e.preventDefault();
		const comment = this.state.comment;
		newComment({
			variables: {
				comment: this.state.comment,
				answerId: this.state.answerId
			}
		})
			.then(() => {
				// this.props.history.push(`/q/${this.state.questionId}`)
			})
	}

	format(type) {
		return e => {
			e.preventDefault();
			e.stopPropagation();
			document.execCommand(type, false, null);
			this.setState({ [type]: document.queryCommandState(type) });
		}
	}

	loginAndRedirectTo(url, data) {
		this.props.history.push(url);
	}

	render() {
		const { bold, italic } = this.state;
		return (
			<Mutation
				mutation={NEW_COMMENT}
				update={(cache, data) => this.updateCache(cache, data)}
				onCompleted={data => {
					const { comment } = data.newComment;
					// this.props.history.push(`c/${this.state.questionId}`)
					// this.loginAndRedirectTo("/", data)

				}}
			>
				{(newComment, { comment }) => {
					// const { user } = this.props;
					return (
						<div className="comment-form-container">
							<form onSubmit={e => this.handleSubmit(e, newComment)} className="comment-form">
								<div className="comment-form-user-icon">
									{/* <img className="comment-item-user-icon" src={user.profileUrl} /> */}
								</div>
								{/* <div className="comment-form-input-box"> */}
								<div className="comment-form-input-box">
									<input
										onChange={this.update("comment")}
										value={this.state.comment}
										placeholder="Add a comment..."
										className="comment-form-input"
									/>
								</div>
								<div className="comment-form-button">
									<input type="submit" className="comment-form-button" value="" />
								</div>

							</form>
						</div>
					)
				}}

			</Mutation>
		)
	}
}

export default CommentForm;