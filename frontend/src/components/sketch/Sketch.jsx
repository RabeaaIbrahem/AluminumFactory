import React, { useState, useEffect } from "react";
import "./sketch.css";
import SketchForm from "./SketchForm";
import SketchDisplay from "./SketchDisplay";
import { validateAndSetDimension } from "../../js/validations/SketchValidation";

const Sketch = () => {
  const [type, setType] = useState("חלון"); // Default to window
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [height, setHeight] = useState("");
  const [profileColor, setProfileColor] = useState("#654321"); // Default brown for profile
  const [glassColor, setGlassColor] = useState("#ADD8E6"); // Default light blue for glass
  const [windowType, setWindowType] = useState("חלון הזזה"); // Sliding Window
  const [widthError, setWidthError] = useState("");
  const [lengthError, setLengthError] = useState("");
  const [heightError, setHeightError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showSketch, setShowSketch] = useState(false); // State to control sketch display

  useEffect(() => {
    const widthValid = !widthError && width !== "";
    const lengthValid = !lengthError && length !== "";

    if (type === "חלון" && widthValid && lengthValid) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [width, length, height, widthError, lengthError, heightError, type]);

  const handleCreateSketch = () => {
    setShowSketch(true); // Set the state to show the sketch
  };

  return (
    <div className="sketch-container">
      <h2>סקיצת {type}</h2>
      <SketchForm
        type={type}
        setType={setType}
        width={width}
        setWidth={setWidth}
        length={length}
        setLength={setLength}
        height={height}
        setHeight={setHeight}
        profileColor={profileColor}
        setProfileColor={setProfileColor}
        glassColor={glassColor}
        setGlassColor={setGlassColor}
        windowType={windowType}
        setWindowType={setWindowType}
        widthError={widthError}
        setWidthError={setWidthError}
        lengthError={lengthError}
        setLengthError={setLengthError}
        heightError={heightError} // Corrected from lengthError
        setHeightError={setHeightError}
        validateAndSetDimension={validateAndSetDimension}
      />
      <button
        onClick={handleCreateSketch}
        disabled={isButtonDisabled}
        className="create-sketch-button"
      >
        צור סקיצה
      </button>
      {showSketch && (
        <SketchDisplay
          type={type}
          width={width}
          length={length}
          profileColor={profileColor}
          glassColor={glassColor}
          windowType={windowType}
        />
      )}
    </div>
  );
};

export default Sketch;
