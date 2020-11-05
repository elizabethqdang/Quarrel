import React from "react";
import TopicHeader from "./TopicHeader"
import QuestionShow from "../questions/QuestionShow"
import { Query } from "react-apollo";
import Queries from "../../graphql/queries";
import Upvote from "../upvote/Upvote";
const { FETCH_TOPIC_BY_NAME } = Queries;

class TopicQuestions extends React.Component {

  render() {
    return (
      < div >
        <Query
          query={FETCH_TOPIC_BY_NAME}
          variables={{ name: this.props.match.params.name }}
        >
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;
            debugger
            return <div>
              <TopicHeader key={data.topic_by_name._id} topic={data.topic_by_name} name={data.topic_by_name.name} />
              <div>
                {data.topic_by_name.questions.map(question => {

                  return <QuestionShow key={question._id} id={question._id} question={question} name={question.name} />
                }
                )}
              </div>
            </div>
          }}
        </Query>
      </div >

    );
  }
}

export default TopicQuestions;