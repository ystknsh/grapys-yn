import React, { useRef, useState, useEffect, useCallback } from "react";
import type { GUINodeData, GUINearestData, NewEdgeEventDirection, UpdateStaticValue } from "../utils/gui/type";
import { getClientPos } from "../utils/gui/utils";
import { nodeMainClass, nodeHeaderClass, nodeOutputClass, nodeInputClass } from "../utils/gui/classUtils";

import { agentProfiles, staticNodeParams } from "../utils/gui/data";
// import { useLocalStore } from "../store/index";

import NodeStaticValue from "./NodeStaticValue";
import NodeComputedParams from "./NodeComputedParams";
interface NodeProps {
  nodeData: GUINodeData;
  nearestData?: GUINearestData;
  nodeIndex: number;
  onUpdatePosition: (position: any) => void;
  onSavePosition: () => void;
  onNewEdgeStart: (event: any) => void;
  onNewEdge: (event: any) => void;
  onNewEdgeEnd: (event: any) => void;
  onOpenNodeMenu: (event: any) => void;
}

const Node: React.FC<NodeProps> = ({
  nodeData,
  nearestData,
  nodeIndex,
  onUpdatePosition,
  onSavePosition,
  onNewEdgeStart,
  onNewEdge,
  onNewEdgeEnd,
  onOpenNodeMenu,
}) => {
  const agentParams = nodeData.type === "computed" ? agentProfiles[nodeData.data.guiAgentId ?? ""] : staticNodeParams;

  const thisRef = useRef<HTMLDivElement>(null);
  const inputsRef = useRef<HTMLDivElement[]>([]);
  const outputsRef = useRef<HTMLDivElement[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isNewEdge, setIsNewEdge] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const startPosition = useRef({ x: 0, y: 0 });
  const distanceMoved = useRef(0);

  // const updateNodePosition = useLocalStore((state) => state.updateNodePosition);

  const transformStyle = {
    transform: `translate(${nodeData?.position?.x ?? 0}px, ${nodeData?.position?.y ?? 0}px)`,
    cursor: isDragging ? "grabbing" : "grab",
  };

  const getWH = () => {
    if (!thisRef.current) {
      return { width: 0, height: 0, outputCenters: [], inputCenters: [] };
    }
    const rect = thisRef.current.getBoundingClientRect();
    const parentTop = rect.top;

    const getCenterHeight = (el: HTMLElement) => {
      const oRect = el.getBoundingClientRect();
      return oRect.top - parentTop + oRect.height / 2;
    };

    return {
      width: rect.width,
      height: rect.height,
      outputCenters: outputsRef.current.map(getCenterHeight),
      inputCenters: inputsRef.current.map(getCenterHeight),
    };
  };
  useEffect(() => {
    onUpdatePosition(getWH());
  }, []);

  const onStartNode = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (isNewEdge) return;
      setIsDragging(true);
      const { clientX, clientY } = getClientPos(event.nativeEvent);
      setOffset({
        x: clientX - nodeData.position.x,
        y: clientY - nodeData.position.y,
      });
      startPosition.current = {
        x: nodeData.position.x,
        y: nodeData.position.y,
      };
      distanceMoved.current = 0;
    },
    [nodeData.position, isNewEdge],
  );

  const onMoveNode = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const { clientX, clientY } = getClientPos(event);
      const x = clientX - offset.x;
      const y = clientY - offset.y;
      onUpdatePosition({ ...getWH(), x, y });
      distanceMoved.current = (startPosition.current.x - x) ** 2 + (startPosition.current.y - y) ** 2;
    },
    [isDragging, offset, onUpdatePosition],
  );

  const onEndNode = useCallback(() => {
    setIsDragging(false);
    if (distanceMoved.current > 4) {
      onSavePosition();
    }
  }, [onSavePosition]);

  const edgeIO = agentParams;

  const onStartEdge = useCallback(
    (event: React.MouseEvent<Element> | React.TouchEvent<Element>, direction: string, index: number) => {
      event.stopPropagation();
      setIsNewEdge(true);
      const { clientX, clientY } = getClientPos(event.nativeEvent);
      onNewEdgeStart({
        nodeId: nodeData.nodeId,
        x: clientX,
        y: clientY,
        index,
        direction,
      });
    },
    [onNewEdgeStart, nodeData.nodeId],
  );

  const onMoveEdge = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!isNewEdge) return;
      const { clientX, clientY } = getClientPos(event);
      onNewEdge({ x: clientX, y: clientY });
    },
    [isNewEdge, onNewEdge],
  );

  const onEndEdge = useCallback(() => {
    setIsNewEdge(false);
    onNewEdgeEnd({});
  }, [onNewEdgeEnd]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onMoveNode);
      window.addEventListener("mouseup", onEndNode);
      window.addEventListener("touchmove", onMoveNode, { passive: false });
      window.addEventListener("touchend", onEndNode);
      return () => {
        window.removeEventListener("mousemove", onMoveNode);
        window.removeEventListener("mouseup", onEndNode);
        window.removeEventListener("touchmove", onMoveNode);
        window.removeEventListener("touchend", onEndNode);
      };
    }
  }, [isDragging, onMoveNode, onEndNode]);

  useEffect(() => {
    if (isNewEdge) {
      window.addEventListener("mousemove", onMoveEdge);
      window.addEventListener("mouseup", onEndEdge);
      window.addEventListener("touchmove", onMoveEdge, { passive: false });
      window.addEventListener("touchend", onEndEdge);
      return () => {
        window.removeEventListener("mousemove", onMoveEdge);
        window.removeEventListener("mouseup", onEndEdge);
        window.removeEventListener("touchmove", onMoveEdge);
        window.removeEventListener("touchend", onEndEdge);
      };
    }
  }, [isNewEdge, onMoveEdge, onEndEdge]);

  const expectNearNode = nodeData.nodeId === nearestData?.nodeId;
  const isExpectNearButton = (direction: NewEdgeEventDirection, index: number) => {
    if (!expectNearNode) {
      return false;
    }
    return nearestData?.direction === direction && nearestData?.index === index;
  };

  const [currentWidth, setCurrentWidth] = useState(0);
  const [currentHeight, setCurrentHeight] = useState(0);
  const onFocus = () => {
    if (thisRef.current) {
      setCurrentWidth(thisRef.current.offsetWidth);
      setCurrentHeight(thisRef.current.offsetHeight);
      thisRef.current.style.width = thisRef.current.offsetWidth * 3 + "px";
      thisRef.current.style.height = thisRef.current.offsetHeight * 3 + "px";
    }
    onUpdatePosition(getWH());
  };
  const onBlur = () => {
    if (thisRef.current) {
      thisRef.current.style.width = currentWidth + "px";
      thisRef.current.style.height = currentHeight + "px";
    }
    onUpdatePosition(getWH());
  };
  const onUpdateValue = (value: UpdateStaticValue) => {
    console.log(value);
    // TODO
  };
  //const openNodeMenu = (event: MouseEvent) => {
  // TODO
  // ctx.emit("openNodeMenu", event);
  // };

  return (
    <div
      className={`absolute flex w-36 cursor-grab flex-col rounded-md text-center text-white select-none ${nodeMainClass(expectNearNode, nodeData)}`}
      style={transformStyle}
      ref={thisRef}
      onMouseDown={onStartNode}
      onTouchStart={onStartNode}
    >
      <div onDoubleClick={onOpenNodeMenu}>
        <div className={`w-full rounded-t-md py-1 text-center leading-none ${nodeHeaderClass(expectNearNode, nodeData)}`}>{nodeData.nodeId}</div>
        {nodeData.type === "computed" && (
          <div className={`w-full py-1 text-center text-xs leading-none ${nodeHeaderClass(expectNearNode, nodeData)}`}>
            {nodeData.data.guiAgentId?.replace(/Agent$/, "")}
          </div>
        )}
      </div>

      <div className="mt-1 flex flex-col items-end">
        {(edgeIO.outputs ?? []).map((output: any, index: number) => (
          <div
            key={`out-${output.name}-${index}`}
            className="relative flex items-center"
            ref={(el) => {
              outputsRef.current[index] = el!;
            }}
          >
            <span className="mr-2 text-xs whitespace-nowrap">{output.name}</span>
            <div
              className={`absolute right-[-10px] h-4 w-4 min-w-[12px] rounded-full ${nodeOutputClass(isExpectNearButton("inbound", index), nodeData)}`}
              onMouseDown={(e) => onStartEdge(e, "outbound", index)}
            ></div>
          </div>
        ))}
      </div>

      <div className="mt-1 mb-1 flex flex-col items-start">
        {(edgeIO.inputs ?? []).map((input: any, index: number) => (
          <div
            key={`in-${input.name}-${index}`}
            className="relative flex items-center"
            ref={(el) => {
              inputsRef.current[index] = el!;
            }}
          >
            <div
              className={`absolute left-[-10px] h-4 w-4 min-w-[12px] rounded-full ${nodeInputClass(isExpectNearButton("outbound", index), nodeData)}`}
              onMouseDown={(e) => onStartEdge(e, "inbound", index)}
            ></div>
            <span className="ml-2 text-xs whitespace-nowrap">{input.name}</span>
          </div>
        ))}
      </div>

      {nodeData.type === "static" && (
        <div className="flex w-full flex-col gap-1 p-2">
          <NodeStaticValue nodeData={nodeData} onFocus={onFocus} onBlur={onBlur} onUpdateValue={onUpdateValue} />
        </div>
      )}
      {nodeData.type === "computed" && (
        <div className="flex w-full flex-col gap-1 p-2">
          <NodeComputedParams nodeData={nodeData} nodeIndex={nodeIndex} onFocus={onFocus} onBlur={onBlur} />
        </div>
      )}
    </div>
  );
};

export default Node;
