import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import {
  globalAPIEndpoint,
  ROUTE_REPO_DETAILS,
} from "../../../../../util/env_config";
import FileExplorerComponent from "./FileExplorerComponent";
import AddBranchComponent from "./RepoDetailBackdrop/AddBranchComponent";
import AddRemoteRepoComponent from "./RepoDetailBackdrop/AddRemoteRepoComponent";
import BranchListComponent from "./RepoDetailBackdrop/BranchListComponent";
import CommitLogComponent from "./RepoDetailBackdrop/CommitLogComponent";
import FetchPullActionComponent from "./RepoDetailBackdrop/FetchPullActionComponent";
import SwitchBranchComponent from "./RepoDetailBackdrop/SwitchBranchComponent";
import RepoInfoComponent from "./RepoInfoComponent";
import RepoLeftPaneComponent from "./RepoLeftPaneComponent";
import RepoRightPaneComponent from "./RepoRightPaneComponent";

export default function RepositoryDetails(props) {
  library.add(fab, fas);
  const [gitRepoStatus, setGitRepoStatus] = useState({});
  const [repoFetchFailed, setRepoFetchFailed] = useState(false);
  const [repoIdState, setRepoIdState] = useState("");
  const [showCommitLogs, setShowCommitLogs] = useState(false);
  const [isMultiRemote, setIsMultiRemote] = useState(false);
  const [multiRemoteCount, setMultiRemoteCount] = useState(0);
  const [backdropToggle, setBackdropToggle] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [currentBranch, setCurrentBranch] = useState("");
  const [gitRepoFiles, setGitRepoFiles] = useState([]);
  const [gitFileBasedCommits, setGitFileBasedCommits] = useState([]);
  const [action, setAction] = useState("");
  const [searchOptionState, setSearchOptionState] = useState("default-search");

  const closeBackdrop = (toggle) => {
    setBackdropToggle(!toggle);
  };

  const showCommitLogsView = () => {
    setShowCommitLogs(true);
  };

  const actionTrigger = (actionType) => {
    setAction(actionType);
    setBackdropToggle(true);
  };

  const memoizedCommitLogComponent = useMemo(() => {
    const searchOptions = ["Commit Hash", "Commit Message", "User"];
    return (
      <>
        <div className="my-4 w-full rounded-lg bg-white shadow-inner flex gap-4 justify-between items-center">
          <select
            defaultValue="default-search"
            id="searchOption"
            className="w-1/4 flex p-4 items-center bg-indigo-500 text-white cursor-pointer rounded-l-md text-lg font-sans font-semibold outline-none"
            onChange={(event) => {
              setSearchOptionState(event.currentTarget.value);
            }}
          >
            <option value={searchOptionState} hidden disabled>
              Search for...
            </option>
            {searchOptions.map((item) => {
              return <option key={item}>{item}</option>;
            })}
          </select>

          <div className="w-3/4 rounded-r-md">
            <input
              type="text"
              className="w-5/6 outline-none text-lg font-light font-sans"
              placeholder="What are you looking for?"
            />
          </div>
          <div className="w-20 bg-gray-200 p-3 mx-auto my-auto text-center rounded-r-lg hover:bg-gray-400 cursor-pointer">
            <FontAwesomeIcon
              icon={["fas", "search"]}
              className="text-3xl text-gray-600"
            ></FontAwesomeIcon>
          </div>
        </div>
        <CommitLogComponent repoId={repoIdState}></CommitLogComponent>
      </>
    );
  }, [repoIdState, searchOptionState]);

  const memoizedFetchRemoteComponent = useMemo(() => {
    return (
      <FetchPullActionComponent
        repoId={repoIdState}
        actionType="fetch"
      ></FetchPullActionComponent>
    );
  }, [repoIdState]);

  const memoizedPullRemoteComponent = useMemo(() => {
    return (
      <FetchPullActionComponent
        repoId={repoIdState}
        actionType="pull"
      ></FetchPullActionComponent>
    );
  }, [repoIdState]);

  const memoizedSwitchBranchComponent = useMemo(() => {
    return (
      <SwitchBranchComponent
        repoId={repoIdState}
        branchName={selectedBranch}
        closeBackdrop={closeBackdrop}
      ></SwitchBranchComponent>
    );
  }, [repoIdState, selectedBranch]);

  const memoizedBranchListComponent = useMemo(() => {
    return (
      <BranchListComponent
        repoId={repoIdState}
        currentBranch={currentBranch}
      ></BranchListComponent>
    );
  }, [repoIdState, currentBranch]);

  const memoizedAddRemoteRepoComponent = useMemo(() => {
    return (
      <AddRemoteRepoComponent repoId={repoIdState}></AddRemoteRepoComponent>
    );
  }, [repoIdState]);

  useEffect(() => {
    const endpointURL = globalAPIEndpoint;

    if (props.parentProps.location) {
      const repoId = props.parentProps.location.pathname.split(
        "/repository/"
      )[1];

      setRepoIdState(repoId);

      const payload = JSON.stringify(JSON.stringify({ repoId: repoId }));

      axios({
        url: endpointURL,
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        data: {
          query: `

            query GitConvexApi
            {
              gitConvexApi(route: "${ROUTE_REPO_DETAILS}", payload: ${payload}){
                gitRepoStatus {
                  gitRemoteData
                  gitRepoName
                  gitBranchList
                  gitCurrentBranch
                  gitRemoteHost
                  gitTotalCommits
                  gitLatestCommit
                  gitTrackedFiles
                  gitFileBasedCommit
                  gitTotalTrackedFiles    
                }
              }
            }
          `,
        },
      })
        .then((res) => {
          if (res.data && res.data.data && !res.data.error) {
            const localRepoStatus = res.data.data.gitConvexApi.gitRepoStatus;
            let gitRemoteLocal = localRepoStatus.gitRemoteData;
            setCurrentBranch(localRepoStatus.gitCurrentBranch);
            if (gitRemoteLocal.includes("||")) {
              setIsMultiRemote(true);
              localRepoStatus.gitRemoteData = gitRemoteLocal.split("||")[0];
              setIsMultiRemote(true);
              setMultiRemoteCount(gitRemoteLocal.split("||").length);
            }
            setGitRepoStatus(localRepoStatus);

            setGitRepoFiles([...localRepoStatus.gitTrackedFiles]);
            setGitFileBasedCommits([...localRepoStatus.gitFileBasedCommit]);
          } else {
            setRepoFetchFailed(true);
          }
        })
        .catch((err) => {
          if (err) {
            console.log("API GitStatus error occurred : " + err);
            setRepoFetchFailed(true);
          }
        });
    }
  }, [props.parentProps, backdropToggle]);

  let {
    gitRemoteData,
    gitRepoName,
    gitBranchList,
    gitCurrentBranch,
    gitRemoteHost,
    gitTotalCommits,
    gitLatestCommit,
  } = gitRepoStatus;

  const switchBranchHandler = (branchName) => {
    setBackdropToggle(true);
    setAction("switchbranch");
    setSelectedBranch(branchName);
  };

  const actionComponentPicker = () => {
    switch (action) {
      case "fetch":
        return memoizedFetchRemoteComponent;
      case "pull":
        return memoizedPullRemoteComponent;
      case "addRemoteRepo":
        return memoizedAddRemoteRepoComponent;
      case "addBranch":
        return <AddBranchComponent repoId={repoIdState}></AddBranchComponent>;
      case "switchbranch":
        return memoizedSwitchBranchComponent;
      case "listBranch":
        return memoizedBranchListComponent;
      default:
        return null;
    }
  };

  return (
    <>
      {showCommitLogs ? (
        <>
          <div
            className="fixed w-full h-full top-0 left-0 right-0 flex overflow-auto"
            id="commit-log__backdrop"
            style={{ background: "rgba(0,0,0,0.5)", zIndex: 99 }}
            onClick={(event) => {
              if (event.target.id === "commit-log__backdrop") {
                setShowCommitLogs(false);
              }
            }}
          >
            <div
              className="fixed top-0 right-0 mx-3 font-semibold bg-red-500 text-3xl cursor-pointer text-center text-white my-5 align-middle rounded-full w-12 h-12 items-center align-middle shadow-md mr-5"
              onClick={() => {
                setShowCommitLogs(false);
              }}
            >
              X
            </div>
            <div
              id="commit-log__cards"
              className="w-full xl:w-3/4 lg:w-5/6 md:w-11/12 sm:w-11/12 h-full block mx-auto my-auto mt-10 mb-10"
            >
              {memoizedCommitLogComponent}
            </div>
          </div>
        </>
      ) : null}
      {backdropToggle ? (
        <div
          className="fixed w-full h-full top-0 left-0 right-0 flex overflow-auto"
          id="repo-backdrop"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={(event) => {
            if (event.target.id === "repo-backdrop") {
              setBackdropToggle(false);
              setAction("");
            }
          }}
        >
          <>{action ? actionComponentPicker() : null}</>
          <div
            className="fixed top-0 right-0 mx-3 font-semibold bg-red-500 text-3xl cursor-pointer text-center text-white my-5 align-middle rounded-full w-12 h-12 items-center align-middle shadow-md mr-5"
            onClick={() => {
              setBackdropToggle(false);
              setAction("");
            }}
          >
            X
          </div>
        </div>
      ) : null}
      <div className="w-full fixed bg-gray-600 opacity-50"></div>
      <div className="xl:overflow-auto lg:overflow-auto md:overflow-none sm:overflow-none rp_repo-view w-full h-full p-6 mx-auto rounded-lg justify-evenly">
        {gitRepoStatus && !repoFetchFailed ? (
          <>
            <div className="flex px-3 py-2">
              {gitRepoStatus ? (
                <RepoInfoComponent
                  gitRepoName={gitRepoName}
                  gitCurrentBranch={gitCurrentBranch}
                ></RepoInfoComponent>
              ) : null}
            </div>
            <div className="w-full">
              <div className="xl:flex lg:block md:block sm:block my-4 mx-auto justify-around">
                {gitRepoStatus ? (
                  <>
                    <RepoLeftPaneComponent
                      received={true}
                      actionTrigger={actionTrigger}
                      showCommitLogsView={showCommitLogsView}
                      gitRemoteHost={gitRemoteHost}
                      gitRemoteData={gitRemoteData}
                      isMultiRemote={isMultiRemote}
                      multiRemoteCount={multiRemoteCount}
                    ></RepoLeftPaneComponent>
                    <RepoRightPaneComponent
                      received={true}
                      switchBranchHandler={switchBranchHandler}
                      actionTrigger={actionTrigger}
                      gitBranchList={gitBranchList}
                      gitCurrentBranch={gitCurrentBranch}
                      gitLatestCommit={gitLatestCommit}
                      gitTotalCommits={gitTotalCommits}
                    ></RepoRightPaneComponent>
                  </>
                ) : null}
              </div>
            </div>

            {gitRepoStatus && repoIdState && gitRepoFiles ? (
              <FileExplorerComponent
                repoIdState={repoIdState}
                gitRepoFiles={gitRepoFiles}
                gitFileBasedCommits={gitFileBasedCommits}
              ></FileExplorerComponent>
            ) : null}
          </>
        ) : (
          <div className="text-center mx-auto rounded-lg p-3 shadow-md border border-indigo-200 text-indigo-800">
            Fetching repo details...
          </div>
        )}
        {repoFetchFailed ? (
          <div className="p-2 text-center mx-auto rounded-lg bg-red-200 text-xl">
            Repo details fetch failed!
          </div>
        ) : null}
      </div>
    </>
  );
}
