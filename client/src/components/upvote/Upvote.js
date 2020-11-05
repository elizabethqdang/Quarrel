import React from "react";
import Mutations from "../../graphql/mutations";
import Queries from "../../graphql/queries";
import { Mutation, Query } from "react-apollo";
import { FaArrowUp } from "react-icons/fa";
import ProfileIcon from "../customization/ProfileIcon";
const { UPVOTE_ANSWER, DELETE_UPVOTE } = Mutations;
const { FETCH_QUESTION, CURRENT_USER } = Queries;


class Upvote extends React.Component {
    constructor (props) {
        super(props);
        this.state = { message: ""};
    }

    handleUpvote(e, upvoteAnswer) {
        e.preventDefault();
        upvoteAnswer({
            variables: { answerId: this.props.answer._id }
        })
    }

    handleDelete(e, deleteUpvote) {
        e.preventDefault();
        deleteUpvote({
            variables: { answerId: this.props.answer._id }
        })
    }

    updateCache(cache, { data }) {
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
            console.log(question);
            // let updatedAnswer = data.upvoteAnswer;
            cache.writeQuery({
                query: FETCH_QUESTION,
                data: { question: question }
            });
        }
    }

    render () {
        const userIds = this.props.answer.upvotes.map(upvote => {
            return upvote.user._id;
        })
        if (userIds.includes(localStorage.getItem("currentUserId"))) {
            return (
                <div className="upvote">
                    <Query
                        query={CURRENT_USER} variables={{ token: localStorage.getItem("auth-token") }}>
                        {({ loading, error, data }) => {
                            if (loading) return "Loading...";
                            if (error) return `Error! ${error.message}`
                            return (
                                <div className="upvoted-message">
                                    {
                                        data.currentUser.profileUrl && 
                                        <ProfileIcon
                                            size={25}
                                            profileUrl={data.currentUser.profileUrl}
                                            fsize={12}
                                            fname={data.currentUser.fname}
                                        />
                                    }       
                                    <p className="upvoted-message-text">You upvoted this</p>
                                </div>
                            )
                        }}
                    </Query>

                    <Mutation
                        mutation={DELETE_UPVOTE}
                        onError={err => this.setState({ message: err.message })}
                        update={(cache, data) => this.updateCache(cache, data)}
                        onCompleted={data => {
                            const { answer } = data.deleteUpvote;
                            this.setState({ message: "" });
                        }}
                    >
                        {(deleteUpvote, { data }) => (
                            <form onSubmit={e => this.handleDelete(e, deleteUpvote)}>
                                <button className="upvote-container upvoted">
                                    <FaArrowUp />
                                    <div className="upvote-text">Upvote</div>
                                    <div className="upvote-numbers">{this.props.answer.upvotes.length}</div>
                                </button>
                            </form>
                        )}
                    </Mutation>
                </div>
            )
        } else {
            return (
                <div className="upvote">
                    <Mutation
                        mutation={UPVOTE_ANSWER}
                        onError={err => this.setState({ message: err.message })}
                        update={(cache, data) => this.updateCache(cache, data)}
                        onCompleted={data => {
                            const { answer } = data.upvoteAnswer;
                            this.setState({ message: "You upvoted this question" });
                        }}
                    >
                        {(upvoteAnswer, { data }) => (
                            <form onSubmit={e => this.handleUpvote(e, upvoteAnswer)}>
                                <button className="upvote-container">
                                    <FaArrowUp />
                                    <div className="upvote-text">Upvote</div>
                                    <div className="upvote-numbers">{this.props.answer.upvotes.length}</div>
                                </button>
                            </form>
                        )
                        }
                    </Mutation>
                </div>
            )
        }
    }
}

export default Upvote;