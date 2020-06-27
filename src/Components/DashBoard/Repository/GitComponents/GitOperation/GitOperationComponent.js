import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  globalAPIEndpoint,
  ROUTE_REPO_TRACKED_DIFF,
  ROUTE_GIT_STAGED_FILES,
} from "../../../../../util/env_config";
import CommitComponent from "./CommitComponent";
import PushComponent from "./PushComponent";
import StageComponent from "./StageComponent";

export default function GitOperationComponent(props) {
  library.add(fab);
  const { repoId } = props;

  const [gitTrackedFiles, setGitTrackedFiles] = useState([]);
  const [gitUntrackedFiles, setGitUntrackedFiles] = useState([]);

  const [action, setAction] = useState("");
  const [list, setList] = useState([]);
  const [viewReload, setViewReload] = useState(0);
  const [currentStageItem, setCurrensStageitem] = useState("");
  const [stageItems, setStagedItems] = useState([]);

  useEffect(() => {
    const payload = JSON.stringify(
      JSON.stringify({
        repoId: props.repoId,
      })
    );

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
              gitConvexApi(route: "${ROUTE_REPO_TRACKED_DIFF}", payload:${payload})
              {
                gitChanges{
                  gitUntrackedFiles
                  gitChangedFiles
                }
              }
            }
        `,
      },
    })
      .then((res) => {
        if (res.data.data) {
          var apiData = res.data.data.gitConvexApi.gitChanges;

          setGitTrackedFiles([...apiData.gitChangedFiles]);
          setGitUntrackedFiles([...apiData.gitUntrackedFiles]);

          const apiTrackedFiles = [...apiData.gitChangedFiles];
          const apiUnTrackedFiles = [...apiData.gitUntrackedFiles];

          let componentList = [];

          apiTrackedFiles &&
            apiTrackedFiles.forEach((item) => {
              if (item.split(",").length > 0) {
                const trackedItem = item.split(",")[1];
                componentList.push(trackedItem);
              }
            });

          apiUnTrackedFiles &&
            apiUnTrackedFiles.forEach((item) => {
              if (item) {
                item = item.replace("NO_DIR", "");
                item.split(",")
                  ? componentList.push(item.split(",").join(""))
                  : componentList.push(item);
              }
            });

          setList([...componentList]);
        }
      })
      .catch((err) => {
        // console.log(err);
      });

    return () => {
      source.cancel();
    };
  }, [props, viewReload, currentStageItem]);

  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    const payload = JSON.stringify(
      JSON.stringify({
        repoId: props.repoId,
      })
    );
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

        if (stagedFiles && stagedFiles.length > 0) {
          setStagedItems([...stagedFiles]);
        }
      })
      .catch((err) => {});

    return () => {
      return source.cancel();
    };
  }, [list, props.repoId, viewReload]);

  const actionButtons = [
    {
      label: "Stage all changes",
      color: "blue",
      key: "stage",
    },
    {
      label: "Commit Changes",
      color: "green",
      key: "commit",
    },
    {
      label: "Push to remote",
      color: "pink",
      key: "push",
    },
  ];

  const tableColumns = ["Changes", "File Status", "Action"];

  function stageGitComponent(stageItem) {
    axios({
      url: globalAPIEndpoint,
      method: "POST",
      data: {
        query: `
          mutation GitConvexMutation{
            stageItem(repoId: "${repoId}", item: "${stageItem}")
          }
        `,
      },
    })
      .then((res) => {
        if (res.data.data && !res.data.error) {
          if (res.data.data.stageItem === "ADD_ITEM_SUCCES") {
            setCurrensStageitem(stageItem);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getTableData() {
    let tableDataArray = [];

    let statusPill = (status) => {
      if (status === "M") {
        return (
          <div className="p-1 text-center text-yellow-700 border border-yellow-500 rounded-md shadow-sm">
            Modified
          </div>
        );
      } else {
        return (
          <div className="p-1 text-center text-indigo-700 border border-indigo-500 rounded-md shadow-sm">
            Untracked
          </div>
        );
      }
    };

    let actionButton = (stageItem) => {
      return (
        <div
          className="p-1 bg-green-300 text-white rounded-md shadow-sm hover:shadow-md hover:bg-green-600"
          onClick={(event) => {
            stageGitComponent(stageItem);
          }}
        >
          Add
        </div>
      );
    };

    gitTrackedFiles &&
      gitTrackedFiles.forEach((item) => {
        if (item.split(",").length > 0) {
          const trackedItem = item.split(",")[1];
          tableDataArray.push([
            trackedItem,
            statusPill(item.split(",")[0]),
            actionButton(trackedItem),
          ]);
        }
      });

    gitUntrackedFiles &&
      gitUntrackedFiles.forEach((item) => {
        if (item) {
          item = item.replace("NO_DIR", "");
          item.split(",")
            ? tableDataArray.push([
                item.split(",").join(""),
                statusPill("N"),
                actionButton(item.split(",").join("")),
              ])
            : tableDataArray.push([item, statusPill("N"), actionButton(item)]);
        }
      });
    return tableDataArray;
  }

  function getStagedFilesComponent() {
    function removeStagedItem(item) {
      axios({
        url: globalAPIEndpoint,
        method: "POST",
        data: {
          query: `
            mutation GitConvexMutation{
              removeStagedItem(repoId: "${repoId}", item: "${item}")
            }
          `,
        },
      })
        .then((res) => {
          let localReload = viewReload + 1;
          setViewReload(localReload);
          if (res.data.data && !res.data.error) {
            if (res.data.data.removeStagedItem === "STAGE_REMOVE_SUCCESS") {
              let localStagedItems = stageItems;

              localStagedItems = localStagedItems.filter((filterItem) => {
                if (filterItem === item) {
                  return false;
                }
                return true;
              });

              setStagedItems([...localStagedItems]);
            }
          }
        })
        .catch((err) => {});
    }

    function removeAllStagedItems() {
      axios({
        url: globalAPIEndpoint,
        method: "POST",
        data: {
          query: `
            mutation GitConvexMutation{
              removeAllStagedItem(repoId: "${repoId}")
            }
          `,
        },
      })
        .then((res) => {
          let localReload = viewReload + 1;
          setViewReload(localReload);
          if (res.data.data && !res.data.error) {
            if (
              res.data.data.removeAllStagedItem === "STAGE_ALL_REMOVE_SUCCESS"
            ) {
              setStagedItems([]);
            }
          }
        })
        .catch((err) => {});
    }

    if (stageItems && stageItems.length > 0) {
      return (
        <div className="w-full mx-auto my-20 p-2 border border-gray-200 rounded">
          <div className="flex items-center align-middle my-4">
            <div className="text-5xl font-sans text-gray-800 mx-4">
              Staged Files
            </div>
            <div
              className="p-2 rounded text-white bg-red-700 text-xl rounded shadow cursor-pointer hover:bg-red-800"
              onClick={() => {
                removeAllStagedItems();
              }}
            >
              Remove All Items
            </div>
          </div>
          <div className="flex mx-auto p-2 text-center font-sans text-lg text-white bg-indigo-400 rounded">
            <div className="w-3/4">Staged File</div>
            <div className="w-1/2">Action</div>
          </div>
          <div
            className="block mx-auto overflow-auto"
            style={{ height: "450px" }}
          >
            {stageItems.map((item) => {
              if (item) {
                return (
                  <div
                    className="flex mx-auto my-4 border-b my-auto items-center align-middle py-4"
                    key={item}
                  >
                    <div className="w-3/4 break-all mx-4 text-xl text-gray-800 font-sans">
                      {item}
                    </div>
                    <div className="w-1/2 mx-auto">
                      <div
                        className="mx-auto w-1/2 text-white cursor-pointer break-all text-center p-2 rounded bg-red-500 shadow hover:bg-red-600 hover:shadow-md"
                        onClick={() => {
                          removeStagedItem(item);
                        }}
                      >
                        Remove
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      );
    }
  }

  function actionComponent(action) {
    switch (action) {
      case "stage":
        if (list && list.length > 0) {
          return (
            <StageComponent
              repoId={repoId}
              stageComponents={list}
            ></StageComponent>
          );
        } else {
          return (
            <div className="w-1/2 mx-auto my-auto bg-gray-200 p-6 rounded-md">
              <div className="p-5 bg-white text-black font-sans font-semibold rounded shadow border border-gray-100">
                No Changes for staging...
              </div>
            </div>
          );
        }
      case "commit":
        return <CommitComponent repoId={repoId}></CommitComponent>;
      case "push":
        return <PushComponent repoId={repoId}></PushComponent>;
      default:
        return null;
    }
  }

  function noChangesComponent() {
    return (
      <div className="p-2 mx-auto my-10 bg-orange-300 text-xl text-center rounded shadow">
        No files to stage
      </div>
    );
  }

  return (
    <>
      {action ? (
        <div
          className="fixed w-full h-full top-0 left-0 right-0 flex overflow-auto"
          id="operation-backdrop"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={(event) => {
            if (event.target.id === "operation-backdrop") {
              setAction("");
              let closeViewCount = viewReload + 1;
              setViewReload(closeViewCount);
              setStagedItems([]);
            }
          }}
        >
          {actionComponent(action)}

          <div
            className="float-right font-semibold my-2 bg-red-500 text-3xl cursor-pointer text-center text-white my-5 align-middle rounded-full w-12 h-12 items-center align-middle shadow-md mr-5"
            onClick={() => {
              setAction("");
            }}
          >
            X
          </div>
        </div>
      ) : null}
      <div className="my-2 flex mx-auto p-3 justify-around">
        {actionButtons.map((item) => {
          const { label, color, key } = item;
          return (
            <div
              className={`my-auto align-middle item-center w-1/4 text-center p-2 rounded-md bg-0 border border-${color}-500 text-${color}-700 font-sans text-xl cursor-pointer hover:bg-${color}-500 hover:text-white`}
              key={key}
              onClick={() => setAction(key)}
            >
              {label}
            </div>
          );
        })}
      </div>
      {getTableData() && getTableData().length > 0 ? (
        <div
          className="overflow-auto p-2 mx-auto rounded shadow border"
          style={{ height: "450px" }}
        >
          <table
            className="table border-0 w-full cursor-pointer"
            cellPadding="10"
          >
            <thead>
              <tr className="bg-orange-300 p-3 text-xl font-sans">
                {tableColumns.map((column) => {
                  return (
                    <th
                      key={column}
                      className="font-bold border-r border-gray-200"
                    >
                      {column}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {getTableData() &&
                getTableData().map((tableData, index) => {
                  return (
                    <tr
                      className="text-md font-sans border-b border-gray-300"
                      key={`tableItem-${index}`}
                    >
                      {tableData.map((data, index) => {
                        return (
                          <td
                            key={`${data}-${index}`}
                            className={`${
                              index === 0 ? "text-left" : "text-center"
                            }`}
                          >
                            {data}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ) : (
        <>{noChangesComponent()}</>
      )}
      <>{stageItems ? getStagedFilesComponent() : null}</>
    </>
  );
}
