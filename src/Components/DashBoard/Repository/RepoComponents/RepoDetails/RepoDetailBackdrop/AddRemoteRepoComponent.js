import React, { useState } from "react";
import "@fortawesome/react-fontawesome";
import { faCodeBranch } from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";
// import { globalAPIEndpoint } from "../../../../../../util/env_config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddRemoteRepoFormComponent from "./AddRemoteRepoFormComponent";

export default function AddRemoteRepoComponent({ repoId }) {
  const [fieldMissing, setFieldMissing] = useState(false);
  const [remoteDetails, setRemoteDetails] = useState([]);
  function addRemote(props) {
    if (props) {
      let newProps = [...remoteDetails, props];
      setRemoteDetails(newProps);
    } else {
      setFieldMissing(true);
    }
  }

  const statusPillComponent = (color, message) => {
    return (
      <div className={`addremote--alert border-${color}-900 bg-${color}-200`}>
        {message}
      </div>
    );
  };

  return (
    <div className="xl:w-4/6 lg:w-3/4 md:w-11/12 sm:w-11/12 repo-backdrop--addremote">
      <div className="addremote--header">
        <FontAwesomeIcon
          icon={faCodeBranch}
          className="text-3xl mx-2"
        ></FontAwesomeIcon>
        Remote details
      </div>
      <div className="w-10/12 mx-auto">
        <div
          className="flex justify-around items-center"
          style={{ width: "90%" }}
        >
          <div className="font-sans text-2xl font-semibold text-gray-600">
            Remote name
          </div>
          <div className="font-sans text-2xl font-semibold text-gray-600">
            Remote URL
          </div>
        </div>
        <AddRemoteRepoFormComponent
          repoId={repoId}
          remoteDetail={addRemote}
          setFieldMissing={setFieldMissing}
        ></AddRemoteRepoFormComponent>
        <div className="mt-4 mb-8 overflow-auto" style={{ maxHeight: "250px" }}>
          {remoteDetails.length > 0
            ? remoteDetails.map((items) => {
                const { remoteName, remoteUrl } = items;
                console.log(items);
                return (
                  <div
                    key={remoteUrl}
                    className="flex items-center justify-around w-10/12 mx-auto my-2"
                  >
                    <div className="text-sans text-lg text-gray-800">
                      {remoteName}
                    </div>
                    <div className="text-sans text-lg text-gray-800">
                      {remoteUrl}
                    </div>
                  </div>
                );
              })
            : null}
        </div>
        {fieldMissing
          ? statusPillComponent(
              "yellow",
              "One or more required parameters are empty!"
            )
          : null}
        {/* {addRemoteStatus === "success"
          ? statusPillComponent(
              "green",
              "Remote repo has been added successfully!"
            )
          : null} */}
      </div>
      <div className="flex items-center justify-around w-10/12 mx-auto"></div>
    </div>
  );
}
