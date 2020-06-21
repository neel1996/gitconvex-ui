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

  const commitRef = useRef();

  useEffect(() => {
    const payload = JSON.stringify(JSON.stringify({ repoId: repoId }));
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
        if (res.data.data && !res.data.error) {
          setCommitDone(true);
        } else {
          setCommitError(true);
        }
      })
      .catch((err) => {
        console.log(err);
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
                <div className="my-2 mx-auto text-center p-2 rounded shadow bg-red-200 borrder-red-400 text-red-800">
                  Commit Failed!
                </div>
              ) : null}
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
            </div>
          ) : (
            <div className="mx-auto my-2 p-3 bg-green-300 text-green-800 rounded- shadow">
              All changes are committed!
            </div>
          )}
        </>
      );
    }
  }

  return (
    <div className="w-1/2 mx-auto my-auto bg-gray-200 p-6 rounded-md">
      {stagedFilesState && stagedFilesState.length > 0 ? (
        commitComponent()
      ) : (
        <div className="bg-orange-200 rounded-md shadow-md p-4 text-2xl font-sans text-center font-bold text-orange-700">
          {loading ? (
            <span>Loading Commits...</span>
          ) : (
            <span>No Staged files to commit</span>
          )}
        </div>
      )}
    </div>
  );
}
