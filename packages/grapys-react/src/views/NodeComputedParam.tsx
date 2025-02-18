import React, { useState, useEffect, useRef } from "react";

const NodeComputedParam = ({
  param,
  appData,
  nodeIndex,
  onFocus,
  onBlur,
  updateValue,
}) => {
  const [inputValue, setInputValue] = useState(
    appData.params?.[param.name] ?? "",
  ); // 初期値を空文字に
  const [booleanValue, setBooleanValue] = useState(
    appData.params?.[param.name] === true ? "true" : "false",
  );
  const [textAreaValue, setTextAreaValue] = useState(
    String(appData.params?.[param.name] ?? ""),
  );
  const [rows, setRows] = useState(3);

  const inputRef = useRef(null);
  const textareaRef = useRef(null);
  const selectRef = useRef(null);

  useEffect(() => {
    const updateValue = appData.params?.[param.name];

    if (updateValue === undefined || updateValue === null) return; // undefined/null の場合は更新しない

    switch (param.type) {
      case "text":
      case "data":
        setTextAreaValue(
          typeof updateValue === "object"
            ? JSON.stringify(updateValue, null, 2)
            : updateValue,
        );
        break;
      case "string":
      case "int":
      case "float":
        setInputValue(String(updateValue ?? "")); // 空文字をデフォルト値に
        break;
      case "boolean":
        setBooleanValue(updateValue ? "true" : "false");
        break;
      default:
        break;
    }
  }, [appData]);

  const handleFocus = () => {
    setRows(10);
    onFocus();
  };

  const handleBlur = () => {
    setRows(3);
    onBlur();
    updateValue(nodeIndex, param.name, textAreaValue);
  };

  // TODO much more features from vuew

  return (
    <div>
      <label className="text-xs text-gray-300">{param.name}</label>
      {param.type === "string" && (
        <input
          ref={inputRef}
          type="text"
          className="w-full rounded-md border border-gray-300 p-1 text-black"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => updateValue(nodeIndex, param.name, inputValue)}
        />
      )}
      {(param.type === "text" || param.type === "data") && (
        <textarea
          ref={textareaRef}
          rows={rows}
          className="w-full resize-none rounded-md border border-gray-300 p-1 text-black"
          value={textAreaValue}
          onChange={(e) => setTextAreaValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        ></textarea>
      )}
      {(param.type === "int" || param.type === "float") && (
        <input
          ref={inputRef}
          type="number"
          className="w-full rounded-md border border-gray-300 p-1 text-black"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => updateValue(nodeIndex, param.name, Number(inputValue))}
        />
      )}
      {param.type === "boolean" && (
        <select
          ref={selectRef}
          className="rounded-md border border-gray-300"
          value={booleanValue}
          onChange={(e) => {
            setBooleanValue(e.target.value);
            updateValue(nodeIndex, param.name, e.target.value === "true");
          }}
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      )}
    </div>
  );
};

export default NodeComputedParam;
