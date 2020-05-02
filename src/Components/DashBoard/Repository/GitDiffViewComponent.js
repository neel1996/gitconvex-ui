import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { GIT_TRACKED_FILES } from "../../../actionStore";
import { getAPIURL } from "../../../apiURLSupplier";
import { ContextProvider } from "../../../context";
import {
  API_GITDIFF,
  API_GITDIFFSTAT,
  CONFIG_HTTP_MODE,
  PORT_GITDIFFSTAT_API,
  PORT_GITDIFF_API,
} from "../../../env_config";
import Prism from "prismjs";

export default function GitDiffViewComponent() {
  const { state, dispatch } = useContext(ContextProvider);
  const repoId = state.globalRepoId;

  const [changedFiles, setChangedFiles] = useState([]);
  const [diffStatState, setDiffStatState] = useState(
    "Click on a file item to see the difference"
  );
  const [fileLineDiffState, setFileLineDiffState] = useState([]);
  const [activeFileName, setActiveFileName] = useState("");

  useEffect(() => {
    setActiveFileName("");
    setFileLineDiffState("Click on a file item to see the difference");
    setDiffStatState("Click on a file item to see the difference");
    let apiEndPoint = `${CONFIG_HTTP_MODE}://${window.location.hostname}:${PORT_GITDIFF_API}/${API_GITDIFF}`;
    if (repoId) {
      axios({
        url: apiEndPoint,
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        data: {
          query: `
              query GitDiffQuery{
                  gitDiffQuery(repoId: "${repoId}")
                  {
                      gitChangedFiles
                  }
              }
          `,
        },
      })
        .then((res) => {
          if (res) {
            var apiData = res.data.data.gitDiffQuery;
            const { gitChangedFiles } = apiData;
            setChangedFiles([...gitChangedFiles]);
            dispatch({ type: GIT_TRACKED_FILES, payload: gitChangedFiles });
            console.log(res);
          }
        })
        .catch((err) => {
          return err;
        });
    }
  }, [state.globalRepoId]);

  function getDiffFiles() {
    return (
      <>
        {changedFiles.map((entry) => {
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
              >
                {fileEntry}
              </div>
            );
          }
        })}
      </>
    );
  }
  function fileDiffStatComponent(repoId, fileName) {
    const apiEndPoint = getAPIURL(
      CONFIG_HTTP_MODE,
      API_GITDIFFSTAT,
      PORT_GITDIFFSTAT_API
    );

    axios({
      url: apiEndPoint,
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      data: {
        repoId,
        fileName,
      },
    })
      .then((res) => {
        const { diffStat, fileDiff } = res.data.differencePayload;

        setDiffStatState(diffStat[1]);
        setFileLineDiffState(fileDiff);
      })
      .catch((err) => {
        console.log(err);
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
                <span>
                  <span className="px-2">{parts.toString().split(" ")[1]}</span>
                  <span className="text-green-700 font-sans font-semibold">
                    {" "}
                    insertions (+)
                  </span>
                </span>
              );
            } else {
              return (
                <span>
                  <span className="px-2">{parts.toString().split(" ")[1]}</span>
                  <span className="text-red-700 font-sans font-semibold">
                    {" "}
                    deletions (+)
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
    let partFile = fileLineDiffState
      .join("|HASH_SEPARATOR_2020|")
      .split(
        /@@\s[-|+][0-9]+[,|\s]+[0-9]+\s[+|-|\s]+[0-9]+[,|\s]+[0-9]+\s+@*/gi
      )[1]
      .split("|HASH_SEPARATOR_2020|");

    let splitLines = partFile.map((line) => {
      if (line[0] === "+") {
        return (
          <div className="bg-green-200">
            <pre>
              <code
                dangerouslySetInnerHTML={{
                  __html: Prism.highlight(
                    line.replace("+", ""),
                    Prism.languages.javascript,
                    "javascript"
                  ),
                }}
              ></code>
            </pre>
          </div>
        );
      } else if (line[0] === "-") {
        return (
          <div className="bg-red-200">
            <pre>
              <pre>
                <code
                  dangerouslySetInnerHTML={{
                    __html: Prism.highlight(
                      line.replace("-", ""),
                      Prism.languages.javascript,
                      "javascript"
                    ),
                  }}
                ></code>
              </pre>
            </pre>
          </div>
        );
      } else {
        return (
          <div className="bg-white-200">
            <pre>
              <code
                dangerouslySetInnerHTML={{
                  __html: Prism.highlight(
                    line,
                    Prism.languages.javascript,
                    "javascript"
                  ),
                }}
              ></code>
            </pre>
          </div>
        );
      }
    });

    return <div className="break-all my-6 mx-auto">{splitLines}</div>;
  }

  return (
    <div className="flex mx-auto w-full justify-center">
      <div className="break-words p-2 py-2 bg-indigo-200 text-indigo-800 w-1/4 overflow-hidden">
        {getDiffFiles()}
      </div>
      {!activeFileName ? (
        <div className="p-3 shadow-md rounded-sm text-center mx-auto my-auto mt-3 block text-md font-sans">
          Click on a file to see difference information
        </div>
      ) : (
        ""
      )}
      {diffStatState &&
      diffStatState !== "Click on a file item to see the difference" ? (
        <div className="p-2 break-all w-3/4 mx-auto">
          {diffStatState ? statFormat() : ""}
          {fileLineDiffState &&
          fileLineDiffState !== "Click on a file item to see the difference" ? (
            <div className="p-2 py-6 mt-6 text-left break-words overflow-scroll">
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
  );
}
