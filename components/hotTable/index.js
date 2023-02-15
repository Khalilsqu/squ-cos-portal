import { useRef, useState, useEffect } from "react";
import { forwardRef } from "react";

const HotTable = (props, ref) => {
  const [loading, setLoading] = useState(true);
  const DynamicComponent = useRef(null);

  useEffect(() => {
    if (loading) {
      Promise.all([
        import("@handsontable/react"),
        import("handsontable"),
        import("handsontable/dist/handsontable.full.min.css"),
        // import language you need
      ]).then(([module]) => {
        DynamicComponent.current = module.HotTable;
        setLoading(false);
      });
    }
  }, [loading, setLoading]);

  if (loading || !DynamicComponent.current) return <div />;

  return <DynamicComponent.current {...props} ref={ref} />;
};

export default forwardRef(HotTable);
