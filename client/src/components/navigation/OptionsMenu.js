import React from 'react';
import { withRouter } from 'react-router-dom';
import { ApolloConsumer, Query, Mutation } from "react-apollo";
import Mutations from "../../graphql/mutations";
import Queries from "../../graphql/queries";
import axios from "axios";
const { UPDATE_PROFILE_PIC } = Mutations;
const { CURRENT_USER } = Queries;
class OptionsMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null
        }
        this.handleFile = this.handleFile.bind(this);
        this.logout = this.logout.bind(this);
        this.colorOptions = this.colorOptions.bind(this);
    }
    
    handleFile(updateProfilePic) {
        return e => {
            this.setState({ file: e.target.files[0] }, () => {
                if (!this.state.file) return null;
                const fd = new FormData();
                fd.append('image', this.state.file, this.state.file.name)
                axios.post('/api/upload', fd)
                    .then(res => {
                        updateProfilePic({
                            variables: {
                                profileUrl: res.data.imageUrl
                            }
                        });
                    })
            });
        }
    }

    updateColor(updateProfilePic, color) {
        return e => {
            updateProfilePic({
                variables: {
                    profileUrl: color
                }
            })
        }
    }


    updateCache(cache, { data }) {
        let user;
        try {
            user = cache.readQuery({
                query: CURRENT_USER,
                variables: { token: localStorage.getItem("auth-token") }
            }).currentUser
        } catch(err) {
            console.log(err);
        } 
        if (user) {
            let newUser = Object.assign({}, user);
            newUser.profileUrl = data.updateProfileUrl.profileUrl;
            cache.writeQuery({
                query: CURRENT_USER,
                data: { currentUser: newUser }
            })
        }
    }

    logout(client) {
        return e => {
            e.preventDefault();
            localStorage.removeItem("auth-token");
            localStorage.removeItem("currentUserId");
            client.cache.writeData({
                data: {
                    isLoggedIn: false,
                    sessionId: null
                }
            });
            this.props.history.push("/")
        }
    }

    colorOptions(updateProfilePic) {
        const colors = [
            "red",
            "blue",
            "green",
            "orange",
            "purple",
            "pink",
            "brown",
            "black"
        ]

        return colors.map((color, i) => (
            <li style={{color: color}}
                key={i} 
                onClick={this.updateColor(updateProfilePic, color)}>
                {color}
            </li>
        ));
    }

    render() {
        return (
            <ApolloConsumer>
                {client => {
                    return <Mutation 
                        mutation={UPDATE_PROFILE_PIC}
                        onCompleted={ data => {
                            this.props.closeOptions();
                        }}
                        update={(cache, data) => this.updateCache(cache, data)}
                        >
                        {updateProfilePic => {
                            return <React.Fragment>
                                <label htmlFor="format-file">Upload Picture</label>
                                <hr></hr>
                                <input id="format-file" type="file" onChange={this.handleFile(updateProfilePic)} />
                                    {this.colorOptions(updateProfilePic)}
                                <hr></hr>
                                <li onClick={this.logout(client)}>Logout</li>
                            </React.Fragment>
                        }}
                </Mutation>
            }}
            </ApolloConsumer>
        )
    }
}

export default withRouter(OptionsMenu);