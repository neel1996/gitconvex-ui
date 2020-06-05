import React, { useContext } from 'react'

import { ContextProvider } from '../../../context'

export default function GitOperationComponent() {

    const { state, dispatch } = useContext(ContextProvider)

    const { gitTrackedFiles, gitUntrackedFiles } = state

    return (
        <div>

        </div>
    )
}
