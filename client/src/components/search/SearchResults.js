import React from "react";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";
import Queries from "../../graphql/queries";
const { SIMILAR_QUESTIONS, SEARCH_TOPICS } = Queries;

class SearchResults extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        const query = this.props.match.params.query.split("-").join(" ")
        return (
            <div className="search-results">
                <ul className="search-results-list">
                    <div className="results-for">Results for <strong>{query}</strong> </div>
                    <Query query={SIMILAR_QUESTIONS} variables={{ question: query }}>
                        {({ loading, error, data }) => {
                            if (loading) return "loading...";
                            if (error) return `Error! ${error.message}`;
                            if (data.similarQuestions.length === 0) return <li key={0} id="no-results"><strong>0</strong> questions found</li>;
                            return data.similarQuestions.map(match => {
                                return (
                                    <Link to={`/q/${match._id}`}>
                                        <li key={match._id}>
                                            <div className="search-results-match">{match.question}</div>
                                            <div className="search-results-answers-number">
                                                {`${match.answers.length} ${match.answers.length === 1 ? "answer" : "answers"}`}
                                            </div>
                                        </li>
                                    </Link>
                                )
                            })
                        }}
                    </Query>
                    
                    <Query query={SEARCH_TOPICS} variables={{ query: query }}>
                        {({loading, error, data}) => {
                            if (loading) return "loading...";
                            if (error) return `Error! ${error.message}`;
                            return data.searchTopics.map(match => {
                                return (
                                    <Link to={`/topic/${match.name}`}>
                                        <li key={match._id}>
                                            <div className="search-results-match">
                                                <div>
                                                    <img className="search-results-topic-image" src={match.imageUrl} />
                                                </div>
                                                <div className="search-results-topic-name">
                                                    <span>Topic: </span>{match.name}
                                                </div>
                                            </div>
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

export default SearchResults;