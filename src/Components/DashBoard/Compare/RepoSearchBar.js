import React, { useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchRepoCards from "./SearchRepoCards";

export default function RepoSearchBar() {
  library.add(fas);

  const [toggleSearchResult, setToggleSearchResult] = useState(false);
  const [searchQueryState, setSearchQueryState] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("");

  function setSelectedRepoHandler(repo) {
    setSelectedRepo(repo);
  }

  function noRepoBanner() {
    return (
      <div className="w-full mx-auto my-auto text-center block">
        <FontAwesomeIcon
          icon={["far", "object-group"]}
          className="font-sans text-center text-gray-300 my-20"
          size="10x"
        ></FontAwesomeIcon>
        <div className="text-6xl text-gray-200">Select a Repo to compare</div>
      </div>
    );
  }

  return (
    <>
      <div className="compare--searchbar flex w-11/12 rounded-md justify-between shadow mt-4 mx-auto items-center border">
        <div className="w-11/12 rounded-r-md">
          <input
            type="text"
            className="w-full p-3 outline-none text-lg font-light font-sans"
            placeholder="Enter repo name to search"
            value={searchQueryState}
            onChange={(event) => {
              setToggleSearchResult(true);
              setSearchQueryState(event.currentTarget.value);
            }}
          />
        </div>
        <div
          className="px-6 py-4 bg-gray-200 text-center rounded-r-lg hover:bg-gray-400 cursor-pointer"
          onClick={() => {}}
        >
          <FontAwesomeIcon
            icon={["fas", "search"]}
            className="text-3xl text-gray-600"
          ></FontAwesomeIcon>
        </div>
      </div>
      {toggleSearchResult && searchQueryState ? (
        <div className="w-11/12 mx-auto rounded-b-md p-3 border">
          <SearchRepoCards
            searchQuery={searchQueryState}
            setSelectedRepoHandler={setSelectedRepoHandler}
          ></SearchRepoCards>
        </div>
      ) : null}

      {selectedRepo ? <div></div> : noRepoBanner()}
    </>
  );
}
