import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { PRESENT_REPO } from "../../../../actionStore";
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

    axios({
      url: fetchRepoURL,
      method: "POST",
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
          type: PRESENT_REPO,
          payload: repoContent,
        });
      }
    });
  }, [repoFormEnable, dispatch]);

  const showAvailableRepo = () => {
    const repoArray = repo;

    return (
      <>
        <div className="w-full mx-auto justify-around flex flex-wrap pb-40">
          <>
            {repoArray.map((entry) => {
              return <RepoCard key={entry.id} repoData={entry}></RepoCard>;
            })}
          </>
        </div>
        <>
          <div
            className="fixed bottom-0 right-0 mb-10 mr-20 cursor-pointer border-2 border-indigo-100 shadow-lg bg-indigo-500 hover:bg-indigo-400 rounded-full h-16 w-16 pb-1 flex items-center justify-center text-3xl text-white font-sans font-black"
            title="Add a Git repo"
            onClick={() => {
              setRepoFormEnable(true);
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
