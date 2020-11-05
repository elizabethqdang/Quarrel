import gql from "graphql-tag";

export default {
    REGISTER_USER: gql`
        mutation RegisterUser($fname: String!, $lname: String! $email: String!, $password: String!) {
            register(fname: $fname, lname: $lname, email: $email, password: $password) {
                email
                token
                loggedIn
                errors
                fname
                lname
                _id
            }
        }
    `,
    LOGIN_USER: gql`
        mutation LoginUser($email: String!, $password: String!) {
            login(email: $email, password: $password) {
                email
                token
                loggedIn
                errors
                _id
            }
        }
    `,
    VERIFY_USER: gql`
        mutation VerifyUser($token: String!) {
            verifyUser(token: $token) {
                loggedIn
                _id
                email
            }
        }
    `,
    NEW_QUESTION: gql`
        mutation NewQuestion($question: String, $link: String) {
            newQuestion(question: $question, link: $link) {
                _id
                date
                question
                link
                user {
                    _id
                }
                topics {
                    _id
                }
                answers {
                    _id
                    date
                    body
                    upvotesTotal
                    user {
                        profileUrl
                        fname
                        lname
                    }
                }
            }
        }
    `,
    TRACK_QUESTION: gql`
        mutation TrackQuestion($questionId: ID!) {
            trackQuestion(questionId: $questionId) {
                _id
                fname
                lname
                email
                profileUrl
                trackedQuestions {
                    _id
                }
            }
        }
    `,
    ADD_TOPIC_TO_QUESTION: gql`
        mutation AddTopicToQuestion($topicId: ID!, $questionId: ID!) {
            addTopicToQuestion(topicId: $topicId, questionId: $questionId) {
                _id
                name
                questions {
                    _id
                }
            }
        }
    `,
    NEW_ANSWER: gql`
        mutation NewAnswer($body: String!, $questionId: ID!) {
            newAnswer(body: $body, questionId: $questionId) {
                _id
                body
                date
                user {
                    _id
                    fname
                    lname
                    profileUrl
                }
                question {
                    _id
                }
                upvotesTotal
                upvotes {
                    user {
                        _id
                    }
                }
                comments {
                    _id
                }
            }
        }
    `,
    UPDATE_ANSWER: gql`
        mutation UpdateAnswer($answerId: ID!, $body: String!) {
            updateAnswer(answerId: $answerId, body: $body) {
                _id
                body
                date
                user {
                    _id
                    fname
                    lname
                    profileUrl
                }
                question {
                    _id
                }
                upvotesTotal
                upvotes {
                    user {
                        _id
                    }
                }
                comments {
                    _id
                }
            }
        }

    `,
    DELETE_ANSWER: gql`
        mutation DeleteAnswer($answerId: ID!) {
            deleteAnswer(answerId: $answerId) {
                _id
            }
        }
    `,
    FOLLOW_TOPIC: gql`
        mutation FollowTopic($topicId: ID!) {
            addTopicToUser(topicId: $topicId) {
                _id
                name
                followers {
                    _id
                }
            }
        }
    `,
    UPDATE_PROFILE_PIC: gql`
        mutation UpdateProfilePic($profileUrl: String!) {
            updateProfileUrl(profileUrl: $profileUrl) {
                _id
                fname
                profileUrl
            }
        }
    `,
    UPVOTE_ANSWER: gql`
        mutation UpvoteAnswer($answerId: ID) {
            upvoteAnswer(answerId: $answerId) {
                _id
                body
                user {
                    _id
                    fname
                    lname
                    profileUrl
                }
                upvotesTotal
                upvotes {
                    user {
                        _id
                    }
                }
            }
        }
    `,
    DELETE_UPVOTE: gql`
        mutation DeleteUpvote($answerId: ID) {
            deleteUpvote(answerId: $answerId) {
                _id
                body
                user {
                    _id
                    fname
                    lname
                    profileUrl
                }
                upvotesTotal
                upvotes {
                    user {
                        _id
                    }
                }
            }
        }
    `,
    NEW_COMMENT: gql`
        mutation NewComment($comment: String, $answerId: ID!) {
            newComment(comment: $comment, answerId: $answerId) {
                _id
								comment
								date
                user {
										_id
										fname
										lname
										profileUrl
                }
                dislikes {
                    _id
                }
                answer {
                    _id
								}
								dislikes {
									user {
										_id
									}
								}
            }
        }
		`,
		DELETE_COMMENT: gql`
				mutation DeleteComment($id: ID!) {
						deleteComment(_id: $id) {
								_id
						}
				}
		`,
		DISLIKE_COMMENT: gql`
				mutation DislikeComment($commentId: ID) {
						dislikeComment(commentId: $commentId) {
								_id
								comment
								user {
										_id
										fname
										lname
										profileUrl
								}
								dislikes {
										user {
											_id
										}
								}
						}
				}	
		`,
		DELETE_DISLIKE: gql`
				mutation DeleteDislike($commentId: ID) {
					deleteDislike(commentId: $commentId) {
						_id
						comment
						user {
							_id
							fname
							lname
							profileUrl
						}
						dislikes {
							user {
								_id
							}
						}
					}
				}
		`
}