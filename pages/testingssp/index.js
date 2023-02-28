import { Typography, Spin } from "antd";

import { useState, useEffect } from "react";
export default function Testing() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/hello");
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        const json = await res.json();
        setData(json.name);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);
  return (
    <div>
      <Typography.Title>Testing</Typography.Title>
      {loading && <Spin />}
      {error && <div>{error}</div>}
      {data && (
        <div>
          <Typography>{data}</Typography>
        </div>
      )}
    </div>
  );
}
