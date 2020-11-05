import React from "react";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";
import Queries from "../../graphql/queries";
const { UNANSWERED_QUESTIONS } = Queries;

class QuestionsForYou extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="search-results">
                <div className="answers-tab-header">
                    <div className="answer-tab selected left-tab">
                        <Link to="/answer">Questions for you</Link>
                    </div>
                    <div className="answer-tab unselected right-tab">
                        <Link to="/answered">Questions you answered</Link>
                    </div>
                </div>
                <ul className="search-results-list">
                    <Query query={UNANSWERED_QUESTIONS} >
                        {({ loading, error, data }) => {
                            if (loading) return "loading...";
                            if (error) return `Error! ${error.message}`;
                            if (data.unansweredQuestions.length === 0) return <li key={0} id="no-results">We don't have any questions for you at the moment. Check later for questions for you to answer.</li>;
                            return data.unansweredQuestions.map(match => {
                                return (
                                    <Link to={`/q/${match._id}`}>
                                        <li key={match._id}>
                                            <div className="search-results-match">{match.question}</div>
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

export default QuestionsForYou;