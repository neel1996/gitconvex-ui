import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  globalAPIEndpoint,
  ROUTE_GIT_STAGED_FILES,
} from "../../../../../util/env_config";

export default function CommitComponent(props) {
  const { repoId } = props;

  const [loading, setLoading] = useState(true);
  const [stagedFilesState, setStagedFilesState] = useState([]);
  const [commitDone, setCommitDone] = useState(false);
  const [commitError, setCommitError] = useState(false);
  const [loadingCommit, setLoadingCommit] = useState(false);

  const commitRef = useRef();

  useEffect(() => {
    setLoading(true);

    const payload = JSON.stringify(JSON.stringify({ repoId: props.repoId }));
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    axios({
      url: globalAPIEndpoint,
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      cancelToken: source.token,
      data: {
        query: `
            query GitConvexApi{
              gitConvexApi(route: "${ROUTE_GIT_STAGED_FILES}", payload:${payload})
              {
                gitStagedFiles{
                    stagedFiles
                }
              }
            }
          `,
      },
    })
      .then((res) => {
        const { stagedFiles } = res.data.data.gitConvexApi.gitStagedFiles;
        setLoading(false);

        if (stagedFiles && stagedFiles.length > 0) {
          setStagedFilesState([...stagedFiles]);
        }
      })
      .catch((err) => {
        setLoading(false);
      });

    return () => {
      source.cancel();
    };
  }, [props]);

  function commitHandler(commitMsg) {
    setLoadingCommit(true);
    commitMsg = commitMsg.replace(/"/gi, '\\"');
    if (commitMsg.split("\n") && commitMsg.split("\n").length > 0) {
      commitMsg = commitMsg.toString().split("\n").join("||");
    }

    axios({
      url: globalAPIEndpoint,
      method: "POST",
      data: {
        query: `
          mutation GitConvexMutation{
            commitChanges(repoId: "${repoId}", commitMessage: "${commitMsg}")
          }
        `,
      },
    })
      .then((res) => {
        setLoadingCommit(false);

        if (
          res.data.data &&
          !res.data.error &&
          res.data.data.commitChanges === "COMMIT_DONE"
        ) {
          setCommitDone(true);
        } else {
          setCommitError(true);
        }
      })
      .catch((err) => {
        setLoadingCommit(false);
        setCommitError(true);
      });
  }

  function commitComponent() {
    if (stagedFilesState && stagedFilesState.length > 0) {
      const stagedCount = stagedFilesState.length;

      return (
        <>
          {!commitDone ? (
            <div className="p-3 mx-auto w-5/6 block justify-center">
              <div className="text-2xl my-2 font-sans font-semibold">
                {stagedCount} Changes to commit...
              </div>
              <div className="overflow-auto" style={{ height: "300px" }}>
                {stagedFilesState.map((stagedFile) => {
                  return (
                    <div
                      className="m-1 mx-auto w-11/12 break-all border-b text-left font-sans text-gray-700"
                      key={stagedFile}
                    >
                      {stagedFile}
                    </div>
                  );
                })}
              </div>
              <div className="text-xl my-4">Commit Message</div>
              <textarea
                className="p-2 rounded-md shadow-md text-gray-900 font-sans w-full outline-none"
                placeholder="Enter commit message"
                cols="20"
                rows="5"
                ref={commitRef}
              ></textarea>
              {commitError ? (
                <div className="my-2 mx-auto text-center p-2 rounded shadow bg-red-200 border-red-400 text-red-800">
                  Commit Failed!
                </div>
              ) : null}
              {loadingCommit ? (
                <div className="my-4 p-2 text-center mx-auto text-xl bg-gray-400 hover:bg-gray-700 rounded shadow w-full cursor-pointer text-white">
                  Committing Changes...
                </div>
              ) : (
                <div
                  className="my-4 p-2 text-center mx-auto text-xl bg-green-400 hover:bg-green-700 rounded shadow w-full cursor-pointer text-white"
                  onClick={(event) => {
                    const commitMsg = commitRef.current.value;

                    if (commitMsg) {
                      commitHandler(commitMsg);
                    } else {
                      alert("Commit message can't be empty");
                    }
                  }}
                >
                  Commit Changes
                </div>
              )}
            </div>
          ) : (
            <div className="mx-auto my-2 p-3 bg-green-200 text-green-800 rounded-md shadow text-xl font-sans font-semibold text-center border-b-4 border-dashed border-green-300">
              All changes are committed!
            </div>
          )}
        </>
      );
    }
  }

  return (
    <div className="w-3/4 mx-auto my-auto bg-gray-200 p-6 rounded-md">
      {stagedFilesState && stagedFilesState.length > 0 ? (
        commitComponent()
      ) : (
        <div className="bg-orange-200 border-b-4 border-orange-400 border-dashed rounded-lg shadow-md p-6 text-3xl font-sans text-center font-light text-orange-700">
          {loading ? (
            <span>Loading staged files to commit...</span>
          ) : stagedFilesState.length === 0 ? (
            <span>No Staged files to commit</span>
          ) : (
            <span>Loading...</span>
          )}
        </div>
      )}
    </div>
  );
}
