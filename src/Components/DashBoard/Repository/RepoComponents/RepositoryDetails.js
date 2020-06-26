import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import {
  globalAPIEndpoint,
  ROUTE_REPO_DETAILS,
} from "../../../../util/env_config";
import RepositoryCommitLogComponent from "./RepositoryCommitLogComponent";

export default function RepositoryDetails(props) {
  library.add(fab, fas);
  const [gitRepoStatus, setGitRepoStatus] = useState({});
  const [repoFetchFailed, setRepoFetchFailed] = useState(false);
  const [repoIdState, setRepoIdState] = useState("");
  const [showCommitLogs, setShowCommitLogs] = useState(false);
  const [isMultiRemote, setIsMultiRemote] = useState(false);
  const [multiRemoteCount, setMultiRemoteCount] = useState(0);
  const [backdropToggle, setBackdropToggle] = useState(false);
  const [action, setAction] = useState("");

  const memoizedCommitLogComponent = useMemo(() => {
    return (
      <RepositoryCommitLogComponent
        repoId={repoIdState}
      ></RepositoryCommitLogComponent>
    );
  }, [repoIdState]);

  const memoizedFetchRemoteComponent = useMemo(() => {
    return <FetchRemoteComponent repoId={repoIdState}></FetchRemoteComponent>;
  }, [repoIdState]);

  const memoizedPullRemoteComponent = useMemo(() => {
    return <PullRemoteComponent repoId={repoIdState}></PullRemoteComponent>;
  }, [repoIdState]);

  useEffect(() => {
    const endpointURL = globalAPIEndpoint;

    if (props.parentProps.location) {
      const repoId = props.parentProps.location.pathname.split(
        "/repository/"
      )[1];

      setRepoIdState(repoId);

      const payload = JSON.stringify(JSON.stringify({ repoId: repoId }));

      axios({
        url: endpointURL,
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        data: {
          query: `

            query GitConvexApi
            {
              gitConvexApi(route: "${ROUTE_REPO_DETAILS}", payload: ${payload}){
                gitRepoStatus {
                  gitRemoteData
                  gitRepoName
                  gitBranchList
                  gitCurrentBranch
                  gitRemoteHost
                  gitTotalCommits
                  gitLatestCommit
                  gitTrackedFiles
                  gitFileBasedCommit
                  gitTotalTrackedFiles    
                }
              }
            }
          `,
        },
      })
        .then((res) => {
          if (res.data && res.data.data && !res.data.error) {
            let gitRemoteLocal =
              res.data.data.gitConvexApi.gitRepoStatus.gitRemoteData;
            if (gitRemoteLocal.includes("||")) {
              setIsMultiRemote(true);
              res.data.data.gitConvexApi.gitRepoStatus.gitRemoteData = gitRemoteLocal.split(
                "||"
              )[0];
              setIsMultiRemote(true);
              setMultiRemoteCount(gitRemoteLocal.split("||").length);
            }
            setGitRepoStatus(res.data.data.gitConvexApi.gitRepoStatus);
          } else {
            setRepoFetchFailed(true);
          }
        })
        .catch((err) => {
          if (err) {
            console.log("API GitStatus error occurred : " + err);
            setRepoFetchFailed(true);
          }
        });
    }
  }, [props.parentProps, backdropToggle]);

  function FetchRemoteComponent(props) {
    const { repoId } = props;
    const [fetchResult, setFecthResult] = useState([]);

    useEffect(() => {
      axios({
        url: globalAPIEndpoint,
        method: "POST",
        data: {
          query: `
            mutation GitConvexMutation{
              fetchFromRemote(repoId: "${repoId}"){
                status
                fetchedItems
              }
            }
          `,
        },
      })
        .then((res) => {
          if (res.data.data && !res.data.error) {
            const fetchResponse = res.data.data.fetchFromRemote;
            if (fetchResponse.status === "FETCH_ABSENT") {
              setFecthResult([
                <div className="text-xl p-2 text-gray-900 font-semibold">
                  No changes to Fetch from remote
                </div>,
              ]);
            } else if (fetchResponse === "FETCH_ERROR") {
              setFecthResult([
                <div className="text-xl p-2 text-pink-800 border border-pink-200 shadow rounded font-semibold">
                  Error while fetching from remote!
                </div>,
              ]);
            } else {
              const fetchArray = fetchResponse.fetchedItems;
              setFecthResult([...fetchArray]);
            }
          }
        })
        .catch((err) => {
          setFecthResult([
            <div className="text-xl p-2 text-pink-800 border border-pink-200 shadow rounded font-semibold">
              Error while fetching from remote!
            </div>,
          ]);
        });
    }, [repoId]);

    return (
      <div className="w-1/2 mx-auto my-auto bg-gray-200 p-6 rounded-md pb-10">
        <div className="mx-3 my-3 text-3xl font-sans text-gray-800">
          Fetch Result
        </div>
        {fetchResult && fetchResult.length > 0 ? (
          <>
            <div className="p-3 rounded shadow bg-indigo-100 text-md font-sans text-gray-700">
              {fetchResult.map((result) => {
                return (
                  <div className="my-1 mx-2 break-normal" key={result}>
                    {result}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="rounded mx-auto p-4 my-auto w-11/12 shadow bg-orange-200 border-orange-700 text-xl font-sand font-semibold">
              Fetching changes from remote...
            </div>
          </>
        )}
      </div>
    );
  }

  function PullRemoteComponent(props) {
    const { repoId } = props;

    const [pullResult, setPullResult] = useState([]);

    useEffect(() => {
      axios({
        url: globalAPIEndpoint,
        method: "POST",
        data: {
          query: `
            mutation GitConvexMutation{
              pullFromRemote(repoId: "${repoId}"){
                status
                pulledItems
              }
            }
          `,
        },
      })
        .then((res) => {
          if (res.data.data && !res.data.error) {
            const pullResponse = res.data.data.pullFromRemote;

            if (pullResponse.status === "PULL_FAILED") {
              setPullResult([
                <div className="text-xl p-2 text-pink-800 border border-pink-200 shadow rounded font-semibold">
                  Error while pulling from remote!
                </div>,
              ]);
            } else if (pullResponse.status === "PULL_EMPTY") {
              setPullResult([
                <div className="text-xl p-2 text-gray-900 font-semibold">
                  No changes to Pull from remote
                </div>,
              ]);
            } else {
              const pullArray = pullResponse.pulledItems;
              setPullResult([...pullArray]);
            }
          }
        })
        .catch((err) => {
          console.log(err);
          setPullResult([
            <div className="text-xl p-2 text-pink-800 border border-pink-200 shadow rounded font-semibold">
              Error while pulling from remote!
            </div>,
          ]);
        });
    }, [repoId]);

    return (
      <div className="w-1/2 mx-auto my-auto bg-gray-200 p-6 rounded-md pb-10">
        <div className="mx-3 my-3 text-3xl font-sans text-gray-800">
          Pull Result
        </div>
        {pullResult && pullResult.length > 0 ? (
          <>
            <div className="p-3 rounded shadow bg-indigo-100 text-md font-sans text-gray-700">
              {pullResult.map((result) => {
                return (
                  <div className="my-1 mx-2 break-normal" key={result}>
                    {result}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="rounded mx-auto p-4 my-auto w-11/12 shadow bg-orange-200 border-orange-700 text-xl font-sand font-semibold">
              Pulling changes from remote...
            </div>
          </>
        )}
      </div>
    );
  }

  const {
    gitRemoteData,
    gitRepoName,
    gitBranchList,
    gitCurrentBranch,
    gitRemoteHost,
    gitTotalCommits,
    gitLatestCommit,
    gitTrackedFiles,
    gitFileBasedCommit,
  } = gitRepoStatus;

  const gitRepoHeaderContent = () => {
    return (
      <div className="mx-auto w-5/6 flex rounded-md shadow-md border-2 border-gray-100 p-4 justify-evenly">
        <div className="text-xl p-2 mx-2">Repo Name</div>
        <div className="bg-blue-100 text-blue-900 p-3 rounded-sm border border-blue-200">
          {gitRepoName}
        </div>
        <div className="text-xl p-2 mx-2">Active Branch</div>
        <div className="bg-orange-200 rounded-sm text-orange-900 p-3 border border-orange-400">
          {gitCurrentBranch}
        </div>
      </div>
    );
  };

  const gitRepoLeftPane = () => {
    var remoteLogo = "";

    if (gitRemoteHost) {
      if (gitRemoteHost.match(/github/i)) {
        remoteLogo = (
          <FontAwesomeIcon
            icon={["fab", "github"]}
            className="text-2xl text-center text-pink-500"
          ></FontAwesomeIcon>
        );
      } else if (gitRemoteHost.match(/gitlab/i)) {
        remoteLogo = (
          <FontAwesomeIcon
            icon={["fab", "gitlab"]}
            className="text-2xl text-center text-pink-400"
          ></FontAwesomeIcon>
        );
      } else if (gitRemoteHost.match(/bitbucket/i)) {
        remoteLogo = (
          <FontAwesomeIcon
            icon={["fab", "bitbucket"]}
            className="text-2xl text-center text-pink-400"
          ></FontAwesomeIcon>
        );
      } else if (gitRemoteHost.match(/codecommit/i)) {
        remoteLogo = (
          <FontAwesomeIcon
            icon={["fab", "aws"]}
            className="text-2xl text-center text-pink-400"
          ></FontAwesomeIcon>
        );
      } else {
        remoteLogo = (
          <FontAwesomeIcon
            icon={["fab", "git-square"]}
            className="text-2xl text-center text-pink-400"
          ></FontAwesomeIcon>
        );
      }

      return (
        <>
          {showCommitLogs ? (
            <>
              <div
                className="fixed w-screen left-0 top-0 right-0 bottom-0 overflow-auto p-6"
                id="commit-log__backdrop"
                style={{ background: "rgba(0,0,0,0.5)", zIndex: 99 }}
                onClick={(event) => {
                  if (event.target.id === "commit-log__backdrop") {
                    setShowCommitLogs(false);
                  }
                }}
              >
                <div
                  className="float-right text-2xl font-sans pl-2 pr-2 p-1 cursor-pointer rounded-lg shadow-sm bg-red-500"
                  onClick={() => {
                    setShowCommitLogs(false);
                  }}
                >
                  X
                </div>
                <div id="commit-log__cards" className="w-3/4 block mx-auto">
                  {memoizedCommitLogComponent}
                </div>
              </div>
            </>
          ) : null}

          <div className="block rounded-md shadow-sm border-2 border-dotted border-gray-400 p-6 my-6 mx-3">
            <table className="table-auto" cellSpacing="10" cellPadding="20">
              <tbody>
                <tr>
                  <td className="text-xl text-gray-600">Remote Host</td>
                  <td>
                    <div className="p-1 rounded-md border-2 shadow-md text-center w-full border-gray-200">
                      <span className="p-3">{remoteLogo}</span>
                      <span className="text-center text-lg">
                        {gitRemoteHost}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td className="text-xl text-gray-600">{gitRemoteHost} URL</td>
                  <td>
                    <span className="text-blue-400 hover:text-blue-500 cursor-pointer">
                      {gitRemoteData}
                    </span>
                    <div>
                      {isMultiRemote ? (
                        <>
                          <span className="font-sans text-gray-800 font-semibold mr-2">
                            Entry truncated!
                          </span>
                          <span>Remote repos : {multiRemoteCount}</span>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td className="text-xl text-gray-600">Commit Logs</td>
                  <td>
                    <div
                      className="rounded-md shadow-md p-3 text-center bg-orange-300 cursor-pointer"
                      onClick={(event) => {
                        setShowCommitLogs(true);
                      }}
                    >
                      Show Commit Logs
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="block rounded-lg shadow-sm border-2 border-dotted border-gray-400 p-2 my-2 mx-3 w-1/2">
            <table className="table-light" cellPadding="10">
              <tbody>
                <tr>
                  <td className="text-lg text-gray-500 w-1/2">Total Commits</td>
                  <td className="text-left text-md text-bold text-black-800 w-1/2">
                    {gitTotalCommits} Commits
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td className="text-lg text-gray-500 w-1/2">Latest Commit</td>
                  <td className="text-left text-sm text-bold w-1/2 text-black-900 w-1/2">
                    {gitLatestCommit}
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td className="text-lg text-gray-500 align-text-top w-1/2">
                    <div className="flex p-2 items-center align-middle">
                      <div>Available Branches</div>
                      <div
                        id="addBranch"
                        className="mx-10 rounded-full items-center align-middle w-10 h-10 text-white text-2xl bg-green-400 text-center mx-auto shadow hover:bg-green-500 cursor-pointer"
                        onMouseEnter={(event) => {
                          event.stopPropagation();
                          event.preventDefault();
                          let popUp =
                            '<div class="p-2 rounded bg-white text-gray-700 w-32 text-center border border-gray-300 text-sm my-2 relative">Click to add a new branch</div>';
                          event.target.innerHTML += popUp;
                        }}
                        onMouseLeave={(event) => {
                          event.target.innerHTML = "+";
                        }}
                      >
                        +
                      </div>
                    </div>
                  </td>
                  <td className="w-1/2">
                    {gitBranchList &&
                      gitCurrentBranch &&
                      gitBranchList.map((entry) => {
                        return entry === gitCurrentBranch ? (
                          <div
                            className="text-lg font-semibold text-indigo-500"
                            key={entry}
                          >
                            {entry}
                          </div>
                        ) : (
                          <div
                            className="my-1 font-sans font-semibold"
                            key="entry-key"
                          >
                            - {entry}
                          </div>
                        );
                      })}
                  </td>
                </tr>
                <tr>
                  <td className="w-1/2">
                    <div
                      className="rounded text-center cursor-pointer p-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xl font-sans"
                      onClick={() => {
                        setBackdropToggle(true);
                        setAction("fetch");
                      }}
                    >
                      Fetch from remote
                    </div>
                  </td>
                  <td className="w-1/2">
                    <div
                      className="mx-auto text-center cursor-pointer rounded text-white p-2 bg-blue-500 hover:bg-blue-600 text-xl font-sans"
                      onClick={() => {
                        setBackdropToggle(true);
                        setAction("pull");
                      }}
                    >
                      Pull from remote
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      );
    } else {
      return (
        <div className="p-6 bg-orange-300 text-orange-900 my-4 rounded-lg shadow-md border border-gray-300">
          Fetching details from server...
        </div>
      );
    }
  };

  const gitTrackedFileComponent = () => {
    if (
      gitTrackedFiles &&
      gitTrackedFiles.length > 0 &&
      gitTrackedFiles[0] !== "NO_TRACKED_FILES"
    ) {
      var formattedFiles = [];
      var directoryEntry = [];
      var fileEntry = [];

      gitTrackedFiles.forEach((entry, index) => {
        const splitEntry = entry.split(":");

        if (splitEntry[1].includes("directory")) {
          directoryEntry.push(
            <tbody key={`dir-entry-${index}`}>
              <tr className="border-b border-gray-300 p-1 shadow-sm hover:bg-indigo-100">
                <td>
                  <FontAwesomeIcon
                    icon={["fas", "folder"]}
                    className="font-sans text-xl text-blue-600"
                  ></FontAwesomeIcon>
                </td>
                <td>
                  <div className="text-gray-800 text-lg mx-3 font-sans">
                    {splitEntry[0]}
                  </div>
                </td>
                <td>
                  <div className="p-2 bg-green-200 text-green-900 rounded-lg text-left mx-auto w-3/5">
                    {gitFileBasedCommit[index]
                      ? gitFileBasedCommit[index]
                          .split(" ")
                          .filter((entry, index) => {
                            return index !== 0 ? entry : null;
                          })
                          .join(" ")
                      : null}
                  </div>
                </td>
              </tr>
            </tbody>
          );
        } else {
          fileEntry.push(
            <tbody key={`file-entry-${index}`}>
              <tr className="border-b border-gray-300 p-1 shadow-sm hover:bg-indigo-100">
                <td>
                  <FontAwesomeIcon
                    icon={["fas", "file"]}
                    className="font-sans text-xl text-gray-700"
                  ></FontAwesomeIcon>
                </td>
                <td>
                  <div className="text-gray-800 text-lg mx-3 font-sans">
                    {splitEntry[0]}
                  </div>
                </td>
                <td>
                  <div className="p-2 bg-indigo-200 text-indigo-900 rounded-lg text-left mx-auto w-3/5">
                    {gitFileBasedCommit[index]
                      ? gitFileBasedCommit[index]
                          .split(" ")
                          .filter((entry, index) => {
                            return index !== 0 ? entry : null;
                          })
                          .join(" ")
                      : null}
                  </div>
                </td>
              </tr>
            </tbody>
          );
        }
      });

      formattedFiles.push(directoryEntry);
      formattedFiles.push(fileEntry);

      return (
        <div
          className="block mx-auto justify-center p-2 text-blue-600 cursor-pointer hover:text-blue-700 overflow-auto"
          key="repo-key"
        >
          <table className="table-auto w-full p-2 mx-auto" cellPadding="10">
            <tbody>
              <tr className="pb-6 border-b border-blue-400">
                <th></th>
                <th>File / Directory</th>
                <th>Latest commit</th>
              </tr>
            </tbody>
            {formattedFiles}
          </table>
        </div>
      );
    } else if (gitTrackedFiles && gitTrackedFiles[0] === "NO_TRACKED_FILES") {
      return (
        <div className="bg-gray-400 rounded-lg text-black text-2xl text-center">
          No Tracked Files in the repo!
        </div>
      );
    } else {
      return (
        <div className="bg-gray-400 rounded-lg text-black text-2xl text-center">
          Loading tracked files...
        </div>
      );
    }
  };

  return (
    <>
      {backdropToggle ? (
        <div
          className="fixed w-full h-full top-0 left-0 right-0 flex overflow-auto"
          id="repo-backdrop"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={(event) => {
            if (event.target.id === "repo-backdrop") {
              setBackdropToggle(false);
              setAction("");
            }
          }}
        >
          <>{action === "fetch" ? memoizedFetchRemoteComponent : null}</>
          <>{action === "pull" ? memoizedPullRemoteComponent : null}</>
          <div
            className="float-right p-1 my-2 bg-red-500 text-2xl cursor-pointer text-center text-white my-5 pl-2 pr-2 h-12 align-middle rounded-sm shadow-md mr-5"
            onClick={() => {
              setBackdropToggle(false);
              setAction("");
            }}
          >
            X
          </div>
        </div>
      ) : null}
      <div className="w-full fixed bg-gray-600 opacity-50"></div>
      <div className="rp_repo-view w-screen h-screen p-6 mx-auto rounded-lg justify-evenly overflow-auto">
        {gitRepoStatus && !repoFetchFailed ? (
          <>
            <div className="flex px-3 py-2">
              {gitRepoStatus ? gitRepoHeaderContent() : null}
            </div>
            <div className="w-full">
              <div className="flex my-4 mx-auto justify-around">
                {gitRepoStatus ? gitRepoLeftPane() : null}
              </div>
            </div>
            <div className="block w-11/12 my-6 mx-auto justify-center p-6 rounded-lg bg-gray-100 p-2 shadow-md overflow-auto">
              {gitRepoStatus ? gitTrackedFileComponent() : null}
            </div>
          </>
        ) : (
          <div className="text-center mx-auto rounded-lg p-3 shadow-md border border-indigo-200 text-indigo-800">
            Fetching repo details...
          </div>
        )}
        {repoFetchFailed ? (
          <div className="p-2 text-center mx-auto rounded-lg bg-red-200 text-xl">
            Repo details fetch failed!
          </div>
        ) : null}
      </div>
    </>
  );
}
