import React, { useMemo, useReducer } from "react";
import { Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Dashboard from "./Components/DashBoard/Dashboard";
import RepositoryDetails from "./Components/DashBoard/Repository/RepoComponents/RepositoryDetails";
import RepositoryAction from "./Components/DashBoard/Repository/RepoComponents/RepositoryAction";
import SplashScreen from "./Components/SplashScreen";
import { ContextProvider } from "./context";
import reducer from "./reducer";

export default function App(props) {
  const initialState = {
    hcParams: {},
    presentRepo: [],
    modifiedGitFiles: [],
    globalRepoId: "",
    gitUntrackedFiles: [],
    gitTrackedFiles: [],
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const memoizedRepoDetails = useMemo(() => {
    return <RepositoryDetails parentProps={props}></RepositoryDetails>;
  }, [props]);

  return (
    <div className="App w-full h-full">
      <ContextProvider.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          <Route path="/" exact component={SplashScreen}></Route>
          <Route path="/dashboard" component={Dashboard}></Route>
          <Route exact path="/dashboard/repository/:repoId">
            {memoizedRepoDetails}
          </Route>
          <Route
            path="/dashboard/repository"
            exact
            component={RepositoryAction}
          ></Route>
        </BrowserRouter>
      </ContextProvider.Provider>
    </div>
  );
}
