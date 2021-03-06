const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;
const Topic = mongoose.model("topic")

const TopicType = new GraphQLObjectType({
  name: "TopicType",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    imageUrl: { type: GraphQLString },
    followers: {
      type: new GraphQLList(require("./user_type")),
      resolve(parentValue) {

        return Topic.findData(parentValue.id, 'followers');
      }
    },
    questions: {
      type: new GraphQLList(require("./question_type")),
      resolve(parentValue) {

        return Topic.findData(parentValue.id, 'questions');
      }
    },
    answers: {
      type: new GraphQLList(require("./answer_type")),
      resolve(parentValue) {

        return Topic.findData(parentValue.id, 'answers');
      }
    }
  })
});

module.exports = TopicType;