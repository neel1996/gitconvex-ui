import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ROUTE_REPO_COMMIT_LOGS,
  globalAPIEndpoint,
} from "../../../../util/env_config";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CommitCompareComponent(props) {
  library.add(fas);

  const [skipCount, setSkipCount] = useState(0);
  const [commitData, setCommitData] = useState([]);
  const [totalCommits, setTotalCommits] = useState(0);

  useEffect(() => {
    const payload = JSON.stringify(
      JSON.stringify({ repoId: props.repoId, skipLimit: skipCount })
    );

    axios({
      url: globalAPIEndpoint,
      method: "POST",
      data: {
        query: `
            query GitConvexApi
            {
                gitConvexApi(route: "${ROUTE_REPO_COMMIT_LOGS}", payload: ${payload}){
                    gitCommitLogs {
                        totalCommits
                        commits{
                            commitTime
                            hash
                            author
                            commitMessage
                            commitRelativeTime
                            commitFilesCount
                        }  
                    }
                }
            }
            `,
      },
    })
      .then((res) => {
        if (res.data.data) {
          const { commits } = res.data.data.gitConvexApi.gitCommitLogs;
          const totalCommitCount =
            res.data.data.gitConvexApi.gitCommitLogs.totalCommits;
          if (totalCommits === 0) {
            setTotalCommits(totalCommitCount);
          }

          setCommitData([...commitData, ...commits]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.repoId, skipCount]);

  return (
    <div>
      {commitData.length === 0 ? (
        <div className="text-3xl text-center font-sans text-gray-300">
          Loading Commits...
        </div>
      ) : null}
      <div className="w-1/4 mx-auto">
        {commitData.map((item) => {
          return (
            <div
              className="flex p-3 justify-between items-center mx-auto border-b w-full"
              key={item.hash}
            >
              <div className="block p-2 font-sans font-light text-gray-800">
                <div>{item.commitMessage}</div>
                <div className="flex items-center gap-4 my-2 align-middle">
                  <div>
                    <FontAwesomeIcon
                      icon={["fas", "user-alt"]}
                      className="text-indigo-500"
                    ></FontAwesomeIcon>
                  </div>
                  <div className="font-semibold font-sans">
                    {item.author}
                  </div>
                </div>
              </div>
              <div className="shadow border rounded p-2 bg-indigo-100 font-mono font-semibold text-indigo-800">
                #{item.hash}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
