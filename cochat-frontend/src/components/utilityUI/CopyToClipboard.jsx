// src/components/utilityUI/CopyToClipboard.jsx

import React, { useState } from "react";
import { FaRegCopy, FaCheck } from "react-icons/fa";

function CopyToClipboard({ textToCopy, size = "1rem", iconOnly = false }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500); // reset after 1.5s
        });
    };

    return (
        <button
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy to clipboard"}
            style={{
                marginLeft: "0.5rem",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: copied ? "#4caf50" : "#888",
                fontSize: size,
                display: "inline-flex",
                alignItems: "center",
                transition: "color 0.2s ease-in-out"
            }}
        >
            {copied ? <FaCheck /> : <FaRegCopy />}
            {!iconOnly && (
                <span style={{ marginLeft: "0.25rem", fontSize: "0.75rem" }}>
                    {copied ? "Copied!" : ""}
                </span>
            )}
        </button>
    );
}

export default CopyToClipboard;