import React from "react";
import NodeComputedParam from "./NodeComputedParam";
import { agentProfiles } from "../utils/gui/data";

const NodeComputedParams = ({ nodeData, nodeIndex, onFocus, onBlur }) => {
  const profile = agentProfiles[nodeData.data.guiAgentId ?? ""];
  const params = profile?.params ?? [];

  return (
    <div>
      {params.map((param, k) => (
        <NodeComputedParam
          key={k}
          param={param}
          nodeIndex={nodeIndex}
          appData={nodeData.data}
          onFocus={onFocus}
          onBlur={onBlur}
          updateValue={(index, name, value) =>
            console.log(`Update: ${index}, ${name}, ${value}`)
          }
        />
      ))}
    </div>
  );
};

export default NodeComputedParams;
