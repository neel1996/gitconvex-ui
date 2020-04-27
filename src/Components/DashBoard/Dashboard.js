import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { ContextProvider } from "../../context";
import LeftPane from "./LeftPane";
import RepositoryPane from "./Repository/Repository";
import RepositoryAction from './Repository/RepositoryAction';
import RightPane from "./RightPane";



export default function Dashboard(props) {
  const { state } = useContext(ContextProvider);

  const [platform, setPlatform] = useState("");
  const [gitVersion, setGitVersion] = useState("");
  const [nodeVersion, setNodeVersion] = useState("");

  useEffect(() => {
    if (state.hcParams.length > 0) {
      state.hcParams.forEach(entry => {
        if (entry["code"].match(/GIT/i)) {
          setGitVersion(entry["value"]);
        } else if (entry["code"].match(/NODE/i)) {
          setNodeVersion(entry["value"]);
        } else if (entry["code"].match(/OS/i)) {
          setPlatform(entry["value"]);
        }
      });
    } else {
      setPlatform(localStorage.getItem("OS_CHECK_PASSED"));
      setNodeVersion(localStorage.getItem("NODE_CHECK_PASSED"));
      setGitVersion(localStorage.getItem("GIT_CHECK_PASSED"));
    }
  }, [state.hcParams]);

  const params = {
    platform,
    gitVersion,
    nodeVersion
  };

  const renderRightPaneComponent = () => {
    switch (props.location.pathname) {
      case "/dashboard":
        return <RightPane params={params}></RightPane>;
      case "/dashboard/repository":
        return <RepositoryAction></RepositoryAction>;
      default:
        return (
          <BrowserRouter>
            <Route exact path="/dashboard/repository/:repoId">
              <RepositoryPane parentProps={props}></RepositoryPane>
            </Route>
          </BrowserRouter>
        );
    }
  };

  return (
    <>
      <div className="flex w-full h-full">
        <LeftPane parentProps={props}></LeftPane>
        {renderRightPaneComponent()}
      </div>
    </>
  );
}
