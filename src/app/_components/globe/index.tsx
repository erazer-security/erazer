import React from "react";
import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export default function Globe() {
  const canvasRef = useRef<any>();
  useEffect(() => {
    let phi = 0;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [
        0.49411764705882355, 0.18823529411764706, 0.8823529411764706,
      ],
      glowColor: [1, 1, 1],
      markers: [
        // longitude latitude
        { location: [37.7595, -122.4367], size: 0.05 },
        { location: [40.7128, -74.006], size: 0.1 },
        { location: [51.5074, -0.1278], size: 0.07 },
        { location: [35.6895, 139.6917], size: 0.03 },
        { location: [55.7558, 37.6176], size: 0.1 },
        { location: [19.076, 72.8777], size: 0.05 },
        { location: [9.082, 8.6753], size: 0.02 },
        { location: [15.3229, 38.9251], size: 0.05 },
        { location: [-1.2921, 36.8219], size: 0.03 },
        { location: [-23.5505, -46.6333], size: 0.05 },
        { location: [-34.6037, -58.3816], size: 0.03 },
        { location: [-12.0464, -77.0428], size: 0.07 },
      ],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="w-[600px] h-[600px] max-w-full aspect-square"
      />
    </>
  );
}
