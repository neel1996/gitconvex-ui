import React from "react";

export default function RepoInfoComponent(props) {
  const { gitRepoName, gitCurrentBranch } = props;
  return (
    <div className="align-middle items-center mx-auto w-full flex rounded-md shadow-md border-2 border-gray-100 p-4 justify-evenly">
      <div className="text-md p-2 mx-2">Repo Name</div>
      <div className="bg-blue-100 text-blue-900 p-3 rounded-sm border border-blue-200">
        {gitRepoName}
      </div>
      <div className="text-md p-2 mx-2">Active Branch</div>
      <div className="bg-orange-200 rounded-sm text-orange-900 p-3 border border-orange-400">
        {gitCurrentBranch}
      </div>
    </div>
  );
}
