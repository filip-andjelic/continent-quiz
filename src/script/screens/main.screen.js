// External dependencies
import React from 'react';
import _ from 'lodash';
// Internal dependencies
import {Util} from "../services/utility.service";
import {ApiService} from "../services/api.service";
import HeaderComponent from "../components/header.component";
import TopResultComponent from "../components/top.result.component";
import FooterComponent from "../components/footer.component";
import {Constants} from "../../constants";

export default class MainScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            topResults: {}
        };
    }

    componentDidUpdate() {
        const Store = this.props.store ? this.props.store.getStoreData() : false;

        // Check if questions were already fetched and loaded into cache memory.
        if (!Store || !Store.questions) {
            Util.triggerCallbackOnlyOncePerPeriod('fetchQuestions', () => {
                ApiService.fetchQuestions().then((questions) => {
                    if (!questions) {
                        // @TODO Throw some kind of error message
                        return;
                    }

                    // Check for unanswered question where User left of.
                    if (Store && !_.isEmpty(Store.completedQuestions)) {
                        //Util.log('User completed these questions...', Store.completedQuestions);

                        this.props.store.updateStoreData({
                            questions: Util.generateQuestions(questions, Constants.maxQuestionNumber, Store.completedQuestions)
                        });

                        this.props.router.goToScreen('/questions');

                        return;
                    }

                    this.props.store.updateStoreData({
                        questions: Util.generateQuestions(questions, Constants.maxQuestionNumber)
                    });
                });
            }, 1000);
        }
        // Check for last top 3 results.
        if (Store && Store.topResults && !_.isEqual(Store.topResults, this.state.topResults)) {
            //Util.log('Top 3 results from Local Storage.', Store.topResults);

            this.setState({
                topResults: Store.topResults
            });
        }
    }
    componentDidMount() {
        const Store = this.props.store ? this.props.store.getStoreData() : false;

        // Check for last top 3 results.
        if (Store && Store.topResults && !_.isEqual(Store.topResults, this.state.topResults)) {
            //Util.log('Top 3 results from Local Storage.', Store.topResults);

            this.setState({
                topResults: Store.topResults
            });
        }
    }

    render() {
        return (<div id='main-screen' className='screen'>
            <HeaderComponent
                subtitle={'Continent quiz'}
                title={'Your Scores'}
            />

            <div className='flex-column-full'>
                {!!this.state.topResults && !!this.state.topResults.first && (<TopResultComponent
                    position={'1'}
                    date={this.state.topResults.first.date}
                    points={this.state.topResults.first.points}
                />)}
                {!!this.state.topResults && !!this.state.topResults.second && (<TopResultComponent
                    position={'2'}
                    date={this.state.topResults.second.date}
                    points={this.state.topResults.second.points}
                />)}
                {!!this.state.topResults && !!this.state.topResults.third && (<TopResultComponent
                    position={'3'}
                    date={this.state.topResults.third.date}
                    points={this.state.topResults.third.points}
                />)}
            </div>

            <FooterComponent
                actions={{
                    reset: () => {
                        this.props.store.clearStoreData();
                        this.props.router.refresh();
                    },
                    play: () => {
                        this.props.router.goToScreen('/questions');
                    }
                }}
                position={'bottom'}
            />
        </div>);
    }
};
