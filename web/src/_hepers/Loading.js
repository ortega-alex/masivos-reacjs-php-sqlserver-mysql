import React, { Component } from 'react';
import { PropagateLoader, DotLoader } from 'react-spinners';

export default class Loading extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { type } = this.props;
        return (
            !type ?
                <PropagateLoader
                    sizeUnit={"px"}
                    size={15}
                    color={'#F4D03F'}
                />
                : <DotLoader
                    sizeUnit={"px"}
                    size={100}
                    color={'#f57f17'}
                />
        );
    }
}