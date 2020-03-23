const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLBoolean, GraphQLList } = graphql;
const User = mongoose.model("user");

const UserType = new GraphQLObjectType({
    name: "UserType",
    fields: () => ({
        _id: { type: GraphQLID },
        fname: { type: GraphQLString },
        lname: { type: GraphQLString },
        email: { type: GraphQLString },
        profileUrl: { type: GraphQLString },
        token: { type: GraphQLString },
        loggedIn: { type: GraphQLBoolean },
        errors: { type: new GraphQLList(GraphQLString) },
        topics: {
            type: new GraphQLList(require("./topic_type")),
            resolve(parentValue) {
                return User.findById(parentValue._id)
                    .populate("topics")
                    .then(user => user.topics);
            }
        },
        trackedQuestions: {
            type: new GraphQLList(require("./question_type")),
            resolve(parentValue) {
                return User.findById(parentValue._id)
                    .populate("trackedQuestions")
                    .then(user => user.trackedQuestions);
            }
        }
    })

});

module.exports = UserType;