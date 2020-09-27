import React, { useEffect, useState } from "react";
import axios from "axios";
import { COMMIT_COMPARE, globalAPIEndpoint } from "../../../../util/env_config";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CommitFileDifferenceComponent(props) {
  library.add(fas, far);
  const { repoId, baseCommit, compareCommit } = props;

  const [fileDifference, setFileDifference] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFileDifference([]);
    setError(false);
    setLoading(true);

    if (baseCommit === compareCommit) {
      setLoading(false);
      return;
    }

    const payload = JSON.stringify(
      JSON.stringify({
        repoId: repoId,
        baseCommit: baseCommit,
        compareCommit: compareCommit,
      })
    );

    axios({
      url: globalAPIEndpoint,
      method: "POST",
      data: {
        query: `
            query GitConvexApi {
              gitConvexApi(route: "${COMMIT_COMPARE}", payload: ${payload}) {
                commitCompare {
                  message
                  difference{
                    status
                    fileName
                  }
                }
              }
            }
          `,
      },
    })
      .then((res) => {
        setLoading(false);

        const {
          difference,
          message,
        } = res.data.data.gitConvexApi.commitCompare;

        if (message && message.includes("Error")) {
          setError(true);
          return;
        }

        if (difference) {
          setFileDifference([...difference]);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        console.log(err);
      });
  }, [props.repoId, props.baseCommit, props.compareCommit]);

  return (
    <div className="my-4 w-11/12 mx-auto p-6 rounded shadow bg-blue-100">
      {baseCommit === compareCommit ? (
        <div className="text-center font-sans font-light text-2xl">
          Same commits cannot be compared
        </div>
      ) : null}
      {error ? (
        <div className="p-3 w-3/4 rounded bg-red-100 border font-sans font-light text-xl">
          Error occurred while fetching comparison results!
        </div>
      ) : null}
      {!error && fileDifference && !loading ? (
        <>
          <div className="text-left font-sans font-semibold text-2xl mx-2 my-4 text-gray-800">
            Differing Files
          </div>
          {fileDifference.map((diff) => {
            const { status, fileName } = diff;
            let iconSelector = "";
            let colorSelector = "";
            let title = "";
            switch (status[0]) {
              case "M":
                iconSelector = "plus-square";
                colorSelector = "text-yellow-600";
                title = "Modified";
                break;
              case "A":
                iconSelector = "plus-square";
                colorSelector = "text-green-500";
                title = "Added";
                break;
              case "D":
                iconSelector = "minus-square";
                colorSelector = "text-red-500";
                title = "Deleted";
                break;
              case "R":
                iconSelector = "caret-square-right";
                colorSelector = "text-indigo-500";
                title = "Renamed";
                break;
              default:
                iconSelector = "stop-circle";
                colorSelector = "text-gray-500";
                title = "Unmerged / Copied / Unknown";
                break;
            }

            return (
              <div
                className="flex items-center align-middle justify-center gap-4"
                key={status + "-" + fileName}
              >
                <div
                  className={`text-2xl cursor-pointer ${colorSelector}`}
                  title={title}
                >
                  <FontAwesomeIcon
                    icon={["far", iconSelector]}
                  ></FontAwesomeIcon>
                </div>
                <div
                  className="w-3/4 font-sans font-light truncate"
                  title={fileName}
                >
                  {fileName}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div className="my-2 text-2xl font-sans font-semibold text-gray-500">
          Loading comparison results...
        </div>
      )}
    </div>
  );
}
