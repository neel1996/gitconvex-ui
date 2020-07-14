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

  useEffect(() => {
    axios({
      url: globalAPIEndpoint,
      method: "POST",
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
  }, [repoId, payload]);

  function switchBranchHandler(branchName) {
    setListError(false);
    setSwitchError(false);
    setSwitchedBranch("");

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
        }
      })
      .catch((err) => {
        if (err) {
          setSwitchError(true);
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

  return (
    <div className="bg-gray-200 p-6 w-11/12 xl:w-3/4 mx-auto my-auto items-center align-middle lg:w-3/4 md:w-11/12 sm:w-11/12 rounded shadow">
      <div className="font-sans mx-4 p-2 text-4xl font-semibold border-b-2 border-dashed text-gray-800">
        Available Branches
      </div>
      <div className="my-4 mx-10">
        {!listError &&
          branchList &&
          branchList.map((branch) => {
            branch = branch.replace(/\s/gi, "");

            const branchPickerComponent = (icon, branchType, branchName) => {
              let activeSwitchStyle = "";
              if (switchedBranch === branchName) {
                activeSwitchStyle = "border-dashed border-b-2 text-indigo-500";
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
                    className={`w-3/4 text-lg font-sans font-semibold text-left text-gray-700 hover:text-blue-700 cursor-pointer ${activeSwitchStyle}`}
                    onClick={() => {
                      switchBranchHandler(branchName);
                    }}
                  >
                    {branchName}
                  </div>
                  <div
                    className="bg-red-600 mx-4 cursor-pointer rounded w-1/6 text-center text-white text-3xl align-middle items-center hover:bg-red-700"
                    title="Click to delete branch"
                  >
                    <FontAwesomeIcon
                      icon={["fas", "window-close"]}
                    ></FontAwesomeIcon>
                  </div>
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
              const remoteBranch = splitBranch.slice(2, splitBranch.length);

              return branchPickerComponent("wifi", remoteName, remoteBranch);
            }
          })}
        {listError
          ? errorComponent("Error occurred while listing branches!")
          : null}

        {switchError
          ? errorComponent("Error occurred while switching to", true)
          : null}

        {switchedBranch && switchSuccess ? (
          <div className="text-center p-4 rounded bg-green-300 text-xl font-sans mt-10">
            Active branch has been switched to{" "}
            <span className="font-semibold border-b border-dashed mx-2">
              {switchedBranch}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
