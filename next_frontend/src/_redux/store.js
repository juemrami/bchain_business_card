import { createStore, applyMiddleware } from "redux";
import { createWrapper } from "next-redux-wrapper"
import rootReducer from "./root-reducer";

const middleWares = [];

export const store = () =>  createStore(rootReducer, applyMiddleware(...middleWares));

export const wrapper = createWrapper(store);