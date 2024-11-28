import React, { useState } from "react";
import editIcon from "../../../../img/icon/edit.png";
import saveIcon from "../../../../img/icon/save.png";
import closeIcon from "../../../../img/icon/close.png";
import classes from "../orders.module.css";

const FoamWindowTable = ({ foamWindowData }) => {
  const [editingRow, setEditingRow] = useState(null); // Track the row being edited
  const [formData, setFormData] = useState({}); // Store data for the row being edited

  // Handle edit button click
  const handleEditClick = (index, item) => {
    setEditingRow(index);
    setFormData({ ...item });
  };

  // Handle cancel button click
  const handleCancelClick = () => {
    setEditingRow(null);
    setFormData({});
  };

  // Handle save button click
  const handleSaveClick = (index) => {
    foamWindowData[index] = formData; // Update the data directly (adjust logic as needed)
    setEditingRow(null);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className={classes.tableSection}>
      <h3 className={classes.tableCaption}>פרזול של חלון</h3>
      <table>
        <thead>
          <tr>
            <th>מקט</th>
            <th>כמות</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {foamWindowData.map((item, index) => (
            <tr key={`foamWindow-${index}`}>
              <td>{item.foamId}</td>
              <td>
                {editingRow === index ? (
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  item.quantity
                )}
              </td>
              <td>
                {editingRow === index ? (
                  <>
                    <img
                      src={saveIcon}
                      alt="Save"
                      className={classes.icon}
                      onClick={() => handleSaveClick(index)}
                    />
                    <img
                      src={closeIcon}
                      alt="Cancel"
                      className={classes.icon}
                      onClick={handleCancelClick}
                    />
                  </>
                ) : (
                  <img
                    src={editIcon}
                    alt="Edit"
                    className={classes.icon}
                    onClick={() => handleEditClick(index, item)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FoamWindowTable;
