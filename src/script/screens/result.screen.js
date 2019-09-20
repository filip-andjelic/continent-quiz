// External dependencies
import React from 'react';
import _ from 'lodash';
// Internal dependencies
import HeaderComponent from "../components/header.component";
import {Constants} from "../../constants";
import FooterComponent from "../components/footer.component";

export default class ResultScreen extends React.Component {
    constructor(props) {
        super(props);

        const completedAllQuestions = !!this.props.store && !_.isEmpty(this.props.store.data.questions) ?
            _.filter(this.props.store.data.questions, (question) => {
                return question.completed;
            }).length === Constants.maxQuestionNumber : false;

        if (!completedAllQuestions) {
            this.props.router.goToScreen('/questions');
        }
    }

    parsePointsValue(value) {
        value = String(value);
        const thousandSeparator = Constants.thousandSeparator;
        let iterator = 3;
        let nominalChars = value.split('').reverse();

        if (!thousandSeparator || nominalChars.length < 4) {
            return value;
        }

        do {
            nominalChars.splice(iterator, 0, thousandSeparator);
            iterator += 3;
        } while (iterator < nominalChars.length);

        return nominalChars.reverse().join('');
    }

    render() {
        const correctAnswers = !!this.props.store && !_.isEmpty(this.props.store.data.questions) ?
            _.filter(this.props.store.data.questions, (question) => {
                return question.correct;
            }) : [];
        const resultPoints = correctAnswers.length * Constants.correctAnswerPoint;

        return (<div id='questions-screen' className='screen'>
            <HeaderComponent
                subtitle={'Vacation quiz'}
                title={'Results'}
            />

            <div className='result-image play-image'></div>

            <div className='result-title'>Your Score</div>

            <div className='result-points'>{this.parsePointsValue(resultPoints)} pts</div>

            <FooterComponent
                actions={{
                    finish: () => {
                        this.props.store.clearStoreData(true);
                        this.props.router.goToScreen('/');
                    }
                }}
            />
        </div>);
    }
}

