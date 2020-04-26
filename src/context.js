import React from 'react'

const contextValues = {
   hcDone: false,
   platform: "",
   git:"",
   node:"",
   hcParams: [],
   presentRepo: []   
}

export const ContextProvider =  React.createContext(contextValues)
