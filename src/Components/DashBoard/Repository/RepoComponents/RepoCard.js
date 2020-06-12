import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { globalAPIEndpoint, ROUTE_REPO_DETAILS } from "../../../../util/env_config";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function RepoCard(props) {
    library.add(fab, fas)
    const { repoData } = props
    const payload = JSON.stringify(JSON.stringify({ repoId: repoData.id }));

    const [repoFooterData, setRepoFooterData] = useState('')

    useEffect(() => {
        axios({
            url: globalAPIEndpoint,
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            data: {
                query: `
    
                query GitConvexApi
                {
                  gitConvexApi(route: "${ROUTE_REPO_DETAILS}", payload: ${payload}){
                    gitRepoStatus {
                      gitTotalCommits
                      gitTotalTrackedFiles    
                    }
                  }
                }
              `,
            },
        })
            .then((res) => {
                setRepoFooterData(res.data.data.gitConvexApi.gitRepoStatus)
            })
            .catch((err) => {
                if (err) {
                    console.log("API GitStatus error occurred : " + err);
                }
            });
    }, props)

    const repoName = repoData.repoName;
    var avatar = "";

    if (repoName) {
        if (repoName.split(" ").length > 1) {
            let tempName = repoName.split(" ");
            avatar =
                tempName[0].substring(0, 1) + tempName[1].substring(0, 1);
            avatar = avatar.toUpperCase();
        } else {
            avatar = repoName.substring(0, 1).toUpperCase();
        }
    }

    return (
        <NavLink
            to={`/dashboard/repository/${repoData.id}`}
            className="w-1/4 block p-6 mx-6 rounded-lg border border-gray-300 shadow-md my-6 text-center bg-blue-100 cursor-pointer hover:shadow-xl"
            key={repoData.repoName}
        >
            <div className="text-center bg-blue-600 text-white text-5xl my-2 px-10 py-5">
                {avatar}
            </div>
            <div className="my-4 font-sans text-2xl">
                {repoData.repoName}
            </div>
            <div className="flex justify-center mx-auto my-2 text-center rounded-md shadow-sm">
                <div className="flex p-2 bg-pink-200 my-2">
                    <FontAwesomeIcon className="my-auto" icon={["fas", "grip-lines"]}></FontAwesomeIcon>
                    <div className="mx-2 text-center font-sans text-center">{repoFooterData.gitTotalCommits} Commits</div>
                </div>
                <div className="flex p-2 bg-red-200 my-2">
                    <FontAwesomeIcon className="my-auto" icon={["fas", "file-alt"]}></FontAwesomeIcon>
                    <div className="mx-2 text-center font-sans text-center">{repoFooterData.gitTotalTrackedFiles} Tracked Files</div>
                </div>
            </div>
        </NavLink>
    );
}
