import React, { useRef } from "react";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-regular-svg-icons";
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
        className={`rounded shadow-md w-full py-2 text-center text-lg items-center text-gray-800 bg-white`}
        placeholder={placeholder}
        ref={formId === "remoteName" ? remoteNameRef : remoteUrlRef}
        onChange={() => {
          props.setFieldMissing(false);
        }}
      ></input>
    );
  };

  const addRemote = () => {
    let remoteName = remoteNameRef.current.value;
    let remoteUrl = remoteUrlRef.current.value;
    if (remoteName && remoteUrl) {
      remoteNameRef.current.value = "";
      remoteUrlRef.current.value = "";
      props.remoteDetail({ remoteName: remoteName, remoteUrl: remoteUrl });
    } else {
      props.remoteDetail("");
    }
  };

  return (
    <form className="form--data flex w-full justify-between items-center mt-4 mb-3">
      <div className="w-1/4">{formAddRemote("remoteName", "Remote name")}</div>
      <div style={{ width: "40%" }}>
        {formAddRemote("remoteURL", "Remote URL")}
      </div>
      <div className="text-center w-1/4" style={{ outline: "none" }}>
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="text-3xl mr-2 cursor-pointer text-blue-500 font-semibold"
          onClick={() => {
            addRemote();
          }}
        ></FontAwesomeIcon>
        <FontAwesomeIcon
          icon={faTimesCircle}
          className="text-3xl mr-2 cursor-pointer text-red-500 font-semibold"
          onClick={() => {
            props.setAddNewRemote(true);
            props.setRemoteForm(false);
            props.setFieldMissing(false);
          }}
        ></FontAwesomeIcon>
      </div>
    </form>
  );
}
