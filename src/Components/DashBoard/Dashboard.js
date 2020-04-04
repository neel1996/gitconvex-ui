import React, { useContext, useState, useEffect } from "react";
import {
  FolderOutlined,
  SettingsOutlined,
  HelpOutline,
} from "@material-ui/icons";

import RepoComponent from "./RepoComponent";
import { ContextProvider } from "../../context";

export default function Dashboard() {
  const { state } = useContext(ContextProvider);

  const [platform, setPlatform] = useState("");
  const [gitVersion, setGitVersion] = useState("");
  const [nodeVersion, setNodeVersion] = useState("");

  useEffect(() => {
    if (state.hcParams.length > 0) {
      state.hcParams.forEach((entry) => {
        if (entry["code"].match(/GIT/i)) {
          setGitVersion(entry["value"]);
        } else if (entry["code"].match(/NODE/i)) {
          setNodeVersion(entry["value"]);
        } else if (entry["code"].match(/OS/i)) {
          setPlatform(entry["value"]);
        }
      });
    }
    else{
      setPlatform(localStorage.getItem('OS_CHECK_PASSED'))
      setNodeVersion(localStorage.getItem('NODE_CHECK_PASSED'))
      setGitVersion(localStorage.getItem('GIT_CHECK_PASSED'))
    }
  }, [state.hcParams]);

  return (
    <>
      <div className="flex w-full h-full">
        {leftPane()}
        {rightPane()}
      </div>
    </>
  );

  function leftPane() {
    return (
      <div className="dashboard-leftpane w-1/2 shadow-md block p-3 bg-white-400">
        <div className="flex justify-center items-center bg-blue-100">
          <div className="block dashboard-leftpane__logo"></div>
          <div className="font-mono text-2xl p-4 text-3xl">
            <span className="font-bold mx-2 border-b-4 border-pink-400">
              Git
            </span>
            Convex
          </div>
        </div>
        <div className="mt-32 cursor-pointer">
          <div className="flex border-b border-black-100 p-3 hover:bg-gray-100">
            <div>
              <FolderOutlined
                style={{ color: "grey", fontSize: "36px" }}
              ></FolderOutlined>
            </div>
            <div className="ml-2 text-2xl text-gray-700">Repositories</div>
          </div>
          <div className="flex border-b border-black-100 p-3 hover:bg-gray-100">
            <div>
              <SettingsOutlined
                style={{ color: "grey", fontSize: "36px" }}
              ></SettingsOutlined>
            </div>
            <div className="ml-2 text-2xl text-gray-700">Settings</div>
          </div>
          <div className="flex border-b border-black-100 p-3 hover:bg-gray-100">
            <div>
              <HelpOutline
                style={{ color: "grey", fontSize: "36px" }}
              ></HelpOutline>
            </div>
            <div className="ml-2 text-2xl text-gray-700">Help</div>
          </div>
        </div>
      </div>
    );
  }

  function rightPane() {
    return (
      <div className="w-11/12">
        <div className="w-11/12 p-3 my-4 rounded-lg shadow-md flex rightpane-details flex justify-between mx-auto bg-blue-100 border-2 border-blue-100">
          <div className="">
            <span className="rightpane-details__header">Platform</span>
            {platform !== "" ? (
              <span className="bg-green-200 border-green-800 text-green-900 p-2 rounded-lg">
                {platform}
              </span>
            ) : (
              <span className="rounded-md bg-red-200 text-red-900 font-bold p-2">
                Invalid
              </span>
            )}
          </div>
          <div className="">
            <span className="rightpane-details__header">Git</span>
            {gitVersion !== "" ? (
              <span className="bg-green-200 border-green-800 text-green-900 p-2 rounded-lg">
                {gitVersion}
              </span>
            ) : (
              <span className="rounded-md bg-red-200 text-red-900 font-bold p-2">
                Invalid
              </span>
            )}
          </div>
          <div className="">
            <span className="rightpane-details__header">Node</span>
            {nodeVersion !== "" ? (
              <span className="bg-green-200 border-green-800 text-green-900 p-2 rounded-lg">
                {nodeVersion}
              </span>
            ) : (
              <span className="rounded-md bg-red-200 text-red-900 font-bold p-2">
                Invalid
              </span>
            )}
          </div>
        </div>
        <div>{repoEntry()}</div>
      </div>
    );
  }

  function repoEntry() {
    if (platform !== "" && gitVersion !== "" && nodeVersion !== "") {
      return <RepoComponent></RepoComponent>;
    }
  }
}
