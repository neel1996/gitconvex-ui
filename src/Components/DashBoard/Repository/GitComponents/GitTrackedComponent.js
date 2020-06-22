import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  GIT_TRACKED_FILES,
  GIT_ACTION_TRACKED_FILES,
  GIT_ACTION_UNTRACKED_FILES,
} from "../../../../actionStore";
import { ContextProvider } from "../../../../context";
import {
  globalAPIEndpoint,
  ROUTE_REPO_TRACKED_DIFF,
} from "../../../../util/env_config";
import GitDiffViewComponent from "./GitDiffViewComponent";
import GitOperationComponent from "./GitOperation/GitOperationComponent";

export default function GitTrackedComponent(props) {
  library.add(fab);
  const [gitDiffFilesState, setGitDiffFilesState] = useState([]);
  const [gitUntrackedFilesState, setGitUntrackedFilesState] = useState([]);
  const [topMenuItemState, setTopMenuItemState] = useState("File View");
  const topMenuItems = ["File View", "Git Difference", "Git Operations"];
  const [noChangeMarker, setNoChangeMarker] = useState(false);

  const { dispatch } = useContext(ContextProvider);

  const memoizedGitDiffView = useMemo(() => {
    return <GitDiffViewComponent repoId={props.repoId}></GitDiffViewComponent>;
  }, [props]);

  const memoizedGitOperationView = useMemo(() => {
    return (
      <GitOperationComponent repoId={props.repoId}></GitOperationComponent>
    );
  }, [props]);

  useEffect(() => {
    let apiEndPoint = globalAPIEndpoint;

    const payload = JSON.stringify(
      JSON.stringify({
        repoId: props.repoId,
      })
    );

    axios({
      url: apiEndPoint,
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
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
        if (res) {
          var apiData = res.data.data.gitConvexApi.gitChanges;
          const { gitChangedFiles, gitUntrackedFiles } = apiData;

          if (
            (gitChangedFiles || gitUntrackedFiles) &&
            (gitChangedFiles.length > 0 || gitUntrackedFiles.length > 0)
          ) {
            setGitDiffFilesState([...gitChangedFiles]);
            setGitUntrackedFilesState([...gitUntrackedFiles]);
            setNoChangeMarker(false);

            dispatch({
              type: GIT_TRACKED_FILES,
              payload: gitChangedFiles,
            });

            dispatch({
              type: GIT_ACTION_TRACKED_FILES,
              payload: [...gitChangedFiles],
            });

            dispatch({
              type: GIT_ACTION_UNTRACKED_FILES,
              payload: [...gitUntrackedFiles],
            });
          } else {
            setNoChangeMarker(true);
          }
        }
      })
      .catch((err) => {
        setNoChangeMarker(true);
      });
  }, [props, dispatch]);

  function diffPane() {
    var deletedArtifacts = [];
    var modifiedArtifacts = [];

    if (gitDiffFilesState && gitDiffFilesState.length > 0) {
      gitDiffFilesState.forEach((diffFile, index) => {
        var splitFile = diffFile.split(",");
        var flag = splitFile[0];
        var name = splitFile[1];
        var styleSelector = "p-1 ";
        switch (flag) {
          case "M":
            styleSelector += "text-yellow-900 bg-yellow-200";
            modifiedArtifacts.push(
              <div className="flex mx-auto justify-between" key={name}>
                <div className={`${styleSelector} w-11/12`}> {name} </div>
                <div className="rounded-lg shadow-sm border border-gray-300 p-2 text-center w-1/6">
                  Modified
                </div>
              </div>
            );
            break;
          case "D":
            styleSelector += "text-red-900 bg-red-200";
            deletedArtifacts.push(
              <div className="flex mx-auto justify-between" key={name}>
                <div className={`${styleSelector} w-11/12`}> {name} </div>
                <div className="rounded-sm shadow-sm border border-gray-300 p-2 text-center w-1/6">
                  Deleted
                </div>
              </div>
            );
            break;
          default:
            styleSelector += "text-indigo-900 bg-indigo-200";
            break;
        }
      });

      return (
        <>
          {modifiedArtifacts} {deletedArtifacts}
        </>
      );
    }
  }

  function untrackedPane() {
    let untrackedDir = [];
    let untrackedFile = [];

    gitUntrackedFilesState.forEach((entry) => {
      let splitEntry = entry.split(",");

      if (splitEntry) {
        untrackedDir.push(
          <div className="font-sans font-semibold">
            {splitEntry[0] !== "NO_DIR" ? splitEntry[0] : "./"}
          </div>
        );
        untrackedFile.push(<div className="font-sans"> {splitEntry[1]} </div>);
      }
    });

    return untrackedDir.map((entry, index) => {
      return (
        <div className="flex" key={`${entry}-${index}`}>
          <div className="bg-indigo-100 text-indigo-800 flex p-2 block w-11/12">
            {untrackedDir[index]} {untrackedFile[index]}
          </div>
          <div className="rounded-sm shadow-sm border border-gray-300 p-2 text-center w-1/6 text-sm">
            New / Untracked
          </div>
        </div>
      );
    });
  }

  function menuComponent() {
    const FILE_VIEW = "File View";
    const GIT_DIFFERENCE = "Git Difference";
    const GIT_OPERATIONS = "Git Operations";

    switch (topMenuItemState) {
      case FILE_VIEW:
        if (!noChangeMarker) {
          return (
            <div className="shadow-sm rounded-sm my-2 block justify-center mx-auto border border-gray-300">
              {gitDiffFilesState ? (
                diffPane()
              ) : (
                <div className="rounded-lg shadow-md text-center p-4 font-sans">
                  Getting file based status...
                </div>
              )}
              {gitUntrackedFilesState ? untrackedPane() : null}
            </div>
          );
        }
        break;
      case GIT_DIFFERENCE:
        if (!noChangeMarker) {
          return memoizedGitDiffView;
        }
        break;
      case GIT_OPERATIONS:
        return memoizedGitOperationView;
      default:
        return (
          <div className="text-xl text-center"> Invalid Menu Selector! </div>
        );
    }
  }

  function presentChangeComponent() {
    return (
      <>
        <div className="flex my-4 mx-auto w-11/12 justify-around font-sans font-semibold rounded-sm shadow-md cursor-pointer">
          {topMenuItems.map((item) => {
            let styleSelector =
              "w-full py-3 px-1 text-center border-r border-blue-400 ";
            if (item === topMenuItemState) {
              styleSelector +=
                "bg-blue-100 text-blue-800 border-b border-blue-700";
            } else {
              styleSelector += "bg-blue-600 text-white";
            }
            return (
              <div
                className={`w-full py-3 px-1 text-center border-r border-blue-400 hover:bg-blue-200 hover:text-blue-900 ${styleSelector}`}
                key={item}
                onClick={(event) => {
                  setTopMenuItemState(item);
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
        {/* <div className="w-11/12 block mx-auto my-6"> {menuComponent()} </div> */}
      </>
    );
  }

  return (
    <>
      {noChangeMarker ? (
        <>
          <div className="w-11/12 block mx-auto my-6">
            {memoizedGitOperationView}
          </div>
          <div className="mt-10 w-11/12 rounded-sm shadow-sm h-full my-auto bock mx-auto text-center align-middle p-6 bg-pink-200 text-xl text-pink-600">
            No changes found in the selected git repo
          </div>
          <div className="p-6 rounded-lg border-2 border-gray-100 w-3/4 block mx-auto my-20">
            <div>
              <FontAwesomeIcon
                icon={["fab", "creative-commons-zero"]}
                className="flex text-6xl mt-20 text-center text-gray-300 font-bold mx-auto my-auto h-full w-full"
              ></FontAwesomeIcon>
            </div>
            <div className="block text-6xl text-gray-200 mx-auto text-center align-middle">
              "0" changes in repo
            </div>
          </div>
        </>
      ) : (
        <>
          {presentChangeComponent()}
          <div className="w-11/12 block mx-auto my-6"> {menuComponent()} </div>
        </>
      )}
    </>
  );
}
