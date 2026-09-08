import React from "react";
import { STL, SanityTable, SanityTableProps } from "structured-table";
import TableView from "./table/TableView";

export const STLReact = {
    Table: (props: SanityTableProps & { className?: string }) => <TableView {...props} />,
};

export interface StlTableBlockValue {
    _key?: string;
    _type?: string;
    stlString?: string;
    stlParsed?: string;
    caption?: string;
}

export function StlTableBlockRenderer({ value }: { value: StlTableBlockValue }) {
    if (!value) return null;

    let tableData: SanityTable | null = null;
    try {
        if (value.stlParsed) {
            tableData = typeof value.stlParsed === "string" ? JSON.parse(value.stlParsed) : value.stlParsed;
        } else if (value.stlString) {
            tableData = STL.parse(value.stlString);
        }
    } catch (err) {
        console.error("Failed to parse STL table block:", err);
        return null;
    }

    if (!tableData) return null;

    if (value.caption && !tableData.caption) {
        tableData.caption = value.caption;
    }

    return <STLReact.Table data={tableData} className="border" />;
}

export default STLReact;
