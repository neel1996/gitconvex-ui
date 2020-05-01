import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Redirect } from "react-router";
import { GIT_GLOBAL_REPOID, PRESENT_REPO } from "../../../actionStore";
import { getAPIURL } from "../../../apiURLSupplier";
import { ContextProvider } from "../../../context";
import {
  API_FETCHREPO,
  API_GITREPOSTATUS,
  CONFIG_HTTP_MODE,
  PORT_FETCHREPO_API,
  PORT_GITREPOSTATUS_API,
} from "../../../env_config";
import GitTrackedComponent from "./GitTrackedComponent";

export default function RepositoryAction() {
  library.add(fas);

  const { state, dispatch } = useContext(ContextProvider);
  const { presentRepo } = state;
  const [selectedFlag, setSelectedFlag] = useState(false);
  const [defaultRepo, setDefaultRepo] = useState({});
  const [availableRepos, setAvailableRepos] = useState([]);
  const [selectedRepoDetails, setSelectedRepoDetails] = useState({
    gitBranchList: "",
    gitCurrentBranch: "",
    gitTotalCommits: 0,
    gitTotalTrackedFiles: 0,
  });

  const memoizedGitTracker = useMemo(() => {
    return <GitTrackedComponent repoId={defaultRepo.id}></GitTrackedComponent>;
  }, [defaultRepo, state.globalRepoId]);

  async function invokeRepoFetchAPI() {
    const fetchRepoURL = getAPIURL(
      CONFIG_HTTP_MODE,
      API_FETCHREPO,
      PORT_FETCHREPO_API
    );

    return await axios({
      url: fetchRepoURL,
      method: "POST",
      data: {
        query: `
            query{
                fetchRepo
            }
        `,
      },
    }).then((res) => {
      const apiResponse = JSON.parse(res.data.data.fetchRepo);

      if (apiResponse.status === "REPO_PRESENT") {
        const repoContent = JSON.parse(apiResponse.content);
        dispatch({
          type: PRESENT_REPO,
          payload: repoContent,
        });
        setDefaultRepo(repoContent[0]);
        setAvailableRepos(repoContent);
        return repoContent;
      }
    });
  }

  function fetchSelectedRepoStatus() {
    const endpointURL = `${CONFIG_HTTP_MODE}://${window.location.hostname}:${PORT_GITREPOSTATUS_API}/${API_GITREPOSTATUS}`;
    const repoId = defaultRepo.id;

    axios({
      url: endpointURL,
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      data: {
        query: `

            query GetRepoStatusQuery
            {
                getRepoStatus(repoId: "${repoId}"){
                    gitBranchList
                    gitCurrentBranch
                    gitTotalCommits
                    gitTotalTrackedFiles
              }
            }
          `,
      },
    })
      .then((res) => {
        setSelectedRepoDetails(res.data.data.getRepoStatus);
      })
      .catch((err) => {
        if (err) {
          console.log("API GitStatus error occurred : " + err);
        }
      });
  }

  useEffect(() => {
    if (presentRepo !== undefined && presentRepo.length >= 1) {
      setAvailableRepos(presentRepo[0]);
      fetchSelectedRepoStatus();
    } else {
      invokeRepoFetchAPI();
      fetchSelectedRepoStatus();
    }
  }, [defaultRepo]);

  function activeRepoPane() {
    const defaultRepoName = defaultRepo.repoName;
    return (
      <div className="text-center mx-auto my-auto justify-around mt-3 p-3 rounded-md shadow-sm flex border-2 border-gray-300 w-1/2">
        <div className="font-sans font-semibold text-gray-900 my-1 mx-2">
          Choose saved repository
        </div>
        <select
          className="bg-green-200 text-gray-800 rounded-sm mx-2 outline-none shadow-xs border border-green-500 w-1/2"
          onChange={(event) => {
            setSelectedFlag(true);
            availableRepos.map((elm) => {
              if (event.target.value === elm.repoName) {
                setDefaultRepo(elm);
                dispatch({ type: GIT_GLOBAL_REPOID, payload: elm.id });
              }
            });
          }}
        >
          <option selected hidden disabled>
            Select a repo
          </option>
          {availableRepos.map((entry) => {
            return <option value={entry.repoName}>{entry.repoName}</option>;
          })}
        </select>
      </div>
    );
  }

  function getTopPaneComponent(icon, value) {
    return (
      <>
        <div className="flex justify-between mx-2 font-sans text-lg text-gray-700">
          <div className="mx-2">
            <FontAwesomeIcon icon={["fas", icon]}></FontAwesomeIcon>
          </div>
          <div className="mx-2">{value}</div>
        </div>
      </>
    );
  }

  return (
    <div className="overflow-scroll w-11/12 h-full mx-auto block justify-center overflow-x-hidden">
      {availableRepos ? (
        <div className="">
          <div className="flex text-center justify-center mt-6">
            {activeRepoPane()}
            {selectedRepoDetails && selectedFlag ? (
              <div className="mt-3 mx-3 p-3 rounded-md shadow-sm flex mx-auto justify-center border-2 border-gray-300">
                {getTopPaneComponent(
                  "code-branch",
                  selectedRepoDetails.gitBranchList.length + " Branches"
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
          <div>
            {selectedRepoDetails && selectedFlag ? memoizedGitTracker : null}
          </div>
        </div>
      ) : (
        <div className="block p-4 mx-auto my-auto text-center font-sans bg-pink-200 rounded-md shadow-lg text-red-800 font-bold h-auto justify-center">
          {alert("Please add a repository!")}
          <Redirect to="/dashboard"></Redirect>
        </div>
      )}
    </div>
  );
}
