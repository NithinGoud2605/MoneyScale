import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

const InfoTooltip = ({ content, children }) => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        {children}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className="bg-black text-white text-xs rounded py-1 px-2 shadow-md"
          side="top"
          align="center"
        >
          {content}
          <Tooltip.Arrow className="fill-black" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
};

export default InfoTooltip;
