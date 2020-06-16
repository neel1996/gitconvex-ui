import React, { useContext, useState, useEffect } from "react";
import { ContextProvider } from "../../../../../context";

import StageComponent from "./StageComponent";
import CommitComponent from "./CommitComponent";
import PushComponent from "./PushComponent";

export default function GitOperationComponent(props) {
  const { repoId } = props;
  const { state, dispatch } = useContext(ContextProvider);

  let { gitTrackedFiles, gitUntrackedFiles } = state;

  const [action, setAction] = useState("");

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
      label: "Push to remote Repo",
      color: "pink",
      key: "push",
    },
  ];

  gitTrackedFiles = gitTrackedFiles[0];
  gitUntrackedFiles = gitUntrackedFiles[0];

  const tableColumns = ["Changes", "File Status", "Action"];
  let tableDataArray = [];

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
          item.split(",")
            ? componentList.push(item.split(",").join(""))
            : componentList.push(item);
        }
      });
    return componentList;
  }

  function getTableData() {
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

    let actionButton = (
      <div className="p-1 bg-green-300 text-white rounded-md shadow-sm hover:shadow-md hover:bg-green-600">
        Add
      </div>
    );

    gitTrackedFiles &&
      gitTrackedFiles.forEach((item) => {
        if (item.split(",").length > 0) {
          const trackedItem = item.split(",")[1];
          tableDataArray.push([
            trackedItem,
            statusPill(item.split(",")[0]),
            actionButton,
          ]);
        }
      });

    gitUntrackedFiles &&
      gitUntrackedFiles.forEach((item) => {
        if (item) {
          item.split(",")
            ? tableDataArray.push([
                item.split(",").join(""),
                statusPill("N"),
                actionButton,
              ])
            : tableDataArray.push([item, statusPill("N"), actionButton]);
        }
      });
    return tableDataArray;
  }

  const actionComponent = (action) => {
    switch (action) {
      case "stage":
        return (
          <StageComponent stageComponents={getComponentList()}></StageComponent>
        );
      case "commit":
        return <CommitComponent></CommitComponent>;
      case "push":
        return <PushComponent></PushComponent>;
      default:
        return null;
    }
  };

  return (
    <>
      {action ? (
        <div
          className="fixed w-full h-full top-0 left-0 right-0 flex overflow-auto"
          style={{ background: "rgba(0,0,0,0.6)" }}
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
              className={`w-1/4 text-center p-2 rounded-md bg-0 border border-${color}-500 text-${color}-700 font-sans text-xl cursor-pointer hover:bg-${color}-500 hover:text-white`}
              key={key}
              onClick={() => setAction(key)}
            >
              {label}
            </div>
          );
        })}
      </div>
      <table className="table border-0 w-full cursor-pointer" cellPadding="10">
        <thead>
          <tr className="bg-orange-300 p-3 text-xl font-sans">
            {tableColumns.map((column) => {
              return (
                <th key={column} className="font-bold border-r border-gray-200">
                  {column}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {getTableData().map((tableData, index) => {
            return (
              <tr
                className="text-md font-sans border-b border-gray-300"
                key={`tableItem-${index}`}
              >
                {tableData.map((data, index) => {
                  return (
                    <td
                      key={`${data}-${index}`}
                      className={`${index === 0 ? "text-left" : "text-center"}`}
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
    </>
  );
}
