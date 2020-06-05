import React from 'react'

const contextValues = {
   hcDone: false,
   platform: "",
   git:"",
   node:"",
   globalRepoId: "",
   hcParams: {},
   presentRepo: [],
   modifiedGitFiles: [],
   gitUntrackedFiles: [],
   gitTrackedFiles: []   
}

export const ContextProvider =  React.createContext(contextValues)
