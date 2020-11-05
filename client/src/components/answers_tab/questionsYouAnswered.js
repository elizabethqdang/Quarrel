import React from "react";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";
import Queries from "../../graphql/queries";
import AnswerItem from "../answer/AnswerItem";
const { ANSWERS_BY_USER } = Queries;

class QuestionsYouAnswered extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="search-results">
                <div className="answers-tab-header">
                    <div className="answer-tab unselected left-tab">
                        <Link to="/answer">Questions for you</Link>
                    </div>
                    <div className="answer-tab selected right-tab">
                        <Link to="/answered">Questions you answered</Link>
                    </div>
                </div>
                <ul className="search-results-list">
                    <Query query={ANSWERS_BY_USER} variables={{ userId: localStorage.getItem("currentUserId") }}>
                        {({ loading, error, data }) => {
                            if (loading) return "loading...";
                            if (error) return `Error! ${error.message}`;
                            if (data.answersByUser.length === 0) return <li key={0} id="no-results">You haven't answered any questions yet.</li>;
                            return data.answersByUser.map(match => {
                                return (
                                    <Link to={`/q/${match.question._id}`}>
                                        <li key={match.question._id}>
                                            <div className="search-results-match">{match.question.question}</div>
                                            <div className="search-results-answers-number my-answer">
                                                <div>{match.body}</div>
                                                <div>Upvotes: {match.upvotes.length}</div>
                                            </div>
                                            {/* <AnswerItem
                                                key={match._id}
                                                answer={match}
                                                questionId={match.question._id}
                                            /> */}
                                        </li>
                                    </Link>
                                )
                            })
                        }}
                    </Query>
                </ul>
            </div>
        )
    }
}

export default QuestionsYouAnswered;