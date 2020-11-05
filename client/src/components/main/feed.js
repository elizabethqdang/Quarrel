import React from 'react';
import { Query } from "react-apollo";
import Queries from "../../graphql/queries";
import FeedItem from "./feed_item";
const { FETCH_QUESTIONS } = Queries;

class Feed extends React.Component { 
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ul className="feed-container">
                <Query
                    query={FETCH_QUESTIONS}
                >
                    {({ loading, error, data }) => {
                        if (loading) return "Loading...";
                        if (error) return `Error! ${error.message}`;
                        return (
                            data.questions.map(question => {
                                return <FeedItem key={question._id} question={question} />
                            })
                        )
                    }}
                </Query>
            </ul>
        )
    }
}

export default Feed;