import React from "react";
import { Route, Switch } from "react-router-dom";
// import AuthRoute from "../util/route_util";
import NavBar from "./navigation/NavBar";
import Feed from "./main/feed";
// import Login from "./session/Login";
// import Register from "./session/Register";
// import QuestionForm from "./questions/QuestionForm";
import TopicsShow from "./topics/TopicsShow"
import TopicShow from "./topics/TopicShow"
import TopicQuestions from "./topics/TopicQuestions"
import SideBar from "./navigation/SideBar"
import RightSideBar from "./navigation/RightSideBar";
import QuestionShow from "./questions/QuestionShow";
import SearchResults from "./search/SearchResults";
import QuestionsForYou from "./answers_tab/questionsForYou";
import QuestionsYouAnswered from "./answers_tab/questionsYouAnswered";
import MainFeedContainer from "./main/main_feed_container";

const Main = () => {
    return (
        <div className="main">
            <NavBar />
            {/* <SessionForm /> */}
            <div className="main-body">
                <Route exact path="/" component={SideBar} />
                <Switch>
                    <Route exact path="/" component={MainFeedContainer} />
                    <Route exact path="/topics" component={TopicsShow} />
                    <Route exact path="/topic/:name" component={TopicShow} />
                    <Route exact path="/topic/:name/questions" component={TopicQuestions} />
                    <Route exact path="/search/:query" component={SearchResults} />
                    <Route exact path="/answer" component={QuestionsForYou} />
                    <Route exact path="/answered" component={QuestionsYouAnswered} />
                </Switch>
                <Route exact path="/" component={RightSideBar} />
            </div>
        </div>
    )
};

export default Main;