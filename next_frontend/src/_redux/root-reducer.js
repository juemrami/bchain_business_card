//Dependencies import
import { combineReducers } from "redux";

//Reducers import
import generalReducer from "./general/general";


const rootReducer = combineReducers({
  general: generalReducer,
});

export default rootReducer;
