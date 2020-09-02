import axios from "axios";
import * as Prism from "prismjs";
import React, { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "../../../../../../prism.css";
import {
  globalAPIEndpoint,
  CODE_FILE_VIEW,
} from "../../../../../../util/env_config";

export default function CodeFileViewComponent(props) {
  const [language, setLanguage] = useState("");
  const [numberOfLines, setNumberOfLines] = useState(0);
  const [latestCommit, setLatestCommit] = useState("");
  const [fileData, setFileData] = useState([]);

  const repoId = props.repoId;
  const fileItem = props.fileItem;

  const payload = JSON.stringify(
    JSON.stringify({
      repoId: repoId,
      fileItem: fileItem,
    })
  );

  useEffect(() => {
    axios({
      url: globalAPIEndpoint,
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      data: {
        query: `
          query GitConvexApi{
            gitConvexApi(route: "${CODE_FILE_VIEW}", payload:${payload})
            {
              codeFileDetails{
                language
                commit
                fileData
              }
            }
          }
        `,
      },
    })
      .then((res) => {
        if (res.data.data) {
          const {
            language,
            commit,
            fileData,
          } = res.data.data.gitConvexApi.codeFileDetails;
          setLanguage(language);
          setLatestCommit(commit);
          setNumberOfLines(fileData);
          setFileData(fileData);
          console.log(res.data.data.gitConvexApi.codeFileDetails);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="p-6 rounded-md shadow-sm block justify-center mx-auto my-auto w-3/4 h-full text-center text-2xl text-indigo-500">
      <div className="my-4 mx-auto w-11/12 rounded shadow border-gray-100">
        <div>Language</div>
        <div>{language}</div>
      </div>
    </div>
  );
}
