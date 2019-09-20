// External dependencies
import React from 'react';

export default class SpinnerComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div id="ft-spinner" className="spinner-wrapper flex-column-full">
            <div className="main-spinner"></div>
            <div className="shadow-caster circle"></div>
        </div>);
    }
};