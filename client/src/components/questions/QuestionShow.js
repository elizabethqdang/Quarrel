import React from 'react';
import { Query, Mutation } from 'react-apollo';
import Queries from "../../graphql/queries";
import Mutations from "../../graphql/mutations";
import { withRouter } from "react-router-dom";
import AnswerForm from "../answer/AnswerForm";
import AnswerItem from "../answer/AnswerItem";
const { FETCH_QUESTION, CURRENT_USER } = Queries;
const { TRACK_QUESTION } = Mutations;

class QuestionShow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            body: "",
            showForm: false
        }
        this.toggleForm = this.toggleForm.bind(this);
        this.numAnswers = this.numAnswers.bind(this);
        this.track = this.track.bind(this);
        this.renderTopicsList = this.renderTopicsList.bind(this)
    }

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
        debugger;
        e.preventDefault();
        trackQuestion({
            variables: {
                questionId: questionId
            }
        })

    }

    renderTopicsList(topics) {
        return topics.map(topic => {
            return <div className="topics-list-item">
                {topic.name}
            </div>
        })
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

                    return (
                        <div >
                            <div className="topics-list-container">
                                {this.renderTopicsList(question.topics)}
                            </div>
                            <div className="qns-container">

                                <h1>{question.question}</h1>
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
                                {answers}
                            </div>
                        </div>
                    )
                }}


            </Query>
        )
    }
}

export default withRouter(QuestionShow);