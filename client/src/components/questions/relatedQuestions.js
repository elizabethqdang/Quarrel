import React from "react";
import { Query } from "react-apollo";
import Queries from "../../graphql/queries";
import { Link } from "react-router-dom";
const { RELATED_QUESTIONS } = Queries;

class RelatedQuestions extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div className="related-questions">
                <div className="related-questions-header">Related Questions</div>
                <ul className="related-questions-list">
                    <Query query={RELATED_QUESTIONS} variables={{ questionId: this.props.match.params.id }}>
                        {({loading, error, data}) => {
                            if (loading) return "loading...";
                            if (error) return `Error! ${error.message}`;
                            return data.relatedQuestions.map(match => {
                                if (this.props.match.params.id !== match._id) {
                                    return <Link to={`/q/${match._id}/`}><li>{match.question}</li></Link>
                                }
                            })
                        }}
                    </Query>
                </ul>
            </div>
        )
    }
}

export default RelatedQuestions;