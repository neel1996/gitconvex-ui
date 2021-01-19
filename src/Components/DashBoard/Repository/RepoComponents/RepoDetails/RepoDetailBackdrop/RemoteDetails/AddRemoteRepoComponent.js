import React, { useState } from "react";
import "@fortawesome/react-fontawesome";
import { faCodeBranch } from "@fortawesome/free-solid-svg-icons";

// import axios from "axios";
// import { globalAPIEndpoint } from "../../../../../../util/env_config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddRemoteRepoFormComponent from "./AddRemoteRepoFormComponent";
import AddRemote from "./RemoteCard";

export default function AddRemoteRepoComponent({ repoId }) {
  const [fieldMissing, setFieldMissing] = useState(false);
  const [remoteDetails, setRemoteDetails] = useState([]);
  const [remoteForm, setRemoteForm] = useState(false);
  const [addNewRemote, setAddNewRemote] = useState(false);
  const [addRemoteStatus, setAddRemoteStatus] = useState(false);

  function addRemote(props) {
    if (props) {
      let remoteCheck = remoteDetails.find((items) => {
        return items.remoteName === props.remoteName;
      });

      if (!remoteCheck) {
        //TODO: Add axios
        let newProps = [...remoteDetails, props];
        setRemoteDetails(newProps);
        setRemoteForm(false);
        setAddNewRemote(true);
      } else {
        setAddRemoteStatus(true);
      }
    } else {
      setAddNewRemote(false);
      setFieldMissing(true);
    }
  }

  const statusPillComponent = (color, message) => {
    return (
      <div
        className={`border-${color}-800 bg-${color}-200 text-${color}-900 border-b-2 font-sans text-xl border-dashed text-center rounded-b-none rounded-t-lg w-full py-6`}
      >
        {message}
      </div>
    );
  };

  return (
    <div
      className="xl:w-3/4 lg:w-3/4 md:w-11/12 sm:w-11/12 m-auto rounded-lg"
      style={{ backgroundColor: "#edf2f7" }}
    >
      {addRemoteStatus
        ? statusPillComponent("red", "Remote name already exist!")
        : null}
      {fieldMissing
        ? statusPillComponent(
            "indigo",
            "One or more required parameters are empty!"
          )
        : null}
      <div className="w-full p-2 pb-8 pt-6">
        <div className="text-3xl m-6 font-sans text-gray-800 font-semibold flex items-center">
          <FontAwesomeIcon
            icon={faCodeBranch}
            className="text-3xl mx-2"
          ></FontAwesomeIcon>
          <div className="border-b-4 pb-2 border-dashed border-blue-400">
            Remote details
          </div>
          {addNewRemote && remoteDetails.length > 0 ? (
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
        <div className="w-11/12 mx-auto">
          {remoteDetails.length > 0 ? (
            <>
              <div className="flex items-center w-full">
                <div className="font-sans w-1/4 text-2xl mx-auto text-center font-semibold text-gray-600">
                  Remote name
                </div>
                <div className="font-sans text-2xl w-7/12 mx-auto text-center font-semibold text-gray-600">
                  Remote URL
                </div>
                <div
                  className="font-sans text-2xl mx-auto text-center font-semibold text-gray-600"
                  style={{ width: "22%" }}
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
                  setAddRemoteStatus={setAddRemoteStatus}
                ></AddRemoteRepoFormComponent>
              ) : null}
              <div
                className="mt-3 w-full mb-4 overflow-auto flex flex-col items-center"
                style={{ maxHeight: "350px" }}
              >
                {remoteDetails.map((items) => {
                  const { remoteName, remoteUrl } = items;
                  return (
                    <AddRemote
                      remoteName={remoteName}
                      remoteUrl={remoteUrl}
                    ></AddRemote>
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
              setAddRemoteStatus={setAddRemoteStatus}
            ></AddRemoteRepoFormComponent>
          )}
        </div>
      </div>
    </div>
  );
}
