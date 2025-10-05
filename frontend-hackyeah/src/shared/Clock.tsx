import React, { useEffect, useState } from "react";


export default function Clock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString("fa-IR"));

  useEffect(() => {
    const time = () => {
      const event = new Date();
      setTime(event.toLocaleTimeString());
    };
    const intervalId = setInterval(time, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <div className="absolute left-4 top-4 text-xl">
      <h1>{time}</h1>
    </div>
  );
}
