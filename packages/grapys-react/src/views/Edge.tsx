import React, { useState, useMemo } from "react";

interface PositionData {
  x: number;
  y: number;
  width?: number;
  outputCenters?: number[];
  inputCenters?: number[];
}

interface EdgeData {
  index?: number;
  data: {
    position: PositionData;
  };
}

interface EdgeProps {
  sourceData: EdgeData;
  targetData: EdgeData;
  isConnectable?: boolean;
}

const colors = {
  edge: "red",
  hover: "blue",
  notConnectable: "pink",
};

const Edge: React.FC<EdgeProps> = ({ sourceData, targetData, isConnectable = true }) => {
  const [isHover, setIsHover] = useState(false);

  const edgePath = useMemo(() => {
    console.log( sourceData, targetData)
    const { x, y: y1, width, outputCenters } = sourceData?.data?.position ?? {};
    const x1 = x + (width ?? 0);
    const { index } = sourceData;
    const { x: x2, y: y2, inputCenters } = targetData?.data?.position ?? {};
    const { index: index2 } = targetData;
    
    const y1Offset = index !== undefined && outputCenters && outputCenters.length >= index ? outputCenters[index] : 0;
    const y2Offset = index2 !== undefined && inputCenters && inputCenters.length >= index2 ? inputCenters[index2] : 0;

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
  }, [sourceData, targetData]);

  return (
    <path
      d={edgePath}
      stroke={isConnectable ? (isHover ? colors.hover : colors.edge) : colors.notConnectable}
      fill="none"
      strokeWidth={isHover ? 4 : 2}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    />
  );
};

export default Edge;
