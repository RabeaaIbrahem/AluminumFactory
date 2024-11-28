// Draws a sliding window with two glass panes and a profile line in the middle
export const drawSlidingWindow = (
  ctx,
  x,
  y,
  w,
  h,
  profileColor,
  glassColor
) => {
  // Draw the window frame (profile)
  ctx.fillStyle = profileColor;
  ctx.fillRect(x, y, w, h);

  // Draw the left and right glass panes
  ctx.fillStyle = glassColor;
  ctx.fillRect(x + 10, y + 10, w / 2 - 20, h - 20);
  ctx.fillRect(x + w / 2 + 10, y + 10, w / 2 - 20, h - 20);

  // Draw the vertical profile line in the middle
  ctx.strokeStyle = profileColor;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y + 10);
  ctx.lineTo(x + w / 2, y + h - 10);
  ctx.stroke();
};

// Draws a multi-pane window with a top and bottom row of panes and vertical dividers
export const drawMultiPaneWindow = (
  ctx,
  x,
  y,
  w,
  h,
  profileColor,
  glassColor
) => {
  // Set thickness for frames and dividers
  const frameThickness = 6; // Consistent frame thickness
  const middleDividerThickness = 12; // Slightly thicker middle divider

  // Calculate pane dimensions
  const paneHeight = (h - middleDividerThickness - 3 * frameThickness) / 2;
  const paneWidth = (w - 4 * frameThickness) / 3;

  // Draw the outer frame
  ctx.fillStyle = profileColor;
  ctx.fillRect(x, y, w, h);

  // Draw top row of glass panes
  ctx.fillStyle = glassColor;
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(
      x + frameThickness + i * (paneWidth + frameThickness),
      y + frameThickness,
      paneWidth,
      paneHeight
    );
  }

  // Draw bottom row of glass panes
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(
      x + frameThickness + i * (paneWidth + frameThickness),
      y + 2 * frameThickness + paneHeight + middleDividerThickness,
      paneWidth,
      paneHeight
    );
  }

  // Draw vertical dividers
  ctx.strokeStyle = profileColor;
  ctx.lineWidth = frameThickness;
  for (let i = 1; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(x + i * (paneWidth + frameThickness), y);
    ctx.lineTo(x + i * (paneWidth + frameThickness), y + h);
    ctx.stroke();
  }

  // Draw the horizontal middle divider
  ctx.fillStyle = profileColor;
  ctx.fillRect(
    x + frameThickness,
    y + frameThickness + paneHeight,
    w - 2 * frameThickness,
    middleDividerThickness
  );
};

// Draws a shuttered window with a main glass pane and shutters on the sides
export const drawShutteredWindow = (
  ctx,
  x,
  y,
  w,
  h,
  profileColor,
  glassColor
) => {
  // Draw the main window frame
  ctx.fillStyle = profileColor;
  ctx.fillRect(x, y, w, h);

  // Draw the glass pane
  ctx.fillStyle = glassColor;
  ctx.fillRect(x + 10, y + 10, w - 20, h - 20);

  // Draw the left and right shutters
  ctx.fillStyle = profileColor;
  ctx.fillRect(x - 30, y, 30, h);
  ctx.fillRect(x + w, y, 30, h);
};

// Draws a casement window with a single glass pane and a vertical profile line in the middle
export const drawCasementWindow = (
  ctx,
  x,
  y,
  w,
  h,
  profileColor,
  glassColor
) => {
  // Draw the window frame
  ctx.fillStyle = profileColor;
  ctx.fillRect(x, y, w, h);

  // Draw the glass pane
  ctx.fillStyle = glassColor;
  ctx.fillRect(x + 10, y + 10, w - 20, h - 20);

  // Draw the vertical profile line in the middle
  ctx.strokeStyle = profileColor;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y + 10);
  ctx.lineTo(x + w / 2, y + h - 10);
  ctx.stroke();
};

// Draws a picture window with a single glass pane
export const drawPictureWindow = (
  ctx,
  x,
  y,
  w,
  h,
  profileColor,
  glassColor
) => {
  // Draw the window frame
  ctx.fillStyle = profileColor;
  ctx.fillRect(x, y, w, h);

  // Draw the glass pane
  ctx.fillStyle = glassColor;
  ctx.fillRect(x + 10, y + 10, w - 20, h - 20);
};

// Helper function to darken a color by a certain percentage
const darkenColor = (color, percent) => {
  let num = parseInt(color.slice(1), 16), // Convert hex to decimal
    amt = Math.round(2.55 * percent * 100), // Calculate amount to darken
    R = (num >> 16) - amt, // Red component
    G = ((num >> 8) & 0x00ff) - amt, // Green component
    B = (num & 0x0000ff) - amt; // Blue component
  // Return darkened color in hex format
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
};
