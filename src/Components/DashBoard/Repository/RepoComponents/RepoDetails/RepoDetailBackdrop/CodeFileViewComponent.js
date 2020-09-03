import axios from "axios";
import * as Prism from "prismjs";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "../../../../../../prism.css";
import {
  CODE_FILE_VIEW,
  globalAPIEndpoint,
} from "../../../../../../util/env_config";

export default function CodeFileViewComponent(props) {
  const [languageState, setLanguageState] = useState("");
  const [numberOfLines, setNumberOfLines] = useState(0);
  const [latestCommit, setLatestCommit] = useState("");
  const [prismIndicator, setPrismIndicator] = useState("");
  const [fileData, setFileData] = useState([]);

  const repoId = props.repoId;
  const fileItem = props.fileItem;

  useEffect(() => {
    const payload = JSON.stringify(
      JSON.stringify({
        repoId: repoId,
        fileItem: fileItem,
      })
    );
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
                fileCommit
                fileData
                prism
              }
            }
          }
        `,
      },
    })
      .then(async (res) => {
        if (res.data.data) {
          const {
            language,
            fileCommit,
            fileData,
            prism,
          } = res.data.data.gitConvexApi.codeFileDetails;
          setLanguageState(language);
          setLatestCommit(fileCommit);
          setNumberOfLines(fileData.length);
          setFileData(fileData);

          if (prism) {
            await import("prismjs/components/prism-" + prism + ".js")
              .then(() => {
                setPrismIndicator(prism);
              })
              .catch((err) => {
                console.log(err);
                setPrismIndicator("markdown");
              });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [repoId, fileItem]);

  function topPanePills(label, content, accent) {
    const bg = `bg-${accent}-100`;
    const textColor = `text-${accent}-500`;

    return (
      <div className="flex justify-between gap-8 items-center align-middle">
        <div className="font-light font-sans text-xl border-b-4 border-dashed text-gray-700">
          {label}
        </div>
        <div
          className={`"rounded p-2 text-center ${bg} ${textColor} ${
            content.length > 10 ? "text-sm" : ""
          } font-semibold"`}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-md shadow-sm flex justify-center mx-auto my-auto mb-6 w-full h-full">
      <div className="my-auto mx-auto mb-10 w-11/12 p-6 rounded shadow border-gray-100 bg-white">
        <div className="flex w-11/12 mx-auto justify-between gap-4">
          {languageState
            ? topPanePills("Language", languageState, "pink")
            : null}
          {numberOfLines
            ? topPanePills("Lines", numberOfLines, "orange")
            : null}
        </div>
        {latestCommit ? (
          <div className="block mx-auto my-6 w-11/12">
            {topPanePills("Latest Commit", latestCommit, "indigo")}
          </div>
        ) : null}

        {fileData && prismIndicator ? (
          <div className="my-6 mx-auto p-4 rounded shadow">
            {fileData.map(async (line) => {
              return (
                <div key={uuidv4()}>
                  <pre>
                    <code
                      dangerouslySetInnerHTML={{
                        __html: Prism.highlight(
                          line,
                          Prism.languages["json"],
                          "json"
                        ),
                      }}
                    ></code>
                  </pre>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
