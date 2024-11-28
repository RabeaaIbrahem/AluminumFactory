import React, { useRef, useEffect } from "react";
import {
  drawSlidingWindow,
  drawCasementWindow,
  drawPictureWindow,
  drawShutteredWindow,
  drawMultiPaneWindow,
} from "./draw3DEffects";

const SketchDisplay = ({
  type,
  width,
  length,
  profileColor = "gray",
  glassColor = "white",
  windowType = "חלון הזזה", // Default to sliding window
  profileWidth = 6, // Default profile width
  middleWidth = 5 // Default middle width
}) => {
  const canvasRef = useRef(null); // Reference to the canvas element

  useEffect(() => {
    const canvas = canvasRef.current; // Get the current canvas element
    const ctx = canvas.getContext("2d"); // Get the 2D drawing context

    // Define a scaling factor
    const scalingFactor = 0.4; // Adjust this factor to control the size of the drawing

    // Function to draw the sketch based on the type and properties
    const drawSketch = () => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Calculate the scaled width and height for drawing
      const drawWidth = Math.min(canvasWidth * scalingFactor, (parseInt(width) || 100) * scalingFactor);
      const drawHeight = Math.min(canvasHeight * scalingFactor, (parseInt(length) || 100) * scalingFactor);

      // Ensure the drawing fits within the canvas with some padding
      const padding = 20; // Padding around the drawing
      const maxDrawWidth = canvasWidth - 2 * padding;
      const maxDrawHeight = canvasHeight - 2 * padding;

      // Clamp drawWidth and drawHeight to fit within the padded canvas area
      const clampedDrawWidth = Math.min(drawWidth, maxDrawWidth);
      const clampedDrawHeight = Math.min(drawHeight, maxDrawHeight);

      // Calculate offsets to center the drawing within the padded canvas area
      const baseX = (canvasWidth - clampedDrawWidth) / 2;
      const baseY = (canvasHeight - clampedDrawHeight) / 2;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Clear the canvas before drawing

      if (type === "חלון") { // Check if the type is "window"
        if (windowType === "חלון הזזה") {
          drawSlidingWindow(ctx, baseX, baseY, clampedDrawWidth, clampedDrawHeight, profileColor, glassColor, { profileWidth, middleWidth });
        } else if (windowType === "חלון רב חלונות") {
          drawMultiPaneWindow(ctx, baseX, baseY, clampedDrawWidth, clampedDrawHeight, profileColor, glassColor, { profileWidth, middleWidth });
        } else if (windowType === "חלון ציר") {
          drawCasementWindow(ctx, baseX, baseY, clampedDrawWidth, clampedDrawHeight, profileColor, glassColor, { profileWidth, middleWidth });
        } else if (windowType === "חלון עם תריסים") {
          drawShutteredWindow(ctx, baseX, baseY, clampedDrawWidth, clampedDrawHeight, profileColor, glassColor, { profileWidth, middleWidth });
        } else if (windowType === "חלון תמונה") {
          drawPictureWindow(ctx, baseX, baseY, clampedDrawWidth, clampedDrawHeight, profileColor, glassColor, { profileWidth });
        }
      }
    };

    drawSketch(); // Call the function to draw the sketch on the canvas
  }, [type, width, length, profileColor, glassColor, windowType, profileWidth, middleWidth]); // Dependency array

  return (
    <div className="sketch-display-container">
      <canvas
        ref={canvasRef} // Reference to the canvas element
        width={parseInt(width)} // Default width if not valid
        height={parseInt(length)} // Default height if not valid
      />
    </div>
  );
};

export default SketchDisplay;
