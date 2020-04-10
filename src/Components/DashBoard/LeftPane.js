import {
  FolderOutlined,
  HelpOutline,
  SettingsOutlined
} from "@material-ui/icons";
import React from "react";
import { NavLink } from "react-router-dom";

export default function LeftPane(props) {
  return (
    <div className="dashboard-leftpane w-1/4 shadow-md block p-3 bg-white-400">
      <div
        className="flex justify-center items-center bg-blue-100 cursor-pointer"
        onClick={event => {
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
        <NavLink to="/dashboard/repository" exact activeClassName="bg-gray-300" className="flex border-b border-black-100 p-3 hover:bg-gray-100">
          <div className="flex">
            <div>
              <FolderOutlined
                style={{ color: "grey", fontSize: "36px" }}
              ></FolderOutlined>
            </div>
            <div className="ml-2 text-2xl text-gray-700">Repositories</div>
          </div>
        </NavLink>
        <div className="flex border-b border-black-100 p-3 hover:bg-gray-100">
          <div>
            <SettingsOutlined
              style={{ color: "grey", fontSize: "36px" }}
            ></SettingsOutlined>
          </div>
          <div className="ml-2 text-2xl text-gray-700">Settings</div>
        </div>
        <div className="flex border-b border-black-100 p-3 hover:bg-gray-100">
          <div>
            <HelpOutline
              style={{ color: "grey", fontSize: "36px" }}
            ></HelpOutline>
          </div>
          <div className="ml-2 text-2xl text-gray-700">Help</div>
        </div>
      </div>
    </div>
  );
}
