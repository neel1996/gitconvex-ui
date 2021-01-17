import React, { useState, useRef } from "react";
import "@fortawesome/react-fontawesome";
import { faCodeBranch } from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import { globalAPIEndpoint } from "../../../../../../util/env_config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AddRemoteRepoComponent({ repoId }) {
  const remoteNameRef = useRef();
  const remoteUrlRef = useRef();

  const [addRemoteStatus, setAddRemoteStatus] = useState("");
  const [fieldMissing, setFieldMissing] = useState(false);

  const formAddRemote = (formId, placeholder) => {
    return (
      <input
        type="text"
        id={formId}
        className="rounded p-3 shadow-md text-lg items-center text-gray-800"
        placeholder={placeholder}
        ref={formId === "remoteName" ? remoteNameRef : remoteUrlRef}
        style={{ width: "45%" }}
        onChange={() => {
          setFieldMissing(false);
        }}
      ></input>
    );
  };

  function addRemote() {
    let remoteName = remoteNameRef.current.value;
    let remoteUrl = remoteUrlRef.current.value;

    if (repoId && remoteName && remoteUrl) {
      console.log(remoteUrl, remoteName);
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
        <div className="form--data flex w-full justify-between items-center mt-4 mb-6 p-3">
          <div
            className="flex items-center justify-around"
            style={{ width: "95%" }}
          >
            {formAddRemote("remoteName", "Enter name for your remote repo")}
            {formAddRemote("remoteURL", "URL for the remote repo")}
          </div>
          <div className="text-center" style={{ width: "5%" }}>
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-4xl cursor-pointer text-blue-500 font-bold"
              onClick={() => {
                addRemote();
              }}
            ></FontAwesomeIcon>
          </div>
        </div>
        {fieldMissing
          ? statusPillComponent(
              "yellow",
              "One or more required parameters are empty!"
            )
          : null}
      </div>
    </div>
  );
}
