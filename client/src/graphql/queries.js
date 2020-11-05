import gql from "graphql-tag";

export default {
  IS_LOGGED_IN: gql`
      query isUserLoggedIn {
          isLoggedIn @client
      }
    `,
  FETCH_QUESTIONS: gql`
      {
        questions {
          _id
          question
          date
          link
          user {
            _id
            email
          }
          topics {
            _id
          }
          answers {
            date
            body
            upvotesTotal
            upvotes {
              _id
            }
            user {
              fname
              lname
              profileUrl
            }
          }
        }
      }
    `,
  FETCH_QUESTIONS_BY_TOPIC: gql`
      query FetchQuestionsByTopic($name: String!) {
        questions_by_topic(name: $name) {
          name
          questions
        }
      }
    `,
  // FETCH_ANSWERS_BY_TOPIC: gql`
  //       query FetchTopic($name: String!) {
  //       topic_by_name(name: $name) {    
  // {
  //       questions {
  //         _id
  //         question
  //         date
  //         user {
  //           email
  //         }
  //       }
  //     }
  //   `,
  FETCH_QUESTION: gql`
      query FetchQuestion($id: ID!) {
        question(_id: $id) {
          _id
          question
          date
          topics {
            name
          }
          answers {
            _id
            body
            date
            upvotesTotal
            user {
              _id
              fname
              lname
              profileUrl
            }
            upvotes {
              user {
                _id
              }
            }
            comments {
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
								user {
									_id
								}
							}
            }
          }
        }
      }
    `,
  CURRENT_USER: gql`
      query CurrentUser($token: String) {
        currentUser(token: $token) {
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
  //removed name from topics
  SIMILAR_QUESTIONS: gql`
      query SimilarQuestions($question: String) {
        similarQuestions(question: $question) {
          _id 
          question
          answers {
            _id
          }
        }
      }
    `,
  FETCH_TOPICS: gql`
     query FetchTopics {
        topics{
          _id
          name
          imageUrl
          followers {
            _id
          }
        }
      }
    `,
  FETCH_TOPIC_BY_NAME: gql`
      query FetchTopic($name: String!) {
        topic_by_name(name: $name) {
          _id
          name
          imageUrl
          followers {
            _id
          }
          questions {
            _id
            question
            answers {
             _id
            }
          }
        }
      }
    `,
  //A query to fetch topic by ID instead of name
  FETCH_TOPIC: gql`
      query FetchTopic($id: ID!) {
        topic(_id: $ID) {
          _id
          name
          imageUrl
          followers {
            _id
          }
        }
      }
    `,
  RELATED_QUESTIONS: gql`
      query RelatedQuestions($questionId: ID!) {
        relatedQuestions(questionId: $questionId) {
          _id
          question
          answers {
            _id
          }
        } 
      }
    `,
  SEARCH_TOPICS: gql`
      query SearchTopics($query: String) {
        searchTopics(query: $query) {
          _id
          name
          imageUrl
        }
      }
    `,
  UNANSWERED_QUESTIONS: gql`
      query UnansweredQuestions {
        unansweredQuestions {
          _id
          question
        }
      }
    `,
  // ANSWERS_BY_USER: gql`
  //   query AnswersByUser($userId: ID) {
  //     answersByUser(userId: $userId) {
  //       _id
  //       body
  //       question {
  //         _id
  //         question
  //       }
  //       user {
  //         _id
  //       }
  //       upvotes {
  //         _id
  //       }
  //     }
  //   }
  // `
  ANSWERS_BY_USER: gql`
        query AnswersByUser($userId: ID) {
          answersByUser(userId: $userId) {
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
                question
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
      `
};