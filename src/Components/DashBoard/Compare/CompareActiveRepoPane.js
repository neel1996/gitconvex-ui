import React from "react";

export default function CompareActiveRepoPane(props) {
  return (
    <div className="w-11/12 mx-auto flex gap-10 justify-between my-4 p-3 rounded-lg shadow border items-center">
      <div className="rounded p-2 text-center font-sans font-semibold text-xl">
        Selected Repository
      </div>
      <div className="bg-orange-200 p-4 text-orange-600 rounded-lg shadow-md border-dashed border border-orange-400 font-sans font-semibold text-xl text-center">
        {props.repoName}
      </div>
    </div>
  );
}
