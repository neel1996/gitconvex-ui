import React from 'react'

const contextValues = {
   hcDone: false,
   platform: "",
   git:"",
   node:""    
}

export const ContextProvider =  React.createContext(contextValues)
