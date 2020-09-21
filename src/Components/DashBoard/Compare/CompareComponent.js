import React, { useState } from "react";
import "../../styles/Compare.css";
import CompareActionButtons from "./CompareActionButtons";
import RepoSearchBar from "./RepoSearchBar";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CompareActiveRepoPane from "./CompareActiveRepoPane";
import CompareSelectionHint from "./CompareSelectionHint";

export default function CompareComponent() {
  library.add(fas, far);

  const [selectedRepo, setSelectedRepo] = useState("");
  const [compareAction, setCompareAction] = useState("");

  function activateCompare(repo) {
    setSelectedRepo(repo);
  }

  function noSelectedRepobanner() {
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
    <div className="compare">
      <div className="compare--header">Compare Branches and Commits</div>
      <RepoSearchBar activateCompare={activateCompare}></RepoSearchBar>
      {selectedRepo ? (
        <>
          <CompareActiveRepoPane
            repoName={selectedRepo.repoName}
          ></CompareActiveRepoPane>
          <CompareActionButtons
            setCompareAction={(action) => {
              setCompareAction(action);
            }}
          ></CompareActionButtons>
          {compareAction ? (
            <div></div>
          ) : (
            <CompareSelectionHint></CompareSelectionHint>
          )}
        </>
      ) : (
        noSelectedRepobanner()
      )}
    </div>
  );
}
