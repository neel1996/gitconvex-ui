import React, { useEffect, useState } from "react";
import axios from "axios";
import { Redirect } from "react-router";
import {
  CONFIG_HTTP_MODE,
  API_HEALTHCHECK,
  PORT_HEALTHCHECK_API
} from "../env_config";
import "./SplashScreen.css";

export default function SplashScreen(props) {
  const [loader, setLoader] = useState("");
  const [hcCheck, setHcCheck] = useState(false);

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
          } else {
            setHcCheck(false);
          }
        })
        .catch(err => console.log(err));
    });
  });

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
          <div className="text-center justify-center p-3 mx-auto border-b-2 border-blue-300">
            {loader}
          </div>
        </div>
      ) : (
        <Redirect to="/dashboard"></Redirect>
      )}
    </>
  );
}
