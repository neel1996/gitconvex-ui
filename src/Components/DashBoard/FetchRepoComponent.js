import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { PRESENT_REPO } from "../../actionStore";
import { ContextProvider } from "../../context";
import { globalAPIEndpoint, ROUTE_FETCH_REPO } from "../../env_config";
import AddRepoFormComponent from "./AddRepoForm";

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
              const repoName = entry.repoName;
              var avatar = "";

              if (repoName) {
                if (repoName.split(" ").length > 1) {
                  let tempName = repoName.split(" ");
                  avatar =
                    tempName[0].substring(0, 1) + tempName[1].substring(0, 1);
                  avatar = avatar.toUpperCase();
                } else {
                  avatar = repoName.substring(0, 1).toUpperCase();
                }
              }

              return (
                <NavLink
                  to={`/dashboard/repository/${entry.id}`}
                  className="w-1/4 block p-6 mx-6 rounded-lg border border-gray-300 shadow-md my-6 text-center bg-blue-100 cursor-pointer hover:shadow-xl"
                  key={entry.repoName}
                >
                  <div>
                    <div className="text-center bg-blue-600 text-white text-5xl my-2 px-10 py-5">
                      {avatar}
                    </div>
                    <div className="my-4 font-sans text-2xl">
                      {entry.repoName}
                    </div>
                  </div>
                </NavLink>
              );
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
