import React from 'react';
import { Query, Mutation } from 'react-apollo';
import Queries from "../../graphql/queries";
import Mutations from "../../graphql/mutations";
import { Link, withRouter } from "react-router-dom";
import AnswerForm from "../answer/AnswerForm";
import AnswerItem from "../answer/AnswerItem";
import Modal from "./EditTopicsModal"

const { FETCH_QUESTION, CURRENT_USER } = Queries;
const { TRACK_QUESTION } = Mutations;

class QuestionShow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            body: "",
            showForm: false,
            show: false,
            updated: false,
            showMoreAnswers: false
        }
        this.toggleForm = this.toggleForm.bind(this);
        this.numAnswers = this.numAnswers.bind(this);
        this.track = this.track.bind(this);
        this.renderTopicsList = this.renderTopicsList.bind(this)
        this.renderAnswers = this.renderAnswers.bind(this)
        this.toggleShowMoreAnswers = this.toggleShowMoreAnswers.bind(this)
        this.renderShowAnswersButton = this.renderShowAnswersButton.bind(this)
        this.containerClassName = this.containerClassName.bind(this)
        this.feedItemClassName = this.feedItemClassName.bind(this)
        this.renderQuestionTitle = this.renderQuestionTitle.bind(this)
    }



    toggleTopicModal = e => {
        this.setState({
            show: !this.state.show
        });
    };

    toggleForm() {
        this.setState({ showForm: !this.state.showForm })
    }

    numAnswers(question) {
        const num = question.answers.length;
        if (num === 1) {
            return "1 Answer";
        } else {
            return `${num} Answers`;
        }
    }

    track(e, trackQuestion, questionId) {
        e.preventDefault();
        trackQuestion({
            variables: {
                questionId: questionId
            }
        })

    }

    renderTopicsList(topics) {
        return topics.map(topic => {
            return <Link key={`${topic._id}`} className="topics-list-item" to={`/topic/${topic.name}/questions`}>{topic.name}</Link>
        })
    }

    //checks the author of the question and compares with current user.
    renderPencil(question, currentUserId) {
        if (question.user._id === currentUserId) {
            return <div className="edit-topics" onClick={e => {
                this.toggleTopicModal();
            }}>
                <i className="fas fa-pencil-alt"></i>
            </div >
        } else {
            return null
        }
    }

    renderQuestionTitle(question) {
        if (this.props.fromTopicQuesitons) {
            return <Link to={`/q/${question._id}`}>
                <h1>{question.question}</h1>
            </Link>
        } else {
           return <h1>{question.question}</h1>
        }
    }

    renderAnswers(answers) {
        if (this.state.showMoreAnswers || !(this.props.fromTopicQuesitons)) {
            return answers
        } else {
            return answers[0]
        }
    }

    renderShowAnswersButton(answersLength) {
        if (answersLength && this.props.fromTopicQuesitons) {
            if(this.state.showMoreAnswers) {
                return <button className="answers-toggle"onClick={this.toggleShowMoreAnswers}>Show Less Answers</button>
            } else {
                return <button className="answers-toggle" onClick={this.toggleShowMoreAnswers}>Show More Answers</button>
            }
        } else {
            return null
        }
    }


    toggleShowMoreAnswers() {
        this.setState({ showMoreAnswers: !this.state.showMoreAnswers });
    }

    containerClassName(){
        if (this.props.fromTopicQuesitons) {
            return "feed-item"
        } else {
            return ""
        }
    }

    feedItemClassName(){
        if (this.props.fromTopicQuesitons) {
            return "topics-feed-question"
        } else {
            return "qns-container"
        }
    }

    render() {
        return (
            <Query
                query={FETCH_QUESTION}
                variables={{ id: this.props.match.params.id || this.props.id }}
            >
                {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) return `Error! ${error.message}`;
                    const { question } = data;
                    const answers = question.answers.map(answer => {
                        return (
                            <AnswerItem
                                key={answer._id}
                                answer={answer}
                                questionId={question._id}
                            />
                        )
                    })
                    let currentUserId = localStorage.getItem("currentUserId")
                    return (
                        <div className={this.containerClassName()}>
                            <Modal onClose={this.toggleTopicModal} show={this.state.show}
                                checked={question.topics} question={question}/>
                            <div className="topics-list-container">
                                {this.renderTopicsList(question.topics)}
                                {this.renderPencil(question, currentUserId)}
                            </div>
                            <div className={this.feedItemClassName()}>
                                {this.renderQuestionTitle(question)}
                                <div className="qns-actions">
                                    <div className="qns-answer"
                                        onClick={this.toggleForm}
                                    >
                                        <i className="far fa-angry"></i>
                                        <span>Quarrel</span>
                                    </div>
                                    <Query
                                        query={CURRENT_USER}
                                        variables={{ token: localStorage.getItem("auth-token") }}
                                    >
                                        {({ loading, error, data }) => {
                                            if (loading) return null;
                                            if (error) return null;
                                            if (data) {
                                                const trackedQuestions = data.currentUser.trackedQuestions;
                                                this.currentUser = data.currentUser
                                                return (
                                                    <Mutation
                                                        mutation={TRACK_QUESTION}
                                                    >
                                                        {trackQuestion => {
                                                            let isTracked;
                                                            trackedQuestions.forEach(trackedQuestion => {
                                                                if (trackedQuestion._id === question._id) {
                                                                    isTracked = true;
                                                                }
                                                            })

                                                            return (
                                                                <div className="qns-follow"
                                                                    id={isTracked ? "qns-followed" : null}
                                                                    onClick={e => this.track(e, trackQuestion, question._id)}
                                                                >
                                                                    <i className="fas fa-user-secret"></i>
                                                                    <span>
                                                                        Tracked
                                                                </span>
                                                                </div>
                                                            )

                                                        }}

                                                    </Mutation>
                                                )
                                            }

                                        }}
                                    </Query>
                                </div>
                                {this.state.showForm ? <AnswerForm toggleForm={this.toggleForm} questionId={question._id} /> : null}
                                <h2>{this.numAnswers(question)}</h2>
                                { this.renderAnswers(answers)}
                                <div className="answers-toggle-container">
                            { this.renderShowAnswersButton(answers.length) }
                                </div>
                            </div>
                        </div>
                    )
                }
                }


            </Query >
        )
    }   
}

export default withRouter(QuestionShow);