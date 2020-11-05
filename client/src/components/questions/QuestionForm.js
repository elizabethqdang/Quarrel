import React from "react";
import { Mutation, Query } from "react-apollo";
import Queries from "../../graphql/queries";
import Mutations from "../../graphql/mutations";
import { FaLink } from "react-icons/fa";
import { Link, withRouter } from "react-router-dom";
import ProfileIcon from "../customization/ProfileIcon";
import AddQuestionDiv from "./AddQuestionDiv";
const Validator = require("validator");
const { FETCH_QUESTIONS, CURRENT_USER, SIMILAR_QUESTIONS, FETCH_TOPICS } = Queries;
const { NEW_QUESTION, ADD_TOPIC_TO_QUESTION } = Mutations;


class QuestionForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: "",
            message: "",
            showModal: false,
            success: "",
            link: "",
            successfulQuestion: "",
            successfulQId: "",
            redirectId: "",
            showTopicModal: false,
            topics: [],
            checked: {
            },
            dataMatches: []
        };
        this.handleModal = this.handleModal.bind(this);
        this.closeMessage = this.closeMessage.bind(this);
        this.redirect = this.redirect.bind(this);
        this.handleTopicSubmit = this.handleTopicSubmit.bind(this);
        this.updateTopic = this.updateTopic.bind(this);
        this.setDefaultCheck = this.setDefaultCheck.bind(this);
        this.handleTopicModal = this.handleTopicModal.bind(this);
    }


    componentDidUpdate(prevProps, prevState) {
        if (prevState.redirectId !== this.state.redirectId) {
            this.props.history.push(`/q/${this.state.redirectId}`);
        }
    }

    redirect(id) {
        return e => {
            this.setState({
                showModal: false,
                redirectId: id
            });
        }
    }

    handleModal(e) {
        e.preventDefault();
        this.props.closeSearchModal(e);
        this.setState({
            showModal: !this.state.showModal,
            message: "",
            success: "",
            question: "",
            link: "",
            successfulQuestion: "",
            successfulQId: "",
            dataMatches: []
        });
    }

    closeMessage(e) {
        this.setState({ message: "" })
    }

    update(field) {
        return e => this.setState({ [field]: e.currentTarget.value })
    }

    updateCache(cache, { data }) {
        let questions;
        try {
            questions = cache.readQuery({ query: FETCH_QUESTIONS });
        } catch (err) {
            return;
        }
        if (questions) {
            let questionArray = questions.questions;
            let newQuestion = data.newQuestion;
            questionArray.unshift(newQuestion);
            cache.writeQuery({
                query: FETCH_QUESTIONS,
                data: { questions: questionArray }
            });
        }
    }

    handleSubmit(e, newQuestion) {
        e.preventDefault();
        let question = this.state.question;
        const link = this.state.link;
        let splitQuestion = question.split(" ");
        if (splitQuestion.length < 3 || splitQuestion.includes("")) {
            this.setState({
                message: "This question needs more detail. " +
                    "Add more information to ask a clear question, " +
                    "written as a complete sentence."
            });
            setTimeout(this.closeMessage, 5001)
        } else if (link.length === 0 || Validator.isURL(link)) {
            if (question[question.length-1] !== "?") question = question + '?';
            newQuestion({
                variables: {
                    question: question,
                    link: link
                }
            });
            setTimeout(this.closeMessage, 5001)
        } else {
            this.setState({ message: "The source should be a valid link." })
            setTimeout(this.closeMessage, 5001)
        }
    }

    handleTopicSubmit(e, addTopicToQuestion) {
        e.preventDefault()
        let topics = this.state.topics;
        topics.forEach(topicId => {
            addTopicToQuestion({ variables: { topicId: topicId, questionId: this.state.successfulQId } })
        });
        setTimeout(this.closeMessage, 5001);
    }

    handleTopicModal(e) {
        e.preventDefault();
        this.setState({ showTopicModal: !this.state.showTopicModal, topics: [], checked: {} });
    }

    updateTopic(e) {
        let topicId = e.currentTarget.value;
        let dup = [...this.state.topics]
        dup.push(topicId)

        let trueState = Object.assign({}, this.state.checked, { [topicId]: true })
        let falseState = Object.assign({}, this.state.checked, { [topicId]: false })
        if (this.state.topics.includes(topicId)) {
            this.setState({ topics: this.state.topics.filter(topic => topic !== topicId), checked: falseState })
        } else {
            this.setState({ topics: dup, checked: trueState })
        }
    }

    setDefaultCheck(topic) {
        return this.state.topics.includes(topic._id)
    }

    capitalize(word) {
        return word[0].toUpperCase() + word.slice(1);
    }

    render() {
        const topicModal = (
            <div className="modal-background" onClick={this.handleTopicModal}>
                <div className="modal-child" onClick={e => e.stopPropagation()}>
                    <div className="add-question-modal">
                        <Mutation
                            mutation={ADD_TOPIC_TO_QUESTION}
                            onError={err => this.setState({ message: err.message })}
                            onCompleted={data => {
                                this.setState({ 
                                    showTopicModal: false, 
                                    message: "You successfully set topics for ",
                                    topics: [],
                                    checked: {} 
                                });
                            }}
                        >
                            {(addTopicToQuestion) => (
                                <div className="topics-modal">
                                    <div className="topics-modal-header">
                                        {this.state.successfulQuestion}
                                    </div>
                                    <div className="topics-modal-instructions">
                                        Add topics that best describe your question
                                    </div>
                                    <form onSubmit={e => this.handleTopicSubmit(e, addTopicToQuestion)}>
                                        <div className="topics-modal-body">
                                            <Query query={FETCH_TOPICS} >
                                                {({ loading, error, data }) => {
                                                    if (loading) return "loading...";
                                                    if (error) return `Error! ${error.message}`;
                                                    return data.topics.map(topic => {
                                                        return (
                                                            <div className="topics-modal-topic-container">
                                                                <input type="checkbox"
                                                                    name={topic.name}
                                                                    value={topic._id}
                                                                    onChange={this.updateTopic}
                                                                    checked={this.state.checked[topic._id]}
                                                                />
                                                                <img className="topic-modal-icon" src={topic.imageUrl} />
                                                                <label for={topic.name}>{topic.name}</label>
                                                            </div>
                                                        )
                                                    })
                                                }}
                                            </Query>
                                        </div>
                                        <div className="add-question-modal-footer">
                                            <button className="cancel-button" onClick={this.handleTopicModal}>Cancel</button>
                                            <button className="add-button" type="submit">Add Topics</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </Mutation>
                    </div>
                </div>
            </div>
        )
        let matchesList = "";
        let questionLength = this.state.question.length;
        if (questionLength > 1) {
            matchesList = (
                <Query query={SIMILAR_QUESTIONS} variables={{ question: this.state.question }}>
                    {({ loading, error, data }) => {
                        if (loading) {
                            return this.state.dataMatches.map(match => {
                                return (
                                    <li className="matches-item" onClick={this.redirect(match._id)}>
                                        <div>{`${match.question}`}</div>
                                        <div className="question-form-answers-number">
                                            {`${match.answers.length} ${match.answers.length === 1 ? "answer" : "answers"}`}
                                        </div>
                                    </li>
                                )
                            })
                        }
                        if (error) return `Error! ${error.message}`;
                        if (data.similarQuestions.length) {
                            this.state.dataMatches = data.similarQuestions;
                        }
                        return this.state.dataMatches.map(match => {
                            return (
                                <li className="matches-item" onClick={this.redirect(match._id)} key={match._id}>
                                    <div>{`${match.question}`}</div>
                                    <div className="question-form-answers-number">
                                        {`${match.answers.length} ${match.answers.length === 1 ? "answer" : "answers"}`}
                                    </div>
                                </li>
                            )
                        })
                    }}
                </Query>
            )
        }
        const button = (
            <div className="modal-background" onClick={this.handleModal}>
                <div className="modal-child" onClick={e => e.stopPropagation()}>
                    <Mutation
                        mutation={NEW_QUESTION}
                        onError={err => this.setState({ message: err.message })}
                        update={(cache, data) => this.updateCache(cache, data)}
                        onCompleted={data => {

                            const { question } = data.newQuestion;
                            this.setState({
                                message: `You asked: `,
                                success: 'success',
                                showModal: false,
                                question: "",
                                link: "",
                                successfulQuestion: `${question}`,
                                successfulQId: data.newQuestion._id,
                                showTopicModal: true,
                                dataMatches: []
                            });
                        }}
                    >
                        {(newQuestion, { data }) => (
                            <div className="add-question-modal">
                                <div className="modal-header">
                                    <div className="add-question-modal-header">
                                        <div className="tab selected">Add Question</div>
                                        {/* <div className="tab">Share Link</div> */}
                                    </div>
                                    <div className="add-question-modal-x">
                                        <span onClick={this.handleModal}>X</span>
                                    </div>
                                </div>
                                <form onSubmit={e => this.handleSubmit(e, newQuestion)}>
                                    <div className="add-question-modal-content">
                                        <Query
                                            query={CURRENT_USER} variables={{ token: localStorage.getItem("auth-token") }}>
                                            {({ loading, error, data }) => {
                                                if (loading) return "Loading...";
                                                if (error) return `Error! ${error.message}`
                                                return (
                                                    <div className="add-question-modal-user">

                                                        <ProfileIcon 
                                                            size={30}
                                                            profileUrl={data.currentUser.profileUrl}
                                                            fsize={15}
                                                            fname={data.currentUser.fname}
                                                        />
                                                        <div className="question-modal-user-name">
                                                            {`${this.capitalize(data.currentUser.fname)} ${this.capitalize(data.currentUser.lname)} asked`}
                                                        </div>
                                                    </div>
                                                )
                                            }}
                                        </Query>
                                        <div className="add-question-modal-question">
                                            <textarea
                                                onChange={this.update("question")}
                                                value={this.state.question}
                                                placeholder='Start your question with "What", "How", "Why", etc.'
                                            />
                                            <ul className="matches-list">
                                                {matchesList}
                                            </ul>
                                        </div>
                                        <div className="add-question-modal-link">
                                            <span><FaLink /></span>
                                            <input
                                                onChange={this.update("link")}
                                                value={this.state.link}
                                                placeholder="Optional: include a link that gives context"
                                            />
                                        </div>
                                    </div>
                                    <div className="add-question-modal-footer">
                                        <button className="cancel-button" onClick={this.handleModal}>Cancel</button>
                                        <button className="add-button" type="submit">Add Question</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </Mutation>
                </div>
            </div>
        )
        return (
            <div>
                {
                    this.state.message.length > 0 &&
                    <div className={`modal-message hide-me ${this.state.success}`}>
                        <div className="hidden">x</div>
                        <p>{this.state.message}<Link to={`/q/${this.state.successfulQId}`}>{this.state.successfulQuestion}</Link></p>
                        <div className="close-message" onClick={this.closeMessage}>x</div>
                    </div>
                }
                {/* <div className="add-question-item" onClick={this.handleModal}>
                    <p className="add-question-item-user">Username</p>
                    <p className="add-question-item-prompt">What is your question or link?</p>
                </div> */}
                {
                    // if the props specify a button, the button gets rendered
                    this.props.button &&
                    <button className="nav-ask-btn" onClick={this.handleModal}>Add Question</button>
                }
                {
                    // otherwise if a div is specified, the div gets rendered
                    this.props.div &&
                    <AddQuestionDiv handleModal={this.handleModal}/>
                }
                {this.state.showModal && button}
                {
                    this.state.showTopicModal && topicModal
                }
            </div>
        )
    }
}
export default withRouter(QuestionForm);