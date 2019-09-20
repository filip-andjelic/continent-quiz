// External dependencies
import React from 'react';

export default class MessageComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div className="message-wrapper" id="message-wrapper">
            <div className="message-title" id="message-title">{this.props.title}</div>
            <div className="message-text" id="message-text">{this.props.text}</div>
        </div>);
    }
};

