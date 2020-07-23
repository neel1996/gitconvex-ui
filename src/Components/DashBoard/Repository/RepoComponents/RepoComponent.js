import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  PRESENT_REPO,
  DELETE_PRESENT_REPO,
  ADD_FORM_CLOSE,
} from "../../../../actionStore";
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
    // dispatch({ type: ADD_FORM_CLOSE, payload: false });

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
        <div className="fixed bottom-0 right-0 mb-10 mr-16 cursor-pointer block justify-center">
          <div
            id="addRepoButton"
            className="border-8 border-indigo-100 shadow-lg bg-indigo-300 hover:bg-indigo-400 rounded-full h-20 w-20 flex align-middle justify-center text-4xl text-white font-sans font-black"
            onClick={() => {
              setRepoFormEnable(true);
              dispatch({ type: ADD_FORM_CLOSE, payload: false });
            }}
            onMouseEnter={(event) => {
              event.stopPropagation();
              event.preventDefault();
              document.getElementById("pop-up").classList.remove("hidden");
            }}
            onMouseLeave={(event) => {
              document.getElementById("pop-up").classList.add("hidden");
            }}
          >
            <span>+</span>
            <div
              id="pop-up"
              className="fixed p-2 hidden rounded bg-white text-gray-700 w-48 text-center font-sans font-medium border border-gray-500 shadow-lg text-sm mx-auto w-1/8"
              style={{ marginTop: "-75px", width: "130px" }}
            >
              Click to add a new repo
            </div>
          </div>
        </div>
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
