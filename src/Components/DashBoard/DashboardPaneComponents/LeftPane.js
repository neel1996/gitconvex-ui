import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { ADD_FORM_CLOSE } from "../../../actionStore";
import { ContextProvider } from "../../../context";



export default function LeftPane(props) {
  library.add(far, fas);
  const { dispatch } = useContext(ContextProvider);
  const menuItemParams = [
    {
      link: "/dashboard/repository",
      icon: (
        <FontAwesomeIcon
          icon={["far", "folder"]}
          className="text-3xl text-gray-600"
        ></FontAwesomeIcon>
      ),
      label: "Repositories",
    },
    {
      link: "/dashboard/settings",
      icon: (
        <FontAwesomeIcon
          icon={["fas", "cog"]}
          className="text-3xl text-gray-600"
        ></FontAwesomeIcon>
      ),
      label: "Settings",
    },
    {
      link: "/dashboard/help",
      icon: (
        <FontAwesomeIcon
          icon={["far", "question-circle"]}
          className="text-3xl text-gray-600"
        ></FontAwesomeIcon>
      ),
      label: "Help",
    },
  ];

  return (
    <div className="dashboard-leftpane xl:block lg:block md:flex md:justify-between bg-white overflow-auto xl:w-1/4 lg:w-1/3 md:w-full top-0 left-0 right-0 shadow-md block p-3 bg-white-400">
      <div
        className="flex justify-center items-center bg-blue-100 cursor-pointer"
        onClick={(event) => {
          dispatch({ type: ADD_FORM_CLOSE, payload: true });
          props.parentProps.history.push("/dashboard");
        }}
      >
        <div className="block dashboard-leftpane__logo"></div>
        <div className="font-mono xl:text-3xl lg:text-2xl md:text-3xl sm:text-2xl p-4">
          <span className="font-bold mx-2 border-b-4 border-pink-400">Git</span>
          Convex
        </div>
      </div>
      <div className="xl:mt-32 lg:mt-24 cursor-pointer xl:block lg:block md:flex sm:block items-center align-middle">
        {menuItemParams.map((entry) => {
          return (
            <NavLink
              to={`${entry.link}`}
              exact
              activeClassName="bg-gray-300"
              className="flex border-b border-black-100 p-3 hover:bg-gray-100 mx-2"
              key={entry.label}
            >
              <div className="flex gap-10 align-middle items-center my-auto">
                <div className="text-sm">{entry.icon}</div>
                <div className="xl:text-2xl lg:text-2xl md:text-xl text-gray-700">
                  {entry.label}
                </div>
              </div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
