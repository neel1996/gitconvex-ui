import React, { useState, useRef } from "react";
import axios from "axios";
import { globalAPIEndpoint } from "../../../../../util/env_config";

export default function AddBranchComponent(props) {
  const { repoId } = props;
  const [branchName, setBranchName] = useState("");
  const [branchAddStatus, setBranchAddStatus] = useState("");
  const branchNameRef = useRef();

  function resetBranchNameText() {
    branchNameRef.current.value = "";
    setBranchName("");
  }

  function addBranchClickHandler() {
    axios({
      url: globalAPIEndpoint,
      method: "POST",
      data: {
        query: `
            mutation GitConvexMutation{
              addBranch(repoId: "${repoId}", branchName: "${branchName}")
            }
          `,
      },
    })
      .then((res) => {
        if (res.data.data && !res.data.error) {
          const branchStatus = res.data.data.addBranch;
          setBranchAddStatus(branchStatus);
          resetBranchNameText();
        } else {
          setBranchAddStatus("BRANCH_ADD_FAILED");
          resetBranchNameText();
        }
      })
      .catch((err) => {
        setBranchAddStatus("BRANCH_ADD_FAILED");
        resetBranchNameText();
      });
  }

  return (
    <div className="w-3/4 mx-auto my-auto bg-gray-200 p-6 rounded-md">
      <div className="my-auto">
        <div className="mx-auto">
          <input
            type="text"
            ref={branchNameRef}
            id="branchName"
            placeholder="Branch Name"
            className="p-3 rounded bg-white text-xl text-gray-700 font-sans font-mono w-full border border-gray-200 shadow"
            onChange={(event) => {
              const branchNameVal = event.target.value;
              if (
                event.target.id === "branchName" &&
                branchNameVal.match(/[^a-zA-Z0-9_.:^\\/]/gi)
              ) {
                event.target.value = branchNameVal.replace(
                  /[^a-zA-Z0-9_.:^\\/]/gi,
                  "-"
                );
              }
              setBranchName(event.target.value);
            }}
            onClick={() => {
              setBranchAddStatus("");
            }}
          ></input>
        </div>
        <div
          className="bg-indigo-500 p-3 rounded mt-6 mx-auto text-xl font-sans text-white hover:bg-indigo-600 text-center mx-auto cursor-pointer"
          onClick={(event) => {
            if (branchName) {
              console.log(branchName);
              addBranchClickHandler();
            } else {
              setBranchAddStatus("BRANCH_ADD_FAILED");
            }
          }}
        >
          Add Branch
        </div>
        {branchAddStatus === "BRANCH_CREATION_SUCCESS" ? (
          <div className="w-full bg-green-200 p-1 rounded my-6 mx-auto text-md font-sans text-center mx-auto cursor-pointer">
            New branch has been added to your repo successfully
          </div>
        ) : null}
        {branchAddStatus === "BRANCH_ADD_FAILED" ? (
          <div className="w-full bg-red-200 p-1 rounded my-6 mx-auto text-md font-sans text-center mx-auto cursor-pointer">
            New branch addition failed!
          </div>
        ) : null}
      </div>
    </div>
  );
}
