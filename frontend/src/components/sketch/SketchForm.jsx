import React from "react";

const SketchForm = ({
  type,
  setType,
  width,
  setWidth,
  length,
  setLength,
  profileColor,
  setProfileColor,
  glassColor,
  setGlassColor,
  windowType,
  setWindowType,
  widthError,
  setWidthError,
  lengthError,
  setLengthError,
  validateAndSetDimension,
}) => {
  return (
    <div>
      {/* Input for selecting the type of sketch (window) */}
      <div className="input-group">
        <label>סוג:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="חלון">חלון</option>
        </select>
      </div>

      {/* Input for width, with validation */}
      <div className="input-group">
        <label>רוחב:</label>
        <input
          type="number"
          value={width}
          onChange={(e) =>
            validateAndSetDimension(
              setWidth,
              parseInt(e.target.value),
              setWidthError
            )
          }
          placeholder="הזן רוחב (100-350)"
        />
        {widthError && <p className="error-message">{widthError}</p>}
      </div>

      {/* Conditional input for length if type is window */}
      {type === "חלון" && (
        <div className="input-group">
          <label>אורך:</label>
          <input
            type="number"
            value={length}
            onChange={(e) =>
              validateAndSetDimension(
                setLength,
                parseInt(e.target.value),
                setLengthError
              )
            }
            placeholder="הזן אורך (100-350)"
          />
          {lengthError && <p className="error-message">{lengthError}</p>}
        </div>
      )}

      {/* Input for selecting profile color */}
      <div className="input-group">
        <label>צבע פרופיל:</label>
        <input
          type="color"
          value={profileColor}
          onChange={(e) => setProfileColor(e.target.value)}
        />
      </div>

      {/* Input for selecting glass color */}
      <div className="input-group">
        <label>צבע זכוכית:</label>
        <input
          type="color"
          value={glassColor}
          onChange={(e) => setGlassColor(e.target.value)}
        />
      </div>

      {/* Conditional input for selecting window type if type is window */}
      {type === "חלון" && (
        <div className="input-group">
          <label>סוג חלון:</label>
          <select
            value={windowType}
            onChange={(e) => setWindowType(e.target.value)}
          >
            <option value="חלון הזזה">חלון הזזה</option>
            <option value="חלון עם תריסים">חלון עם תריסים</option>
            <option value="חלון ציר">חלון ציר</option>
            <option value="חלון רב חלונות">חלון רב חלונות</option>
            <option value="חלון מראה">חלון מראה</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default SketchForm;
