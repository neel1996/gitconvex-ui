import { HC_PARAM_ACTION, HC_DONE_SWITCH } from "./actionStore";

export default function reducer(state, action) {
  switch (action.type) {
    case HC_DONE_SWITCH:
      return{
        ...state,
        hcDone: action.payload
      }
    case HC_PARAM_ACTION:
      localStorage.setItem(action.payload.code, action.payload.value)
      return {
        ...state,
        hcParams: [...state.hcParams, action.payload]
      };
    default:
      return {
        ...state
      };
  }
}
