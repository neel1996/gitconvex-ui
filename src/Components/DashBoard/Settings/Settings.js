import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  globalAPIEndpoint,
  ROUTE_SETTINGS_DBPATH,
  ROUTE_SETTINGS_REPODETAILS
} from "../../../util/env_config";

export default function Settings(props) {
  library.add(fab, fas);

  const dbPathTextRef = useRef();

  const [dbPath, setDbPath] = useState("");
  const [repoDetails, setRepoDetails] = useState([]);

  useEffect(() => {
    axios({
      url: globalAPIEndpoint,
      method: "POST",
      data: {
        query: `
          query GitConvexResults{
            gitConvexApi(route: "${ROUTE_SETTINGS_DBPATH}"){
              settingsDatabasePath
            }
          }
        `,
      },
    })
      .then((res) => {
        if (res.data.data && !res.data.error) {
          const dbPathText = res.data.data.gitConvexApi.settingsDatabasePath;
          setDbPath(dbPathText);
          dbPathTextRef.current.value = dbPathText;
        }
      })
      .catch((err) => {
        console.log(err);
      });

    axios({
      url: globalAPIEndpoint,
      method: "POST",
      data: {
        query: `
            query GitConvexResults{
              gitConvexApi(route: "${ROUTE_SETTINGS_REPODETAILS}"){
                settingsRepoDetails{
                  id
                  repoPath
                  repoName
                  timeStamp
                }
              }
            }
          `,
      },
    })
      .then((res) => {
        if (res.data.data && !res.data.error) {
          const repoDetailsArray =
            res.data.data.gitConvexApi.settingsRepoDetails;
          setRepoDetails([...repoDetailsArray]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props]);

  const databasePathSettings = () => {
    return (
      <div className="settings-data">
        <div className="text-xl text-gray-700 font-sans font-semibold">
          Server data file (file which stores repo details)
        </div>
        <div className="my-4">
          <input
            type="text"
            className="p-2 rounded border border-gray-500 bg-gray-200 text-gray-800 w-1/2"
            ref={dbPathTextRef}
          ></input>
          <div className="text-justify font-sand font-light text-sm my-4 text-gray-500 italic w-1/2">
            The data file can be updated. The data file must be an accessible
            JSON file with read / write permissions set to it. Also make sure
            you enter the full path for the file
            <pre className="my-2">E.g: /opt/my_data/data-file.json</pre>
          </div>
        </div>
      </div>
    );
  };

  const repoDetailsSettings = () => {
    return (
      <div className="repo-data my-10">
        <div className="text-xl text-gray-700 font-sans font-semibold">
          Saved Repos
        </div>
        <>
          {repoDetails && repoDetails.length > 0 ? (
            <>
              <div className="flex my-4 bg-indigo-500 my-1 w-11/12 rounded text-white bg-white shadow p-3 font-sand text-xl font-semibold">
                <div className="w-1/2 border-r text-center">Repo ID</div>
                <div className="w-1/2 border-r text-center">Repo Name</div>
                <div className="w-1/2 border-r text-center">Repo Path</div>
                <div className="w-1/2 border-r text-center">
                  Created Timestamp
                </div>
                <div className="w-1/2 border-r text-center">Action</div>
              </div>
              {repoDetails.map((repo) => {
                return (
                  <div
                    className="flex my-1 w-11/12 rounded bg-white shadow p-3 font-sans text-gray-800"
                    key={repo.id}
                  >
                    <div className="w-1/2 px-2 border-r font-sans break-all">
                      {repo.id}
                    </div>
                    <div className="w-1/2 px-2 border-r font-bold font-sans break-all">
                      {repo.repoName}
                    </div>
                    <div className="w-1/2 px-2 border-r font-sans break-all text-sm font-light text-blue-600">
                      {repo.repoPath}
                    </div>
                    <div className="w-1/2 px-2 border-r font-sans break-all text-sm font-light">
                      {repo.timeStamp}
                    </div>
                    <div className="w-1/2 px-2 border-r font-sans break-all">
                      <div className="bg-red-600 p-2 mx-auto my-auto rounded shadow text-center w-1/4 hover:bg-red-400 cursor-pointer">
                        <FontAwesomeIcon
                          color="white"
                          icon={["fas", "trash-alt"]}
                        ></FontAwesomeIcon>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="my-4 mx-auto bg-gray-200 text-center p-3 rounded shadow w-3/4">
              No repos are being managed by Gitconvex. YOu can add one from the
              dashboard
            </div>
          )}
        </>
      </div>
    );
  };

  return (
    <div className="block w-full h-full overflow-auto">
      <div className="font-sans text-6xl my-4 mx-10 text-gray-700 block items-center align-middle">
        <FontAwesomeIcon
          className="text-5xl"
          icon={["fas", "cogs"]}
        ></FontAwesomeIcon>
        <span className="mx-10">Settings</span>
      </div>
      <div className="block my-10 justify-center mx-auto w-3/4">
        {dbPath ? databasePathSettings() : null}
        {repoDetails ? repoDetailsSettings() : null}
      </div>
    </div>
  );
}
