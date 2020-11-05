const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLID } = graphql;
const mongoose = require("mongoose");
const AuthService = require("../services/auth");
const UserType = require("./types/user_type");
const User = mongoose.model("user");
const TopicType = require("./types/topic_type");
const Topic = mongoose.model("topic");
const QuestionType = require("./types/question_type");
const Question = mongoose.model("question");
const AnswerType = require("./types/answer_type");
const Answer = mongoose.model("answer");
const Upvote = mongoose.model("upvote");
const CommentType = require("./types/comment_type");
const Comment = mongoose.model("comment");
const Dislike = mongoose.model("dislike");

const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        register: {
            type: UserType,
            args: {
                fname: { type: GraphQLString },
                lname: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(_, args) {
                return AuthService.register(args);
            }
        },
        login: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(_, args) {
                return AuthService.login(args);
            }
        },
        logout: {
            type: UserType,
            args: {
                _id: { type: GraphQLID }
            },
            resolve(_, args) {
                return AuthService.logout(args);
            }
        },
        verifyUser: {
            type: UserType,
            args: {
                token: { type: GraphQLString }
            },
            resolve(_, args) {
                return AuthService.verifyUser(args);
            }
        },
        newQuestion: {
            type: QuestionType,
            args: {
                question: { type: GraphQLString },
                link: { type: GraphQLString }
            },
            async resolve(_, { question, link }, ctx) {
                const validUser = await AuthService.verifyUser({ token: ctx.token });
                if (validUser.loggedIn) {
                    console.log(validUser);
                    return new Question({ question, user: validUser._id, link, date: new Date() }).save()
                } else {
                    throw new Error("Must be logged in to create a question")
                }
            }
        },
        newAnswer: {
            type: AnswerType,
            args: {
                body: { type: GraphQLString },
                questionId: { type: GraphQLID },
            },
            async resolve(_, { body, questionId }, ctx) {
                const validUser = await AuthService.verifyUser({ token: ctx.token });
                if (validUser.loggedIn) {
                    return new Answer({ body, user: validUser._id, question: questionId, date: new Date(), upvotesTotal: 0 }).save()
                        .then(answer => {
                            Question.findByIdAndUpdate(questionId, { $push: { answers: answer._id } }).exec();
                            return answer;
                        })
                } else {
                    throw new Error("Must be logged in to create an answer");
                }
            }
        },
        updateAnswer: {
            type: AnswerType,
            args: {
                answerId: { type: GraphQLID },
                body: { type: GraphQLString }
            },
            async resolve(_, { answerId, body }, ctx) {
                const validUser = await AuthService.verifyUser({ token: ctx.token });
                if (validUser.loggedIn) {
                    return Answer.findByIdAndUpdate(
                        answerId, 
                        { body }, 
                        { new: true }, (err, answer) => {
                            return answer;
                        }
                    );
                } else {
                    throw new Error("Must be logged in to update an answer");
                }
            }
        },
        deleteAnswer: {
            type: AnswerType,
            args: {
                answerId: { type: GraphQLID }
            },
            async resolve(_, { answerId }, ctx) {
                const validUser = await AuthService.verifyUser({ token: ctx.token });
                if (validUser.loggedIn) {
                    return Answer.deleteAnswer(answerId);
                } else {
                    throw new Error("Must be logged in to delete an answer");
                }
            }
        },
        newTopic: {
            type: TopicType,
            args: {
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                imageUrl: { type: GraphQLString },
            },
            async resolve(_, { name, description, imageUrl }, ctx) {
                const validUser = await AuthService.verifyUser({ token: ctx.token });
                if (validUser.loggedIn) {
                    return new Topic({ name, description, imageUrl }).save()
                } else {
                    // throw new Error("Must be logged in to create an answer")
                    return new Topic({ name, description, imageUrl }).save()
                }
            }
        },
        addTopicToUser: {
            type: TopicType,
            args: {
                topicId: { type: GraphQLID }
            },
            async resolve(parentValue, { topicId }, ctx) {
                const validUser = await AuthService.verifyUser({ token: ctx.token });
                return Topic.addUser(topicId, validUser._id).then(
                    User.addTopic(topicId, validUser._id)
                )
            }
        },
        addTopicToQuestion: {
            type: TopicType,
            args: {
                topicId: { type: GraphQLID },
                questionId: { type: GraphQLID }
            },
            async resolve(parentValue, { topicId, questionId }, ctx) {
                return Question.addTopic(questionId, topicId).then(
                    Topic.addQuestion(questionId, topicId)
                )
            }
        },
        trackQuestion: {
            type: UserType,
            args: {
                questionId: { type: GraphQLID }
            },
            async resolve(parentValue, { questionId}, ctx) {
                const validUser = await AuthService.verifyUser({ token: ctx.token });
                if (validUser) {
                    return User.trackQuestion(questionId, validUser._id)
                } else {
                    throw new Error("Must be logged in to track");
                }
            }

            
        },
        updateProfileUrl: {
            type: UserType,
            args: {
                profileUrl: { type: GraphQLString }
            },
            async resolve(parentValue, { profileUrl }, ctx) {
                const validUser = await AuthService.verifyUser({ token: ctx.token });
                if (validUser.loggedIn) {
                    return User.findByIdAndUpdate(validUser._id, { profileUrl }, {new: true}).exec();
                } else {
                    throw new Error("Must be logged in to upload!")
                }
            }
        },
        upvoteAnswer: {
            type: AnswerType,
            args: {
                answerId: { type: GraphQLID }
            },
            async resolve(parentValue, { answerId }, ctx) {
                const validUser = await AuthService.verifyUser({ token: ctx.token });
                return new Upvote({ user: validUser._id, answer: answerId }).save()
                    .then(upvote => {
                        
                        return Answer.findByIdAndUpdate(answerId, { $inc: { upvotesTotal: 1 }, $push: { upvotes: upvote._id } }).exec();
                    })
            }
        },
        deleteUpvote: {
            type: AnswerType,
            args: {
                answerId: { type: GraphQLID }
            },
            async resolve(parentValue, { answerId }, ctx) {
                const validUser = await AuthService.verifyUser({ token: ctx.token });
                return Upvote.remove({ user: validUser._id, answer: answerId })
                    .then(upvote => {
                        return Answer.findByIdAndUpdate(answerId, { $inc: { upvotesTotal: -1 }, $pull: { upvotes: upvote._id } }).exec();
                    })
            }
        },
        newComment: {
            type: CommentType,
            args: {
                comment: { type: GraphQLString },
                answerId: { type: new GraphQLNonNull(GraphQLID) }
            },
            async resolve(_, { comment, answerId }, ctx) {
                const validUser = await AuthService.verifyUser({ token: ctx.token });
                if (validUser.loggedIn) {
                    return new Comment({ comment, user: validUser._id, answer: answerId, date: new Date() }).save()
                        .then(comment => {
                            Answer.findByIdAndUpdate(answerId, { $push: { comments: comment._id } }).exec();
                            return comment;
                        })
                } else {
									throw new Error("Must be logged in to comment")
                }
            }
				},
				deleteComment: {
					type: CommentType,
					args: {
						_id: { type: new GraphQLNonNull(GraphQLID) },
						// answerId: { type: new GraphQLNonNull(GraphQLID) }
					},
					async resolve(parentValue, { _id}, ctx)
					{
						const validUser = await AuthService.verifyUser({ token: ctx.token });
						// if (validUser.loggedIn) {
							return Comment.remove({ _id:_id, user: validUser._id })
								.then(comment =>
								{
									return Answer.findByIdAndUpdate(_id, { $pull: { comments: comment._id } }).exec();
								})
						// } else {
							// throw new Error("You can only delete your own comments.")
						// }
					}
				},	
				dislikeComment: {
					type: CommentType,
					args: {
						commentId: { type: GraphQLID }
					},
					async resolve(parentValue, { commentId }, ctx) {
						const validUser = await AuthService.verifyUser({ token: ctx.token });
						return new Dislike({ user: validUser._id, comment: commentId }).save()
							.then(dislike => {
								return Comment.findByIdAndUpdate(commentId, { $push: { dislikes: dislike._id } }).exec();
							})
					}
				},
				deleteDislike: {
					type: CommentType,
					args: {
						commentId: { type: GraphQLID }
					},
					async resolve(parentValue, { commentId }, ctx) {
						const validUser = await AuthService.verifyUser({ token: ctx.token });
						return Dislike.remove({ user: validUser._id, comment: commentId })
							.then(dislike => {
								return Comment.findByIdAndUpdate(commentId, { $pull: { dislikes: dislike._id } }).exec();
						})
					}
				}
    }
});

module.exports = mutation;