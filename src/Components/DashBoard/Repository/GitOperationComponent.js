import React, { useContext } from 'react'
import { MUIDataTable } from 'mui-datatables'
// import { Table } from '@material-ui/core'

import { ContextProvider } from '../../../context'

export default function GitOperationComponent() {

    const { state, dispatch } = useContext(ContextProvider)

    const { gitTrackedFiles, gitUntrackedFiles } = state

    const tableColumns = ["Changes", "File Status", "Action"]
    let tableDataArray = []

    function getTableData() {
        let statusPill = (status) => {
            if (status === 'M') {
                return (
                    <div className="p-2 text-center text-yellow-700 border border-yellow-500 rounded-md shadow-sm">
                        Modified
                    </div>
                )
            } else {
                return (
                    <div className="p-2 text-center text-indigo-700 border border-indigo-500 rounded-md shadow-sm">
                        Untracked
                    </div>
                )
            }
        }

        let actionButton = <div className="p-2  bg-green-300 text-white rounded-md shadow-sm hover:shadow-md">Add</div>
        console.log(gitTrackedFiles)
        console.log(gitUntrackedFiles)

        gitTrackedFiles.forEach((item) => {
            console.log(item[0])
            if (item[0].split(",").length > 0) {
                tableDataArray.push([item[0].split(",")[1], statusPill(item[0].split(",")[0]), actionButton])
            }
        })

        gitUntrackedFiles.forEach((item) => {
            console.log(item[0])

            if (item[0]) {
                item[0].split(",") ? tableDataArray.push([item[0].split(",").join(""), statusPill('N'), actionButton]) : tableDataArray.push([item[0], statusPill('N'), actionButton])
            }
        })
        console.log(tableDataArray)

        return tableDataArray;

    }

    return (
        <>
            <table className="table border-0 w-full cursor-pointer" cellPadding="20">
                <thead>
                    <tr className="bg-orange-300 p-3 text-xl font-sans">
                        {
                            tableColumns.map((column) => {
                                return (
                                    <th className="font-bold border-r border-gray-200">{column}</th>
                                )
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        getTableData().map((tableData) => {
                            return (
                                <tr className="m-4 text-xl font-sans border-b border-gray-300">
                                    {
                                        tableData.map((data) => {
                                            return (
                                                <td className="text-center">
                                                    {data}
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </>
    )
}
