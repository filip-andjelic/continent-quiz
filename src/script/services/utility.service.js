// External dependencies
import _ from 'lodash';
// Internal dependencies
import {TriggerCallbackOnlyOncePerPeriod} from "./trigger.callback.only.once.per.period.helper";

/*
 *  * Usage & Purpose *
 *
 *  `Util` contains methods which are commonly used but not contained in other services.
 */
export const Util = {
    generateNewRandomIndex(usedIndexes, count, isCountArray) {
        const length = isCountArray ? count.length : count;
        let randomIndex = Math.floor(Math.random() * length);

        if (isCountArray && usedIndexes && usedIndexes[count[randomIndex]]) {
            return Util.generateNewRandomIndex(usedIndexes, count, isCountArray);
        }
        if (usedIndexes && usedIndexes[randomIndex]) {
            return Util.generateNewRandomIndex(usedIndexes, count, isCountArray);
        }

        return randomIndex;
    },
    generateQuestions: (questions, questionLimit, completedQuestions) => {
        const availableAnswers = ['Africa', 'Asia', 'South America', 'North America', 'Europe', 'Oceania', 'Antarctica'];
        const questionCount = questions.length;
        let generatedQuestions = completedQuestions ? completedQuestions : [];
        let usedIndexes = {};
        let iterationCount = completedQuestions ? completedQuestions.length + 1 : 1;

        // If User completed some questions before, mark those as used.
        if (!_.isEmpty(completedQuestions)) {
            _.each(completedQuestions, (completedQuestion) => {
                const completedQuestionIndex = _.findIndex(questions, function (q) {
                    return q.image === completedQuestion.image;
                });

                usedIndexes[completedQuestionIndex] = true;
            });
        }
        do {
            const randomIndex = Util.generateNewRandomIndex(usedIndexes, questionCount);
            let newQuestion = questions[randomIndex];

            newQuestion.answers = {};

            newQuestion.answers[newQuestion.continent] = {
                correct: true,
                label: newQuestion.continent
            };
            const secondAnswerIndex = Util.generateNewRandomIndex(newQuestion.answers, availableAnswers, true);

            newQuestion.answers[availableAnswers[secondAnswerIndex]] = {
                correct: false,
                label: availableAnswers[secondAnswerIndex]
            };
            const thirdAnswerIndex = Util.generateNewRandomIndex(newQuestion.answers, availableAnswers, true);

            newQuestion.answers[availableAnswers[thirdAnswerIndex]] = {
                correct: false,
                label: availableAnswers[thirdAnswerIndex]
            };

            newQuestion.answers = _.shuffle(newQuestion.answers);
            generatedQuestions.push(newQuestion);

            usedIndexes[randomIndex] = true;
            iterationCount++;
        } while (iterationCount <= questionLimit);

        return generatedQuestions;
    },
    log: (text, variable) => {
        console.log('-----!----- Log Written Data -----!-----');
        console.log(text);

        if (variable || variable === false || variable === 0) {
            console.log(variable);
        } else {
            console.log('Not Defined');
        }

        console.log('-----!-----!-----!-----!-----!----!-----');
    },
    triggerCallbackOnlyOncePerPeriod: (callbackKey, callback, period) => {
        return TriggerCallbackOnlyOncePerPeriod(callbackKey, callback, period, Util);
    },
    forObjectKeys: (object, callback) => {
        for (let key in object) {
            callback(object[key], key);
        }
    },
    getRequest: (url, callback, auth) => {
        let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new window.ActiveXObject('Microsoft.XMLHTTP');

        xhr.open('GET', url);
        xhr.onreadystatechange = () => {
            if (xhr.readyState > 3 && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            }
            if (xhr.readyState > 3 && xhr.status > 399) {
                callback({
                    error: true,
                    message: xhr.responseText
                })
            }
        };
        if (auth) {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            xhr.setRequestHeader('Authorization', 'Bearer ' + auth);
        }
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send();

        return xhr;
    }
};