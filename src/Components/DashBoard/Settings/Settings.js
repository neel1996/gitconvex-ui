import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { DELETE_PRESENT_REPO } from "../../../actionStore";
import { ContextProvider } from "../../../context";
import {
  globalAPIEndpoint,
  ROUTE_SETTINGS_DBPATH,
  ROUTE_SETTINGS_REPODETAILS
} from "../../../util/env_config";

export default function Settings(props) {
  library.add(fab, fas);

  const dbPathTextRef = useRef();

  const { state, dispatch } = useContext(ContextProvider);
  const { presentRepo } = state;

  const [dbPath, setDbPath] = useState("");
  const [repoDetails, setRepoDetails] = useState([]);
  const [backdropToggle, setBacldropToggle] = useState(false);
  const [deleteRepo, setDeleteRepo] = useState({});
  const [deleteRepoStatus, setDeleteRepoStatus] = useState("");
  const [viewReload, setViewReload] = useState(0);

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
      cancelToken: source.token,
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

    return () => {
      source.cancel();
    };
  }, [props, viewReload]);

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

  function deleteRepoHandler() {
    const repoColumn = ["Repo ID", "Repo Name", "Repo Path", "Timestamp"];
    let repoArray = [];

    Object.keys(deleteRepo).forEach((key, index) => {
      repoArray.push({ label: repoColumn[index], value: deleteRepo[key] });
    });

    return (
      <div className="w-3/4 p-6 mx-auto my-auto rounded shadow bg-white">
        <div className="mx-4 my-2 text-3xl font-sans text-gray-900">
          The repo below will be removed from Gitconvex records.
        </div>
        <div className="mx-4 my-1 text-md font-light w-5/6 font-sans italic text-gray-800">
          This will not delete the actual git folder. Just the record from the
          gitconvex server will be removed
        </div>
        <div className="my-2 mx-auto block justify-center w-3/4 p-2">
          {repoArray.map((item) => {
            return (
              <div className="mx-auto flex p-2 font-sans" key={item.label}>
                <div className="w-2/4 font-semibold">{item.label}</div>
                <div className="w-2/4">{item.value}</div>
              </div>
            );
          })}
        </div>
        {deleteRepoStatus !== "loading" ? (
          <div
            className="cursor-pointer mx-auto my-4 text-center p-3 rounded shadow bg-red-400 hover:bg-red-500 text-white text-xl"
            onClick={() => {
              deleteRepoApiHandler();
            }}
          >
            Confirm Delete
          </div>
        ) : (
          <div className="cursor-pointer mx-auto my-4 text-center p-3 text-white rounded shadow bg-gray-400 hover:bg-gray-500 text-white text-xl">
            Deletion in progress
          </div>
        )}
        {deleteRepoStatus === "success" ? (
          <div className="p-4 mx-auto text-center font-sans font-semibold bg-green-300 text-green-600 my-4">
            Repo has been deleted!
          </div>
        ) : null}
        {deleteRepoStatus === "failed" ? (
          <div className="p-4 mx-auto text-center font-sans font-semibold bg-red-300 my-4">
            Repo deletion failed!
          </div>
        ) : null}
      </div>
    );
  }

  function deleteRepoApiHandler() {
    setDeleteRepoStatus("loading");
    const { id, repoName, repoPath, timeStamp } = deleteRepo;
    axios({
      url: globalAPIEndpoint,
      method: "POST",
      data: {
        query: `
          mutation GitConvexMutation{
            deleteRepo(repoId: "${id}", name: "${repoName}", pathName: "${repoPath}", time: "${timeStamp}"){
              status
              repoId
            }
          }
        `,
      },
    })
      .then((res) => {
        if (res.data.data && !res.data.eror) {
          const { status, repoId } = res.data.data.deleteRepo;
          if (status === "DELETE_SUCCESS") {
            if (presentRepo && presentRepo.length > 0) {
              let localState = presentRepo[0];

              localState = localState.map((item) => {
                if (item.id.toString() === repoId.toString()) {
                  return null;
                } else {
                  return item;
                }
              });

              dispatch({
                action: DELETE_PRESENT_REPO,
                payload: [...localState],
              });
            }

            setDeleteRepoStatus("success");
          } else {
            setDeleteRepoStatus("failed");
          }
        }
      })
      .catch((err) => {
        console.log(err);
        setDeleteRepoStatus("failed");
      });
  }

  const repoDetailsSettings = () => {
    return (
      <div className="repo-data my-10">
        <div className="text-xl text-gray-700 font-sans font-semibold">
          Saved Repos
        </div>
        <>
          {repoDetails && repoDetails.length > 0 ? (
            <>
              <div className="flex my-4 bg-indigo-500 my-1 w-full rounded text-white bg-white shadow p-3 font-sand text-xl font-semibold">
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
                    className="flex my-1 w-full rounded bg-white shadow p-3 font-sans text-gray-800"
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
                      <div
                        className="bg-red-600 p-2 mx-auto my-auto rounded shadow text-center w-1/2 hover:bg-red-400 cursor-pointer"
                        onClick={(event) => {
                          setBacldropToggle(true);
                          setDeleteRepo(repo);
                        }}
                      >
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
              No repos are being managed by Gitconvex. You can add one from the
              dashboard
            </div>
          )}
        </>
      </div>
    );
  };

  return (
    <>
      {backdropToggle ? (
        <div
          className="fixed w-full h-full top-0 left-0 right-0 flex overflow-auto"
          id="settings-backdrop"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={(event) => {
            if (event.target.id === "settings-backdrop") {
              setDeleteRepoStatus("");
              setBacldropToggle(false);
              let localViewReload = viewReload + 1;
              setViewReload(localViewReload);
            }
          }}
        >
          {deleteRepo ? deleteRepoHandler() : null}
          <div
            className="top-0 right-0 fixed float-right font-semibold my-2 bg-red-500 text-3xl cursor-pointer text-center text-white my-5 align-middle rounded-full w-12 h-12 items-center align-middle shadow-md mr-5"
            onClick={() => {
              setBacldropToggle(false);
              let localViewReload = viewReload + 1;
              setViewReload(localViewReload);
            }}
          >
            X
          </div>
        </div>
      ) : null}
      <div className="block w-full h-full overflow-auto">
        <div className="font-sans text-6xl my-4 mx-10 text-gray-700 block items-center align-middle">
          <FontAwesomeIcon
            className="text-5xl"
            icon={["fas", "cogs"]}
          ></FontAwesomeIcon>
          <span className="mx-10">Settings</span>
        </div>
        <div className="block my-10 justify-center mx-auto w-11/12">
          {dbPath ? databasePathSettings() : null}
          {repoDetails ? repoDetailsSettings() : null}
        </div>
      </div>
    </>
  );
}
