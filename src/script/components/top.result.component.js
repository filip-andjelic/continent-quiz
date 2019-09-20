// External dependencies
import React from 'react';

export default class TopResultComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const defaultClasses = 'top-result';

        return (<div className={!this.props.points ? defaultClasses + ' disabled' : defaultClasses}>
            <div className='position'>
                <p>#{this.props.position}</p>
            </div>
            <div className='points-wrapper'>
                <p className='date'>on {this.props.date ? this.props.date : new Date().toLocaleDateString()}</p>
                <p className='points'>{this.props.points ? this.props.points : 'N/A' }</p>
            </div>
        </div>);
    }
};

