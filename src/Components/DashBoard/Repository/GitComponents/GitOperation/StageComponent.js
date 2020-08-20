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
              <div className="overflow-y-auto" style={{ height: "400px" }}>
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
              </div>

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
            <div className="bg-white p-6 font-sans text-3xl font-light text-gray-500 border-b-4 border-dashed rounded-lg shadow-lg border-gray-500 text-center">
              No Changes for staging...
            </div>
          )}
          {allStaged ? (
            <div className="mx-auto my-2 p-3 bg-green-200 text-green-800 rounded-md shadow text-xl font-sans font-semibold text-center border-b-4 border-dashed border-green-300">
              All changes Staged!
            </div>
          ) : null}
        </>
      </div>
    </>
  );
}
