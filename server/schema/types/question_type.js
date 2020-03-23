const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const Question = mongoose.model("question");
const AnswerType = require("./answer_type");
const TopicType = require("./topic_type");

const QuestionType = new GraphQLObjectType({
    name: "QuestionType",
    fields: () => ({
        _id: { type: GraphQLID },
        question: { type: GraphQLString },
        date: { type: GraphQLString },
        user: {
            type: require("./user_type"),
            resolve(parentValue) {
                return Question.findById(parentValue._id)
                    .populate("user")
                    .then(question => {
                        return question.user;
                    });
            }
        },
        link: { type: GraphQLString },
        answers: {
            type: new GraphQLList(AnswerType),
            resolve(parentValue) {
                return Question.findById(parentValue._id)
                    .populate({
                        path: 'answers',
                        options: { sort: { 'upvotesTotal': -1 } }
                    })
                    .then(question => question.answers);
            }
        },
        topics: {
            type: new GraphQLList(TopicType),
            resolve(parentValue) {
                return Question.findById(parentValue._id)
                    .populate("topics")
                    .then(question => question.topics);
            }
        }
    })
});

module.exports = QuestionType;