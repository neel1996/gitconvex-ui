import axios from "axios";
import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { globalAPIEndpoint } from "../../../../../util/env_config";

export default function FetchRemoteComponent(props) {
  const { repoId } = props;
  const [fetchResult, setFecthResult] = useState([]);

  useEffect(() => {
    axios({
      url: globalAPIEndpoint,
      method: "POST",
      data: {
        query: `
            mutation GitConvexMutation{
              fetchFromRemote(repoId: "${repoId}"){
                status
                fetchedItems
              }
            }
          `,
      },
    })
      .then((res) => {
        if (res.data.data && !res.data.error) {
          const fetchResponse = res.data.data.fetchFromRemote;
          if (fetchResponse.status === "FETCH_ABSENT") {
            setFecthResult([
              <div className="text-xl p-2 text-gray-900 font-semibold">
                No changes to Fetch from remote
              </div>,
            ]);
          } else if (fetchResponse === "FETCH_ERROR") {
            setFecthResult([
              <div className="text-xl p-2 text-pink-800 border border-pink-200 shadow rounded font-semibold">
                Error while fetching from remote!
              </div>,
            ]);
          } else {
            const fetchArray = fetchResponse.fetchedItems;
            setFecthResult([...fetchArray]);
          }
        }
      })
      .catch((err) => {
        setFecthResult([
          <div className="text-xl p-2 text-pink-800 border border-pink-200 shadow rounded font-semibold">
            Error while fetching from remote!
          </div>,
        ]);
      });
  }, [repoId]);

  return (
    <div className="w-5/6 mx-auto my-auto bg-gray-200 p-6 rounded-md pb-10">
      <div className="mx-3 my-3 text-3xl font-sans text-gray-800">
        Fetch Result
      </div>
      {fetchResult && fetchResult.length > 0 ? (
        <>
          <div className="p-3 rounded shadow bg-indigo-100 text-md font-sans text-gray-700">
            {fetchResult.map((result) => {
              return (
                <div
                  className="my-1 mx-2 break-normal"
                  key={result + `-${uuid()}`}
                >
                  {result}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="rounded mx-auto p-4 my-auto w-11/12 shadow bg-orange-200 border-orange-700 text-xl font-sand font-semibold">
            Fetching changes from remote...
          </div>
        </>
      )}
    </div>
  );
}
