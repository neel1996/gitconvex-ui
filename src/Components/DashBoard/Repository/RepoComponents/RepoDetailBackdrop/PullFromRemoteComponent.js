import axios from "axios";
import React, { useEffect, useState } from "react";
import { globalAPIEndpoint } from "../../../../../util/env_config";

export default function PullRemoteComponent(props) {
  const { repoId } = props;

  const [pullResult, setPullResult] = useState([]);

  useEffect(() => {
    axios({
      url: globalAPIEndpoint,
      method: "POST",
      data: {
        query: `
            mutation GitConvexMutation{
              pullFromRemote(repoId: "${repoId}"){
                status
                pulledItems
              }
            }
          `,
      },
    })
      .then((res) => {
        if (res.data.data && !res.data.error) {
          const pullResponse = res.data.data.pullFromRemote;

          if (pullResponse.status === "PULL_FAILED") {
            setPullResult([
              <div className="text-xl p-2 text-pink-800 border border-pink-200 shadow rounded font-semibold">
                Error while pulling from remote!
              </div>,
            ]);
          } else if (pullResponse.status === "PULL_EMPTY") {
            setPullResult([
              <div className="text-xl p-2 text-gray-900 font-semibold">
                No changes to Pull from remote
              </div>,
            ]);
          } else {
            const pullArray = pullResponse.pulledItems;
            setPullResult([...pullArray]);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        setPullResult([
          <div className="text-xl p-2 text-pink-800 border border-pink-200 shadow rounded font-semibold">
            <div>Error while pulling from remote!</div>
            <div>
              Could be due to conflicting changes between local and remote
            </div>
          </div>,
        ]);
      });
  }, [repoId]);

  return (
    <div className="w-5/6 mx-auto my-auto bg-gray-200 p-6 rounded-md pb-10">
      <div className="mx-3 my-3 text-3xl font-sans text-gray-800">
        Pull Result
      </div>
      {pullResult && pullResult.length > 0 ? (
        <>
          <div className="p-3 rounded shadow bg-indigo-100 text-md font-sans text-gray-700">
            {pullResult.map((result) => {
              return (
                <div className="my-1 mx-2 truncate ..." key={result}>
                  {result}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="rounded mx-auto p-4 my-auto w-11/12 shadow bg-orange-200 border-orange-700 text-xl font-sand font-semibold">
            Pulling changes from remote...
          </div>
        </>
      )}
    </div>
  );
}
