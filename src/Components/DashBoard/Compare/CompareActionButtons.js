import React, { useState } from "react";

export default function CompareActionButtons(props) {
  const actionButtons = ["Branch Compare", "Commit Compare"];
  const [localAction, setLocalAction] = useState("");

  return (
    <div className="my-10 w-11/12 mx-auto flex justify-around">
      {actionButtons.map((item, index) => {
        const btnStyle = localAction.includes(item.split(" ")[0].toLowerCase())
          ? "bg-blue-400 text-white"
          : "border-blue-200";
        return (
          <div
            className={`w-1/3 rounded-lg p-3 shadow border text-center font-sans font-semibold cursor-pointer hover:shadow-lg ${btnStyle}`}
            key={`actionItem-${index}`}
            onClick={(event) => {
              if (event.currentTarget.innerText.includes("Branch")) {
                const action = "branch-compare";
                props.setCompareAction(action);
                setLocalAction(action);
              } else if (event.currentTarget.innerText.includes("Commit")) {
                const action = "commit-compare";
                props.setCompareAction(action);
                setLocalAction(action);
              }
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
}
