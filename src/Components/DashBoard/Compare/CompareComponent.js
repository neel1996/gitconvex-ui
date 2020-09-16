import React from "react";
import "../../styles/Compare.css";
import RepoSearchBar from "./RepoSearchBar";

export default function CompareComponent() {
  return (
    <div className="compare">
      <div className="compare--header">Compare Branches and Commits</div>
      <RepoSearchBar></RepoSearchBar>
    </div>
  );
}
