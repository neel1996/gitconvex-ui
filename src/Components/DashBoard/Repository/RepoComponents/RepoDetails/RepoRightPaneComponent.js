import React from "react";
import { v4 as uuid } from "uuid";
import { actionType } from "./backdropActionType";

export default function RepoRightPaneComponent(props) {
  const {
    gitBranchList,
    gitCurrentBranch,
    gitLatestCommit,
    gitTotalCommits,
    actionTrigger,
    switchBranchHandler,
  } = props;

  return (
    <>
      {props.received ? (
        <div className="block rounded-md xl:w-1/2 lg:w-3/4 md:w-11/12 sm:w-11/12 w-11/12 shadow-sm border-2 border-dotted border-gray-400 p-1 my-6 mx-auto">
          <div className="block mx-auto my-2">
            <div className="flex justify-around my-3">
              <div className="text-lg text-gray-500 w-1/4">Total Commits</div>
              <div className="text-left text-md text-bold text-black-800 w-1/2">
                {`${gitTotalCommits} Commits`}
              </div>
            </div>

            <div className="flex justify-around my-3">
              <div className="text-lg text-gray-500 w-1/4">Latest Commit</div>
              <div className="text-left text-sm text-bold text-black-900 w-1/2 truncate ...">
                {gitLatestCommit}
              </div>
            </div>

            <div className="flex justify-around mx-auto my-2 align-middle items-center">
              <div className="text-lg text-gray-500 w-1/4">
                Available Branches
              </div>

              <div className="w-1/2 flex justify-evenly align-middle items-center">
                <div className="w-3/4 my-auto">
                  {gitBranchList &&
                    gitCurrentBranch &&
                    gitBranchList
                      .slice(0, 3)
                      .map((entry) => {
                        if (entry) {
                          return entry === gitCurrentBranch ? (
                            <div
                              className="text-lg font-semibold text-indigo-500 my-1 border-b border-dotted cursor-pointer hover:border-dashed hover:text-indigo-600"
                              key={`${entry}-${uuid()}`}
                            >
                              {entry}
                            </div>
                          ) : (
                            <div
                              className="text-md my-1 font-sans font-semibold my-2 border-b border-dotted cursor-pointer hover:border-dashed hover:text-indigo-400"
                              key={`entry-key-${uuid()}`}
                              onClick={() => {
                                switchBranchHandler(entry);
                                actionTrigger(actionType.SWITCH_BRANCH);
                              }}
                            >
                              {entry}
                            </div>
                          );
                        }
                        return null;
                      })
                      .filter((item) => {
                        if (item) {
                          return item;
                        }
                        return false;
                      })}
                  <div
                    className="border-b border-dashed font-sans text-blue-500 cursor-pointer hover:text-blue-800 my-2 text-center my-auto"
                    onClick={() => {
                      actionTrigger(actionType.LIST_BRANCH);
                    }}
                  >
                    List all branches
                  </div>
                </div>
                <div
                  id="addBranch"
                  className="rounded-full items-center align-middle w-10 h-10 text-white text-2xl bg-green-400 text-center mx-auto shadow hover:bg-green-500 cursor-pointer"
                  onMouseEnter={(event) => {
                    let popUp =
                      '<div class="p-2 rounded bg-white text-gray-700 w-32 text-center border border-gray-300 text-sm my-2 relative" style="margin-left:-40px;">Click to add a new branch</div>';
                    event.target.innerHTML += popUp;
                  }}
                  onMouseLeave={(event) => {
                    event.target.innerHTML = "+";
                  }}
                  onClick={() => {
                    actionTrigger(actionType.ADD_BRANCH);
                  }}
                >
                  +
                </div>
              </div>
            </div>

            <div className="flex justify-around mx-auto mt-4">
              <div
                className="w-1/3 rounded text-center cursor-pointer p-2 bg-indigo-500 hover:bg-indigo-600 text-white font-sans nowrap"
                onClick={() => {
                  actionTrigger(actionType.FETCH);
                }}
              >
                Fetch from remote
              </div>
              <div
                className="w-1/3 text-center cursor-pointer rounded text-white p-2 bg-blue-500 hover:bg-blue-600 font-sans"
                onClick={() => {
                  actionTrigger(actionType.PULL);
                }}
              >
                Pull from remote
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
