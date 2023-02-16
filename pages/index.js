import { useRef } from "react";
import HotTable from "@/lib/hotTable";
import { Button } from "antd";

function Home(props) {
  const hotRef = useRef(null);

  const handleClick = () => {
    const hotInstance = hotRef.current.hotInstance;
    hotInstance.selectCell(1, 1);
  };
  return (
    <div
      style={{
        zIndex: 1,
      }}
    >
      <HotTable
        ref={hotRef}
        data={[
          ["", "Kia", "Nissan", "Toyota", "Honda"],
          ["2008", 10, 11, 12, 13],
          ["2009", 20, 11, 14, 13],
          ["2010", 30, 15, 12, 13],
        ]}
        licenseKey="non-commercial-and-evaluation"
        rowHeaders={true}
        colHeaders={true}
        width="800px"
        height="auto"
        filters={true}
        dropdownMenu={true}
        manualColumnResize={true}
        manualRowResize={true}
        manualColumnMove={true}
        manualRowMove={true}
        contextMenu={true}
        columnSorting={true}
      />
      <Button onClick={handleClick}>click me</Button>
    </div>
  );
}

export default Home;
