import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import {
  GIT_FOLDER_CONTENT,
  globalAPIEndpoint,
} from "../../../../../util/env_config";

export default function FileExplorerComponent(props) {
  library.add(fab, fas);

  const [gitRepoFiles, setGitRepoFiles] = useState([]);
  const [gitFileBasedCommits, setGitFileBasedCommits] = useState([]);
  const [directoryNavigator, setDirectoryNavigator] = useState([]);

  const { repoIdState } = props;

  function filterNullCommitEntries(gitTrackedFiles, gitFileBasedCommit) {
    let localGitCommits = gitFileBasedCommit;
    let localTrackedFiles = gitTrackedFiles.filter((item, index) => {
      if (item) {
        return true;
      } else {
        localGitCommits[index] = "";
        return false;
      }
    });

    localGitCommits = localGitCommits.filter((commit) => {
      if (commit) {
        return true;
      } else {
        return false;
      }
    });

    setGitRepoFiles([...localTrackedFiles]);
    setGitFileBasedCommits([...localGitCommits]);
  }

  useEffect(() => {
    filterNullCommitEntries(props.gitRepoFiles, props.gitFileBasedCommits);
  }, [props]);

  function directorySepraratorRemover(directorypath) {
    if (directorypath.match(/.\/./gi)) {
      directorypath = directorypath.split("/")[
        directorypath.split("/").length - 1
      ];
    } else if (directorypath.match(/[^\\]\\[^\\]/gi)) {
      directorypath = directorypath.split("\\")[
        directorypath.split("\\").length - 1
      ];
    } else if (directorypath.match(/.\\\\./gi)) {
      directorypath = directorypath.split("\\\\")[
        directorypath.split("\\\\").length - 1
      ];
    }

    return directorypath;
  }

  const fetchFolderContent = (
    directoryName,
    slicePosition,
    sliceIndicator,
    homeIndicator
  ) => {
    if (repoIdState) {
      setGitRepoFiles([]);
      setGitFileBasedCommits([]);
      let localDirNavigator = directoryNavigator;

      if (sliceIndicator) {
        let slicedDirectory = localDirNavigator.slice(0, slicePosition);
        if (slicedDirectory.length > 0) {
          directoryName = slicedDirectory.join("/") + "/" + directoryName;
        }
      }

      const payload = JSON.stringify(
        JSON.stringify({ repoId: repoIdState, directoryName })
      );

      axios({
        url: globalAPIEndpoint,
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        data: {
          query: `

          query GitConvexApi
          {
            gitConvexApi(route: "${GIT_FOLDER_CONTENT}", payload: ${payload}){
              gitFolderContent{
                gitTrackedFiles
                gitFileBasedCommit
              }
            }
          }
        `,
        },
      })
        .then((res) => {
          if (res.data.data && !res.data.error) {
            const localFolderContent =
              res.data.data.gitConvexApi.gitFolderContent;

            filterNullCommitEntries(
              localFolderContent.gitTrackedFiles,
              localFolderContent.gitFileBasedCommit
            );

            directoryName = directorySepraratorRemover(directoryName);

            if (homeIndicator) {
              setDirectoryNavigator([]);
              return;
            }

            if (directoryNavigator.length === 0) {
              setDirectoryNavigator([directoryName]);
            } else {
              if (
                sliceIndicator &&
                slicePosition < directoryNavigator.length - 1
              ) {
                const iterator =
                  directoryNavigator.length - (slicePosition + 1);

                for (let i = 0; i < iterator; i++) {
                  localDirNavigator.pop();
                }
                setDirectoryNavigator([...localDirNavigator]);
              } else {
                setDirectoryNavigator([...directoryNavigator, directoryName]);
              }
            }
          } else {
            console.log(
              "ERROR: Error occurred while fetching the folder content!"
            );
          }
        })
        .catch((err) => {
          if (err) {
            console.log(
              "ERROR: Error occurred while fetching the folder content!"
            );
          }
        });
    }
  };

  const gitTrackedFileComponent = () => {
    if (
      gitRepoFiles &&
      gitRepoFiles.length > 0 &&
      gitRepoFiles[0] !== "NO_TRACKED_FILES"
    ) {
      var formattedFiles = [];
      var directoryEntry = [];
      var fileEntry = [];

      gitRepoFiles.forEach((entry, index) => {
        const splitEntry = entry.split(":");

        if (splitEntry[1].includes("directory")) {
          let directorypath = directorySepraratorRemover(splitEntry[0]);

          directoryEntry.push(
            <div
              className="block w-full p-2 border-b border-gray-300"
              key={`directory-key-${uuid()}`}
            >
              <div className="flex cursor-pointer">
                <div className="w-1/6">
                  <FontAwesomeIcon
                    icon={["fas", "folder"]}
                    className="font-sans text-xl text-blue-600"
                  ></FontAwesomeIcon>
                </div>
                <div
                  className="w-2/4 text-gray-800 text-lg mx-3 font-sans hover:text-indigo-400 hover:font-semibold"
                  onClick={(event) => {
                    fetchFolderContent(splitEntry[0], 0, false);
                  }}
                >
                  {directorypath}
                </div>

                <div className="w-2/4 p-2 bg-green-200 text-green-900 truncate rounded-lg text-left mx-auto w-3/5">
                  {gitFileBasedCommits[index]
                    ? gitFileBasedCommits[index]
                        .split(" ")
                        .filter((entry, index) => {
                          return index !== 0 ? entry : null;
                        })
                        .join(" ")
                    : null}
                </div>
              </div>
            </div>
          );
        } else if (splitEntry[1].includes("File")) {
          fileEntry.push(
            <div
              className="block w-full p-2 border-b border-gray-300"
              key={`file-key-${uuid()}`}
            >
              <div className="flex">
                <div className="w-1/6">
                  <FontAwesomeIcon
                    icon={["fas", "file"]}
                    className="font-sans text-xl text-gray-700"
                  ></FontAwesomeIcon>
                </div>
                <div className="w-2/4 text-gray-800 text-lg mx-3 font-sans">
                  {splitEntry[0]}
                </div>
                <div className="w-2/4 p-2 bg-indigo-200 truncate ... text-indigo-900 rounded-lg text-left mx-auto w-3/5">
                  {gitFileBasedCommits[index]
                    ? gitFileBasedCommits[index]
                        .split(" ")
                        .filter((entry, index) => {
                          return index !== 0 ? entry : null;
                        })
                        .join(" ")
                    : null}
                </div>
              </div>
            </div>
          );
        }
      });

      formattedFiles.push(directoryEntry);
      formattedFiles.push(fileEntry);

      return (
        <div
          className="block mx-auto justify-center p-2 text-blue-600 hover:text-blue-700"
          key="repo-key"
        >
          <div className="flex justify-around w-full p-2 mx-auto pb-6 border-b border-blue-400">
            <div className="w-1/6"></div>
            <div className="w-2/4">File / Directory</div>
            <div className="w-2/4">Latest commit</div>
          </div>
          {formattedFiles}
        </div>
      );
    } else if (gitRepoFiles && gitRepoFiles[0] === "NO_TRACKED_FILES") {
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
    <div>
      {directoryNavigator ? (
        <div className="mx-6 p-3 font-sans flex gap-4 items-center justify-start">
          <div
            className="w-1/6 text-gray-700 bg-gray-200 border border-dashed cursor-pointer justify-center p-3 text-center rounded shadow-md flex gap-4 my-auto items-center mx-4 text-xl"
            onClick={() => {
              fetchFolderContent("", 0, false, true);
            }}
          >
            <div>
              <FontAwesomeIcon icon={["fas", "home"]}></FontAwesomeIcon>
            </div>
            <div>Home</div>
          </div>
          <div
            className="flex gap-4 items-center w-3/4 break-words overflow-x-auto"
            id="repoFolderNavigator"
          >
            {directoryNavigator.map((item, index) => {
              return (
                <div
                  className="flex gap-2 justify-start items-center"
                  key={item + "-" + index}
                >
                  <div
                    className={`${
                      index !== directoryNavigator.length - 1
                        ? "text-blue-600 font-semibold hover:underline hover:text-blue-700 cursor-pointer"
                        : ""
                    } text-xl`}
                    onClick={() => {
                      if (index !== directoryNavigator.length - 1) {
                        fetchFolderContent(item, index, true);
                      }
                    }}
                  >
                    {item}
                  </div>
                  <div>/</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
      <div className="block w-11/12 my-6 mx-auto justify-center p-6 rounded-lg bg-gray-100 p-2 shadow-md overflow-auto">
        {gitTrackedFileComponent()}
      </div>
    </div>
  );
}
