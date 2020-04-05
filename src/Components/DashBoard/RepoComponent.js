import React, { useEffect, useState, useRef } from "react";
import { getAPIURL } from "../../apiURLSupplier";

import axios from "axios";
import {
  PORT_FETCHREPO_API,
  API_FETCHREPO,
  CONFIG_HTTP_MODE,
} from "../../env_config";

export default function RepoComponent() {
  const [repoStatus, setRepoStatus] = useState(false);
  const [repo, setRepo] = useState([]);

  const repoName = React.createRef();
  const repoPath = React.createRef();

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
                `,
      },
    }).then((res) => {
      if (res.data.status === "REPO_PRESENT") {
        setRepoStatus(true);
      }
    });
  }, []);

  const showAvailableRepo = () => {
    const repoArray = repo;

    return repoArray.map((entry) => {
      return entry.name;
    });
  };

  const addNeRepo = () => {
    return (
      <>
        <div id="repoFileInput">
          <div className="p-12 rounded-lg shadow-md m-6 ml-12 justify-center bg-gray-200 align-middle border border-gray-100 w-1/4 text-center">
            <div className="text-6xl font-bold text-black-800 text-center">
              +
            </div>
            <div>Click to add a Repo</div>
          </div>
        </div>
      </>
    );
  };

  const repoAddForm = () => {
    return (
      <div className="block text-center justify-center my-3 p-6 rounded-lg shadow-md border-2 border-gray-200 w-11/12 mx-auto">
        <div className="repo-form block">
          <div className="my-3 text-center block text-3xl font-sans text-gray-800">
            Enter Repo Details
          </div>
          <div>
            <input
              type="text"
              placeholder="Enter a Repository Name"
              className="w-11/12 p-3 my-3 rounded-md outline-none border-blue-100 border-2 shadow-md"
            ></input>
          </div>
          <div>
            <input
              type="text"
              placeholder="Enter repository path"
              className="w-11/12 p-3 my-3 rounded-md outline-none border-blue-100 border-2 shadow-md"
            ></input>
          </div>
          <div className="flex w-11/12 justify-start mx-auto my-5">
            <div className="block w-1/2 mx-3 p-3 my-2 bg-green-400 rounded-md shadow-md hover:bg-green-500">
              Submit
            </div>
            <div className="my-2 w-1/2 block mx-3 p-3 bg-red-400 rounded-md shadow-md hover:bg-red-500">
              Close
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div>
        {repoStatus ? showAvailableRepo() : addNeRepo()}
        {repoAddForm()}
      </div>
    </>
  );
}
