import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

import {
  CONFIG_HTTP_MODE,
  PORT_GITDIFFSTAT_API,
  API_GITDIFFSTAT,
} from "../../../env_config";

import { ContextProvider } from "../../../context";

export default function GitDiffViewComponent(props) {
  const { state } = useContext(ContextProvider);
  var gitModifiedFiles = state.modifiedGitFiles[0];
  const repoId = state.globalRepoId;

  const [activeFileName, setActiveFileName] = useState(
    gitModifiedFiles[0].split(",")[1]
  );
  const [fileLineDifference, setFileLineDifference] = useState([]);
  const [diffStat, setDiffStat] = useState([]);

  useEffect(() => {
    let apiEndPoint = `${CONFIG_HTTP_MODE}://${window.location.hostname}:${PORT_GITDIFFSTAT_API}/${API_GITDIFFSTAT}`;
    let fileName = activeFileName;

    axios({
      url: apiEndPoint,
      method: "POST",
      data: {
        repoId,
        fileName,
      },
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        console.log(res);
        const { diffStat, fileDiff } = res.data.differencePayload;

        setDiffStat([...diffStat]);
        setFileLineDifference([...fileDiff]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [activeFileName]);

  function modifiedComponents() {
    return (
      <div className="w-full">
        {gitModifiedFiles.map((item) => {
          if (item && item.split(",")) {
            if (item.split(",")[0] === "M") {
              let styleSelector =
                "bg-indigo-100 text-indigo-900 font-sans font-bold border-b border-indigo-400";

              return (
                <div
                  className={`p-2 px-6 bg-blue-200 text-sm font-sans break-words hover:bg-indigo-100 cursor-pointer ${
                    item.split(",")[1] === activeFileName ? styleSelector : ""
                  }`}
                  onClick={() => {
                    setActiveFileName(item.split(",")[1]);
                  }}
                >
                  {item.split(",")[1]}
                </div>
              );
            }
          }
        })}
      </div>
    );
  }

  function fileDiffStat() {
    if (diffStat) {
      const diffStatText = diffStat[1];

      console.log("Check : " + diffStatText);

      if (diffStatText) {
        diffStatText.replace(
          "insertion(+)",
          <span className="text-green-800 text-bold">insertions(+)</span>
        );
        diffStatText.replace(
          "deletion(-)",
          <span className="text-green-800 text-bold">deletions(-)</span>
        );
      }

      return (
        <div className="text-center font-sans text-xl mx-auto">
          {diffStat[1]}
        </div>
      );
    } else {
      return (
        <div className="text-center font-sans text-xl mx-auto">
          Fetching stat...
        </div>
      );
    }
  }

  return (
    <div className="flex w-11/12 p-2 mx-auto justify-center">
      {gitModifiedFiles ? (
        <div>{modifiedComponents()}</div>
      ) : (
        <div className="text-center p-2 text-xl">Fetching files...</div>
      )}
      {diffStat ? <div className="w-full">{fileDiffStat()}</div> : null}
    </div>
  );
}
