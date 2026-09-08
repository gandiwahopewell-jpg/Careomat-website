import React, { useCallback, useMemo } from "react";
import { PatchEvent, set, unset, type ObjectInputProps } from "sanity";
import { STL } from "structured-table";
import TableView from "@/components/stl-table/table/TableView";

export const TableInput = (props: ObjectInputProps) => {
  const { value, onChange, readOnly } = props;
  const typedValue = value as { stlString?: string; stlParsed?: string; caption?: string } | undefined;
  const stlString = typedValue?.stlString ?? "";

  const tableData = useMemo(() => {
    try {
      if (typedValue?.stlParsed) {
        return typeof typedValue.stlParsed === "string"
          ? JSON.parse(typedValue.stlParsed)
          : typedValue.stlParsed;
      }
      if (!stlString) return null;
      return STL.parse(stlString);
    } catch {
      return null;
    }
  }, [stlString, typedValue?.stlParsed]);

  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const nextValue = event.currentTarget.value;
      if (nextValue) {
        let parsedJson: string | undefined;
        try {
          parsedJson = JSON.stringify(STL.parse(nextValue));
        } catch {
          parsedJson = undefined;
        }
        onChange(
          PatchEvent.from([
            set(nextValue, ["stlString"]),
            parsedJson ? set(parsedJson, ["stlParsed"]) : unset(["stlParsed"]),
          ])
        );
      } else {
        onChange(PatchEvent.from([unset(["stlString"]), unset(["stlParsed"])]));
      }
    },
    [onChange]
  );

  const handleCaptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const caption = e.currentTarget.value;
      onChange(
        caption
          ? PatchEvent.from(set(caption, ["caption"]))
          : PatchEvent.from(unset(["caption"]))
      );
    },
    [onChange]
  );

  const hasContent = useMemo(() => {
    if (!tableData) return false;
    const hasHeader = (tableData.header?.cells?.length ?? 0) > 0;
    const hasBody = (tableData.body?.length ?? 0) > 0;
    const hasFooter = (tableData.footer?.cells?.length ?? 0) > 0;
    return hasHeader || hasBody || hasFooter;
  }, [tableData]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>
          Table Data (STL Format)
        </label>
        <textarea
          value={stlString}
          onChange={handleTextChange}
          readOnly={readOnly}
          rows={10}
          placeholder={"[header]\n| Column 1 | Column 2 |\n[body]\n| Data 1 | Data 2 |"}
          style={{
            width: "100%",
            fontFamily: "monospace",
            fontSize: "13px",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>
          Table Caption
        </label>
        <input
          type="text"
          value={typedValue?.caption ?? ""}
          onChange={handleCaptionChange}
          readOnly={readOnly}
          placeholder="Enter table caption..."
          style={{
            width: "100%",
            padding: "8px 10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ padding: "16px", borderRadius: "6px", border: "1px dashed #ccc", backgroundColor: "rgba(0,0,0,0.02)" }}>
        <div style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", color: "#666", marginBottom: "8px" }}>
          Live Preview
        </div>
        {hasContent && tableData ? (
          <TableView data={tableData} className="border" />
        ) : (
          <div style={{ color: "#888", fontSize: "13px" }}>
            Start by defining a section (e.g. <code>[header]</code> or <code>[body]</code>) to see the preview.
          </div>
        )}
      </div>
    </div>
  );
};

export const TablePreview = (props: any) => {
  const { subtitle: stlString, title: caption } = props;
  const tableData = useMemo(() => {
    if (!stlString) return null;
    try {
      const data = STL.parse(stlString);
      if (caption) data.caption = caption;
      return data;
    } catch {
      return null;
    }
  }, [stlString, caption]);

  if (!tableData) return <div>Empty Table</div>;
  return <TableView data={tableData} className="border" />;
};

export const stlTableBlock = {
  name: "stlTableBlock",
  title: "Structured Table Block",
  type: "object",
  icon: () => "📊",
  fields: [
    {
      title: "Table Data (STL Format)",
      name: "stlString",
      type: "string",
      description: "Enter your Structured Table Language (STL) here.",
    },
    {
      name: "stlParsed",
      title: "Parsed Table Data",
      type: "text",
      hidden: true,
      readOnly: true,
      description: "Auto-generated JSON string from stlString. Used for faster rendering without re-parsing.",
    },
    {
      name: "caption",
      title: "Table Caption",
      type: "string",
    },
  ],
  components: {
    input: TableInput,
    preview: TablePreview,
  },
  preview: {
    select: {
      title: "caption",
      subtitle: "stlString",
    },
  },
};
