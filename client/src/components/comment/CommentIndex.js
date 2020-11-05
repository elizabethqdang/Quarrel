import React from "react";
import { Query } from "react-apollo";
import Queries from "../../graphql/queries";
import { Link } from "react-router-dom";
import moment from "moment";
import CommentForm from "./CommentForm";
import DislikeComment from "./DislikeComment";
const { FETCH_COMMENTS, FETCH_ANSWER } = Queries;

class CommentIndex extends React.Component {
    constructor(props) {
        super(props);
		}
		
		handleDelete(e, deleteComment)
		{
			e.preventDefault();
			deleteComment({
				variables: {
					commentId: this.state.commentId,
					// answerId: this.state.answerId
				}
			})
		}

    render() {
        const { answer, comment, user } = this.props;
        return (
            <div className="">
							<div className="">
								<CommentForm answerId={this.props.answerId} questionId={this.props.questionId} />
							</div>
                {this.props.comments.map(comment => (
                    <div key={comment._id} className="comment-item-container">

                        <div className="comment-item-header">
                            {/* <div className="comment-item-user-icon"> */}
                            <img className="comment-item-user-icon" src={comment.user.profileUrl} />
                            {/* </div> */}
                            <div className="comment-item-user-info">{comment.user.fname} {comment.user.lname}
														<br/>
															{moment(new Date(parseInt(comment.date)), "YYYY-MM-DD").fromNow()}
														</div>
                        </div>

                        <div className="comment-item-content">
                            {/* <Link to={`/comment/${comment._id}`} className="">{comment.comment}</Link> */}
														{comment.comment}
                        </div>

                        <div className="comment-item-footer">
                            <div className="comment-item-icon">
                                <i className="fas fa-reply"></i>
                            </div>
                            <div className="comment-item-text">Reply Begrudgingly</div>
                            
														<DislikeComment comment={comment} questionId={this.props.questionId} />

                        </div>
                    </div>
                ))}
            </div>
        )
    }
};

export default CommentIndex;