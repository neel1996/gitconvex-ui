import React, { useState } from "react";
import "@fortawesome/react-fontawesome";
import { faCodeBranch } from "@fortawesome/free-solid-svg-icons";
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
      className="xl:w-4/6 lg:w-3/4 md:w-11/12 sm:w-11/12 m-auto p-2 rounded-lg"
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
            className="mx-6 px-3 py-2 rounded text-lg cursor-pointer bg-blue-200 text-gray-800 hover:bg-blue-300 hover:text-gray-900"
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
        {fieldMissing
          ? statusPillComponent(
              "yellow",
              "One or more required parameters are empty!"
            )
          : null}
        {remoteDetails.length > 0 ? (
          <>
            <div className="flex justify-around items-center w-full">
              <div className="font-sans text-2xl text-center font-semibold text-gray-600">
                Remote name
              </div>
              <div className="font-sans text-2xl text-center font-semibold text-gray-600">
                Remote URL
              </div>
              <div className="font-sans text-2xl text-center font-semibold text-gray-600">
                Actions
              </div>
            </div>
            {remoteForm ? (
              <AddRemoteRepoFormComponent
                repoId={repoId}
                remoteDetail={addRemote}
                setFieldMissing={setFieldMissing}
                setAddNewRemote={setAddNewRemote}
              ></AddRemoteRepoFormComponent>
            ) : null}
            <div
              className="mt-3 mb-4 overflow-auto flex flex-col items-center"
              style={{ maxHeight: "300px" }}
            >
              {remoteDetails.map((items) => {
                const { remoteName, remoteUrl } = items;
                return (
                  <div
                    key={remoteName}
                    className="flex items-center align-middle justify-around w-10/12 mx-auto my-2"
                  >
                    <div className="flex items-center align-middle text-sans text-lg text-gray-700 w-5/12 m-auto">
                      <FontAwesomeIcon
                        icon={faGithub}
                        className="w-1/5 text-3xl mx-auto flex items-center"
                      ></FontAwesomeIcon>
                      <div className="mx-auto align-middle w-3/4 flex items-center">
                        {remoteName}
                      </div>
                    </div>
                    <div className="text-sans flex items-center align-middle text-lg text-gray-700 mx-auto w-6/12">
                      {remoteUrl}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <AddRemoteRepoFormComponent
            repoId={repoId}
            remoteDetail={addRemote}
            setFieldMissing={setFieldMissing}
            setAddNewRemote={setAddNewRemote}
          ></AddRemoteRepoFormComponent>
        )}
      </div>
    </div>
  );
}
