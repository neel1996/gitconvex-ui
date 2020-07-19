import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import {
  globalAPIEndpoint,
  ROUTE_REPO_COMMIT_LOGS,
} from "../../../../../util/env_config";
import moment from "moment";
import CommitLogFileCard from "./CommitLogFileCard";

export default function RepositoryCommitLogComponent(props) {
  library.add(fab, fas, far);

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

  function fetchCommitFiles(commitHash, arrowTarget) {
    const parentDivId = `commitLogCard-${commitHash}`;
    const targetDivId = `commitFile-${commitHash}`;

    const targetDiv = document.createElement("div");
    targetDiv.id = targetDivId;

    const parentDiv = document.getElementById(parentDivId);
    parentDiv.append(targetDiv);

    const unmountHandler = () => {
      ReactDOM.unmountComponentAtNode(
        document.getElementById("closeBtn-" + commitHash)
      );
      ReactDOM.unmountComponentAtNode(document.getElementById(targetDivId));
      arrowTarget.classList.remove("hidden");
    };

    ReactDOM.render(
      <CommitLogFileCard
        repoId={props.repoId}
        commitHash={commitHash}
        unmountHandler={unmountHandler}
      ></CommitLogFileCard>,
      document.getElementById(targetDivId)
    );

    const closeArrow = (
      <div
        className="text-center mx-auto text-3xl font-sans font-light text-gray-600 items-center align-middle cursor-pointer"
        onClick={(event) => {
          unmountHandler();
        }}
      >
        <FontAwesomeIcon icon={["fas", "angle-up"]}></FontAwesomeIcon>
      </div>
    );

    const closeBtn = document.createElement("div");
    const closeBtnId = "closeBtn-" + commitHash;
    closeBtn.id = closeBtnId;
    parentDiv.append(closeBtn);

    ReactDOM.render(closeArrow, document.getElementById(closeBtnId));
  }

  function fallBackComponent(message) {
    return (
      <div className="p-6 rounded-md shadow-sm block justify-center mx-auto my-auto w-3/4 h-full text-center text-2xl text-indigo-500">
        <div className="flex w-full h-full mx-auto my-auto">
          <div className="my-auto mx-auto bg-white w-full p-6 rounded-lg shadow">{message}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isCommitEmpty ? fallBackComponent("No Commit Logs found") : null}
      {commitLogs &&
        commitLogs.map((commit) => {
          const {
            hash,
            author,
            commitTime,
            commitMessage,
            commitRelativeTime,
            commitFilesCount,
          } = commit;
          const formattedCommitTime = moment(new Date(commitTime)).format(
            "MMM DD, YYYY"
          );
          return (
            <div
              id={`commitLogCard-${hash}`}
              className="p-6 pb-6 rounded-lg shadow-sm block justify-center mx-auto my-4 bg-white xl:w-3/4 lg:w-5/6 md:w-11/12 sm:w-11/12 w-full border-b-8 border-indigo-400"
              key={hash}
            >
              <div className="flex justify-between text-indigo-500">
                <div className="text-2xl font-sans mx-auto">
                  <FontAwesomeIcon
                    icon={["fas", "calendar-alt"]}
                  ></FontAwesomeIcon>
                  <span className="mx-2 border-b-2 border-dashed">
                    {formattedCommitTime}
                  </span>
                </div>
                <div className="p-1 h-auto border-r"></div>
                <div className="text-2xl font-sans mx-auto">
                  <FontAwesomeIcon
                    icon={["fab", "slack-hash"]}
                  ></FontAwesomeIcon>
                  <span className="mx-2 border-b-2 border-dashed">{hash}</span>
                </div>
                <div className="p-1 h-auto border-r"></div>
                <div className="text-2xl font-sans mx-auto">
                  <FontAwesomeIcon
                    icon={["fas", "user-ninja"]}
                  ></FontAwesomeIcon>
                  <span className="mx-2 border-b-2 border-dashed truncate">
                    {author}
                  </span>
                </div>
              </div>

              <div className="p-3 my-4 text-2xl font-semibold text-gray-600 font-sans flex justify-evenly items-center">
                <div className="w-1/8">
                  <FontAwesomeIcon
                    icon={["fas", "code"]}
                    className="text-3xl"
                  ></FontAwesomeIcon>
                </div>
                <div className="w-5/6 mx-3">{commitMessage}</div>
              </div>

              <div className="w-11/12 flex justify-between mx-auto mt-4 text-xl text-gray-600">
                <div className="w-1/3 flex justify-center my-auto items-center align-middle">
                  <div>
                    <FontAwesomeIcon icon={["far", "clock"]}></FontAwesomeIcon>
                  </div>
                  <div className="mx-2 border-dashed border-b-4">
                    {commitRelativeTime}
                  </div>
                </div>
                <div
                  className="w-1/3 flex justify-around my-auto text-3xl font-sans font-light text-gray-600 items-center align-middle cursor-pointer pt-10"
                  onClick={(event) => {
                    if (commitFilesCount) {
                      event.currentTarget.classList.add("hidden");
                      fetchCommitFiles(hash, event.currentTarget);
                    }
                  }}
                >
                  {commitFilesCount ? (
                    <FontAwesomeIcon
                      icon={["fas", "angle-down"]}
                    ></FontAwesomeIcon>
                  ) : (
                    <FontAwesomeIcon
                      icon={["fas", "dot-circle"]}
                      className="text-xl text-gray-200"
                    ></FontAwesomeIcon>
                  )}
                </div>
                <div className="w-1/3 flex justify-center my-auto items-center align-middle">
                  <div>
                    <FontAwesomeIcon
                      icon={["far", "plus-square"]}
                    ></FontAwesomeIcon>
                  </div>
                  <div className="mx-2 border-dashed border-b-4">
                    {commitFilesCount ? (
                      `${commitFilesCount} Files`
                    ) : (
                      <span className="text-gray-500">No Changed Files</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      {!isCommitEmpty && commitLogs.length === 0
        ? fallBackComponent("Loading commits...")
        : null}
    </>
  );
}
