import { useState, useEffect, useRef } from "react";

const options = [
  { value: "text", name: "Text" },
  { value: "number", name: "Number" },
  { value: "data", name: "Data(JSON format array or object)" },
  { value: "boolean", name: "Boolean" },
];

const NodeStaticValue = ({ nodeData, onFocus, onBlur, onUpdateValue }) => {
  const textareaRef = useRef(null);
  const inputRef = useRef(null);
  const selectFormRef = useRef(null);

  const [dataType, setDataType] = useState(
    nodeData.data.staticNodeType ?? "text",
  );
  const [numberValue, setNumberValue] = useState(
    nodeData.data.staticNodeType ?? "",
  );
  const [booleanValue, setBooleanValue] = useState("true");
  const [textAreaValue, setTextAreaValue] = useState(
    nodeData.data.staticNodeType === "data"
      ? JSON.stringify(nodeData.data.value, null, 2)
      : (nodeData.data.value ?? ""),
  );
  const [rows, setRows] = useState(3);

  const isValidData = () => {
    if (dataType === "data") {
      try {
        JSON.parse(textAreaValue);
        return true;
      } catch {
        return false;
      }
    }
    return true;
  };

  const handleFocus = (event) => {
    if (event.target instanceof HTMLTextAreaElement) {
      onFocus && onFocus();
      setRows(10);
    }
  };

  const handleBlur = (event) => {
    if (event.target instanceof HTMLTextAreaElement) {
      setRows(3);
      onBlur && onBlur();
      const value =
        dataType === "data" && isValidData()
          ? JSON.parse(textAreaValue)
          : textAreaValue;
      onUpdateValue && onUpdateValue({ value, staticNodeType: "text" });
    }
  };

  const handleNumberBlur = () => {
    if (dataType === "number") {
      onUpdateValue &&
        onUpdateValue({ value: Number(numberValue), staticNodeType: dataType });
    }
  };

  const handleBooleanChange = () => {
    onUpdateValue &&
      onUpdateValue({
        value: booleanValue === "true",
        staticNodeType: dataType,
      });
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.addEventListener("focus", handleFocus);
      textareaRef.current.addEventListener("blur", handleBlur);
    }
    if (inputRef.current) {
      inputRef.current.addEventListener("blur", handleNumberBlur);
    }
    return () => {
      if (textareaRef.current) {
        textareaRef.current.removeEventListener("focus", handleFocus);
        textareaRef.current.removeEventListener("blur", handleBlur);
      }
      if (inputRef.current) {
        inputRef.current.removeEventListener("blur", handleNumberBlur);
      }
    };
  }, [textAreaValue, numberValue]);

  return (
    <div>
      <label className="text-xs text-gray-300">Value</label>
      <select
        value={dataType}
        onChange={(e) => setDataType(e.target.value)}
        className="w-full resize-none rounded-md border border-gray-300 p-1 text-black"
      >
        {options.map((option, k) => (
          <option key={k} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
      {["text", "data"].includes(dataType) && (
        <div>
          <textarea
            placeholder="Enter the text"
            className="w-full resize-none rounded-md border border-gray-300 p-1 text-black"
            value={textAreaValue}
            onChange={(e) => setTextAreaValue(e.target.value)}
            ref={textareaRef}
            rows={rows}
          />
          {dataType === "data" && (
            <div>{isValidData() ? "valid" : "invalid"}</div>
          )}
        </div>
      )}
      {dataType === "number" && (
        <input
          type="number"
          className="w-full resize-none rounded-md border border-gray-300 p-1 text-black"
          value={numberValue}
          onChange={(e) => setNumberValue(e.target.value)}
          ref={inputRef}
        />
      )}
      {dataType === "boolean" && (
        <select
          value={booleanValue}
          onChange={(e) => setBooleanValue(e.target.value)}
          ref={selectFormRef}
          onBlur={handleBooleanChange}
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      )}
    </div>
  );
};

export default NodeStaticValue;
