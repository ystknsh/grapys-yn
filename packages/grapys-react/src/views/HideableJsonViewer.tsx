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
      className="absolute bottom-0 right-0 z-30 flex flex-col"
      style={{ width }}
    >
      <div 
        className={`bg-gray-700 text-white p-2 rounded-t-lg flex justify-between items-center cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-sm font-bold">JSON データ</h3>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
      
      <div 
        className={`bg-white bg-opacity-95 border border-gray-300 shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[400px]" : "max-h-0"
        }`}
      >
        <div className="overflow-auto p-4" style={{ maxHeight: '400px' }}>
          <pre className="text-xs font-mono whitespace-pre-wrap break-words">
            {JSON.stringify(jsonData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default HideableJsonViewer;