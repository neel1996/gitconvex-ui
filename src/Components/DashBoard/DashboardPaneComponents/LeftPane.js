import {
  FolderOutlined,
  HelpOutline,
  SettingsOutlined,
} from "@material-ui/icons";
import React from "react";
import { NavLink } from "react-router-dom";

export default function LeftPane(props) {
  const menuItemParams = [
    {
      link: "/dashboard/repository",
      icon: (
        <FolderOutlined
          style={{ color: "grey", fontSize: "36px" }}
        ></FolderOutlined>
      ),
      label: "Repositories",
    },
    {
      link: "/dashboard/settings",
      icon: (
        <SettingsOutlined
          style={{ color: "grey", fontSize: "36px" }}
        ></SettingsOutlined>
      ),
      label: "Settings",
    },
    {
      link: "/dashboard/help",
      icon: (
        <HelpOutline style={{ color: "grey", fontSize: "36px" }}></HelpOutline>
      ),
      label: "Help",
    },
  ];

  return (
    <div className="dashboard-leftpane overflow-auto w-1/4 lg:w-1/3 shadow-md block p-3 bg-white-400">
      <div
        className="flex justify-center items-center bg-blue-100 cursor-pointer"
        onClick={(event) => {
          props.parentProps.history.push("/dashboard");
        }}
      >
        <div className="block dashboard-leftpane__logo"></div>
        <div className="font-mono text-2xl p-4 text-3xl">
          <span className="font-bold mx-2 border-b-4 border-pink-400">Git</span>
          Convex
        </div>
      </div>
      <div className="mt-32 cursor-pointer">
        {menuItemParams.map((entry) => {
          return (
            <NavLink
              to={`${entry.link}`}
              exact
              activeClassName="bg-gray-300"
              className="flex border-b border-black-100 p-3 hover:bg-gray-100"
              key={entry.label}
            >
              <div className="flex">
                <div>{entry.icon}</div>
                <div className="ml-2 text-2xl text-gray-700">{entry.label}</div>
              </div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
