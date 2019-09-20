// External dependencies
import React from 'react';

export default class HeaderComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div id="header" className="header">

            {this.props.subtitle && <div className="header-subtitle">
                <p>{this.props.subtitle}</p>
            </div>}

            {this.props.title && <div className="header-title">
                <p>{this.props.title}</p>
            </div>}

        </div>);
    }
};

