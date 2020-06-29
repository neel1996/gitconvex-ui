import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { PRESENT_REPO, DELETE_PRESENT_REPO } from "../../../../actionStore";
import { ContextProvider } from "../../../../context";
import {
  globalAPIEndpoint,
  ROUTE_FETCH_REPO,
} from "../../../../util/env_config";
import AddRepoFormComponent from "./AddRepoForm";
import RepoCard from "./RepoCard";

export default function RepoComponent(props) {
  const [repo, setRepo] = useState([]);
  const [repoFormEnable, setRepoFormEnable] = useState(false);

  const { dispatch } = useContext(ContextProvider);

  useEffect(() => {
    const fetchRepoURL = globalAPIEndpoint;

    const token = axios.CancelToken;
    const source = token.source();

    axios({
      url: fetchRepoURL,
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
    }).then((res) => {
      const apiResponse = res.data.data.gitConvexApi.fetchRepo;

      if (apiResponse) {
        const { repoId, repoName } = apiResponse;
        let repoContent = [];

        repoId.forEach((entry, index) => {
          repoContent.push({ id: entry, repoName: repoName[index] });
        });

        setRepo(repoContent);

        dispatch({
          type: DELETE_PRESENT_REPO,
          payload: [],
        });

        dispatch({
          action: PRESENT_REPO,
          payload: [...repoContent],
        });
      }
    });

    return () => {
      source.cancel();
    };
  }, [repoFormEnable, dispatch]);

  const showAvailableRepo = () => {
    const repoArray = repo;

    return (
      <>
        <div className="w-full mx-auto justify-around flex flex-wrap pb-40">
          <>
            {repoArray.length > 0 ? (
              <>
                {repoArray.map((entry) => {
                  return <RepoCard key={entry.id} repoData={entry}></RepoCard>;
                })}
              </>
            ) : (
              <div className="mx-auto w-3/4 rounded-md text-center shadow bg-gray-200 text-gray-500 font-sans p-10 my-10 text-xl">
                No repos present. Press + to add a new repo
              </div>
            )}
          </>
        </div>
        <>
          <div
            id="addRepoButton"
            className="fixed bottom-0 right-0 mb-16 mr-20 cursor-pointer border-2 border-indigo-100 shadow-lg bg-indigo-500 hover:bg-indigo-400 rounded-full h-16 w-16 pb-1 flex items-center justify-center text-3xl text-white font-sans font-black"
            onClick={() => {
              setRepoFormEnable(true);
            }}
            onMouseEnter={(event) => {
              event.stopPropagation();
              event.preventDefault();
              let popUp =
                '<div class="p-2 rounded bg-white text-gray-700 w-48 mt-16 text-center font-sans font-medium border border-gray-300 text-sm my-2 fixed">Click to add a new repo</div>';
              event.target.innerHTML += popUp;
            }}
            onMouseLeave={(event) => {
              event.target.innerHTML = "+";
            }}
          >
            +
          </div>
        </>
      </>
    );
  };

  const addFormRemove = (param) => {
    setRepoFormEnable(param);
  };

  return (
    <div className="flex flex-wrap mx-auto justify-center text-center align-middle">
      {!repoFormEnable ? (
        showAvailableRepo()
      ) : (
        <AddRepoFormComponent formEnable={addFormRemove}></AddRepoFormComponent>
      )}
    </div>
  );
}
