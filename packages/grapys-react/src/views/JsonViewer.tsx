import React, { useState } from "react";

interface JsonViewerProps {
  jsonData: any;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ jsonData }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={"pointer-events-auto flex w-100 flex-col"}>
      {/* {header} */}
      <div
        className={"flex cursor-pointer items-center justify-between rounded-t-lg border border-gray-300 bg-gray-100 p-3"}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center font-bold">
          <span>JSON Data</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {/* {body} */}
      <div
        className={`overflow-hidden overflow-y-scroll border border-gray-300 bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[calc(100vh-90px)]" : "max-h-0"
        }`}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <pre className="p-6 font-mono text-xs break-words whitespace-pre-wrap">{JSON.stringify(jsonData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default JsonViewer;
