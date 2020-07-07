import React from "react";
import RepoComponent from "../Repository/RepoComponents/RepoComponent";

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
      <div className="dashboard-rightpane w-full mx-auto justify-center">
        <div className="w-11/12 p-3 my-6 mx-auto rounded-lg shadow-md xl:flex lg:flex md:block sm:block rightpane-details block justify-between mx-auto bg-blue-100 border-2 border-blue-100">
          {hcParams.map((entry) => {
            return (
              <div
                key={entry.label}
                className="my-2 flex mx-auto justify-around items-center align-middle"
              >
                <div className="w-1/2 rightpane-details__header border-b-2 border-dashed mx-2 font-sans xl:font-bold lg:font-semibold md:font-medium xl:text-2xl lg:text-xl md:text-md">
                  {entry.label}
                </div>
                {entry.value !== "" ? (
                  <div
                    className="w-2/3 mx-2 bg-green-200 border-green-800 text-center text-green-900 p-2 rounded-lg hc-param"
                    id={`hc-param__${entry.label}`}
                  >
                    {entry.value}
                  </div>
                ) : (
                  <div className="rounded-md bg-red-200 text-red-900 font-bold p-2">
                    Invalid
                  </div>
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
      return <RepoComponent parentProps={props}></RepoComponent>;
    }
  }
}
