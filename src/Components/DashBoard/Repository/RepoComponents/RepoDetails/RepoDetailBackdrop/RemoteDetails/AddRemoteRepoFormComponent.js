import React, { useRef } from "react";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AddRemoteRepoFormComponent(props) {
  const remoteNameRef = useRef();
  const remoteUrlRef = useRef();

  const formAddRemote = (formId, placeholder) => {
    return (
      <input
        type="text"
        autoComplete="off"
        id={formId}
        className={`rounded p-3 shadow-md text-lg items-center text-gray-800 bg-white ${
          formId === "remoteName" ? "w-5/12" : "w-6/12"
        }`}
        placeholder={placeholder}
        ref={formId === "remoteName" ? remoteNameRef : remoteUrlRef}
        onChange={() => {
          props.setFieldMissing(false);
        }}
      ></input>
    );
  };

  const addRemote = () => {};

  return (
    <form
      className="form--data flex w-full justify-between items-center mt-4 mb-6 p-3"
      onSubmit={(e) => {
        let remoteName = remoteNameRef.current.value;
        let remoteUrl = remoteUrlRef.current.value;
        if (remoteName && remoteUrl) {
          remoteNameRef.current.value = "";
          remoteUrlRef.current.value = "";
          props.remoteDetail({ remoteName: remoteName, remoteUrl: remoteUrl });
        } else {
          props.remoteDetail("");
        }
        return e.preventDefault();
      }}
    >
      <div
        className="flex items-center justify-around"
        style={{ width: "95%" }}
      >
        {formAddRemote("remoteName", "Name for the remote repo")}
        {formAddRemote("remoteURL", "URL for the remote repo")}
      </div>
      <button className="text-center" style={{ width: "5%", outline: "none" }}>
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="text-4xl cursor-pointer text-blue-500 font-bold"
          onClick={() => {
            props.setAddNewRemote(true);
            addRemote();
          }}
        ></FontAwesomeIcon>
      </button>
    </form>
  );
}
