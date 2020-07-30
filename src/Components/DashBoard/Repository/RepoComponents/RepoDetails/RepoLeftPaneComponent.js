import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { actionType } from "./backdropActionType";
import React, { useEffect } from "react";

export default function RepoLeftPaneComponent(props) {
  library.add(fab, fas);

  let {
    gitRemoteHost,
    gitRemoteData,
    isMultiRemote,
    multiRemoteCount,
    showCommitLogsView,
    actionTrigger,
  } = props;

  useEffect(() => {}, [props]);

  const getRemoteLogo = () => {
    let remoteLogo = "";
    if (gitRemoteHost.match(/github/i)) {
      remoteLogo = (
        <FontAwesomeIcon
          icon={["fab", "github"]}
          className="text-4xl text-center text-pink-500"
        ></FontAwesomeIcon>
      );
    } else if (gitRemoteHost.match(/gitlab/i)) {
      remoteLogo = (
        <FontAwesomeIcon
          icon={["fab", "gitlab"]}
          className="text-4xl text-center text-pink-400"
        ></FontAwesomeIcon>
      );
    } else if (gitRemoteHost.match(/bitbucket/i)) {
      remoteLogo = (
        <FontAwesomeIcon
          icon={["fab", "bitbucket"]}
          className="text-4xl text-center text-pink-400"
        ></FontAwesomeIcon>
      );
    } else if (gitRemoteHost.match(/codecommit/i)) {
      remoteLogo = (
        <FontAwesomeIcon
          icon={["fab", "aws"]}
          className="text-4xl text-center text-pink-400"
        ></FontAwesomeIcon>
      );
    } else {
      remoteLogo = (
        <FontAwesomeIcon
          icon={["fab", "git-square"]}
          className="text-4xl text-center text-pink-400"
        ></FontAwesomeIcon>
      );
    }

    return remoteLogo;
  };

  return (
    <>
      {props.received ? (
        <div className="block rounded-md xl:w-1/2 lg:w-3/4 md:w-11/12 sm:w-11/12 w-11/12 shadow-sm border-2 border-dotted border-gray-400 p-1 my-6 mx-auto">
          <div className="block mx-auto my-6">
            <div className="flex justify-evenly items-center">
              <div className="text-lg text-gray-600 w-1/4">Remote Host</div>
              <div className="flex justify-around items-center align-middle w-1/2">
                <div className="w-3/4 flex cursor-pointer justify-center p-4 rounded-md shadow-md border border-dashed my-auto items-center align-middle">
                  {gitRemoteHost ? (
                    <div className="mx-2">{getRemoteLogo()}</div>
                  ) : null}
                  <div className="text-xl text-gray-800 border-b border-dashed border-gray-400 w-3/4 text-center">
                    {gitRemoteHost}
                  </div>
                </div>
                <div className="w-1/4">
                  <div
                    id="addRemote"
                    className="rounded-full items-center align-middle w-10 h-10 text-white text-2xl bg-indigo-400 text-center mx-auto shadow hover:bg-indigo-500 cursor-pointer"
                    onMouseEnter={(event) => {
                      let popUp =
                        '<div class="p-2 rounded bg-white text-gray-700 w-32 text-center border border-gray-300 text-sm my-2 relative" style="margin-left:-40px;">Click to add a new remote repo</div>';
                      event.target.innerHTML += popUp;
                    }}
                    onMouseLeave={(event) => {
                      event.target.innerHTML = "+";
                    }}
                    onClick={() => {
                      actionTrigger(actionType.ADD_REMOTE_REPO);
                    }}
                  >
                    +
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-evenly my-4">
              <div className="text-lg text-gray-600 w-1/4">
                {`${gitRemoteHost} URL`}
              </div>
              <div className="text-blue-400 hover:text-blue-500 cursor-pointer w-1/2 break-words">
                {gitRemoteData}
              </div>
            </div>

            {isMultiRemote ? (
              <div className="flex justify-evenly my-2">
                <div className="font-sans text-gray-800 font-semibold w-1/4 border-dotted border-b-2 border-gray-200">
                  Entry truncated!
                </div>
                <div className="w-1/2 border-dotted border-b-2 border-gray-200">
                  {`Remote repos : ${multiRemoteCount}`}
                </div>
              </div>
            ) : null}
          </div>

          <div className="block mx-auto my-6">
            <div className="flex justify-evenly my-3">
              <div className="w-1/4 text-md text-gray-600">Commit Logs</div>
              <div
                className="w-1/2 rounded-md shadow-md p-3 text-center bg-orange-300 cursor-pointer"
                onClick={(event) => {
                  showCommitLogsView();
                }}
              >
                Show Commit Logs
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
