import { useEffect, useState } from 'react';

// Counts from 0 up to `value` when it appears.
export default function CountUp({ value = 0, prefix = '', duration = 900 }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {shown.toLocaleString('en-IN')}
    </span>
  );
}
