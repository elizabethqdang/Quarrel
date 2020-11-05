import React from 'react';
import { withRouter } from 'react-router-dom';
import Queries from "../../graphql/queries";
import { Query } from "react-apollo";
import { Link, Redirect } from "react-router-dom";
const { SIMILAR_QUESTIONS } = Queries;

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: ""
        };
        this.update = this.update.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    update (e) {
        this.setState({ search: e.currentTarget.value });
    }

    handleSubmit (e) {
        e.preventDefault();
        if (this.state.search.length > 0) {
            this.props.closeModal(e);
            this.props.history.push(`/search/${this.state.search.split(" ").join("-")}`);
        }
    }

    render() {
        let searchList = "";
        const searchLength = this.state.search.length;
        if (searchLength > 1) {
            searchList = (
                <Query query={SIMILAR_QUESTIONS} variables={{ question: this.state.search }}>
                    {({loading, error, data}) => {
                        if (loading) return "loading...";
                        if (error) return `Error! ${error.message}`;
                        return data.similarQuestions.map(match => {
                            return <Link to={`q/${match._id}`}><li>{match.question}</li></Link>
                        })
                    }}
                </Query>
            )
        }
        return (
            <div className="search-wrapper">
                <div className={`search-container ${this.props.searchFocus}`} onClick={this.props.openModal}>
                    <i className="fas fa-search"></i>
                    <form onSubmit={this.handleSubmit}>
                        <input
                            className="search"
                            type="text"
                            placeholder="Search Quarrel"
                            value={this.state.search}
                            onChange={this.update}
                        />
                    </form>
                </div>
                {
                    this.props.showModal && <ul className="search-list">{searchList}</ul>
                }
            </div>
        )
    }
}

export default withRouter(SearchBar);