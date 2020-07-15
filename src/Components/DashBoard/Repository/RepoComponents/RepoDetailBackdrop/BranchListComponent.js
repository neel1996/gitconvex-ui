import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  globalAPIEndpoint,
  ROUTE_REPO_DETAILS,
} from "../../../../../util/env_config.js";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BranchListComponent({ repoId, currentBranch }) {
  library.add(fas);
  const payload = JSON.stringify(JSON.stringify({ repoId: repoId }));

  const [branchList, setBranchList] = useState([]);
  const [listError, setListError] = useState(false);
  const [switchSuccess, setSwitchSuccess] = useState(false);
  const [switchError, setSwitchError] = useState(false);
  const [switchedBranch, setSwitchedBranch] = useState("");
  const [errorBranch, setErrorBranch] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  function resetStates() {
    setListError(false);
    setSwitchSuccess(false);
    setSwitchError(false);
    setSwitchedBranch("");
    setErrorBranch("");
    setDeleteError(false);
    setDeleteSuccess(false);
  }

  useEffect(() => {
    const token = axios.CancelToken;
    const source = token.source();

    axios({
      url: globalAPIEndpoint,
      method: "POST",
      cancelToken: source.token,
      data: {
        query: `

          query GitConvexApi
          {
            gitConvexApi(route: "${ROUTE_REPO_DETAILS}", payload: ${payload}){
              gitRepoStatus {
                gitAllBranchList  
              }
            }
          }
        `,
      },
    })
      .then((res) => {
        if (res.data.data && !res.data.error) {
          let { gitAllBranchList } = res.data.data.gitConvexApi.gitRepoStatus;
          setBranchList([...gitAllBranchList]);
        } else {
          setListError(true);
        }
      })
      .catch((err) => {
        if (err) {
          console.log("API error occurred : " + err);
          setListError(true);
        }
      });

    return () => source.cancel;
  }, [repoId, payload, switchedBranch]);

  function switchBranchHandler(branchName) {
    resetStates();

    axios({
      url: globalAPIEndpoint,
      method: "POST",
      data: {
        query: `
            mutation{
              setBranch(repoId: "${repoId}", branch: "${branchName}")
            }
          `,
      },
    })
      .then((res) => {
        if (res.data.data && !res.data.error) {
          setSwitchSuccess(true);
          setSwitchedBranch(branchName);
        } else {
          setSwitchError(true);
        }
      })
      .catch((err) => {
        if (err) {
          setSwitchError(true);
          setErrorBranch(branchName);
        }
      });
  }

  function deleteBranchHandler(branchName, forceFlag) {
    resetStates();

    axios({
      url: globalAPIEndpoint,
      method: "POST",
      data: {
        query: `
            mutation{
              deleteBranch(repoId: "${repoId}", branchName: "${branchName}", forceFlag: ${forceFlag}){
                status
              }
            }
          `,
      },
    })
      .then((res) => {
        if (res.data.data && !res.data.error) {
          if (res.data.data.deleteBranch.status === "BRANCH_DELETE_SUCCESS") {
            setDeleteSuccess(true);
            setSwitchedBranch(branchName);
          } else {
            setDeleteError(true);
            setErrorBranch(branchName);
          }
        }
      })
      .catch((err) => {
        if (err) {
          setDeleteError(true);
          setErrorBranch(branchName);
        }
      });
  }

  function errorComponent(errorString, branchError = false) {
    return (
      <div className="text-center p-4 rounded bg-red-300 text-xl font-sans mt-10">
        {errorString}
        {branchError ? (
          <span className="font-semibold border-b border-dashed mx-2">
            {errorBranch}
          </span>
        ) : null}
      </div>
    );
  }

  function successComponent(successString) {
    return (
      <div className="text-center p-4 rounded bg-green-300 text-xl font-sans mt-10">
        {successString}
        <span className="font-semibold border-b border-dashed mx-2">
          {switchedBranch}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 p-6 w-11/12 xl:w-3/4 mx-auto my-auto items-center align-middle lg:w-3/4 md:w-11/12 sm:w-11/12 rounded shadow">
      <div className="font-sans mx-4 p-2 text-4xl font-semibold border-b-2 border-dashed text-gray-800">
        Available Branches
      </div>
      <div className="font-sans mx-4 p-2 font-light italic font-semibold border-b-2 border-dashed text-gray-500">
        Click on a branch to checkout to that branch
      </div>
      <div className="my-4 mx-10">
        {!listError &&
          branchList &&
          branchList.map((branch) => {
            branch = branch.replace(/\s/gi, "");

            const branchPickerComponent = (icon, branchType, branchName) => {
              let activeSwitchStyle = "";
              let activeBranchFlag = false;
              if (branchName.includes("*")) {
                activeBranchFlag = true;
                branchName = branchName.replace("*", "");
              }

              console.log(icon, branchType, branchName);

              if (activeBranchFlag) {
                activeSwitchStyle =
                  "border-dashed border-b-2 text-indigo-700 text-3xl";
              }
              return (
                <div
                  className="flex my-2 border-b border-dashed py-4 my-auto items-center justify-start"
                  key={branchType + branchName}
                >
                  <div className="w-1/6 text-2xl text-blue-500 text-center">
                    <FontAwesomeIcon icon={["fas", icon]}></FontAwesomeIcon>
                  </div>
                  <div className="w-1/2 flex-2 text-xl font-sans font-semibold text-center text-indigo-500">
                    {branchType}
                  </div>
                  <div
                    className={`w-3/4 text-lg font-sans font-semibold text-left text-gray-700 hover:text-blue-700 cursor-pointer truncate ${activeSwitchStyle}`}
                    title={branchName}
                    onClick={() => {
                      if (!activeBranchFlag) {
                        switchBranchHandler(branchName);
                      }
                    }}
                  >
                    {branchName}
                  </div>
                  {!activeBranchFlag && branchType === "Local Branch" ? (
                    <div className="flex justify-center my-auto text-center items-center align-middle w-1/6">
                      <div
                        className="block mx-auto text-center my-auto justify-center cursor-pointer px-2"
                        title="Will delete only if the branch is clean and safe"
                        onClick={() => {
                          if (!activeBranchFlag) {
                            deleteBranchHandler(branchName, false);
                          }
                        }}
                      >
                        <div
                          className="bg-red-600 mx-4 p-2 cursor-pointer rounded text-center text-white text-xl align-middle items-center hover:bg-red-700 px-4"
                          title="Click to delete branch"
                        >
                          <FontAwesomeIcon
                            icon={["fas", "trash-alt"]}
                          ></FontAwesomeIcon>
                        </div>
                        <div className="font-light text-sm my-2 font-sans text-red-500 border-b border-dashed border-red-700">
                          Normal
                        </div>
                      </div>
                      <div
                        className="block mx-auto text-center my-auto justify-center cursor-pointer px-2"
                        onClick={() => {
                          if (!activeBranchFlag) {
                            deleteBranchHandler(branchName, true);
                          }
                        }}
                      >
                        <div
                          className="bg-red-600 mx-4 p-2 cursor-pointer rounded text-center text-white text-xl align-middle items-center hover:bg-red-700 px-4"
                          title="Click to delete branch"
                        >
                          <FontAwesomeIcon
                            icon={["fas", "minus-square"]}
                          ></FontAwesomeIcon>
                        </div>
                        <div className="font-light text-sm my-2 font-sans text-red-500 border-b border-dashed border-red-700">
                          Force
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {activeBranchFlag ? (
                        <div className="w-1/6 font-sans mx-4 text-sm px-2 font-light bg-blue-200 border border-dashed border-blue-800 rounded-full p-1 my-auto items-center text-center align-middle">
                          Active
                        </div>
                      ) : (
                        <div className="w-1/6 font-sans mx-4 text-sm px-2 font-light bg-orange-200 border border-dashed border-orange-800 rounded-full p-1 my-auto items-center text-center align-middle">
                          Remote
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            };

            if (branch.includes("->") || branch === currentBranch) {
              return null;
            }

            if (!branch.includes("remotes/")) {
              return branchPickerComponent(
                "code-branch",
                "Local Branch",
                branch
              );
            } else {
              const splitBranch = branch.split("/");
              const remoteName = splitBranch[1];
              const remoteBranch = splitBranch
                .slice(2, splitBranch.length)
                .join("/");

              return branchPickerComponent("wifi", remoteName, remoteBranch);
            }
          })}
        {listError
          ? errorComponent("Error occurred while listing branches!")
          : null}

        {switchError
          ? errorComponent("Error occurred while switching to", true)
          : null}

        {switchedBranch && switchSuccess
          ? successComponent("Active branch has been switched to")
          : null}

        {deleteSuccess
          ? successComponent("Selected branch has been removed")
          : null}

        {deleteError
          ? errorComponent("Branch deletion failed for", true)
          : null}
      </div>
    </div>
  );
}
