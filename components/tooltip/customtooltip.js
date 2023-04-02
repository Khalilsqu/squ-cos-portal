import { Tooltip } from "antd";
import { useState } from "react";

import { useWindowSize } from "../utils/windowSize";

export default function CustomTooltip(props) {
  const { title, placement, children } = props;
  const { width } = useWindowSize();

  const [visible, setVisible] = useState(false);

  const timer = setTimeout;

  const handleShowTooltip = () => {
    setVisible(true);

    timer(() => {
      setVisible(false);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  };

  const handleHideTooltip = () => {
    setVisible(false);

    return () => {
      clearTimeout(timer);
    };
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
        open={visible}
        onMouseEnter={handleShowTooltip}
        onMouseLeave={handleHideTooltip}
      >
        {children}
      </Tooltip>
    </>
  );
}
