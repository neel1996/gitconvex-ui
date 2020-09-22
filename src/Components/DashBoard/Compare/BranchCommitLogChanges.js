import React, { useEffect, useState } from "react";
import axios from "axios";
import { globalAPIEndpoint } from "../../../util/env_config";

export default function BranchCommitLogChanges(props) {
  const { baseBranch, compareBranch } = props;

  const [commitLogs, setCommitLogs] = useState([]);

  useEffect(() => {
    axios({
      url: globalAPIEndpoint,
      method: "POST",
      data: {
        query: ``,
      },
    });
  });

  return <div></div>;
}
