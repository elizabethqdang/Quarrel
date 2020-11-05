import React from 'react';
import Feed from './feed';
import QuestionForm from '../questions/QuestionForm';

class MainFeedContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showModal: false };
        this.closeModal = this.closeModal.bind(this);
    }

    closeModal(e) {
        e.preventDefault();
        this.setState({ showModal: false});
    }

    render() {
        return (
            <div>
                <QuestionForm div={true} closeSearchModal={this.closeModal}/>
                <Feed />
            </div>
            
        )
    }
}

export default MainFeedContainer;