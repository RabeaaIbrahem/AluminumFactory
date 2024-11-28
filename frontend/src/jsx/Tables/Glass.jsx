import React, { useEffect, useState } from "react"; // Import necessary React hooks and other dependencies.
import axios from "axios"; // Import Axios for making HTTP requests.
import SearchBar from "../searchBar/SearchVal.jsx"; // Import custom SearchBar component.
import editIcon from "../../img/icon/edit.png"; // Import icons for edit, save, close, and add actions
import saveIcon from "../../img/icon/save.png";
import closeIcon from "../../img/icon/close.png";
import addIcon from "../../img/icon/add.png";
import classes from "../../css/table.module.css"; // Import CSS module for styling the table.
import GlassValidation from "../../js/validations/GlassValidation"; // Import custom validation logic for foam data.

const Glass = () => {
  // Define component state variables.
  const [glass, setGlass] = useState([]);
  const [search, setSearch] = useState(""); // State for search input value.
  const [errors, setErrors] = useState({}); // State to track form validation errors.
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    // State to hold form data for creating or editing a g=glass.
    glassType: "",
    Thickness: "",
    status: 1,
  });
  const [currentPage, setCurrentPage] = useState(1); // State to track the current page for pagination.
  const [displayActiveOnly, setDisplayActiveOnly] = useState(1); // State to filter foams based on status (active/inactive).
  const [message, setMessage] = useState({}); // State to show success/error messages.
  const rowsPerPage = 7; // Number of rows to show per page.
  // Fetch all glass data from the server when the component mounts.
  useEffect(() => {
    fetchAllGlass();
  }, []);

  const fetchAllGlass = async () => {
    try {
      const res = await axios.get("/glass");
      setGlass(res.data);
    } catch (err) {
      console.error("Error fetching glass:", err);
    }
  };
  // Set the glass data to the form for editing and mark the index as the one being edited.
  const handleEdit = (index, data) => {
    setEditingIndex(index);
    setFormData({ ...data });
  };

  // Cancel editing or adding a glass and reset the form data.
  const handleCancel = () => {
    setEditingIndex(null);
    setFormData({ glassType: "", Thickness: "", status: 1 });
    setErrors({});
  };
  // Handle saving a new or edited glass entry.
  const handleSave = async () => {
    try {
      const validationErrors = GlassValidation(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors); // Set validation errors if any.
        return;
      }

      if (editingIndex !== null && editingIndex !== glass.length) {
        await axios.put(`/update/${formData.glassType}`, formData); // Send a PUT request to update glass.
        const updatedGlasses = [...glass];
        updatedGlasses[editingIndex] = formData; // Update the local state with the edited glass.
        setGlass(updatedGlasses);
      } else {
        // If creating a new glass, send a POST request.
        const res = await axios.post("/create", formData);
        setGlass([...glass, res.data.data]); // Add the new glass to the local state.
        window.location.reload(); // Reload the page (optional).
      }

      handleCancel(); // Reset form and state after saving.
    } catch (err) {
      console.error("Error saving glass:", err);
    }
  };
  // Update form data when input values change.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Toggle the status of a glass (activate/deactivate).
  const handleActivateTable = async (table) => {
    try {
      const newStatus = table.status === 1 ? 0 : 1; // Toggle status.
      const res = await axios.put(`/update/${table.glassType}`, {
        ...table,
        status: newStatus,
      }); // Send a PUT request to update glass status.
      if (res.status === 200) {
        const updatedData = glass.map((item) =>
          item.glassType === table.glassType
            ? { ...item, status: newStatus }
            : item
        );
        setGlass(updatedData); // Update foam status locally.
        setMessage({
          msgClass: "success",
          text:
            newStatus === 1
              ? "Glass activated successfully!"
              : "Glass deactivated successfully!",
        }); // Show a success message.
        setTimeout(() => {
          setMessage({});
        }, 2000); // Clear message after 2 seconds.
      } else {
        setMessage({
          msgClass: "error",
          text: "Failed to update glass status",
        });
      }
    } catch (error) {
      console.error("Error updating glass status:", error);
      setMessage({
        msgClass: "error",
        text: "Failed to update glass status",
      });
    }
  };
  // Handle changing the display filter (show active, inactive, or all glasses).
  const handleChangeDisplay = (event) => {
    const option = event.target.value;
    if (option === "active") {
      setDisplayActiveOnly(true);
    } else if (option === "inactive") {
      setDisplayActiveOnly(false);
    } else {
      setDisplayActiveOnly(null);
    }
  };
  // Filter glass based on search query and active/inactive status.
  const filteredGlasses = glass
    .filter((data) =>
      data.glassType.toLowerCase().includes(search.toLowerCase())
    )
    .filter((glassItem) => {
      if (displayActiveOnly === null) return true;
      return displayActiveOnly
        ? glassItem.status === 1
        : glassItem.status === 0;
    }); // Filter by status (active/inactive).
  // Pagination: calculate the range of rows to display.
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredGlasses.slice(indexOfFirstRow, indexOfLastRow);
  // Update the current page for pagination.
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // Handle adding a new glass (set form data to defaults).
  const handleAddGlass = () => {
    setEditingIndex(glass.length);
    setFormData({ glassType: "", Thickness: "", status: 1 });
  };
  return (
    <div className={classes.container}>
      {/* Main table component structure */}
      <div className={classes.tablef}>
        <h2 className="w-100 d-flex justify-content-center p-3">זכוכית</h2>
        <div className={classes.controls}>
          <button className="btn btn-primary" onClick={handleAddGlass}>
            <img src={addIcon} alt="Add" className={classes.icon} /> הוספת
            זכוכית
          </button>
          <div>
            <select onChange={handleChangeDisplay} className="form-select">
              <option value="active">פעילות</option>
              <option value="inactive">לא פעילות</option>
              <option value="">הכל</option>
            </select>
          </div>
          <SearchBar
            searchVal={search}
            setSearchVal={setSearch}
            className="search-bar"
          />
        </div>
        {/* Message section for displaying success or error messages */}
        {message.text && (
          <div
            className={`alert ${
              message.msgClass === "success" ? "alert-success" : "alert-danger"
            }`}
          >
            {message.text}
          </div>
        )}
        {/* Table to display the glass data */}
        <table className={`table ${classes.table}`}>
          <thead>
            <tr>
              <th>פעולות</th>
              <th>סטטוס</th>
              <th>עובי ב מ"מ</th>
              <th>סוג זכוכית</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((data, i) => (
              <tr key={`${data.glassType}-${i}`}>
                <td>
                  {editingIndex === i ? (
                    <>
                      <img
                        src={saveIcon}
                        alt="Save"
                        className={classes.icon}
                        onClick={handleSave}
                      />
                      <img
                        src={closeIcon}
                        alt="Cancel"
                        className={classes.icon}
                        onClick={handleCancel}
                      />
                    </>
                  ) : (
                    <div>
                      <img
                        src={editIcon}
                        alt="Edit"
                        className={classes.icon}
                        onClick={() => handleEdit(i, data)}
                      />
                      <button
                        className="btn btn-link p-0"
                        onClick={() => handleActivateTable(data)}
                      >
                        שנה סטטוס
                      </button>
                    </div>
                  )}
                </td>
                <td>
                  {editingIndex === i ? (
                    <input
                      type="text"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      placeholder="סטטוס"
                      className="form-control"
                      disabled
                    />
                  ) : data.status === 1 ? (
                    "פעיל"
                  ) : (
                    "לא פעיל"
                  )}
                </td>
                <td>
                  {editingIndex === i ? (
                    <>
                      <input
                        type="text"
                        name="Thickness"
                        value={formData.Thickness}
                        onChange={handleChange}
                        placeholder="עובי"
                        className="form-control"
                      />
                      {errors.Thickness && (
                        <div className="text-danger">{errors.Thickness}</div>
                      )}
                    </>
                  ) : (
                    data.Thickness
                  )}
                </td>
                <td>
                  {editingIndex === i ? (
                    <>
                      <input
                        type="text"
                        name="glassType"
                        value={formData.glassType}
                        onChange={handleChange}
                        placeholder="סוג זכוכית"
                        className="form-control"
                      />
                      {errors.glassType && (
                        <div className="text-danger">{errors.glassType}</div>
                      )}
                    </>
                  ) : (
                    data.glassType
                  )}
                </td>
              </tr>
            ))}
            {editingIndex === glass.length && (
              <tr>
                <td>
                  <img
                    src={saveIcon}
                    alt="Save"
                    className={classes.icon}
                    onClick={handleSave}
                  />
                  <img
                    src={closeIcon}
                    alt="Cancel"
                    className={classes.icon}
                    onClick={handleCancel}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    placeholder="סטטוס"
                    className="form-control"
                    disabled
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="Thickness"
                    value={formData.Thickness}
                    onChange={handleChange}
                    placeholder="עובי"
                    className="form-control"
                  />
                  {errors.Thickness && (
                    <div className="text-danger">{errors.Thickness}</div>
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    name="glassType"
                    value={formData.glassType}
                    onChange={handleChange}
                    placeholder="סוג זכוכית"
                    className="form-control"
                  />
                  {errors.glassType && (
                    <div className="text-danger">{errors.glassType}</div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination controls */}
        <div className="pagination justify-content-center">
          {[
            ...Array(Math.ceil(filteredGlasses.length / rowsPerPage)).keys(),
          ].map((number) => (
            <button
              key={number + 1}
              onClick={() => paginate(number + 1)}
              className="page-link"
            >
              {number + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Glass;
