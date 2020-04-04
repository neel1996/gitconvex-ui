import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Redirect } from "react-router";
import {
  CONFIG_HTTP_MODE,
  API_HEALTHCHECK,
  PORT_HEALTHCHECK_API
} from "../env_config";
import { HC_PARAM_ACTION, HC_DONE_SWITCH } from "../actionStore";

import { ContextProvider } from "../context";

import "./SplashScreen.css";

export default function SplashScreen(props) {
  const [loader, setLoader] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [hcCheck, setHcCheck] = useState(false);
  const { state, dispatch } = useContext(ContextProvider);

  useEffect(() => {
    const apiURL = `${CONFIG_HTTP_MODE}://${window.location.hostname}:${PORT_HEALTHCHECK_API}/${API_HEALTHCHECK}`;
    const hcParams = ["osCheck", "gitCheck", "nodeCheck"];

    hcParams.forEach(param => {
      axios({
        url: apiURL,
        method: "POST",
        data: {
          query: `
            query{
              ${param}
            }
          `
        }
      })
        .then(res => {
          if (res) {
            var currentObj = JSON.parse(JSON.stringify(res.data));
            var objKey = Object.keys(currentObj);
            let hcEntry = JSON.parse(
              JSON.stringify(Object.values(currentObj[objKey]))
            );

            hcEntry = {
              code: JSON.parse(hcEntry).status,
              value: JSON.parse(hcEntry).message
            };

            dispatch({
              type: HC_PARAM_ACTION,
              payload: hcEntry
            });

            switch (hcParams) {
              case "osCheck":
                setLoader("Checking platform...");
                break;
              case "gitCheck":
                setLoader("Checking Git availability...");
                break;
              case "nodeCheck":
                setLoader("Checking Node availability...");
                break;
            }
            setHcCheck(true);
            dispatch({ type: HC_DONE_SWITCH, payload: true });
          } else {
            setHcCheck(false);
          }
        })
        .catch(err => {
          setShowAlert(true);
          console.log(err);
        });
    });
  }, []);

  return (
    <>
      {!hcCheck ? (
        <div className="w-64 h-full justify-center mx-auto flex my-auto align-center items-center">
          <div className="splash-logo w-64 h-full justify-center mx-auto flex my-auto align-center items-center">
            <div className="p-5 shadow-md border-l-4 border-t-4 border-blue-100 rounded-lg block">
              <div className="splash-logo__image"></div>
            </div>
            <div className="logo-label my-3 p-3 text-center block">
              <div className="logo-label__title block text-6xl border-solid border-b-4 border-pink-200">
                <span className="logo-label__title-first font-sans font-bold mx-3">
                  Git
                </span>
                <span>Convex</span>
              </div>
              <div className="block font-mono my-2">
                A visualizer for your git repo
              </div>
            </div>
          </div>

          {showAlert ? (
            <div className="fixed bottom-0 left-0 right-0 w-full p-3 rounded-lg text-center font-sans bg-red-200 border-red-900">
              <div className="h1 text-3xl p-2 m-2 text-red-800">
                Server Unreachable
              </div>
              <p>
                The server is not reachable.Please check if the server module is
                running.
              </p>
            </div>
          ) : null}
        </div>
      ) : (
        props.history.push("/dashboard")
      )}
    </>
  );
}
