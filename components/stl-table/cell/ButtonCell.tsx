"use client";

import React, { useId } from "react";
import { ButtonCellProps } from "structured-table";

const ButtonCell = React.memo(({ data }: { data: ButtonCellProps }) => {
    const stableId = useId();

    const handleBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        try {
            if (data.url) {
                window.open(data.url, "_blank");
                return;
            }

            if (data.action) {
                const event = new CustomEvent("st-action", {
                    detail: {
                        action: data.action,
                        targetId: data.targetId,
                        text: data.text,
                        originalEvent: e,
                    },
                    bubbles: true,
                });
                e.currentTarget.dispatchEvent(event);
                console.log(`[StructuredTable] Action triggered: ${data.action}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <button
            onClick={handleBtnClick}
            id={data.targetId ?? stableId}
            className="st-button"
            data-action={data.action}
            data-variant={data.variant}
        >
            {data.text}
        </button>
    );
});
ButtonCell.displayName = "ButtonCell";

export { ButtonCell };
