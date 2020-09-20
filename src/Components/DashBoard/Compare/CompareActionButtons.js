import React from "react";

export default function CompareActionButtons() {
  const actionButtons = ["Branch Compare", "Commit Compare"];

  return (
    <div className="my-10 w-11/12 mx-auto flex justify-around">
      {actionButtons.map((item, index) => {
        return (
          <div
            className="w-1/3 rounded-lg border-blue-200 p-3 shadow border text-center font-sans font-semibold cursor-pointer hover:shadow-lg"
            key={`actionItem-${index}`}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
}
