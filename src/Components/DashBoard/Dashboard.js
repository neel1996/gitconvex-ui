import React from "react";
import {
  FolderOutlined,
  SettingsOutlined,
  HelpOutline
} from "@material-ui/icons";

export default function Dashboard() {
  return (
    <>
      <div className="flex w-full h-full">{leftPane()}</div>
    </>
  );

  function leftPane() {
    return (
      <div className="dashboard-leftpane w-1/4 shadow-md block p-3 bg-white-400">
        <div className="flex justify-center items-center bg-blue-100">
          <div className="block dashboard-leftpane__logo"></div>
          <div className="font-mono text-2xl p-2">Git Convex</div>
        </div>
        <div className="mt-32 cursor-pointer">
          <div className="flex border-b border-black-100 p-3 hover:bg-gray-100">
            <div>
              <FolderOutlined
                style={{ color: "grey", fontSize: "36px" }}
              ></FolderOutlined>
            </div>
            <div className="ml-2 text-2xl text-gray-700">Repositories</div>
          </div>
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

  function rightPane() {}
}
