import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  globalAPIEndpoint,
  ROUTE_REPO_DETAILS,
  GIT_UNPUSHED_COMMITS,
} from "../../../../../util/env_config";

export default function PushComponent(props) {
  const { repoId } = props;

  const [remoteData, setRemoteData] = useState();
  const [isRemoteSet, setIsRemoteSet] = useState(false);
  const [isBranchSet, setIsBranchSet] = useState(false);
  const [unpushedCommits, setUnpushedCommits] = useState([]);
  const [isCommitEmpty, setIsCommitEmpty] = useState(false);

  const [pushDone, setPushDone] = useState(false);
  const [pushFailed, setPushFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  const remoteRef = useRef();
  const branchRef = useRef();

  useEffect(() => {
    let payload = JSON.stringify(JSON.stringify({ repoId: props.repoId }));

    axios({
      url: globalAPIEndpoint,
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
                      gitCurrentBranch
                      gitRemoteHost
                      gitBranchList 
                    }
                  }
                }
              `,
      },
    })
      .then((res) => {
        const repoDetails = res.data.data.gitConvexApi.gitRepoStatus;
        setRemoteData(repoDetails);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props]);

  function getUnpushedCommits() {
    let payload = JSON.stringify(JSON.stringify({ repoId: props.repoId }));

    axios({
      url: globalAPIEndpoint,
      method: "POST",
      data: {
        query: `
          query GitConvexApi
          {
            gitConvexApi(route: "${GIT_UNPUSHED_COMMITS}", payload: ${payload}){
              gitUnpushedCommits{
                commits
              }
            }
          }
        `,
      },
    })
      .then((res) => {
        if (res.data.data && !res.data.error) {
          const { commits } = res.data.data.gitConvexApi.gitUnpushedCommits;
          if (commits.length === 0) {
            setIsCommitEmpty(true);
          }
          setUnpushedCommits([...commits]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function remoteHostGenerator() {
    if (remoteData) {
      const { gitRemoteData } = remoteData;
      if (gitRemoteData.includes("||")) {
        return gitRemoteData.split("||").map((item) => {
          console.log(item);
          return (
            <option value={item} key={item}>
              {item}
            </option>
          );
        });
      } else {
        return <option>{gitRemoteData}</option>;
      }
    }
  }

  function branchListGenerator() {
    if (remoteData) {
      const { gitBranchList } = remoteData;

      return gitBranchList.map((branch) => {
        return (
          <option value={branch} key={branch}>
            {branch}
          </option>
        );
      });
    }
  }

  function commitModel(commit) {
    const modelLabel = [
      "Commit Hash",
      "Commit Author",
      "Commit Timestamp",
      "Commit Message",
    ];
    const splitCommit = commit.split("||");

    const localModelFormat = (left, right) => {
      return (
        <div className="flex justify-evenly">
          <div className="font-sans text-gray-900 font-bold mx-2 w-1/4 break-words">
            {left}
          </div>
          <div className="font-sans text-gray-800 mx-2 w-1/2 break-words">
            {right}
          </div>
        </div>
      );
    };

    return (
      <div className="block justify-evenly border shadow rounded p-2">
        {modelLabel.map((label, index) => {
          return localModelFormat(label, splitCommit[index]);
        })}
      </div>
    );
  }

  function pushHandler(remote, branch) {
    setLoading(true);
    axios({
      url: globalAPIEndpoint,
      method: "POST",
      data: {
        query: `
          mutation GitConvexMutation{
            pushToRemote(repoId: "${repoId}", remoteHost: "${remote}", branch: "${branch}")
          }
        `,
      },
    })
      .then((res) => {
        if (res.data.data && !res.data.error) {
          setPushDone(true);
          setLoading(false);
        } else {
          setPushFailed(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        setPushFailed(true);
        setLoading(false);
      });
  }

  return (
    <>
      {!pushDone ? (
        <>
          <div className="w-1/2 mx-auto my-auto p-6 rounded shadow bg-white block">
            <div className="m-3 text-2xl font-sans text-ghray-800">
              Available remote repos
            </div>
            <div>
              <select
                className="border p-3 my-4 text-xl rounded shadow"
                defaultValue="checked"
                onChange={() => {
                  setIsRemoteSet(true);
                }}
                ref={remoteRef}
              >
                <option disabled hidden value="checked">
                  Select the remote repo
                </option>
                {remoteData ? remoteHostGenerator() : null}
              </select>
            </div>

            {isRemoteSet ? (
              <div>
                <select
                  className="border p-3 my-4 text-xl rounded shadow"
                  defaultValue="checked"
                  onChange={() => {
                    setIsBranchSet(true);
                    getUnpushedCommits();
                  }}
                  ref={branchRef}
                >
                  <option disabled hidden value="checked">
                    Select upstream branch
                  </option>
                  {remoteData ? branchListGenerator() : null}
                </select>
              </div>
            ) : null}

            {unpushedCommits && unpushedCommits.length > 0 ? (
              <div className="my-2 p-3 rounded bg-gray-300 shadow-md border-gray-100">
                <div className="my-2 font-sans text-2xl font-semibold">
                  Commits to be pushed
                </div>
                <div className="overflow-auto" style={{ height: "200px" }}>
                  {unpushedCommits.map((commits, index) => {
                    return (
                      <div
                        key={`unpushed-commit-${index}`}
                        className="my-2 border-b-2 block justify-evenly mx-auto"
                      >
                        {commitModel(commits)}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div></div>
            )}

            {pushFailed ? (
              <>
                <div className="my-2 mx-auto text-center p-2 rounded shadow bg-red-200 border-red-400 text-red-800">
                  Push Failed!
                </div>
              </>
            ) : null}

            {isRemoteSet &&
            isBranchSet &&
            unpushedCommits.length > 0 &&
            !loading ? (
              <div
                className="my-4 text-center bg-indigo-400 rounded shadow text-white text-xl font-sans p-2 mx-auto hover:bg-indigo-600 cursor-pointer"
                onClick={() => {
                  const remoteHost = remoteRef.current.value;
                  const branchName = branchRef.current.value;

                  if (remoteHost && branchName) {
                    pushHandler(remoteHost, branchName);
                  }
                }}
              >
                Push changes
              </div>
            ) : (
              <>
                {isCommitEmpty ? (
                  <div className="my-4 text-center bg-gray-500 rounded shadow text-white text-xl font-sans p-2 mx-auto hover:bg-gray-600 cursor-pointer">
                    No Commits to Push
                  </div>
                ) : null}
              </>
            )}
            <>
              {loading ? (
                <div className="my-4 text-center border border-orange-800 text-orange-900 bg-orange-300 rounded shadow text-white text-xl font-sans p-2 mx-auto cursor-pointer">
                  Pushing to remote...
                </div>
              ) : null}
            </>
          </div>
        </>
      ) : (
        <div className="w-1/2 mx-auto my-auto p-6 rounded shadow bg-white block">
          <div className="mx-auto my-2 p-3 bg-green-300 text-green-800 rounded shadow">
            All commits are pushed to remote
          </div>
        </div>
      )}
    </>
  );
}
