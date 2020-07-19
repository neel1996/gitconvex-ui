import axios from "axios";
import React, { useEffect, useRef, useState, useContext } from "react";
import { globalAPIEndpoint, ROUTE_ADD_REPO } from "../../../../util/env_config";
import { DELETE_PRESENT_REPO } from "../../../../actionStore";
import { ContextProvider } from "../../../../context";

export default function AddRepoForm(props) {
  const { state, dispatch } = useContext(ContextProvider);
  const [repoNameState, setRepoName] = useState("");
  const [repoPathState, setRepoPath] = useState("");
  const [repoAddFailed, setRepoAddFailed] = useState(false);
  const [repoAddSuccess, setRepoAddSuccess] = useState(false);

  const repoNameRef = useRef();
  const repoPathRef = useRef();
  const initCheckRef = useRef();

  useEffect(() => {
    if (state.shouldAddFormClose) {
      props.formEnable(false);
    }
  }, [state, props]);

  function storeRepoAPI(repoName, repoPath) {
    if (repoName && repoPath) {
      let initCheck = false;

      if (initCheckRef.current.checked) {
        initCheck = true;
      }

      let payload = JSON.stringify(
        JSON.stringify({ repoName, repoPath, initCheck })
      );

      axios({
        url: globalAPIEndpoint,
        method: "POST",
        data: {
          query: `
              query GitConvexApi{
                gitConvexApi(route: "${ROUTE_ADD_REPO}", payload: ${payload}){
                  addRepo{
                    message
                  }
                }
              }
            `,
        },
      })
        .then((res) => {
          if (res.data && res.data.data && !res.data.error) {
            const { message } = res.data.data.gitConvexApi.addRepo;

            if (message && !message.match(/FAIL/g)) {
              setRepoAddSuccess(true);
              setRepoAddFailed(false);
              repoNameRef.current.value = "";
              repoPathRef.current.value = "";
              initCheckRef.current.value = "";

              dispatch({
                action: DELETE_PRESENT_REPO,
                payload: [],
              });

              console.log(state.presentRepo);
            } else {
              setRepoAddFailed(true);
              setRepoAddSuccess(false);
            }
          } else {
            setRepoAddFailed(true);
            setRepoAddSuccess(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setRepoAddFailed(true);
          setRepoAddSuccess(false);
        });
    } else {
      setRepoAddFailed(true);
    }
  }

  function resetAlertBanner() {
    setRepoAddFailed(false);
    setRepoAddSuccess(false);
  }

  function repoAddStatusBanner() {
    if (repoAddSuccess) {
      return (
        <div className="my-6 mx-auto block p-3 w-1/2 rounded-lg shadow-sm border border-green-500 bg-green-200 text-xl text-green-800 text-center">
          New repo added
        </div>
      );
    } else if (repoAddFailed) {
      return (
        <div className="my-6 mx-auto block p-3 w-1/2 rounded-lg shadow-sm border border-red-500 bg-red-200 text-xl text-red-800 text-center">
          Process failed! Please try again
        </div>
      );
    } else {
      return null;
    }
  }

  return (
    <div className="block text-center justify-center my-20 p-6 rounded-lg shadow-md border-2 border-gray-200 xl:w-1/2 lg:w-2/3 md:w-3/4 sm:w-11/12 w-11/12 mx-auto">
      <div className="repo-form block">
        {repoAddStatusBanner()}
        <div className="my-3 text-center block text-3xl font-sans text-gray-800">
          Enter Repo Details
        </div>
        <div>
          <input
            id="repoNameText"
            type="text"
            placeholder="Enter a Repository Name"
            className="w-11/12 p-3 my-3 rounded-md outline-none border-blue-100 border-2 shadow-md"
            onChange={(event) => {
              setRepoName(event.target.value);
            }}
            ref={repoNameRef}
            onClick={() => {
              resetAlertBanner();
            }}
          ></input>
        </div>
        <div>
          <input
            id="repoPathText"
            type="text"
            placeholder="Enter repository path"
            className="w-11/12 p-3 my-3 rounded-md outline-none border-blue-100 border-2 shadow-md"
            onChange={(event) => {
              setRepoPath(event.target.value);
            }}
            ref={repoPathRef}
            onClick={() => {
              resetAlertBanner();
            }}
          ></input>
        </div>
        <div className="cursor-pointer my-4">
          <input
            id="initCheck"
            type="checkbox"
            value="initRepo"
            ref={initCheckRef}
          ></input>
          <label
            htmlFor="initCheck"
            className="mx-2 text-gray-700 font-sans font-semibold"
          >
            Check this if the folder is not a git repo
          </label>
        </div>
        <div className="flex w-11/12 justify-start mx-auto my-5 cursor-pointer">
          <div
            className="my-2 w-1/2 block mx-3 p-3 bg-red-400 rounded-md shadow-md hover:bg-red-500"
            id="addRepoClose"
            onClick={() => {
              props.formEnable(false);
            }}
          >
            Close
          </div>
          <div
            className="block w-1/2 mx-3 p-3 my-2 bg-green-400 rounded-md shadow-md hover:bg-green-500"
            id="addRepoSubmit"
            onClick={() => {
              storeRepoAPI(repoNameState, repoPathState);
            }}
          >
            Submit
          </div>
        </div>
      </div>
    </div>
  );
}
