import {Util} from "./utility.service";
import {Constants} from "../../constants";

export const ApiService = {
    fetchQuestions: () => {
        return new Promise((resolve) => {
            Util.getRequest(Constants.endpoints.questions, (response) => {
                if (response && response.error) {
                    resolve(false);

                    return;
                }

                resolve(response);
            });
        });
    }
};