import React, { useState, useMemo } from "react";
import { EdgeData2 } from "../utils/gui/type";

interface EdgeProps {
  sourceData: EdgeData2;
  targetData: EdgeData2;
  isConnectable?: boolean;
  index: number;
  openEdgeMenu: (event: MouseEvent, edgeIndex: number) => void;
}

const colors = {
  edge: "red",
  hover: "blue",
  notConnectable: "pink",
};

const convEdgePath = (soureIndex: number, sourcePosition: NodePositionData, targetIndex: number, targetPosition: NodePositionData) => {
  const { x, y: y1, width, outputCenters } = sourcePosition;
  const x1 = x + (width ?? 0);
  const { x: x2, y: y2, inputCenters } = targetPosition;

  const y1Offset = soureIndex !== undefined && outputCenters && outputCenters.length >= soureIndex ? outputCenters[soureIndex] : 0;
  const y2Offset = targetIndex !== undefined && inputCenters && inputCenters.length >= targetIndex ? inputCenters[targetIndex] : 0;

  const y1dash = y1 + y1Offset;
  const y2dash = y2 + y2Offset;

  const ydashDiff = Math.abs(y1dash - y2dash);
  const controlYOffset = (ydashDiff > 40 ? 40 : ydashDiff) * (y1dash > y2dash ? 1 : -1);

  const xDiff = x2 - x1;
  const maxOffset = 120;
  const minOffset = 40;
  const offsetThreshold = maxOffset - minOffset;
  const controlXOffset = xDiff > 0 ? minOffset + (xDiff > offsetThreshold ? 0 : offsetThreshold - xDiff) : maxOffset;

  return `M ${x1} ${y1dash} C ${x1 + controlXOffset} ${y1dash - controlYOffset}, ${x2 - controlXOffset} ${y2dash + controlYOffset}, ${x2} ${y2dash}`;
};

const Edge: React.FC<EdgeProps> = ({ sourceData, targetData, isConnectable = true, index, openEdgeMenu }) => {
  const [isHover, setIsHover] = useState(false);

  const edgePath = useMemo(() => {
    return convEdgePath(sourceData.index, sourceData?.data?.position ?? {}, targetData.index, targetData?.data?.position ?? {});
  }, [sourceData, targetData]);

  return (
    <path
      d={edgePath}
      stroke={isConnectable ? (isHover ? colors.hover : colors.edge) : colors.notConnectable}
      fill="none"
      strokeWidth={isHover ? 4 : 2}
      onDoubleClick={(e) => openEdgeMenu(e, index)}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    />
  );
};

export default Edge;
