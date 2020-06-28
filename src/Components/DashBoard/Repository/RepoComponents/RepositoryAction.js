import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  GIT_GLOBAL_REPOID,
  PRESENT_REPO
} from "../../../../actionStore";
import { ContextProvider } from "../../../../context";
import {
  globalAPIEndpoint,
  ROUTE_FETCH_REPO,
  ROUTE_REPO_DETAILS
} from "../../../../util/env_config";
import GitTrackedComponent from "../GitComponents/GitTrackedComponent";

export default function RepositoryAction() {
  library.add(fas);

  const { state, dispatch } = useContext(ContextProvider);
  const { presentRepo } = state;
  const [selectedFlag, setSelectedFlag] = useState(false);
  const [defaultRepo, setDefaultRepo] = useState({});
  const [availableRepos, setAvailableRepos] = useState([]);
  const [activeBranch, setActiveBranch] = useState("");
  const [selectedRepoDetails, setSelectedRepoDetails] = useState({
    gitBranchList: "",
    gitCurrentBranch: "",
    gitTotalCommits: 0,
    gitTotalTrackedFiles: 0,
  });
  const [branchError, setBranchError] = useState(false);

  const memoizedGitTracker = useMemo(() => {
    if (defaultRepo && defaultRepo.id) {
      return (
        <GitTrackedComponent repoId={defaultRepo.id}></GitTrackedComponent>
      );
    }
  }, [defaultRepo]);

  useEffect(() => {
    //Effect dep function
    const token = axios.CancelToken;
    const source = token.source();

    function fetchSelectedRepoStatus() {
      const repoId = defaultRepo && defaultRepo.id;

      if (repoId) {
        const payload = JSON.stringify(JSON.stringify({ repoId: repoId }));

        axios({
          url: globalAPIEndpoint,
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          cancelToken: source.token,
          data: {
            query: `
              query GitConvexApi
              {
                gitConvexApi(route: "${ROUTE_REPO_DETAILS}", payload: ${payload}){
                  gitRepoStatus {
                    gitBranchList
                    gitCurrentBranch
                    gitTotalCommits
                    gitTotalTrackedFiles 
                  }
                }
              }
            `,
          },
        })
          .then((res) => {
            setSelectedRepoDetails(res.data.data.gitConvexApi.gitRepoStatus);
          })
          .catch((err) => {
            if (err) {
              console.log("API GitStatus error occurred : " + err);
            }
          });
      }
    }

    //Effect dep function
    async function invokeRepoFetchAPI() {
      return await axios({
        url: globalAPIEndpoint,
        method: "POST",
        cancelToken: source.token,
        data: {
          query: `
              query GitConvexApi{
                gitConvexApi(route: "${ROUTE_FETCH_REPO}"){
                  fetchRepo{
                    repoId
                    repoName
                    repoPath
                  }
                }
              }
          `,
        },
      }).then((res) => {
        const apiResponse = res.data.data.gitConvexApi.fetchRepo;

        if (apiResponse) {
          const repoContent = apiResponse.repoId.map((entry, index) => {
            return {
              id: apiResponse.repoId[index],
              repoName: apiResponse.repoName[index],
              repoPath: apiResponse.repoPath[index],
            };
          });

          dispatch({
            type: PRESENT_REPO,
            payload: [...repoContent],
          });

          setDefaultRepo(repoContent[0]);
          setAvailableRepos(repoContent);
          return repoContent;
        }
      });
    }

    if (presentRepo && presentRepo[0]) {
      setAvailableRepos(presentRepo[0]);
      fetchSelectedRepoStatus();
    } else {
      invokeRepoFetchAPI();
      fetchSelectedRepoStatus();
    }

    return () => {
      source.cancel();
    };
  }, [defaultRepo, activeBranch, presentRepo, dispatch, branchError]);

  function setTrackingBranch(branchName, event) {
    axios({
      url: globalAPIEndpoint,
      method: "POST",
      data: {
        query: `
          mutation{
            setBranch(repoId: "${defaultRepo.id}", branch: "${branchName}")
          }
        `,
      },
    })
      .then((res) => {
        if (res.data.data && !res.data.error) {
          setActiveBranch(branchName);
        }
      })
      .catch((err) => {
        if (err) {
          setBranchError(true);
          event.target.selectedIndex = 0;
        }
      });
  }

  function activeRepoPane() {
    return (
      <div className="flex justify-around mx-auto align-middle items-around my-4">
        <div className="flex">
          <div className="font-sans font-semibold text-gray-900 my-1">
            Choose saved repository
          </div>
          <select
            className="bg-green-200 text-gray-800 rounded-sm mx-2 outline-none shadow-xs border border-green-500"
            defaultValue="checked"
            onChange={(event) => {
              setSelectedFlag(true);
              availableRepos.length &&
                availableRepos.forEach((elm) => {
                  if (event.target.value === elm.repoName) {
                    setDefaultRepo(elm);
                    dispatch({ type: GIT_GLOBAL_REPOID, payload: elm.id });
                  }
                });
            }}
          >
            <option defaultChecked value="checked" hidden disabled>
              Select a repo
            </option>
            {availableRepos.length &&
              availableRepos.map((entry) => {
                return (
                  <option value={entry.repoName} key={entry.repoName}>
                    {entry.repoName}
                  </option>
                );
              })}
          </select>
        </div>
        {selectedFlag ? (
          <div className="flex">
            <div className="font-sans font-semibold text-gray-900 my-1">
              Branch
            </div>
            <select
              className="bg-indigo-200 text-gray-800 rounded-sm mx-2 outline-none shadow-xs border border-indigo-500"
              defaultValue="checked"
              onChange={(event) => {
                event.persist();
                setActiveBranch(event.currentTarget.value);
                setTrackingBranch(event.target.value, event);
              }}
              onClick={() => {
                setBranchError(false);
              }}
            >
              {availableBranch()}
            </select>
          </div>
        ) : null}
      </div>
    );
  }

  function getTopPaneComponent(icon, value) {
    return (
      <>
        <div className="flex p-2 border-b-2 border-indigo-400 border-dashed justify-between mx-2 font-sans text-lg text-gray-700">
          <div className="mx-2">
            <FontAwesomeIcon icon={["fas", icon]}></FontAwesomeIcon>
          </div>
          <div className="mx-2">{value}</div>
        </div>
      </>
    );
  }

  function availableBranch() {
    if (selectedRepoDetails && selectedRepoDetails.gitBranchList) {
      const { gitBranchList } = selectedRepoDetails;

      return gitBranchList.map((branch) => {
        if (branch !== "NO_BRANCH") {
          return (
            <option key={branch} value={branch}>
              {branch}
            </option>
          );
        }

        return null;
      });
    }
  }

  return (
    <div className="overflow-scroll w-full h-full mx-auto block justify-center overflow-x-hidden">
      {availableRepos ? (
        <div className="">
          <div className="mx-auto my-6 w-11/12 rounded shadow border border-gray-200">
            {activeRepoPane()}
            {selectedRepoDetails && selectedFlag ? (
              <div className="my-auto flex justify-around p-3 mx-auto">
                {getTopPaneComponent(
                  "code-branch",
                  selectedRepoDetails.gitBranchList &&
                    selectedRepoDetails.gitBranchList.length > 0 &&
                    !selectedRepoDetails.gitBranchList[0].match(
                      /NO_BRANCH/gi
                    ) ? (
                    <>
                      {selectedRepoDetails.gitBranchList.length === 1
                        ? 1 + " branch"
                        : selectedRepoDetails.gitBranchList.length +
                          " branches"}
                    </>
                  ) : (
                    "No Branches"
                  )
                )}
                {getTopPaneComponent(
                  "sort-amount-up",
                  selectedRepoDetails.gitTotalCommits + " Commits"
                )}
                {getTopPaneComponent(
                  "archive",
                  selectedRepoDetails.gitTotalTrackedFiles + " Tracked Files"
                )}
              </div>
            ) : null}
          </div>
          {!selectedFlag ? (
            <>
              <div className="mt-10 w-11/12 rounded-sm shadow-sm h-full my-auto bock mx-auto text-center align-middle p-6 bg-orange-200 text-xl text-orange-900">
                Select a configured repo from the dropdown to perform git
                related operations
              </div>
              <div className="p-6 rounded-lg border-2 border-gray-100 w-3/4 block mx-auto my-20">
                <div>
                  <FontAwesomeIcon
                    icon={["fas", "mouse-pointer"]}
                    className="flex text-6xl mt-20 text-center text-gray-300 font-bold mx-auto my-auto h-full w-full"
                  ></FontAwesomeIcon>
                </div>
                <div className="block text-6xl text-gray-200 mx-auto text-center align-middle">
                  No repositories selected
                </div>
              </div>
            </>
          ) : null}
          <div>
            {branchError ? (
              <div className="p-2 rounded my-2 mx-auto text-center font-sand bg-red-200 text-red-800">
                Branch switching failed.Commit your changes and try again
              </div>
            ) : null}
            {selectedRepoDetails && selectedFlag && defaultRepo.id
              ? memoizedGitTracker
              : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
