// External dependencies
import _ from 'lodash';
// Internal dependencies
import {Util} from './utility.service';
import {Constants} from "../../constants";

const localStorageKey = Constants.localStorageKey;
const localStorageAPI = {
    update: (data) => {
        if (localStorage) {
            const localStorageData = data ? _.cloneDeep(data) : {};

            // Don't allow User to see correct answers in LocalStorage data.
            delete localStorageData.questions;

            localStorage.setItem(localStorageKey, JSON.stringify(localStorageData));

            return true;
        }

        return false;
    },
    get: () => {
        const data = localStorage.getItem(localStorageKey);

        return JSON.parse(data);
    }
};

export default class StoreService {
    constructor() {
        // Update data from local storage if existing.
        const storage = localStorageAPI.get();

        if (storage) {
            storage.questions = false;

            this.data = storage;
        } else {
            this.data = this.getEmptyData();

            localStorageAPI.update(this.data);
        }

        this.hooks = {};
    };

    getEmptyData() {
        return {
            topResults: {
                first: {},
                second: {},
                third: {}
            },
            completedQuestions: false,
            questions: false,
            questionNumber: false
        };
    }

    getStoreData() {
        return _.cloneDeep(this.data);
    };

    updateStoreData(data) {
        Util.forObjectKeys(data, (value, key) => {
            if (Object.keys(this.data).indexOf(key) >= 0) {
                this.data[key] = value;
            }
        });

        localStorageAPI.update(this.data);

        _.each(this.hooks, (hookCallback) => {
            hookCallback(this.data);
        });
    };

    updateQuestionsProgress(questions) {
        let currentData = this.getStoreData();
        const completedQuestions = _.filter(questions, (question) => {
            return question.completed;
        });

        currentData.questions = questions;
        currentData.completedQuestions = completedQuestions;
        currentData.questionNumber = completedQuestions.length;
        // User completed all questions, calculate top rank points.
        if (completedQuestions.length === Constants.maxQuestionNumber) {
            const correctQuestions = _.filter(questions, (question) => {
                return question.correct;
            });
            const resultPoints = correctQuestions.length * Constants.correctAnswerPoint;
            const topResultKeys = ['first', 'second', 'third'];
            let resultAdded = false;
            // Update top result points.
            _.each(topResultKeys, (resultPosition, resultIndex) => {
                const positionPoints = currentData.topResults[resultPosition].points ?
                    parseInt(currentData.topResults[resultPosition].points) :
                    0;

                if (!resultAdded && parseInt(resultPoints) > positionPoints) {
                    // Check if current result is better than the ones below.
                    if (currentData.topResults[topResultKeys[resultIndex + 1]] && (
                        _.isEmpty(currentData.topResults[topResultKeys[resultIndex + 1]].points) ||
                        positionPoints > parseInt(currentData.topResults[topResultKeys[resultIndex + 1]].points))) {

                        const nextResult = _.cloneDeep(currentData.topResults[topResultKeys[resultIndex + 1]]);
                        const nextPoints = nextResult.points ? parseInt(nextResult.points) : 0;

                        currentData.topResults[topResultKeys[resultIndex + 1]] = _.cloneDeep(currentData.topResults[resultPosition]);

                        if (currentData.topResults[topResultKeys[resultIndex + 2]] && (
                            _.isEmpty(currentData.topResults[topResultKeys[resultIndex + 2]].points) ||
                            nextPoints > parseInt(currentData.topResults[topResultKeys[resultIndex + 2]].points))) {
                            currentData.topResults[topResultKeys[resultIndex + 2]] = _.cloneDeep(nextResult);
                        }
                    } else if (currentData.topResults[topResultKeys[resultIndex + 2]]  && (
                        _.isEmpty(currentData.topResults[topResultKeys[resultIndex + 2]].points) ||
                        positionPoints > parseInt(currentData.topResults[topResultKeys[resultIndex + 2]].points))) {

                        currentData.topResults[topResultKeys[resultIndex + 2]] = _.cloneDeep(currentData.topResults[resultPosition]);
                    }

                    currentData.topResults[resultPosition].points = resultPoints;
                    currentData.topResults[resultPosition].date = new Date().toLocaleDateString();

                    resultAdded = true;

                    return false;
                }
            });
        }

        this.updateStoreData(currentData);
    };

    hookOnStoreUpdate(hookName, hookCallback) {
        this.hooks[hookName] = hookCallback;
    };

    deleteHookOnStoreUpdate(hookName) {
        delete this.hooks[hookName];
    };

    clearStoreData(keepTopResults) {
        const topResults = this.data.topResults;
        let emptyData = this.getEmptyData();

        if (keepTopResults) {
            emptyData.topResults = topResults;
        }

        this.data = emptyData;

        localStorageAPI.update(this.data);
    };
}