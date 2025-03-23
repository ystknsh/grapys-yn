import React, { useState } from 'react';

interface HideableJsonViewerProps {
  jsonData: any;
  width?: string;
}

const HideableJsonViewer: React.FC<HideableJsonViewerProps> = ({ 
  jsonData, 
  width = '400px' 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`flex flex-col`}
      style={{ width }}
    >
      {/* {header} */}
      <div 
        className={`flex items-center justify-between bg-gray-100 p-3 border border-gray-300 rounded-t-lg cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="font-bold flex items-center">
          <span>JSON Data</span>
        </div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
      {/* {body} */}      
      <div 
        className={`bg-white border border-gray-300 shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[calc(100vh-90px)]" : "max-h-0"
        }`}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        <div className="overflow-auto p-6" style={{ maxHeight: 'calc(100vh - 40px)' }}>
          <pre className="text-xs font-mono whitespace-pre-wrap break-words">
            {JSON.stringify(jsonData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default HideableJsonViewer;