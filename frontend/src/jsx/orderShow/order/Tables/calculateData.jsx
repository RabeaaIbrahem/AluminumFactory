import React, { useState } from "react";
import editIcon from "../../../../img/icon/edit.png";
import saveIcon from "../../../../img/icon/save.png";
import closeIcon from "../../../../img/icon/close.png";
import classes from "../orders.module.css";

const CalculateDataTable = ({ calculateData }) => {
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
    // You can replace this with proper data update logic, like calling an API or updating a parent state
    calculateData[index] = formData;
    setEditingRow(null);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className={classes.tableSection}>
      <h3 className={classes.tableCaption}>נתוני חישוב</h3>
      <table>
        <thead>
          <tr>
            <th>מקט</th>
            <th>כמות פרופילים נצרכת ביחידות</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {calculateData.map((item, index) => (
            <tr key={`calculate-${index}`}>
              <td>
                {editingRow === index ? (
                  <input
                    type="text"
                    name="ProfileId"
                    value={formData.ProfileId || ""}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  item.ProfileId
                )}
              </td>
              <td>
                {editingRow === index ? (
                  <input
                    type="number"
                    name="RequiredProfiles"
                    value={formData.RequiredProfiles || ""}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  item.RequiredProfiles
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

export default CalculateDataTable;
