import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo, useState } from "react";
import "../../styles/Compare.css";
import BranchCompareComponent from "./BranchCompareComponent/BranchCompareComponent";
import CommitCompareComponent from "./CommitCompareComponent/CommitCompareComponent";
import CompareActionButtons from "./CompareActionButtons";
import CompareActiveRepoPane from "./CompareActiveRepoPane";
import CompareSelectionHint from "./CompareSelectionHint";
import RepoSearchBar from "./RepoSearchBar";

export default function CompareComponent() {
  library.add(fas, far);

  const [selectedRepo, setSelectedRepo] = useState("");
  const [compareAction, setCompareAction] = useState("");

  function activateCompare(repo) {
    setSelectedRepo(repo);
  }

  const memoizedBranchCompareComponent = useMemo(() => {
    return (
      <BranchCompareComponent repoId={selectedRepo.id}></BranchCompareComponent>
    );
  }, [selectedRepo.id]);

  const memoizedCommitCompareComponent = useMemo(() => {
    return (
      <CommitCompareComponent repoId={selectedRepo.id}></CommitCompareComponent>
    );
  }, [selectedRepo.id]);

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
    <div className="compare overflow-auto">
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
            compareAction === "branch-compare" ? (
              memoizedBranchCompareComponent
            ) : (
              <>
                {compareAction === "commit-compare"
                  ? memoizedCommitCompareComponent
                  : null}
              </>
            )
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
