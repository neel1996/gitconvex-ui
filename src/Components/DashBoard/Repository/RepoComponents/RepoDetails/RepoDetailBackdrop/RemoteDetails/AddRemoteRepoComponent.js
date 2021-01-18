import React, { useState } from "react";
import "@fortawesome/react-fontawesome";
import {
  faCodeBranch,
  faPencilAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
// import axios from "axios";
// import { globalAPIEndpoint } from "../../../../../../util/env_config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddRemoteRepoFormComponent from "./AddRemoteRepoFormComponent";

export default function AddRemoteRepoComponent({ repoId }) {
  const [fieldMissing, setFieldMissing] = useState(false);
  const [remoteDetails, setRemoteDetails] = useState([]);
  const [remoteForm, setRemoteForm] = useState(false);
  const [addNewRemote, setAddNewRemote] = useState(false);
  function addRemote(props) {
    if (props) {
      let newProps = [...remoteDetails, props];
      setRemoteDetails(newProps);
      setRemoteForm(false);
      setAddNewRemote(true);
    } else {
      setAddNewRemote(false);
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
    <div
      className="xl:w-4/6 lg:w-3/4 md:w-11/12 sm:w-11/12 m-auto p-2 py-10 rounded-lg"
      style={{ backgroundColor: "#edf2f7" }}
    >
      <div className="text-3xl m-6 font-sans text-gray-800 font-semibold flex items-center">
        <FontAwesomeIcon
          icon={faCodeBranch}
          className="text-3xl mx-2"
        ></FontAwesomeIcon>
        <div className="border-b-4 pb-2 border-dashed border-blue-400">
          Remote details
        </div>
        {addNewRemote ? (
          <div
            className="mx-6 px-3 py-2 font-sans rounded text-lg cursor-pointer bg-blue-200 text-gray-800 hover:bg-blue-300 hover:text-gray-900"
            onClick={() => {
              setAddNewRemote(false);
              setRemoteForm(true);
            }}
          >
            Add new remote
          </div>
        ) : null}
      </div>
      <div className="w-10/12 mx-auto">
        {remoteDetails.length > 0 ? (
          <>
            <div className="flex items-center w-full">
              <div
                className="font-sans text-2xl mx-auto text-center font-semibold text-gray-600"
                style={{ width: "25%" }}
              >
                Remote name
              </div>
              <div
                className="font-sans text-2xl mx-auto text-center font-semibold text-gray-600"
                style={{ width: "50%" }}
              >
                Remote URL
              </div>
              <div
                className="font-sans text-2xl mx-auto text-center font-semibold text-gray-600"
                style={{ width: "20%" }}
              >
                Actions
              </div>
            </div>
            {remoteForm ? (
              <AddRemoteRepoFormComponent
                setRemoteForm={setRemoteForm}
                remoteDetail={addRemote}
                setFieldMissing={setFieldMissing}
                setAddNewRemote={setAddNewRemote}
              ></AddRemoteRepoFormComponent>
            ) : null}
            <div
              className="mt-3 w-full mb-4 overflow-auto flex flex-col items-center"
              style={{ maxHeight: "350px" }}
            >
              {remoteDetails.map((items) => {
                const { remoteName, remoteUrl } = items;
                return (
                  <div
                    key={remoteName}
                    className="flex items-center align-middle w-full mx-auto my-4 shadow rounded-md py-6"
                  >
                    <div
                      className="flex items-center mx-auto justify-center text-sans text-lg text-gray-700"
                      style={{ width: "25%" }}
                    >
                      <FontAwesomeIcon
                        icon={faGithub}
                        className="text-3xl text-pink-500 w-2/12 mr-2"
                      ></FontAwesomeIcon>
                      <div className="w-1/2">{remoteName}</div>
                    </div>
                    <div
                      className="text-sans flex items-center  mx-auto justify-center text-center text-lg text-gray-700"
                      style={{ width: "50%" }}
                    >
                      {remoteUrl}
                    </div>
                    <div
                      className="text-center flex items-center"
                      style={{ width: "20%" }}
                    >
                      <div className="text-lg items-center p-1 rounded w-1/3 mx-auto cursor-pointer bg-blue-500 hover:bg-blue-700 font-semibold">
                        <FontAwesomeIcon
                          icon={faPencilAlt}
                          className="text-white"
                        ></FontAwesomeIcon>
                      </div>
                      <div className="text-lg items-center p-1 rounded w-1/3 mx-auto cursor-pointer bg-red-400 hover:bg-red-600 font-semibold">
                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          className="text-white"
                        ></FontAwesomeIcon>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <AddRemoteRepoFormComponent
            setRemoteForm={setRemoteForm}
            remoteDetail={addRemote}
            setFieldMissing={setFieldMissing}
            setAddNewRemote={setAddNewRemote}
          ></AddRemoteRepoFormComponent>
        )}
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
