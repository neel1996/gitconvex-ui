import React from 'react'

const contextValues = {
   hcDone: false,
   platform: "",
   git:"",
   node:"",
   globalRepoId: "",
   hcParams: [],
   presentRepo: [],
   modifiedGitFiles: []   
}

export const ContextProvider =  React.createContext(contextValues)
