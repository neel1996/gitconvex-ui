import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { PRESENT_REPO } from "../../actionStore";
import { getAPIURL } from "../../apiURLSupplier";
import { ContextProvider } from "../../context";
import { API_ADDREPO, API_FETCHREPO, CONFIG_HTTP_MODE, PORT_ADDREPO_API, PORT_FETCHREPO_API } from "../../env_config";

export default function RepoComponent(props) {
  const [repoStatus, setRepoStatus] = useState(false);
  const [repo, setRepo] = useState([]);
  const [repoFormEnable, setRepoFormEnable] = useState(false);

  const [repoNameState, setRepoName] = useState("");
  const [repoPathState, setRepoPath] = useState("");

  const { state, dispatch } = useContext(ContextProvider);

  useEffect(() => {
    const fetchRepoURL = getAPIURL(
      CONFIG_HTTP_MODE,
      API_FETCHREPO,
      PORT_FETCHREPO_API
    );

    axios({
      url: fetchRepoURL,
      method: "POST",
      data: {
        query: `
                    query{
                        fetchRepo
                    }
                `
      }
    }).then(res => {
      const apiResponse = JSON.parse(res.data.data.fetchRepo);

      if (apiResponse.status === "REPO_PRESENT") {
        const repoContent = JSON.parse(apiResponse.content);
        setRepoStatus(true);
        setRepo(repoContent);
        dispatch({
          type: PRESENT_REPO,
          payload: repoContent
        });
      }
    });
  }, []);

  const showAvailableRepo = () => {
    const repoArray = repo;

    return (
      <>
        <div className="w-5/6 mx-auto flex">
          {!repoFormEnable ? (
            <>
              {repoArray.map(entry => {
                const repoName = entry.repoName;
                var avatar = "";

                if (repoName.split(" ").length > 1) {
                  let tempName = repoName.split(" ");
                  avatar =
                    tempName[0].substring(0, 1) + tempName[1].substring(0, 1);
                  avatar = avatar.toUpperCase();
                } else {
                  avatar = repoName.substring(0, 1).toUpperCase();
                }

                return (
                  <NavLink
                    to={`/dashboard/repository/${entry.id}`}
                    className="pl-4 pr-4 py-3 pt-6 pb-6 rounded-lg shadow-md my-6 text-center xl:w-1/4 lg:w-1/3 md:w-1/2 md:block mx-auto bg-blue-100 border border-gray-100 text-center cursor-pointer hover:shadow-xl"
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
          ) : null}
        </div>
        {addNewRepo()}
      </>
    );
  };

  const addNewRepo = () => {
    return !repoFormEnable ? (
      <>
        <div
          className="my-20 rounded-lg pt-4 pl-2 pr-2 pb-8 w-1/5 mx-auto justify-center shadow-md bg-gray-100 hover:bg-gray-300 border-2 border-gray-300 border-dotted cursor-pointer"
          onClick={() => {
            setRepoFormEnable(true);
          }}
        >
          <div className="text-6xl font-bold text-black-800 text-center">+</div>
          <div className="text-1xl text-gray-700">Click to add a Repo</div>
        </div>
      </>
    ) : null;
  };

  const repoAddForm = () => {
    return repoFormEnable ? (
      <div className="block text-center justify-center my-20 p-6 rounded-lg shadow-md border-2 border-gray-200 w-11/12 mx-auto">
        <div className="repo-form block">
          <div className="my-3 text-center block text-3xl font-sans text-gray-800">
            Enter Repo Details
          </div>
          <div>
            <input
              type="text"
              placeholder="Enter a Repository Name"
              className="w-11/12 p-3 my-3 rounded-md outline-none border-blue-100 border-2 shadow-md"
              onChange={event => {
                setRepoName(event.target.value);
              }}
            ></input>
          </div>
          <div>
            <input
              type="text"
              placeholder="Enter repository path"
              className="w-11/12 p-3 my-3 rounded-md outline-none border-blue-100 border-2 shadow-md"
              onChange={event => {
                setRepoPath(event.target.value);
              }}
            ></input>
          </div>
          <div className="flex w-11/12 justify-start mx-auto my-5 cursor-pointer">
            <div
              className="block w-1/2 mx-3 p-3 my-2 bg-green-400 rounded-md shadow-md hover:bg-green-500"
              onClick={() => {
                storeRepoAPI(repoNameState, repoPathState);
              }}
            >
              Submit
            </div>
            <div
              className="my-2 w-1/2 block mx-3 p-3 bg-red-400 rounded-md shadow-md hover:bg-red-500"
              onClick={() => {
                setRepoFormEnable(false);
              }}
            >
              Close
            </div>
          </div>
        </div>
      </div>
    ) : null;
  };

  return (
    <div className="flex md:block flex-wrap mx-auto justify-center text-center align-middle">
      {repoStatus ? showAvailableRepo() : addNewRepo()}
      {repoAddForm()}
    </div>
  );

  function storeRepoAPI(repoName, repoPath) {
    axios({
      url: getAPIURL(CONFIG_HTTP_MODE, API_ADDREPO, PORT_ADDREPO_API),
      method: "POST",
      data: {
        repoName,
        repoPath
      }
    })
      .then(res => {
        console.log(res);
        setRepoFormEnable(!setRepoFormEnable);
      })
      .catch(err => {
        console.log(err);
      });
  }
}
