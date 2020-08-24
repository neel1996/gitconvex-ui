import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function Help() {
  library.add(fas, fab);

  return (
    <div className="w-full h-full pb-10 xl:overflow-auto lg:overflow-auto md:overflow-none sm:overflow-none">
      <div className="flex text-5xl text-gray-700 mx-6 my-auto align-middle items-center">
        <FontAwesomeIcon icon={["fas", "question-circle"]}></FontAwesomeIcon>
        <div className="my-5 mx-5 font-sans">Help and Support</div>
      </div>
      <div className="my-4 mx-10">
        <div className="text-2xl font-sans text-gray-900">
          Facing an issue or need any help?
        </div>
        <span className="text-xl font-medium my-2">
          Before raising an issue, make sure you have gone through the
        </span>
        <span className="font-mono text-xl mx-2 text-indigo-500 hover:text-indigo-600 hover:font-semibold cursor-pointer">
          <a
            href="https://github.com/neel1996/gitconvex/blob/master/DOCUMENTATION.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </span>
      </div>

      <div className="my-10 border rounded shadow-sm p-4 mx-10">
        <div className="text-2xl font-sans font-semibold text-indigo-800">
          Have any queries or want to share your feedback?
        </div>
        <div className="flex mx-auto my-2 items-center align-middle">
          <div className="text-gray-800 text-2xl font-sans">
            Lets have a discussion on
          </div>

          <a
            href="https://discord.gg/PSd2Cq9"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex mx-2 justify-around align-middle items-center bg-indigo-400 text-white p-2 rounded shadow-sm text-2xl cursor-pointer hover:bg-indigo-500">
              <FontAwesomeIcon icon={["fab", "discord"]}></FontAwesomeIcon>
              <div className="mx-3 font-sans font-black">discord</div>
            </div>
          </a>
        </div>
      </div>

      <div className="my-10 border rounded shadow-sm p-4 mx-10">
        <div className="text-2xl font-sans font-semibold text-gray-600">
          You can also use the github issue reporting feature to report any
          issue you find in the platform
        </div>
        <a
          href="https://github.com/neel1996/gitconvex-package/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex w-1/3 xl:w-1/3 lg:w-1/3 md:w-1/2 sm:w-3/4 w-3/4 cursor-pointer hover:shadow-lg align-middle my-3 items-center p-3 bg-white shadow-md rounded border border-gray-500">
            <FontAwesomeIcon icon={["fab", "github"]}></FontAwesomeIcon>
            <div className="mx-2">Report an issue</div>
          </div>
        </a>
      </div>

      <div className="my-10 border rounded shadow-sm p-4 mx-10">
        <div className="text-2xl font-sans font-semibold text-gray-600 my-5 break-normal">
          gitconvex is open source and please visit the repo if you are
          interested in contributing to the platform
        </div>

        <div className="xl:flex lg:block md:block justify-center items-center align-middle">
          <a
            href="https://github.com/neel1996/gitconvex-ui"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto h-full flex w-3/4 xl:w-1/3 lg:w-1/3 md:w-1/2 sm:w-3/4 cursor-pointer hover:shadow-lg align-middle my-4 items-center bg-white shadow-md rounded border border-gray-500"
          >
            <div className="bg-blue-500 text-white p-1 text-5xl w-1/4 align-middle my-auto items-center text-center rounded-l">
              <FontAwesomeIcon icon={["fab", "react"]}></FontAwesomeIcon>
            </div>
            <div className="text-md mx-2 text-gray-700">gitconvex UI</div>
          </a>

          <a
            href="https://github.com/neel1996/gitconvex-server"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto h-full flex w-3/4 xl:w-1/3 lg:w-1/3 md:w-1/2 sm:w-3/4 cursor-pointer hover:shadow-lg align-middle my-4 items-center bg-white shadow-md rounded border border-gray-500"
          >
            <div className="bg-green-500 text-white p-1 text-5xl w-1/4 align-middle my-auto items-center text-center rounded-l">
              <FontAwesomeIcon icon={["fab", "node-js"]}></FontAwesomeIcon>
            </div>
            <div className="text-md mx-2 text-gray-700">gitconvex server</div>
          </a>
        </div>
      </div>
    </div>
  );
}
