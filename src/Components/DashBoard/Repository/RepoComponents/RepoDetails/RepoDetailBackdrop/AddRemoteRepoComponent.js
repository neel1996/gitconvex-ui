import React, { useState, useRef } from "react";
import axios from "axios";
import { globalAPIEndpoint } from "../../../../../../util/env_config";

export default function AddRemoteRepoComponent({ repoId }) {
  const remoteNameRef = useRef();
  const remoteUrlRef = useRef();

  const [paramMissing, setParamMissing] = useState(false);
  const [addRemoteStatus, setAddRemoteStatus] = useState("");

  const remoteFormTextComponent = (formId, label, placeholder) => {
    return (
      <div className="flex justify-between around my-4 align-middle items-center">
        <label
          htmlFor={formId}
          className="text-gray-700 text-lg font-sans w-1/3"
        >
          {label}
        </label>
        <div className="w-5/6">
          <input
            id={formId}
            onClick={() => {
              setParamMissing(false);
              setAddRemoteStatus("");
            }}
            className="w-3/4 p-3 rounded shadow-md bg-white text-gray-900 text-lg font-sans outline-none"
            placeholder={placeholder}
            ref={formId === "remoteName" ? remoteNameRef : remoteUrlRef}
            onChange={(event) => {
              const remoteNameVal = event.target.value;
              if (
                event.target.id === "remoteName" &&
                remoteNameVal.match(/[^a-zA-Z0-9_]/gi)
              ) {
                event.target.value = remoteNameVal.replace(
                  /[^a-zA-Z0-9_]/gi,
                  "-"
                );
              }
            }}
          ></input>
        </div>
      </div>
    );
  };

  function addRemoteClickHandler() {
    let repoName = remoteNameRef.current.value;
    let repoUrl = remoteUrlRef.current.value;

    if (repoId && repoName && repoUrl) {
      axios({
        url: globalAPIEndpoint,
        method: "POST",
        data: {
          query: `
              mutation GitConvexMutation{
                addRemoteRepo(repoId: "${repoId}", remoteName: "${repoName}", remoteUrl: "${repoUrl}")
              }
            `,
        },
      })
        .then((res) => {
          if (res.data.data && !res.data.error) {
            const remoteAddStatus = res.data.data.addRemoteRepo;

            if (remoteAddStatus === "REMOTE_ADD_SUCCESS") {
              setAddRemoteStatus("success");
              remoteNameRef.current.value = "";
              remoteUrlRef.current.value = "";
            } else {
              setAddRemoteStatus("failed");
            }
          } else {
            setAddRemoteStatus("failed");
          }
        })
        .catch((err) => {
          console.log(err);
          setAddRemoteStatus("failed");
        });
    } else {
      setParamMissing(true);
    }
  }

  const statusPillComponent = (color, message) => {
    return (
      <div
        className={`my-6 w-1/2 text-center mx-auto p-2 rounded-lg border-${color}-900 bg-${color}-200 font-sans text-xl font-semibold border`}
      >
        {message}
      </div>
    );
  };

  return (
    <div className="xl:w-1/2 lg:w-3/4 md:w-11/12 sm:w-11/12 w-11/12 mx-auto my-auto bg-gray-200 pt-6 rounded-md rounded-b-lg">
      <div className="mx-6 my-6 text-4xl font-semibold font-sans text-gray-800">
        Enter new remote details
      </div>
      <div className="my-4 mx-6">
        {remoteFormTextComponent(
          "remoteName",
          "Enter Remote Name",
          "Give a name for your new remote"
        )}
        {remoteFormTextComponent(
          "remoteUrl",
          "Enter Remote URL",
          "Provide the URL for your remote repo"
        )}
      </div>
      {paramMissing
        ? statusPillComponent(
            "orange",
            "One or more required parameters are empty!"
          )
        : null}
      {addRemoteStatus === "success"
        ? statusPillComponent(
            "green",
            "Remote repo has been added successfully!"
          )
        : null}
      {addRemoteStatus === "failed"
        ? statusPillComponent("red", "Failed to add new repo!")
        : null}
      <div
        className="w-full mt-10 p-3 text-center rounded-b-lg text-xl cursor-pointer shadow bg-green-200 border border-green-700 hover:bg-green-600 hover:text-white"
        onClick={() => {
          addRemoteClickHandler();
        }}
      >
        Add New Remote
      </div>
    </div>
  );
}
