import { useRef } from "react";
import HotTable from "@/components/hotTable";

function Home() {
  const hotRef = useRef(null);

  return (
    <HotTable
      ref={hotRef}
      data={[
        ["", "Kia", "Nissan", "Toyota", "Honda"],
        ["2008", 10, 11, 12, 13],
        ["2009", 20, 11, 14, 13],
        ["2010", 30, 15, 12, 13],
      ]}
      licenseKey="non-commercial-and-evaluation"
    />
  );
}

export default Home;
