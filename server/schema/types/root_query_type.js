const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull } = graphql;

const UserType = require("./user_type");
const QuestionType = require("./question_type");
const AnswerType = require("./answer_type");

const User = mongoose.model("user");
const Question = mongoose.model("question");
const Answer = mongoose.model("answer");

const RootQueryType = new GraphQLObjectType({
    name: "RootQueryType",
    fields: () => ({
        users: {
            type: new GraphQLList(UserType),
            resolve(_, args) {
                return User.find({});
            }
        },
        user: {
            type: UserType,
            args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(_, args) {
                return User.findById(args._id);
            }
        },
        questions: {
            type: new GraphQLList(QuestionType),
            resolve() {
                return Question.find({});
            }
        },
        question: {
            type: QuestionType,
            args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(_, args) {
                return Question.findById(args._id);
            }
        },
        answers: {
            type: new GraphQLList(AnswerType),
            resolve() {
                return Answer.find({});
            }
        },
        answer: {
            type: AnswerType,
            args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(_, args) {
                return Answer.findById(args._id);
            }
        }
    })
});

module.exports = RootQueryType;