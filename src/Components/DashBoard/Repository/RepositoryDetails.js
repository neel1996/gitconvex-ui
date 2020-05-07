import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { globalAPIEndpoint, ROUTE_REPO_DETAILS } from "../../../env_config";

export default function RepositoryDetails(props) {
  library.add(fab, fas);
  const [gitRepoStatus, setGitRepoStatus] = useState({});
  const [repoFetchFailed, setRepoFetchFailed] = useState(false);

  useEffect(() => {
    const endpointURL = globalAPIEndpoint;

    if (props.parentProps) {
      const repoId = props.parentProps.location.pathname.split(
        "/repository/"
      )[1];

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
          setGitRepoStatus(res.data.data.gitConvexApi.gitRepoStatus);
        })
        .catch((err) => {
          if (err) {
            console.log("API GitStatus error occurred : " + err);
            setRepoFetchFailed(true);
          }
        });
    }
  }, [props.parentProps]);

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

    if (gitRemoteHost && gitRemoteHost) {
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
          <div className="block rounded-md shadow-sm border-2 border-dotted border-gray-400 p-6 my-6 mx-3">
            <table className="table-auto" cellSpacing="10" cellPadding="20">
              <tbody>
                <tr>
                  <td className="text-xl text-gray-600">Remote Host</td>
                  <td>
                    <div className="p-1 rounded-md border-2 shadow-md text-center w-1/2 border-gray-200">
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
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="block rounded-lg shadow-sm border-2 border-dotted border-gray-400 p-2 my-2 mx-3">
            <table className="table-light" cellPadding="10">
              <tbody>
                <tr>
                  <td className="text-lg text-gray-500">Total Commits</td>
                  <td className="text-left text-md text-bold text-black-800">
                    {gitTotalCommits} Commits
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td className="text-lg text-gray-500">Latest Commit</td>
                  <td className="text-left text-sm text-bold text-black-900">
                    {gitLatestCommit}
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td className="text-lg text-gray-500 align-text-top">
                    Available Branches
                  </td>
                  <td>
                    {gitBranchList.map((entry) => {
                      return entry === gitCurrentBranch ? (
                        <div
                          className="text-lg text-bold text-gray-800"
                          key={entry}
                        >
                          {entry}
                        </div>
                      ) : (
                        <div key="entry-key">{entry}</div>
                      );
                    })}
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
    if (gitRepoStatus.gitTrackedFiles && gitTrackedFiles) {
      var formattedFiles = [];
      var directoryEntry = [];
      var fileEntry = [];

      gitTrackedFiles.forEach((entry, index) => {
        const splitEntry = entry.split(":");

        if (splitEntry[1].includes("directory")) {
          directoryEntry.push(
            <tbody>
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
            <tbody>
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
    } else {
      return (
        <div className="bg-gray-400 rounded-lg text-black text-2xl text-center">
          Loading tracked files...
        </div>
      );
    }
  };

  return (
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
  );
}
