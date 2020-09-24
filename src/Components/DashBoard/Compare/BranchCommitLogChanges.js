import React, { useEffect, useState } from "react";
import axios from "axios";
import { globalAPIEndpoint, BRANCH_COMPARE } from "../../../util/env_config";

export default function BranchCommitLogChanges(props) {
  const { repoId, baseBranch, compareBranch } = props;

  const [commitLogs, setCommitLogs] = useState([]);

  useEffect(() => {
    const payload = JSON.stringify(
      JSON.stringify({
        repoId: repoId,
        baseBranch: baseBranch,
        compareBranch: compareBranch,
      })
    );

    axios({
      url: globalAPIEndpoint,
      method: "POST",
      data: {
        query: `
          query GitConvexApi {
            gitConvexApi(route: "${BRANCH_COMPARE}", payload: ${payload}) {
              branchCompare {
                date
                commits{
                  hash
                  author
                  commitMessage
                }
              }
            }
          }
        `,
      },
    }).then((res) => {
      if (res.data.data) {
        const { branchCompare } = res.data.data.gitConvexApi;
        setCommitLogs([...branchCompare]);
      }
    });
  }, [repoId, baseBranch, compareBranch]);

  return (
    <div className="mx-auto my-10 p-6 block w-11/12 overflow-auto">
      {commitLogs &&
        commitLogs.map((commit) => {
          return (
            <div className="my-2 border-b p-3 border rounded">
              <div className="text-xl font-sans font-semibold text-gray-800 border-b">
                Committed on - {commit.date}
              </div>
              <div>
                {commit.commits.map((item) => {
                  return (
                    <div className="flex p-3 justify-between items-center mx-auto border-b w-full">
                      <div className="p-2 font-sans font-light text-gray-800">
                        {item.commitMessage}
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
        })}
    </div>
  );
}
