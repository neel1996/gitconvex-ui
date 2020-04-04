import React, { useEffect, useState } from "react";
import {getAPIURL} from "../../apiURLSupplier";

import axios from "axios";
import {
  PORT_FETCHREPO_API,
  API_FETCHREPO,
  CONFIG_HTTP_MODE,
} from "../../env_config";

export default function RepoComponent() {
  const [repoStatus, setRepoStatus] = useState(false);
  const [repo, setRepo] = useState([]);

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
        return entry.name
    });
  };

  return (
    <>
      <div>
        {repoStatus ? (
          showAvailableRepo()
        ) : (
          <div className="p-12 rounded-lg shadow-md m-6 justify-center align-middle border border-gray-100 w-1/4 text-center">
            <div className="text-5xl text-gray-200 text-center">+</div>
            <div>Click to add a Repo</div>
          </div>
        )}
      </div>
    </>
  );
}
