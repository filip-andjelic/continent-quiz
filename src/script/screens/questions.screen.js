// External dependencies
import React from 'react';
import _ from 'lodash';
// Internal dependencies
import HeaderComponent from "../components/header.component";
import FooterComponent from "../components/footer.component";
import {Util} from "../services/utility.service";
import StoreService from "../services/store.service";
import {Constants} from "../../constants";

export default class QuestionsScreen extends React.Component {
    constructor(props) {
        super(props);
        const component = this;
        const questionNumber = this.props.store && this.props.store.data.questionNumber ? this.props.store.data.questionNumber : 1;
        const currentQuestionIndex = parseInt(questionNumber) - 1;
        const questions = this.props.store ? this.props.store.data.questions : [];
        const currentQuestionData = questions.length ? questions[currentQuestionIndex] : {};

        this.state = {
            questionNumber: questionNumber,
            questions: questions,
            answers: currentQuestionData.answers
        };

        this.props.store.hookOnStoreUpdate('questionsScreen', (newStoreData) => {
            component.setState({
                questions: newStoreData.questions
            });
        });

        if (currentQuestionData.completed && questionNumber === Constants.maxQuestionNumber) {
            this.props.router.goToScreen('/result');
        }
    }

    componentWillUnmount() {
        this.props.store.deleteHookOnStoreUpdate('questionsScreen');
    }

    selectAnswer(answer) {
        const currentQuestionIndex = parseInt(this.state.questionNumber) - 1;
        let questions = this.state.questions;
        let currentQuestionData = questions.length ? questions[currentQuestionIndex] : {};

        // If User selected answer disable clicking to change it.
        if (!!currentQuestionData.completed) {
            return;
        }

        answer.selected = true;
        currentQuestionData.completed = true;
        currentQuestionData.correct = !!answer.correct;

        this.setState({
            answers: currentQuestionData.answers,
            questions: questions
        });

        this.props.store.updateQuestionsProgress(questions);
    }

    renderAnswers() {
        const currentQuestionIndex = parseInt(this.state.questionNumber) - 1;
        const currentQuestionData = this.state.questions.length ? this.state.questions[currentQuestionIndex] : {};
        let currentQuestionAnswers = [];

        if (currentQuestionData && currentQuestionData.answers) {
            _.each(currentQuestionData.answers, (answerData) => {
                let answerClasses = 'question-answer';

                if (answerData.selected) {
                    answerClasses += ' selected';
                }
                if (!!currentQuestionData.completed && answerData.correct) {
                    answerClasses += ' correct';
                }

                currentQuestionAnswers.push(<button
                    onClick={() => {
                        this.selectAnswer(answerData)
                    }}
                    className={answerClasses}
                    key={'answer-' + answerData.label}>

                    <div className='play-image' key={'answer-image-' + answerData.label}></div>

                    <div key={'answer-label-' + answerData.label}
                         className='question-answer-label'>{answerData.label}</div>

                    <div className='answer-status' key={'answer-status-' + answerData.label}></div>
                </button>);
            });
        }

        return currentQuestionAnswers;
    }

    render() {
        const currentQuestionIndex = parseInt(this.state.questionNumber) - 1;
        const currentQuestionData = this.state.questions.length ? this.state.questions[currentQuestionIndex] : {};
        const currentQuestionAnswers = this.renderAnswers();

        return (<div id='questions-screen' className='screen'>
            <HeaderComponent
                subtitle={'Continent quiz'}
                title={'Question ' + String(this.state.questionNumber) + ' of ' + Constants.maxQuestionNumber}
            />

            {!!this.state.questions.length && !!currentQuestionData && (<div className='question-wrapper'>
                <div className='question-image'
                     style={{backgroundImage: 'url(' + currentQuestionData.image + ')'}}></div>

                <div className='question-answers'>
                    {!!currentQuestionAnswers.length && currentQuestionAnswers}
                </div>
            </div>)}

            {!!currentQuestionData && !!currentQuestionData.completed && (<FooterComponent
                actions={{
                    next: () => {
                        if (this.state.questionNumber === Constants.maxQuestionNumber) {
                            this.props.router.goToScreen('/result');

                            return;
                        }

                        this.setState({
                            questionNumber: this.state.questionNumber + 1
                        });
                    },
                    back: this.state.questionNumber <= 1 ? false : () => {
                        if (this.state.questionNumber > 1) {
                            this.setState({
                                questionNumber: this.state.questionNumber - 1
                            });
                        }
                    }
                }}
                position={'bottom'}
            />)}
        </div>);
    }
};
