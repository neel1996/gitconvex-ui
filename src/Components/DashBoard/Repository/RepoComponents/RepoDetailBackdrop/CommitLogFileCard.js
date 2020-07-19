import React, { useState, useEffect } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ROUTE_COMMIT_FILES,
  globalAPIEndpoint,
} from "../../../../../util/env_config";
import axios from "axios";
export default function CommitLogFileCard({
  repoId,
  commitHash,
  unmountHandler,
}) {
  library.add(far, fas);
  const [commitFiles, setCommitFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    const token = axios.CancelToken;
    const source = token.source();

    const payload = JSON.stringify(
      JSON.stringify({ repoId: repoId, commitHash: commitHash })
    );

    axios({
      url: globalAPIEndpoint,
      method: "POST",
      cancelToken: source.token,
      data: {
        query: `
                query GitConvexApi
                {
                    gitConvexApi(route: "${ROUTE_COMMIT_FILES}", payload: ${payload}){
                        gitCommitFiles {
                            type
                            fileName
                        }
                    }
                }
            `,
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.data.data && !res.data.err) {
          setCommitFiles([...res.data.data.gitConvexApi.gitCommitFiles]);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [repoId, commitHash]);
  return (
    <div className="w-11/12 p-6 rounded-lg shadow-sm block justify-center mx-auto my-6 bg-blue-100">
      <div
        className="font-sans right-0 float-right font-light cursor-pointer mx-auto text-blue-400 text-2xl my-0"
        style={{ marginTop: "-20px" }}
        onClick={() => {
          setCommitFiles([]);
          unmountHandler();
        }}
      >
        x
      </div>
      {isLoading ? (
        <div className="mx-4 text-2xl text-gray-700 font-sans font-light text-center">
          Fetching changed files...
        </div>
      ) : null}
      {!isLoading && commitFiles ? (
        <div className="mx-4 text-2xl text-gray-700 font-sans font-light">{`${commitFiles.length} Files changed`}</div>
      ) : null}
      <div className="block w-3/4 my-4 mx-10">
        {commitFiles &&
          commitFiles.map(({ type, fileName }) => {
            let iconSelector = "";
            let colorSelector = "";
            switch (type) {
              case "M":
                iconSelector = "plus-square";
                colorSelector = "text-yellow-600";
                break;
              case "A":
                iconSelector = "plus-square";
                colorSelector = "text-green-500";
                break;
              case "D":
                iconSelector = "minus-square";
                colorSelector = "text-red-500";
                break;
              default:
                iconSelector = "plus-square";
                colorSelector = "text-gray-500";
                break;
            }

            return (
              <div
                className="flex justify-evenly items-center my-auto align-middle"
                key={fileName + commitHash}
              >
                <div className={`w-1/4 text-2xl ${colorSelector}`}>
                  <FontAwesomeIcon
                    icon={["far", iconSelector]}
                  ></FontAwesomeIcon>
                </div>
                <div className="w-3/4 text-sm font-sans font-medium text-gray-700 truncate">
                  {fileName}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
