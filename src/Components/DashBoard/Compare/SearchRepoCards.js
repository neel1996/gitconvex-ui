import axios from "axios";
import React, { useEffect, useState } from "react";
import { globalAPIEndpoint, ROUTE_FETCH_REPO } from "../../../util/env_config";

export default function SearchRepoCards(props) {
  const [repo, setRepo] = useState([]);

  useEffect(() => {
    const token = axios.CancelToken;
    const source = token.source();

    axios({
      url: globalAPIEndpoint,
      method: "POST",
      cancelToken: source.token,
      data: {
        query: `
          query GitConvexResults{
            gitConvexApi(route: "${ROUTE_FETCH_REPO}"){
              fetchRepo{
                repoId
                repoName
                repoPath
              }
            }
          }
        `,
      },
    })
      .then((res) => {
        const apiResponse = res.data.data.gitConvexApi.fetchRepo;

        if (apiResponse) {
          const { repoId, repoName, repoPath } = apiResponse;
          let repoContent = [];

          repoId.forEach((entry, index) => {
            repoContent.push({
              id: entry,
              repoName: repoName[index],
              repoPath: repoPath[index],
            });
          });

          setRepo(repoContent);
        }
      })
      .catch((err) => {});

    return () => {
      source.cancel();
    };
  }, [props.searchQuery]);

  return (
    <div className="w-full">
      {repo ? (
        repo.map((item) => {
          return (
            <div
              className="my-4 p-4 border-b mx-auto flex justify-around items-center cursor-pointer hover:bg-gray-200"
              onClick={(e) => {
                props.setSelectedRepoHandler(item);
              }}
            >
              <div className="w-1/2 text-2xl font-sand font-semibold">
                {item.repoName}
              </div>
              <div className="w-1/4 block justify-center">
                <div className="bg-blue-100 border shadow rounded p-2">
                  PATH
                </div>
                <div className="my-2 text-lg font-light text-gray-700">
                  {item.repoPath}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center text-2xl font-sans font-light">
          Loading...
        </div>
      )}
    </div>
  );
}
