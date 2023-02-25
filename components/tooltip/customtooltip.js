import { Tooltip } from "antd";
import { useRef } from "react";

import { useWindowSize } from "../utils/windowSize";

export default function CustomTooltip(props) {
  const { title, placement, children } = props;
  const { width } = useWindowSize();

  const switchRef = useRef();

  const handleVisibleChange = (visible) => {
    if (visible) {
      setTimeout(() => {
        if (switchRef.current !== null) {
          switchRef.current.close();
        }
      }, 2000);
    }
  };

  if (width < 768) {
    return <>{children}</>;
  }

  return (
    <>
      <Tooltip
        title={title}
        mouseLeaveDelay={0}
        placement={placement}
        ref={switchRef}
        onOpenChange={handleVisibleChange}
      >
        {children}
      </Tooltip>
    </>
  );
}
