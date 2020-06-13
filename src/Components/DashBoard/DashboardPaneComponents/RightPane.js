import React from "react";
import FetchRepoComponent from "../Repository/RepoComponents/RepoComponent";

export default function RightPane(props) {
  const { platform, gitVersion, nodeVersion } = props.params;

  const hcParams = [
    {
      label: "Platform",
      value: platform,
    },
    {
      label: "Git",
      value: gitVersion,
    },
    {
      label: "Node",
      value: nodeVersion,
    },
  ];

  return (
    <>
      <div className="dashboard-rightpane w-11/12 mx-auto justify-center overflow-auto">
        <div className="w-11/12 p-3 my-4 rounded-lg shadow-md flex rightpane-details flex justify-between mx-auto bg-blue-100 border-2 border-blue-100">
          {hcParams.map((entry) => {
            return (
              <div key={entry.label}>
                <span className="rightpane-details__header">{entry.label}</span>
                {entry.value !== "" ? (
                  <span
                    className="bg-green-200 border-green-800 text-green-900 p-2 rounded-lg hc-param"
                    id={`hc-param__${entry.label}`}
                  >
                    {entry.value}
                  </span>
                ) : (
                  <span className="rounded-md bg-red-200 text-red-900 font-bold p-2">
                    Invalid
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {repoEntry()}
      </div>
    </>
  );

  function repoEntry() {
    if (platform && gitVersion && nodeVersion) {
      return <FetchRepoComponent parentProps={props}></FetchRepoComponent>;
    }
  }
}
