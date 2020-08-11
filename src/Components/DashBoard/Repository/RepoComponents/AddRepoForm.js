import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";
import { DELETE_PRESENT_REPO } from "../../../../actionStore";
import { ContextProvider } from "../../../../context";
import { globalAPIEndpoint } from "../../../../util/env_config";
import InfiniteLoader from "../../../Animations/InfiniteLoader";

export default function AddRepoForm(props) {
  library.add(fas);
  const { state, dispatch } = useContext(ContextProvider);
  const [repoNameState, setRepoName] = useState("");
  const [repoPathState, setRepoPath] = useState("");
  const [cloneUrlState, setCloneUrlState] = useState("");
  const [repoAddFailed, setRepoAddFailed] = useState(false);
  const [repoAddSuccess, setRepoAddSuccess] = useState(false);
  const [inputInvalid, setInputInvalid] = useState(false);
  const [loading, setLoading] = useState(false);

  const [cloneSwitch, setCloneSwitch] = useState(false);
  const [initSwitch, setInitSwitch] = useState(false);

  const switchAnimationEnter = useSpring({
    config: { duration: 1500, tension: 500 },
    from: {
      transform: "translate(0em, 0em)",
    },
    to: {
      transform: "translate(2em, 0em)",
    },
  });

  const switchAnimationExit = useSpring({
    config: { duration: 500, tension: 500 },
    from: {
      transform: "translate(2em, 0em)",
    },
    to: {
      transform: "translate(0em, 0em)",
    },
  });

  useEffect(() => {
    if (state.shouldAddFormClose) {
      props.formEnable(false);
    }
  }, [state, props]);

  function storeRepoAPI(repoName, repoPath) {
    if (repoName && repoPath) {
      if (repoName.match(/[^a-zA-Z0-9-_.]/gi)) {
        setInputInvalid(true);
        setRepoAddFailed(true);
        return;
      }

      let initCheck = false;
      let cloneCheck = false;
      let cloneUrl = cloneUrlState;
      repoPath = repoPath.replace(/\\/gi, "\\\\");

      if (cloneSwitch && !cloneUrlState) {
        setRepoAddFailed(true);
        return false;
      }

      if (cloneUrl.match(/[^a-zA-Z0-9-_.~@#$%:/]/gi)) {
        setInputInvalid(true);
        setRepoAddFailed(true);
        return;
      }

      if (initSwitch) {
        initCheck = true;
      } else if (cloneSwitch && cloneUrl) {
        cloneCheck = true;
      }

      setLoading(true);

      axios({
        url: globalAPIEndpoint,
        method: "POST",
        data: {
          query: `
              mutation GitConvexMutation{
                addRepo(repoName: "${repoName}", repoPath: "${repoPath}", initSwitch: ${initCheck}, cloneSwitch: ${cloneCheck}, cloneUrl: "${cloneUrl}"){
                  message
                  repoId
                }
              }
            `,
        },
      })
        .then((res) => {
          setLoading(false);
          setInputInvalid(false);

          if (res.data.data && !res.data.error) {
            const { message } = res.data.data.addRepo;

            if (message && !message.match(/FAIL/g)) {
              setRepoAddSuccess(true);
              setRepoAddFailed(false);
              setCloneSwitch("");
              setInitSwitch("");

              setRepoName("");
              setRepoPath("");
              setCloneUrlState("");

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
          setLoading(false);

          console.log(err);
          setRepoAddFailed(true);
          setRepoAddSuccess(false);
        });
    } else {
      setInputInvalid(false);
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
        <div className="my-6 mx-auto block p-2 w-3/4 rounded-lg shadow-sm border-4 border-dotted border-green-300 bg-green-100 text-lg font-sans font-light text-green-700 text-center">
          New repo added
        </div>
      );
    } else if (repoAddFailed) {
      return (
        <div className="my-6 mx-auto block p-2 w-3/4 rounded-lg shadow-sm border-4 border-dotted border-red-300 bg-red-100 text-lg font-sans font-light text-red-700 text-center">
          Process failed! Please try again
          {inputInvalid ? (
            <div className="font-semibold">Invalid input paremeters!</div>
          ) : null}
        </div>
      );
    } else {
      return null;
    }
  }

  function switchComponent(operation) {
    return (
      <div
        key={`switch-${operation}`}
        className={`flex rounded-full h-8 w-16 py-2 shadow-inner items-center align-middle pl-1 cursor-pointer ${
          operation === "clone" && cloneSwitch ? "bg-green-400" : "bg-gray-200"
        }
        ${operation === "init" && initSwitch ? "bg-blue-400" : "bg-gray-200"}`}
        onClick={(event) => {
          if (operation === "clone") {
            if (!cloneSwitch) {
              setCloneSwitch(true);
              setInitSwitch(false);
            } else {
              setCloneSwitch(false);
            }
          } else {
            if (!initSwitch) {
              setInitSwitch(true);
              setCloneSwitch(false);
            } else {
              setInitSwitch(false);
            }
          }
        }}
      >
        {operation === "clone" ? (
          <animated.div
            className="rounded-full h-6 w-6 shadow-md bg-white"
            id={`${operation}-switch`}
            style={cloneSwitch ? switchAnimationEnter : switchAnimationExit}
          ></animated.div>
        ) : (
          <animated.div
            className="rounded-full h-6 w-6 shadow-md bg-white"
            id={`${operation}-switch`}
            style={initSwitch ? switchAnimationEnter : switchAnimationExit}
          ></animated.div>
        )}
      </div>
    );
  }

  function addRepoFormContainer() {
    return (
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
            value={repoNameState}
            onClick={() => {
              resetAlertBanner();
            }}
          ></input>
        </div>
        <div>
          <input
            id="repoPathText"
            type="text"
            placeholder={
              cloneSwitch
                ? "Enter base directory path"
                : "Enter repository path"
            }
            className="w-11/12 p-3 my-3 rounded-md outline-none border-blue-100 border-2 shadow-md"
            onChange={(event) => {
              setRepoPath(event.target.value);
            }}
            value={repoPathState}
            onClick={() => {
              resetAlertBanner();
            }}
          ></input>
        </div>
        {cloneSwitch && repoPathState && repoNameState ? (
          <div className="my-4 mx-auto text-center font-sans font-light text-gray-600 text-sm items-center">
            The repo will be cloned to
            <span className="mx-3 text-center font-sans font-semibold border-b-2 border-dashed">
              {repoPathState}
              <>{repoPathState.includes("\\") ? "\\" : "/"}</>
              {repoNameState}
            </span>
          </div>
        ) : null}
        <div className="flex mx-auto my-10 items-center justify-center">
          <div className="flex justify-around items-center">
            <div>{switchComponent("clone")}</div>
            <div className="mx-2 font-sans font-light">Clone from remote</div>
          </div>

          <div className="flex justify-around items-center">
            <div>{switchComponent("init")}</div>
            <div className="mx-2 font-sans font-light">
              Initialize a new repo
            </div>
          </div>
        </div>
        {cloneSwitch ? (
          <div className="flex mx-auto w-11/12 justify-between shadow-md border items-center rounded-md text-indigo-800">
            <div className="w-1/8 text-center border p-3 px-6">
              <FontAwesomeIcon icon={["fas", "link"]}></FontAwesomeIcon>
            </div>
            <div className="w-5/6">
              <input
                value={cloneUrlState}
                className="border-0 outline-none w-full p-2"
                placeholder="Enter the remote repo URL"
                onClick={() => {
                  setRepoAddFailed(false);
                }}
                onChange={(event) => {
                  setCloneUrlState(event.target.value);
                }}
              ></input>
            </div>
          </div>
        ) : null}
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
    );
  }

  return (
    <div
      className={`block text-center justify-center my-20 p-6 rounded-lg shadow-md border-2 border-gray-200 xl:w-1/2 lg:w-2/3 md:w-3/4 sm:w-11/12 w-11/12 mx-auto ${
        loading ? "border-dashed border-2" : ""
      }`}
    >
      {loading ? (
        <>
          <div className="text-center font-sand font-semibold text-xl text-gray-600">
            Repo setup in progress...
          </div>
          <div className="flex mx-auto my-6 text-center justify-center">
            <InfiniteLoader loadAnimation={loading}></InfiniteLoader>
          </div>
        </>
      ) : (
        addRepoFormContainer()
      )}
    </div>
  );
}
