import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import { v4 as uuid } from "uuid";
import InfiniteLoader from "../../../../Animations/InfiniteLoader";
import CodeFileViewComponent from "./RepoDetailBackdrop/CodeFileViewComponent";
import {
  GIT_FOLDER_CONTENT,
  globalAPIEndpoint,
} from "../../../../../util/env_config";

export default function FileExplorerComponent(props) {
  library.add(fab, fas);

  const [gitRepoFiles, setGitRepoFiles] = useState([]);
  const [codeViewToggle, setCodeViewToggle] = useState(false);
  const [gitFileBasedCommits, setGitFileBasedCommits] = useState([]);
  const [directoryNavigator, setDirectoryNavigator] = useState([]);
  const [codeViewItem, setCodeViewItem] = useState("");
  const [cwd, setCwd] = useState("");

  const { repoIdState } = props;

  const memoizedCodeFileViewComponent = useMemo(() => {
    return (
      <CodeFileViewComponent
        repoId={repoIdState}
        fileItem={codeViewItem}
      ></CodeFileViewComponent>
    );
  }, [repoIdState, codeViewItem]);

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

    localGitCommits = localGitCommits.filter((commit) => commit);

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

      setCwd(directoryName);

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
                <div
                  className="w-2/4 text-gray-800 text-lg mx-3 font-sans hover:text-indigo-400 hover:font-semibold cursor-pointer"
                  onClick={() => {
                    setCodeViewItem(cwd + "/" + splitEntry[0]);
                    setCodeViewToggle(true);
                  }}
                >
                  {splitEntry[0]}
                </div>
                <div className="w-2/4 p-2 bg-indigo-200 truncate text-indigo-900 rounded-lg text-left mx-auto w-3/5">
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
        <div className="flex gap-4 w-3/4 mx-auto items-center justify-center rounded-lg text-gray-600 text-2xl text-center border-b-4 border-dashed border-gray-400 p-1">
          <div>
            <FontAwesomeIcon icon={["fas", "unlink"]}></FontAwesomeIcon>
          </div>
          <div>No Tracked Files in the repo!</div>
        </div>
      );
    } else {
      return (
        <>
          <div className="flex justify-center mx-auto my-2 w-3/4">
            <div className="w-full mx-auto text-2xl text-center font-sans font-semibold text-gray-800 border-b-2 border-dashed border-gray-500 p-1">
              Loading tracked files...
            </div>
          </div>
          <div className="flex mx-auto my-6 text-center justify-center">
            <InfiniteLoader
              loadAnimation={!gitRepoFiles.length}
            ></InfiniteLoader>
          </div>
        </>
      );
    }
  };

  return (
    <>
      {codeViewToggle ? (
        <div
          className="fixed w-full h-full top-0 left-0 right-0 flex overflow-auto"
          id="code-view__backdrop"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 99 }}
          onClick={(event) => {
            if (event.target.id === "code-view__backdrop") {
              setCodeViewToggle(false);
            }
          }}
        >
          <div
            className="fixed top-0 right-0 mx-3 font-semibold bg-red-500 text-3xl cursor-pointer text-center text-white my-5 align-middle rounded-full w-12 h-12 items-center align-middle shadow-md mr-5"
            onClick={() => {
              setCodeViewToggle(false);
            }}
          >
            X
          </div>

          <div
            id="code-view-area"
            className="w-full h-full block mx-auto my-auto mt-4 mb-10"
          >
            {memoizedCodeFileViewComponent}
          </div>
        </div>
      ) : null}
      <div>
        {directoryNavigator &&
        gitRepoFiles &&
        gitRepoFiles[0] !== "NO_TRACKED_FILES" ? (
          <div className="mx-6 p-3 font-sans flex gap-4 items-center justify-start">
            <div
              className="w-1/6 text-gray-700 border-b-2 border-dashed cursor-pointer justify-center p-3 text-center rounded flex gap-4 my-auto items-center mx-6 text-xl hover:text-black hover:border-black hover:scale-110 transition duration-500 ease-in-out"
              onClick={() => {
                fetchFolderContent("", 0, false, true);
              }}
            >
              <div>
                <FontAwesomeIcon icon={["fas", "home"]}></FontAwesomeIcon>
              </div>
              <div>Home</div>
              <div className="text-2xl font-sans text-blue-400">./</div>
            </div>
            <div
              className="flex p-4 gap-4 items-center w-3/4 break-words overflow-x-auto"
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
        <div className="block w-11/12 my-6 mx-auto justify-center p-6 rounded-lg bg-white p-2 shadow-md overflow-auto border">
          {gitTrackedFileComponent()}
        </div>
      </div>
    </>
  );
}
