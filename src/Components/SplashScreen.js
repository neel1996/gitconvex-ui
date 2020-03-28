import React, {useEffect} from "react";

import "./SplashScreen.css";

export default function SplashScreen() {

  useEffect(()=>{
    
  })

  return (
    <>
      <div className="splash-logo w-64 h-full justify-center mx-auto flex my-auto align-center items-center">
        <div className="p-5 shadow-md border-l-4 border-t-4 border-blue-100 rounded-lg block">
          <div className="splash-logo__image"></div>
        </div>
        <div className="logo-label my-3 p-3 text-center block">
          <div className="logo-label__title block text-6xl border-solid border-b-4 border-pink-200">
            <span className="logo-label__title-first font-sans font-bold mx-3">Git</span>
            <span>Convex</span>
          </div>
          <div className="block font-mono my-2">
            A visualizer for your git repo
          </div>
        </div>
      </div>
    </>
  );
}
