import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  globalAPIEndpoint,
  ROUTE_REPO_COMMIT_LOGS,
} from "../../../../util/env_config";

export default function RepositoryCommitLogComponent(props) {
  library.add(fab, fas);

  const [commitLogs, setCommitLogs] = useState([]);
  const [isCommitEmpty, setIsCommitEmpty] = useState(false);

  useEffect(() => {
    const payload = JSON.stringify(JSON.stringify({ repoId: props.repoId }));

    axios({
      url: globalAPIEndpoint,
      method: "POST",
      data: {
        query: `
        query GitConvexApi
        {
            gitConvexApi(route: "${ROUTE_REPO_COMMIT_LOGS}", payload: ${payload}){
                gitCommitLogs {
                    commits{
                        commitTime
                        hash
                        author
                        commitMessage
                    }  
                }
            }
        }
        `,
      },
    })
      .then((res) => {
        const commits = res.data.data.gitConvexApi.gitCommitLogs.commits;
        if (commits && commits.length > 0) {
          setCommitLogs(commits);
        } else {
          setIsCommitEmpty(true);
        }
      })
      .catch((err) => {
        if (err) {
          setIsCommitEmpty(true);
          console.log(err);
        }
      });
  }, [props]);

  return (
    <>
      {isCommitEmpty ? (
        <div className="p-3 rounded-md shadow-sm block justify-center mx-auto my-4 bg-white w-3/4 text-center">
          No Commit Logs found
        </div>
      ) : null}
      {commitLogs &&
        commitLogs.map((commit) => {
          const { hash, author, commitTime, commitMessage } = commit;
          return (
            <div
              className="p-3 pb-6 rounded-md shadow-sm block justify-center mx-auto my-4 bg-white w-full border-b-4 border-blue-400"
              key={hash}
            >
              <div className="p-2 text-2xl font-sans text-left">
                <FontAwesomeIcon
                  icon={["fas", "calendar-alt"]}
                ></FontAwesomeIcon>
                <span className="mx-2">{commitTime}</span>
              </div>
              <div className="p-3 m-3 text-xl text-gray-700 font-sans">
                {commitMessage}
              </div>

              <div className="flex justify-center text-center">
                <div className="rounded-l p-2 shadow-sm bg-indigo-200 text-xl font-sans ont-semibold text-indigo-900 w-1/2">
                  <FontAwesomeIcon
                    icon={["fab", "slack-hash"]}
                  ></FontAwesomeIcon>
                  <span className="mx-2">{hash}</span>
                </div>
                <div className="rounded-r p-2 shadow-sm bg-indigo-200 text-xl font-sans ont-semibold text-indigo-900 w-1/2">
                  <FontAwesomeIcon icon={["fas", "at"]}></FontAwesomeIcon>
                  <span className="mx-2">{author}</span>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
}
