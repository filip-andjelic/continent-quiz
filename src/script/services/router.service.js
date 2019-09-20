// External dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import Aviator from 'aviator';
// Internal dependencies
import MainScreen from '../screens/main.screen';
import QuestionsScreen from "../screens/questions.screen";
import ResultScreen from "../screens/result.screen";
import StoreService from "./store.service";

const rootApplicationId = 'root';
const Store = new StoreService();

const MainTarget = {
    screen: () => {
        ReactDOM.render(
            <MainScreen store={Store} router={RouterService}/>,
            document.getElementById(rootApplicationId)
        );
    }
};
const QuestionsTarget = {
    screen: () => {
        ReactDOM.render(
            <QuestionsScreen store={Store} router={RouterService}/>,
            document.getElementById(rootApplicationId)
        );
    }
};
const ResultTarget = {
    screen: () => {
        ReactDOM.render(
            <ResultScreen store={Store} router={RouterService}/>,
            document.getElementById(rootApplicationId)
        );
    }
};

Aviator.setRoutes({
    target: MainTarget,
    '/*': 'screen',
    '/questions': {
        target: QuestionsTarget,
        '/*': 'screen'
    },
    '/result': {
        target: ResultTarget,
        '/*': 'screen'
    }
});

export const RouterService = {
    watchRoutes: () => {
        ReactDOM.render(<MainScreen/>, document.getElementById(rootApplicationId));

        Aviator.dispatch();
    },
    goToScreen: (screenName) => {
        Aviator.navigate(screenName);
    },
    refresh: () => {
        Aviator.refresh();
    }
};

