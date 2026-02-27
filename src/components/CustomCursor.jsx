import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      if (dotRef.current && ringRef.current) {
        dotRef.current.style.left = mouseRef.current.x + 'px';
        dotRef.current.style.top = mouseRef.current.y + 'px';

        ringPosRef.current.x += (mouseRef.current.x - ringPosRef.current.x) * 0.12;
        ringPosRef.current.y += (mouseRef.current.y - ringPosRef.current.y) * 0.12;

        ringRef.current.style.left = ringPosRef.current.x + 'px';
        ringRef.current.style.top = ringPosRef.current.y + 'px';

        animationRef.current = requestAnimationFrame(animate);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="cursor" id="cursor">
      <div className="cursor-dot" id="cursorDot" ref={dotRef}></div>
      <div className="cursor-ring" id="cursorRing" ref={ringRef}></div>
    </div>
  );
};

export default CustomCursor;