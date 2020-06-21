import React, { useContext, useState, useEffect } from "react";
import { ContextProvider } from "../../../../../context";
import axios from "axios";

import StageComponent from "./StageComponent";
import CommitComponent from "./CommitComponent";
import PushComponent from "./PushComponent";
import {
  globalAPIEndpoint,
  ROUTE_REPO_TRACKED_DIFF,
} from "../../../../../util/env_config";

export default function GitOperationComponent(props) {
  const { repoId } = props;

  const [gitTrackedFiles, setGitTrackedFiles] = useState([]);
  const [gitUntrackedFiles, setGitUntrackedFiles] = useState([]);

  const [action, setAction] = useState("");
  const [list, setList] = useState([]);
  const [viewReload, setViewReload] = useState(0);

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

          const listElm = getComponentList();
          setList([...listElm]);
        }
      })
      .catch((err) => {
        // console.log(err);
      });

    return () => {
      source.cancel();
    };
  }, [props, viewReload]);

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
    let indexItem;

    list &&
      list.forEach((item, index) => {
        if (item === stageItem) {
          indexItem = index;
        }
      });
  }

  function getComponentList() {
    let componentList = [];

    gitTrackedFiles &&
      gitTrackedFiles.forEach((item) => {
        if (item.split(",").length > 0) {
          const trackedItem = item.split(",")[1];
          componentList.push(trackedItem);
        }
      });

    gitUntrackedFiles &&
      gitUntrackedFiles.forEach((item) => {
        if (item) {
          item = item.replace("NO_DIR", "");
          item.split(",")
            ? componentList.push(item.split(",").join(""))
            : componentList.push(item);
        }
      });
    return componentList;
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

  function actionComponent(action) {
    switch (action) {
      case "stage":
        return (
          <StageComponent
            repoId={repoId}
            stageComponents={getComponentList()}
          ></StageComponent>
        );
      case "commit":
        return <CommitComponent repoId={repoId}></CommitComponent>;
      case "push":
        return <PushComponent repoId={repoId}></PushComponent>;
      default:
        return null;
    }
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
            }
          }}
        >
          {actionComponent(action)}

          <div
            className="float-right p-1 my-2 bg-red-500 text-2xl cursor-pointer text-center text-white my-5 pl-2 pr-2 h-12 align-middle rounded-sm shadow-md mr-5"
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
      <table className="table border-0 w-full cursor-pointer" cellPadding="10">
        {getTableData() && getTableData().length > 0 ? (
          <>
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
          </>
        ) : null}
      </table>
    </>
  );
}
