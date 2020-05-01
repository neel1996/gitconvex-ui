import {
  HC_PARAM_ACTION,
  HC_DONE_SWITCH,
  PRESENT_REPO,
  GIT_TRACKED_FILES,
  GIT_GLOBAL_REPOID,
} from "./actionStore";

export default function reducer(state, action) {
  switch (action.type) {
    case HC_DONE_SWITCH:
      return {
        ...state,
        hcDone: action.payload,
      };
    case HC_PARAM_ACTION:
      localStorage.setItem(action.payload.code, action.payload.value);
      return {
        ...state,
        hcParams: [...state.hcParams, action.payload],
      };
    case PRESENT_REPO:
      return {
        ...state,
        presentRepo: [...state.presentRepo, action.payload],
      };
    case GIT_TRACKED_FILES:
      state.modifiedGitFiles = [];
      return {
        ...state,
        modifiedGitFiles: [...state.modifiedGitFiles, action.payload],
      };
    case GIT_GLOBAL_REPOID:
      state.globalRepoId = "";
      return {
        ...state,
        globalRepoId: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
}
