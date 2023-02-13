import { Tooltip } from "antd";
import { useRef } from "react";

export default function CustomTooltip(props) {
  const { title, placement, children } = props;

  const switchRef = useRef();

  const handleVisibleChange = (visible) => {
    if (visible) {
      setTimeout(() => {
        switchRef.current.close();
      }, 1000);
    }
  };

  return (
    <Tooltip
      title={title}
      mouseLeaveDelay={0}
      placement={placement}
      ref={switchRef}
      onOpenChange={handleVisibleChange}
    >
      {children}
    </Tooltip>
  );
}
