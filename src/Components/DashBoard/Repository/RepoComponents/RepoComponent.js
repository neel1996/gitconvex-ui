import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { PRESENT_REPO } from "../../../../actionStore";
import { ContextProvider } from "../../../../context";
import { globalAPIEndpoint, ROUTE_FETCH_REPO } from "../../../../util/env_config";
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
  }, [repoFormEnable]);

  const showAvailableRepo = () => {
    const repoArray = repo;

    return (
      <>
        <div className="w-full mx-auto justify-around flex flex-wrap">
          <>
            {repoArray.map((entry) => {
              return <RepoCard repoData={entry}></RepoCard>;
            })}
          </>
        </div>
        <>
          <div
            className="my-20 rounded-lg pt-4 pl-2 pr-2 pb-8 w-1/5 mx-auto justify-center shadow-md bg-gray-100 hover:bg-gray-300 border-2 border-gray-300 border-dotted cursor-pointer"
            onClick={() => {
              setRepoFormEnable(true);
            }}
          >
            <div className="text-6xl font-bold text-black-800 text-center">
              +
            </div>
            <div className="text-1xl text-gray-700">Click to add a Repo</div>
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
