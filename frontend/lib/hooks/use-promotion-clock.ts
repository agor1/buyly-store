"use client";

import { useEffect, useState } from "react";

export const usePromotionClock = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTick((tick) => tick + 1);
    }, 30_000);

    return () => window.clearInterval(intervalId);
  }, []);
};
