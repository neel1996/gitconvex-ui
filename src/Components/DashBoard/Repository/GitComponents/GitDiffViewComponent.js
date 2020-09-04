import axios from "axios";
import * as Prism from "prismjs";
import React, { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { GIT_TRACKED_FILES } from "../../../../actionStore";
import { ContextProvider } from "../../../../context";
import "../../../../prism.css";
import {
  globalAPIEndpoint,
  ROUTE_REPO_FILE_DIFF,
  ROUTE_REPO_TRACKED_DIFF,
} from "../../../../util/env_config";

export default function GitDiffViewComponent() {
  const { state, dispatch } = useContext(ContextProvider);
  const repoId = state.globalRepoId;

  const [changedFiles, setChangedFiles] = useState([]);
  const [diffStatState, setDiffStatState] = useState(
    "Click on a file item to see the difference"
  );
  const [fileLineDiffState, setFileLineDiffState] = useState([]);
  const [activeFileName, setActiveFileName] = useState("");
  const [isApiCalled, setIsApiCalled] = useState(false);
  const [warnStatus, setWarnStatus] = useState("");
  const [lang, setLang] = useState("");

  useEffect(() => {
    let repoId = state.globalRepoId;

    setActiveFileName("");
    setFileLineDiffState("Click on a file item to see the difference");
    setDiffStatState("Click on a file item to see the difference");
    let apiEndPoint = globalAPIEndpoint;
    if (repoId) {
      const payload = JSON.stringify(JSON.stringify({ repoId: repoId }));

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
                  gitChangedFiles
                }
              }
            }
          `,
        },
      })
        .then((res) => {
          if (res) {
            if (res.data.data && !res.data.error) {
              var apiData = res.data.data.gitConvexApi.gitChanges;
              let { gitChangedFiles } = apiData;

              gitChangedFiles = gitChangedFiles.filter((fileEntry) => {
                if (fileEntry.split(",")[0] === "D") {
                  return false;
                }
                return true;
              });

              if (gitChangedFiles.length >= 1) {
                setChangedFiles([...gitChangedFiles]);
              } else {
                setWarnStatus(
                  "No modified or new files found in the repo. All the files are either removed or not present in the repo!"
                );
              }

              setIsApiCalled(true);
              dispatch({ type: GIT_TRACKED_FILES, payload: gitChangedFiles });
            }
          }
        })
        .catch((err) => {
          return err;
        });
    }
  }, [state.globalRepoId, dispatch]);

  function getDiffFiles() {
    const directorySplit = (fileEntry) => {
      if (fileEntry.includes("/")) {
        let splitEntry = fileEntry.split("/");
        let dirSplit = splitEntry
          .map((entry, index) => {
            if (index === splitEntry.length - 1) {
              return null;
            } else {
              return entry;
            }
          })
          .join("/");
        let fileName = splitEntry[splitEntry.length - 1];

        return (
          <div
            className="my-4 border border-dashed border-gray-800 cursor-pointer block items-center"
            title={fileEntry}
          >
            <div className="bg-gray-100 p-1 rounded">
              <div className="font-sans font-semibold text-gray-700 border-b">
                Directory:
              </div>
              <div className="font-sans font-light text-gray-900 truncate">
                {dirSplit}
              </div>
            </div>
            <div className="text-md font my-2 mx-2">{fileName}</div>
          </div>
        );
      } else {
        return <span className="text-xl mx-2 border-b">{fileEntry}</span>;
      }
    };

    return (
      <>
        {changedFiles.length >= 1 &&
          changedFiles.map((entry) => {
            if (entry && entry.split(",")[0] === "M") {
              let fileEntry = entry.split(",")[1];
              const styleSelector = " bg-indigo-100 border-b border-indigo-400";
              return (
                <div
                  className={`p-2 text-sm break-words hover:bg-indigo-100 cursor-pointer ${
                    fileEntry === activeFileName ? styleSelector : ""
                  }`}
                  onClick={() => {
                    setActiveFileName(fileEntry);
                    fileDiffStatComponent(repoId, fileEntry);
                  }}
                  key={fileEntry}
                >
                  {directorySplit(fileEntry)}
                </div>
              );
            } else {
              return null;
            }
          })}
      </>
    );
  }

  function fileDiffStatComponent(repoId, fileName) {
    const apiEndPoint = globalAPIEndpoint;
    setWarnStatus("");

    const payload = JSON.stringify(
      JSON.stringify({ repoId: repoId, fileName: fileName })
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
            gitConvexApi(route: "${ROUTE_REPO_FILE_DIFF}", payload:${payload})
            {
              gitFileLineChanges{
                diffStat
                fileDiff
                language
              }
            }
          }
        `,
      },
    })
      .then(async (res) => {
        if (res.data.data && !res.data.error) {
          const {
            diffStat,
            fileDiff,
            language,
          } = res.data.data.gitConvexApi.gitFileLineChanges;

          if (diffStat[0] === "NO_STAT" || fileDiff[0] === "NO_DIFF") {
            setWarnStatus(
              "No difference could be found. Please check if the file is present in the repo!"
            );
          } else {
            setDiffStatState(diffStat[1]);
            setFileLineDiffState(fileDiff);

            if (language) {
              await import("prismjs/components/prism-" + language + ".js")
                .then(() => {})
                .catch((err) => {
                  console.log(err);
                  setLang("markdown");
                });

              setLang(language);
            }
          }
        } else {
          setWarnStatus(
            "Error while fetching the file difference. Please try reloading the view!"
          );
        }
      })
      .catch((err) => {
        console.log(err);
        setWarnStatus(
          "Error while fetching the file difference. Please try reloading the view!"
        );
      });
  }

  function statFormat() {
    if (diffStatState && diffStatState.includes(",")) {
      let splitStat = diffStatState.split(",");

      return (
        <div className="text-xl text-center w-3/4 mx-auto block p-2 border border-gray-500 rounded-md shadow-md border-dotted">
          <span className="font-sans font-bold px-1">{splitStat[0]}</span>
          {splitStat.slice(1, splitStat.length).map((parts) => {
            if (parts.match(/insert/i)) {
              return (
                <span key={`${parts}-${new Date().getTime()}`}>
                  <span className="px-2">{parts.toString().split(" ")[1]}</span>
                  <span className="text-green-700 font-sans font-semibold">
                    insertions (+)
                  </span>
                </span>
              );
            } else {
              return (
                <span key={`${parts}-${new Date().getTime()}`}>
                  <span className="px-2">{parts.toString().split(" ")[1]}</span>
                  <span className="text-red-700 font-sans font-semibold">
                    deletions (-)
                  </span>
                </span>
              );
            }
          })}
        </div>
      );
    }
  }

  function fileLineDiffComponent() {
    let splitLines = [];
    let lineCounter = 0;
    if (
      fileLineDiffState &&
      fileLineDiffState.join("").split(/@@.*@@/gi) &&
      lang
    ) {
      let partFile = fileLineDiffState
        .join("|__HASH_SEPARATOR__|")
        .split(/@@.*@@/gi)[1]
        .split("|__HASH_SEPARATOR__|");

      splitLines = partFile.map((line) => {
        if (line.match(/\\ No newline at end of file/gi)) {
          return "";
        }
        if (line[0] && line[0] === "+") {
          return (
            <div
              className="flex items-center gap-4 bg-green-200 w-screen"
              key={`${line}-${uuidv4()}`}
            >
              <div className="w-1/8 text-green-500 border-b-2 font-mono mx-1">
                {++lineCounter}
              </div>
              <pre className="w-5/6 mx-2">
                <code
                  dangerouslySetInnerHTML={{
                    __html: Prism.highlight(
                      line.replace("+", ""),
                      Prism.languages[lang],
                      lang
                    ),
                  }}
                ></code>
              </pre>
            </div>
          );
        } else if (line[0] && line[0] === "-") {
          return (
            <div
              className="flex gap-4 items-center bg-red-200 w-screen"
              key={`${line}-${uuidv4()}`}
            >
              <div className="w-1/8 text-red-500 border-b-2 font-mono mx-1">
                -
              </div>
              <pre className="w-5/6 mx-2">
                <code
                  dangerouslySetInnerHTML={{
                    __html: Prism.highlight(
                      line.replace("-", ""),
                      Prism.languages[lang],
                      lang
                    ),
                  }}
                ></code>
              </pre>
            </div>
          );
        } else {
          if (line[0]) {
            return (
              <div
                className="flex items-center gap-4 bg-white-200 w-screen"
                key={`${line}-${uuidv4()}`}
              >
                <div className="w-1/8 text-gray-300 font-mono mx-1">
                  {++lineCounter}
                </div>
                <pre className="w-5/6">
                  <code
                    dangerouslySetInnerHTML={{
                      __html: Prism.highlight(
                        line,
                        Prism.languages[lang],
                        lang
                      ),
                    }}
                  ></code>
                </pre>
              </div>
            );
          } else {
            return "";
          }
        }
      });
    }

    return (
      <div className="break-all my-6 mx-auto">
        <code>{splitLines}</code>
      </div>
    );
  }

  return (
    <>
      {changedFiles && changedFiles.length > 0 ? (
        <>
          <div className="flex mx-auto w-full justify-center">
            <div
              className="break-words p-2 py-2 bg-white border-2 border-dashed border-gray-400 text-indigo-800 w-1/4 rounded-md shadow-md overflow-auto"
              style={{ height: "880px" }}
            >
              {getDiffFiles()}
            </div>

            {!activeFileName ? (
              <div className="p-6 rounded-md bg-gray-300 shadow-md rounded-sm text-center mx-auto my-auto mt-3 block text-xl items-center text-gray-500 border-2 border-dashed font-sans">
                Click on a file to see difference information
              </div>
            ) : (
              ""
            )}

            {warnStatus ? (
              <div className="text-center mx-auto my-4 p-4 rounded bg-yellow-300 border-yellow-800 font-sans font-medium my-auto">
                {warnStatus}
              </div>
            ) : null}

            {diffStatState &&
            diffStatState !== "Click on a file item to see the difference" &&
            !warnStatus ? (
              <div className="p-2 break-all w-3/4 mx-auto">
                {diffStatState ? statFormat() : ""}
                {fileLineDiffState &&
                fileLineDiffState !==
                  "Click on a file item to see the difference" ? (
                  <div
                    className="p-2 py-6 mt-6 text-left break-words overflow-scroll w-full"
                    style={{ height: "800px" }}
                  >
                    {fileLineDiffComponent()}
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        </>
      ) : (
        <>
          {isApiCalled ? (
            <div className="shadow-md mx-auto w-3/4 my-4 p-2 border-b-4 border-dashed border-pink-300 rounded-md mx-auto text-center font-sans font-semibold text-xl">
              No File changes in the repo
            </div>
          ) : (
            <div className="mx-auto w-3/4 my-4 p-2 border-b-4 border-dashed border-pink-300 rounded-md mx-auto text-center font-sans font-semibold text-xl">
              <span className="text-gray-400">
                Fetching changed files from the server...
              </span>
            </div>
          )}
        </>
      )}
    </>
  );
}
