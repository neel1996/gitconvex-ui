import React, { useContext, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { ContextProvider } from "../../context";
import LeftPane from "./DashboardPaneComponents/LeftPane";
import RightPane from "./DashboardPaneComponents/RightPane";
import RepositoryAction from "./Repository/RepoComponents/RepositoryAction";
import RepositoryDetails from "./Repository/RepoComponents/RepositoryDetails";

export default function Dashboard(props) {
  const { state } = useContext(ContextProvider);

  const [platform, setPlatform] = useState("");
  const [gitVersion, setGitVersion] = useState("");
  const [nodeVersion, setNodeVersion] = useState("");

  const memoizedRepoDetails = useMemo(() => {
    return <RepositoryDetails parentProps={props}></RepositoryDetails>;
  }, [props]);

  useEffect(() => {
    const { osCheck, gitCheck, nodeCheck } = state.hcParams;

    if (osCheck && gitCheck && nodeCheck) {
      setPlatform(osCheck);
      setGitVersion(gitCheck);
      setNodeVersion(nodeCheck);
    } else {
      setPlatform(localStorage.getItem("OS_TYPE"));
      setNodeVersion(localStorage.getItem("GIT_VERSION"));
      setGitVersion(localStorage.getItem("NODE_VERSION"));
    }
  }, [state.hcParams]);

  const params = {
    platform,
    gitVersion,
    nodeVersion,
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
              {memoizedRepoDetails}
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
