import React from "react";
import TopicHeader from "./TopicHeader"
import QuestionShow from "../questions/QuestionShow"
import { Query } from "react-apollo";
import Queries from "../../graphql/queries";
const { FETCH_TOPIC_BY_NAME } = Queries;

class TopicShow extends React.Component {

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
            return <div>
              <TopicHeader key={data.topic_by_name._id} topic={data.topic_by_name} name={data.topic_by_name.name} />

            </div>
          }}
        </Query>
      </div >

    );
  }
}

export default TopicShow;