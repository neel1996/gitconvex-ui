import React, { useEffect, useState } from "react";
import axios from "axios";

import { fab } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  CONFIG_HTTP_MODE,
  PORT_GITREPOSTATUS_API,
  API_GITREPOSTATUS
} from "../../../env_config";

export default function Repository(props) {
  library.add(fab);
  const [gitRepoStatus, setGitRepoStatus] = useState({});

  useEffect(() => {
    const endpointURL = `${CONFIG_HTTP_MODE}://${window.location.hostname}:${PORT_GITREPOSTATUS_API}/${API_GITREPOSTATUS}`;

    if (props.parentProps !== undefined) {
      const repoId = props.parentProps.location.pathname.split(
        "/repository/"
      )[1];

      axios({
        url: endpointURL + "?repoId=" + repoId,
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json"
        }
      })
        .then(res => {
          setGitRepoStatus(res.data);
        })
        .catch(err => {
          if (err) {
            console.log("API GitStatus error occurred : " + err);
          }
        });
    }
  }, []);

  const {
    gitRemoteData,
    gitRepoName,
    gitBranchList,
    gitCurrentBranch,
    gitRemoteHost,
    gitTotalCommits,
    gitLatestCommit,
    gitTrackedFiles
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

    if (gitRemoteHost != "" && gitRemoteHost !== undefined) {
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
          <div className="block rounded-md shadow-sm border-2 border-dotted border-gray-400 p-6 my-6">
            <table className="table-auto" cellSpacing="10" cellPadding="20">
              <tr>
                <td className="text-xl text-gray-600">Remote Host</td>
                <td>
                  <div className="p-1 rounded-md border-2 shadow-md text-center w-1/2 border-gray-200">
                    <span className="p-3">{remoteLogo}</span>
                    <span className="text-center text-lg">{gitRemoteHost}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="text-xl text-gray-600">{gitRemoteHost} URL</td>
                <td>
                  <span className="text-blue-400 hover:text-blue-500 cursor-pointer">
                    <a href={gitRemoteData} target="_blank">
                      {gitRemoteData}
                    </a>
                  </span>
                </td>
              </tr>
            </table>
          </div>
          <div className="block rounded-lg shadow-sm border-2 border-dotted border-gray-400 p-2 my-2">
            <table className="table-light" cellPadding="10">
              <tr>
                <td className="text-lg text-gray-500">Total Commits</td>
                <td className="text-left text-md text-bold text-black-800">
                  {gitTotalCommits} Commits
                </td>
              </tr>
              <tr>
                <td className="text-lg text-gray-500">Latest Commit</td>
                <td className="text-left text-sm text-bold text-black-900">
                  {gitLatestCommit}
                </td>
              </tr>
              <tr>
                <td className="text-lg text-gray-500 align-text-top">
                  Available Branches
                </td>
                <td>
                  {gitBranchList.map(entry => {
                    return entry == gitCurrentBranch ? (
                      <div className="text-lg text-bold text-gray-800">
                        {entry}
                      </div>
                    ) : (
                      <div>{entry}</div>
                    );
                  })}
                </td>
              </tr>
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
    console.log(gitTrackedFiles);

    if (gitRepoStatus.gitTrackedFiles != "" && gitTrackedFiles !== undefined) {
      return (
        <>
          {gitTrackedFiles.map(entry => {
            return (
              <div className="border-1 border-b border-gray-300 p-1">
                {entry}
              </div>
            );
          })}
        </>
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
    <div className="p-6 mx-auto rounded-lg justify-evenly">
      <div className="flex px-3 py-2">
        {gitRepoStatus !== {} ? gitRepoHeaderContent() : null}
      </div>
      <div className="flex mx-auto justify-evenly">
        <div className="block w-4/5">{gitRepoStatus !== {} ? gitRepoLeftPane() : null}</div>
        <div className="block w-11/12 ml-6 h-48 my-6 scroll p-6 rounded-lg bg-gray-100 p-2 shadow-md overflow-auto">
          {gitRepoStatus !== {} ? gitTrackedFileComponent() : null}
        </div>
      </div>
    </div>
  );
}
