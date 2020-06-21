import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  globalAPIEndpoint,
  ROUTE_REPO_DETAILS,
  GIT_UNPUSHED_COMMITS,
} from "../../../../../util/env_config";

export default function PushComponent(props) {
  const { repoId } = props;

  const payload = JSON.stringify(JSON.stringify({ repoId: repoId }));

  const [remoteData, setRemoteData] = useState();
  const [isRemoteSet, setIsRemoteSet] = useState(false);
  const [isBranchSet, setIsBranchSet] = useState(false);
  const [unpushedCommits, setUnpushedCommits] = useState([]);
  const [isCommitEmpty, setIsCommitEmpty] = useState(false);

  useEffect(() => {
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

  return (
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
            {unpushedCommits.map((commits, index) => {
              return (
                <div
                  key={`unpushed-commit-${index}`}
                  className="text-md text-gray-700"
                >
                  {commits}
                </div>
              );
            })}
          </div>
        ) : (
          <div></div>
        )}

        {isRemoteSet && isBranchSet && unpushedCommits.length > 0 ? (
          <div className="my-4 text-center bg-indigo-400 rounded shadow text-white text-xl font-sans p-2 mx-auto hover:bg-indigo-600 cursor-pointer">
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
      </div>
    </>
  );
}
