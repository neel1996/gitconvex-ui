import React, { useEffect, useState } from "react";
import { globalAPIEndpoint } from "../../../../../util/env_config";
import axios from "axios";

export default function SwitchBranchComponent({
  repoId,
  branchName,
  closeBackdrop,
}) {
  const [branchError, setBranchError] = useState(false);

  useEffect(() => {
    axios({
      url: globalAPIEndpoint,
      method: "POST",
      data: {
        query: `
            mutation{
              setBranch(repoId: "${repoId}", branch: "${branchName}")
            }
          `,
      },
    })
      .then((res) => {
        if (res.data.data && !res.data.error) {
          closeBackdrop(true);
        }
      })
      .catch((err) => {
        if (err) {
          setBranchError(true);
        }
      });
  }, [branchName, closeBackdrop, repoId]);

  return (
    <div className="xl:w-3/4 lg:w-3/4 md:w-11/12 sm:w-11/12 w-11/12 mx-auto my-auto bg-gray-200 p-6 rounded-md">
      <div className="bg-indigo-200 p-2 border-indigo-600 rounded shadow-md">
        Switching to branch -{" "}
        <span className="font-sans font-semibold text-xl">{branchName}</span>...
      </div>
      {branchError ? (
        <div className="bg-red-200 p-2 border-red-600 rounded shadow-md">
          Switching to branch -{" "}
          <span className="font-sans font-semibold text-xl">{branchName}</span>{" "}
          Failed!
        </div>
      ) : null}
    </div>
  );
}
