import React from "react";

export default function CompareActiveRepoPane(props) {
  return (
    <div className="w-11/12 bg-indigo-100 border border-dashed border-indigo-400 mx-auto flex gap-10 justify-around my-4 p-3 rounded-lg shadow border border-dashed items-center">
      <div className="rounded p-2 text-center font-sans font-semibold text-xl">
        Selected Repository
      </div>
      <div className="bg-indigo-400 p-4 text-white rounded-lg shadow-md border-dashed border border-orange-400 font-sans font-semibold text-xl text-center">
        {props.repoName}
      </div>
    </div>
  );
}