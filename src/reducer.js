import { HC_PARAM_ACTION, HC_DONE_SWITCH, PRESENT_REPO } from "./actionStore";

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
    case PRESENT_REPO:
      localStorage.setItem("presentRepo",[...action.payload])
      return{
        ...state,
        presentRepo: [...state.presentRepo, action.payload]
      }
    default:
      return {
        ...state
      };
  }
}
