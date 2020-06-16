import RepoCard from "../Components/DashBoard/Repository/RepoComponents/RepoCard";
import React from "react";
import ReactDOM from "react-dom";
import { render, cleanup, waitForElement } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

test("RepoCard test", () => {
  const renderedElement = await waitForElement(<RepoCard repoData={{id: "1587824646294"}}></RepoCard>)
});
