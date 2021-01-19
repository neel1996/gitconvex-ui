import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrashAlt,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faGitlab,
  faBitbucket,
  faAws,
  faGitSquare,
} from "@fortawesome/free-brands-svg-icons";

export default function RemoteCard({ remoteName, remoteUrl }) {
  const [editRemote, setEditRemote] = useState(false);
  const getRemoteLogo = (gitRemoteHost) => {
    let remoteLogo = "";
    if (gitRemoteHost.match(/github/i)) {
      remoteLogo = (
        <FontAwesomeIcon
          icon={faGithub}
          className="text-3xl text-pink-500 w-2/12 mr-2"
        ></FontAwesomeIcon>
      );
    } else if (gitRemoteHost.match(/gitlab/i)) {
      remoteLogo = (
        <FontAwesomeIcon
          icon={faGitlab}
          className="text-3xl text-pink-500 w-2/12 mr-2"
        ></FontAwesomeIcon>
      );
    } else if (gitRemoteHost.match(/bitbucket/i)) {
      remoteLogo = (
        <FontAwesomeIcon
          icon={faBitbucket}
          className="text-3xl text-pink-500 w-2/12 mr-2"
        ></FontAwesomeIcon>
      );
    } else if (gitRemoteHost.match(/codecommit/i)) {
      remoteLogo = (
        <FontAwesomeIcon
          icon={faAws}
          className="text-3xl text-pink-500 w-2/12 mr-2"
        ></FontAwesomeIcon>
      );
    } else {
      remoteLogo = (
        <FontAwesomeIcon
          icon={faGitSquare}
          className="text-3xl text-pink-500 w-2/12 mr-2"
        ></FontAwesomeIcon>
      );
    }

    return remoteLogo;
  };
  return (
    <div
      key={remoteName}
      className="flex items-center align-middle w-full mx-auto my-1 shadow rounded-md py-6 bg-gray-50"
    >
      <div className="flex items-center w-1/4 mx-auto justify-center text-sans text-lg text-gray-700">
        {getRemoteLogo(remoteUrl)}
        <div className="w-1/2">{remoteName}</div>
      </div>
      <div className="text-sans mx-auto justify-center items-center text-center flex text-lg text-gray-700 w-7/12">
        {remoteUrl}
      </div>
      {editRemote ? (
        <div className="text-center flex items-center" style={{ width: "22%" }}>
          <div className="text-lg items-center p-1 py-2 rounded w-1/4 mx-auto cursor-pointer bg-blue-500 hover:bg-blue-700 font-semibold">
            <FontAwesomeIcon
              icon={faSave}
              className="text-white"
            ></FontAwesomeIcon>
          </div>
          <div
            className="text-lg items-center p-1 py-2 rounded w-1/4 mx-auto cursor-pointer bg-gray-500 hover:bg-gray-700 font-semibold"
            onClick={() => {
              setEditRemote(false);
            }}
          >
            <FontAwesomeIcon
              icon={faTimes}
              className="text-white"
            ></FontAwesomeIcon>
          </div>
          <div className="text-lg items-center p-1 py-2 rounded w-1/4 mx-auto cursor-pointer bg-red-500 hover:bg-red-600 font-semibold">
            <FontAwesomeIcon
              icon={faTrashAlt}
              className="text-white"
            ></FontAwesomeIcon>
          </div>
        </div>
      ) : (
        <div className="text-center flex items-center" style={{ width: "22%" }}>
          <div
            className="text-lg items-center p-1 py-2 rounded w-5/12 mx-auto cursor-pointer bg-blue-500 hover:bg-blue-700 font-semibold"
            onClick={() => {
              setEditRemote(true);
            }}
          >
            <FontAwesomeIcon
              icon={faPencilAlt}
              className="text-white"
            ></FontAwesomeIcon>
          </div>
          <div className="text-lg items-center p-1 py-2 rounded w-5/12 mx-auto cursor-pointer bg-red-500 hover:bg-red-600 font-semibold">
            <FontAwesomeIcon
              icon={faTrashAlt}
              className="text-white"
            ></FontAwesomeIcon>
          </div>
        </div>
      )}
    </div>
  );
}
