import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  globalAPIEndpoint,
  ROUTE_REPO_DETAILS,
} from "../../../util/env_config";

export default function BranchCompareComponent(props) {
  library.add(fas);
  const [branchList, setBranchList] = useState([]);
  const [currentBranch, setCurrentBranch] = useState("");
  const [compareBranch, setCompareBranch] = useState("");
  const [baseBramch, setBaseBranch] = useState("");

  useEffect(() => {
    const token = axios.CancelToken;
    const source = token.source();

    const payload = JSON.stringify(JSON.stringify({ repoId: props.repoId }));

    axios({
      url: globalAPIEndpoint,
      method: "POST",
      cancelToken: source.token,
      data: {
        query: `
            query GitConvexApi
            {
              gitConvexApi(route: "${ROUTE_REPO_DETAILS}", payload: ${payload}){
                gitRepoStatus {
                    gitBranchList  
                    gitCurrentBranch
                }
              }
            }
          `,
      },
    })
      .then((res) => {
        let {
          gitBranchList,
          gitCurrentBranch,
        } = res.data.data.gitConvexApi.gitRepoStatus;

        gitBranchList =
          gitBranchList &&
          gitBranchList.map((branch) => {
            return branch.trim();
          });

        setBranchList(gitBranchList);
        setCurrentBranch(gitCurrentBranch);
        setBaseBranch(currentBranch);
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      return source.cancel;
    };
  }, [props.repoId]);

  function noBranchToCompare() {
    return (
      <div className="w-full mx-auto my-auto text-center block">
        <FontAwesomeIcon
          icon={["fas", "puzzle-piece"]}
          className="font-sans text-center text-gray-300 my-20"
          size="10x"
        ></FontAwesomeIcon>
        <div className="text-2xl text-gray-300">
          Only one branch is available, hence can't be set for comparison
        </div>
      </div>
    );
  }

  function compareBranchSelectPane() {
    return (
      <div className="w-11/12 p-3 flex mx-auto items-center align-middle rounded-lg shadow-md border-2 justify-around">
        <div className="flex gap-6 justify-between items-center">
          <div>Base branch</div>
          <div>
            <select
              className="outline-none p-2 shadow border-2 bg-white rounded-lg"
              onChange={(e) => {
                setBaseBranch(e.currentTarget.value);
              }}
            >
              <option value={currentBranch} selected>
                {currentBranch}
              </option>
              {branchList.slice(1).map((branch) => {
                return <option value={branch}>{branch}</option>;
              })}
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {branchList.length === 1 ? (
        noBranchToCompare()
      ) : branchList.length === 0 ? (
        <div className="mx-auto my-20 text-center flex justify-center text-4xl font-sans text-center text-gray-300">
          Loading Branch Info...
        </div>
      ) : (
        compareBranchSelectPane()
      )}
    </div>
  );
}
