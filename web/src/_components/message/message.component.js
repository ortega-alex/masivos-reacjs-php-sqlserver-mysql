import React, { Component } from "react";
import { connect } from "react-redux";

class Message extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>Message</div>
        );
    }
}

function mapsStateToProps(state) {
    return {};
}

export default connect(mapsStateToProps)(Message);