import React from "react";
import RepoComponent from './RepoComponent';


export default function RightPane(props) {
  const { platform, gitVersion, nodeVersion } = props.params;

  return (
    <>
      <div className="w-11/12 mx-auto justify-center">
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
        {repoEntry()}
      </div>
    </>
  );

  function repoEntry() {
    if (platform !== "" && gitVersion !== "" && nodeVersion !== "") {
      return <RepoComponent parentProps={props}></RepoComponent>;
    }
  }
}
