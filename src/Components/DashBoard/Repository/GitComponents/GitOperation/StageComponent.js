import React, { useEffect, useState } from "react";
import axios from "axios";
import { globalAPIEndpoint } from "../../../../../util/env_config";

export default function StageComponent(props) {
  const { stageComponents, repoId } = props;

  const [allStaged, setAllStaged] = useState(false);
  const [loading, setLodaing] = useState(false);
  const [errorInd, setErrorInd] = useState(false);

  useEffect(() => {
    if (!props) {
      return;
    }
  }, [props]);

  function stageAllChanges() {
    setLodaing(true);
    axios({
      url: globalAPIEndpoint,
      method: "POST",
      data: {
        query: `
          mutation GitConvexMutation{
            stageAllItems(repoId: "${repoId}")
          }
        `,
      },
    })
      .then((res) => {
        setLodaing(false);
        if (res.data.data && !res.data.error) {
          if (res.data.data.stageAllItems === "ALL_STAGED") {
            setAllStaged(true);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        setLodaing(false);
        setErrorInd(true);
      });
  }

  return (
    <>
      <div className="w-5/6 mx-auto my-auto bg-gray-200 p-6 rounded-md">
        <>
          {stageComponents.length > 0 && !allStaged ? (
            <>
              <div className="p-5 font-sans text-2xl font-sans font-bold">
                All these changes will be staged:
              </div>
              {stageComponents &&
                stageComponents.map((item) => {
                  return (
                    <div
                      className="p-1 font-sans text-lg mx-4 border-b w-11/12 break-words"
                      key={item}
                    >
                      {item}
                    </div>
                  );
                })}
              {errorInd ? (
                <div className="my-2 mx-auto text-center p-2 rounded shadow bg-red-200 border-red-400 text-red-800">
                  Staging Failed!
                </div>
              ) : null}
              {loading ? (
                <div className="mx-auto my-4 text-center bg-gray-600 text-xl p-3 rounded-md shadow-md font-sans text-white hover:bg-gray-400 cursor-pointer">
                  Staging in prgoress...
                </div>
              ) : (
                <div
                  className="mx-auto my-4 text-center bg-green-600 text-xl p-3 rounded-md shadow-md font-sans text-white hover:bg-green-400 cursor-pointer"
                  onClick={() => {
                    stageAllChanges();
                  }}
                >
                  Confirm Staging
                </div>
              )}
            </>
          ) : (
            <div className="p-5 bg-white text-black font-sans font-semibold rounded shadow border border-gray-100">
              No Changes for staging...
            </div>
          )}
          {allStaged ? (
            <div className="mx-auto my-2 p-3 bg-green-300 text-green-800 rounded- shadow">
              All changes Staged!
            </div>
          ) : null}
        </>
      </div>
    </>
  );
}
