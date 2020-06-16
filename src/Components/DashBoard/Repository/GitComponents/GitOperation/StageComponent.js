import React from "react";

export default function StageComponent(props) {
  const { stageComponents } = props;

  return (
    <>
      <div className="w-1/2 mx-auto my-auto bg-gray-200 p-6 rounded-md">
        <div className="p-5 font-sans text-2xl font-sans font-bold">
          All these changes will be staged:
        </div>
        {stageComponents &&
          stageComponents.map((item) => {
            return (
              <div className="p-1 font-sans text-lg mx-4" key={item}>
                {item}
              </div>
            );
          })}
        <div className="mx-auto my-4 text-center bg-green-600 text-xl p-3 rounded-md shadow-md font-sans text-white hover:bg-green-400 cursor-pointer">
          Confirm Staging
        </div>
      </div>
    </>
  );
}
