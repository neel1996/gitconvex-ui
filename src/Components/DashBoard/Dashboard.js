import React, { useContext, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { ContextProvider } from "../../context";
import LeftPane from "./DashboardPaneComponents/LeftPane";
import RightPane from "./DashboardPaneComponents/RightPane";
import RepositoryAction from "./Repository/RepoComponents/RepositoryAction";
import RepositoryDetails from "./Repository/RepoComponents/RepositoryDetails";
import { globalAPIEndpoint } from "../../util/env_config";
import axios from "axios";
import Settings from "./Settings/Settings";

export default function Dashboard(props) {
  const { state } = useContext(ContextProvider);

  const [platform, setPlatform] = useState("");
  const [gitVersion, setGitVersion] = useState("");
  const [nodeVersion, setNodeVersion] = useState("");

  const memoizedRepoDetails = useMemo(() => {
    return <RepositoryDetails parentProps={props}></RepositoryDetails>;
  }, [props]);

  const memoizedSettings = useMemo(() => {
    return <Settings></Settings>;
  }, []);

  useEffect(() => {
    const { osCheck, gitCheck, nodeCheck } = state.hcParams;

    const localStorageItems = ["OS_TYPE", "NODE_VERSION", "GIT_VERSION"];

    const token = axios.CancelToken;
    const source = token.source();

    if (osCheck && gitCheck && nodeCheck) {
      setPlatform(osCheck);
      setGitVersion(gitCheck);
      setNodeVersion(nodeCheck);
    } else {
      let checkArray = localStorageItems.filter((item) => {
        return localStorage.getItem(item) ? true : false;
      });

      if (checkArray.length === 3) {
        setPlatform(localStorage.getItem("OS_TYPE"));
        setNodeVersion(localStorage.getItem("NODE_VERSION"));
        setGitVersion(localStorage.getItem("GIT_VERSION"));
      } else {
        axios({
          url: globalAPIEndpoint,
          method: "POST",
          cancelToken: source.token,
          data: {
            query: `
              query GitConvexAPI{
                gitConvexApi(route:"HEALTH_CHECK"){
                  healthCheck{
                    osCheck
                    gitCheck
                    nodeCheck
                  }
                }
              }
            `,
          },
        })
          .then((res) => {
            if (res.data.data && !res.data.error) {
              const {
                osCheck,
                gitCheck,
                nodeCheck,
              } = res.data.data.gitConvexApi.healthCheck;

              setPlatform(JSON.parse(osCheck).message);
              setGitVersion(JSON.parse(gitCheck).message);
              setNodeVersion(JSON.parse(nodeCheck).message);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    return () => {
      source.cancel();
    };
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
      case "/dashboard/settings":
        return memoizedSettings;
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
      <div className="xl:flex lg:flex md:block w-full h-full">
        <LeftPane parentProps={props}></LeftPane>
        {renderRightPaneComponent()}
      </div>
    </>
  );
}
