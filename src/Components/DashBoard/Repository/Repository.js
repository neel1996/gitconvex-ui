import React from "react";

export default function Repository(props) {
  var repoId = "";
  if (props.parentProps !== undefined) {
    repoId = props.parentProps.location.pathname.split("/repository/")[1];
  }
  console.log(repoId);

  return (
    <div className="w-1/2 p-6 bg-gray-200 mx-auto justify-center rounded-lg">
      <h1>Repository</h1>
    </div>
  );
}
