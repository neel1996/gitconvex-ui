import axios from "axios";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { GIT_TRACKED_FILES } from "../../../actionStore";
import { ContextProvider } from "../../../context";
import { API_GITDIFF, CONFIG_HTTP_MODE, PORT_GITDIFF_API } from "../../../env_config";
import GitDiffViewComponent from "./GitDiffViewComponent";

export default function GitTrackedComponent(props) {
  const [gitDiffFilesState, setGitDiffFilesState] = useState([]);
  const [gitUntrackedFilesState, setGitUntrackedFilesState] = useState([]);
  const [topMenuItemState, setTopMenuItemState] = useState("File View");
  const topMenuItems = ["File View", "Git Difference", "Git Operations"];

  const { state, dispatch } = useContext(ContextProvider);

  const memoizedGitDiffView = useMemo(() => {
    return <GitDiffViewComponent></GitDiffViewComponent>;
  }, []);

  useEffect(() => {
    let apiEndPoint = `${CONFIG_HTTP_MODE}://${window.location.hostname}:${PORT_GITDIFF_API}/${API_GITDIFF}`;

    axios({
      url: apiEndPoint,
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      data: {
        query: `
            query GitDiffQuery{
                gitDiffQuery(repoId: "${props.repoId}")
                {
                    gitUntrackedFiles
                    gitChangedFiles
                }
            }
        `
      }
    })
      .then(res => {
        if (res) {
          var apiData = res.data.data.gitDiffQuery;
          const { gitChangedFiles, gitUntrackedFiles } = apiData;
          setGitDiffFilesState([...gitChangedFiles]);
          setGitUntrackedFilesState([...gitUntrackedFiles]);

          dispatch({ type: GIT_TRACKED_FILES, payload: gitChangedFiles });
        }
      })
      .catch(err => {
        return err;
      });
  }, [props]);

  function diffPane() {
    var deletedArtifacts = [];
    var modifiedArtifacts = [];

    if (gitDiffFilesState) {
      gitDiffFilesState.forEach((diffFile, index) => {
        var splitFile = diffFile.split(",");
        var flag = splitFile[0];
        var name = splitFile[1];
        var styleSelector = "p-1 ";
        switch (flag) {
          case "M":
            styleSelector += "text-yellow-900 bg-yellow-200";
            modifiedArtifacts.push(
              <div className="flex mx-auto justify-between">
                <div className={`${styleSelector} w-11/12`}>{name}</div>
                <div className="rounded-lg shadow-sm border border-gray-300 p-2 text-center w-1/6">
                  Modified
                </div>
              </div>
            );
            break;
          case "D":
            styleSelector += "text-red-900 bg-red-200";
            deletedArtifacts.push(
              <div className="flex mx-auto justify-between">
                <div className={`${styleSelector} w-11/12`}>{name}</div>
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
          {modifiedArtifacts}
          {deletedArtifacts}
        </>
      );
    }
  }

  function untrackedPane() {
    let untrackedDir = [];
    let untrackedFile = [];

    gitUntrackedFilesState.forEach(entry => {
      let splitEntry = entry.split(",");

      if (splitEntry) {
        untrackedDir.push(
          <div className="font-sans font-semibold">
            {splitEntry[0] !== "NO_DIR" ? splitEntry[0] : "./"}
          </div>
        );
        untrackedFile.push(<div className="font-sans">{splitEntry[1]}</div>);
      }
    });

    return untrackedDir.map((entry, index) => {
      return (
        <div className="flex">
          <div className="bg-indigo-100 text-indigo-800 flex p-2 block w-11/12">
            {untrackedDir[index]}
            {untrackedFile[index]}
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
      case GIT_DIFFERENCE:
        return <GitDiffViewComponent></GitDiffViewComponent>;
    }
  }

  return (
    <>
      <div className="flex my-4 mx-auto w-11/12 justify-around font-sans font-semibold rounded-sm shadow-md cursor-pointer">
        {topMenuItems.map(item => {
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
              onClick={event => {
                setTopMenuItemState(item);
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
      <div className="w-11/12 block mx-auto my-6">{menuComponent()}</div>
    </>
  );
}
