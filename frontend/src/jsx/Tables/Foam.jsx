import React, { useEffect, useState } from "react"; // Import necessary React hooks and other dependencies.
import axios from "axios"; // Import Axios for making HTTP requests.
import SearchBar from "../searchBar/SearchBar.jsx"; // Import custom SearchBar component.
import editIcon from "../../img/icon/edit.png"; // Import icons for edit, save, close, and add actions.
import saveIcon from "../../img/icon/save.png";
import closeIcon from "../../img/icon/close.png";
import addIcon from "../../img/icon/add.png";
import classes from "../../css/table.module.css"; // Import CSS module for styling the table.
import Validation from "../../js/validations/FoamValidation"; // Import custom validation logic for foam data.

const Foam = () => {
  // Define component state variables.
  const [foam, setFoam] = useState([]); // State to hold the list of foams.
  const [errors, setErrors] = useState({}); // State to track form validation errors.
  const [search, setSearch] = useState(""); // State for search input value.
  const [editingIndex, setEditingIndex] = useState(null); // State to track which foam is being edited.
  const [formData, setFormData] = useState({
    // State to hold form data for creating or editing a foam.
    foamType: "",
    foamId: "",
    status: 1,
  });
  const [currentPage, setCurrentPage] = useState(1); // State to track the current page for pagination.
  const [displayActiveOnly, setDisplayActiveOnly] = useState(1); // State to filter foams based on status (active/inactive).
  const [message, setMessage] = useState({}); // State to show success/error messages.
  const rowsPerPage = 7; // Number of rows to show per page.

  // Fetch all foam data from the server when the component mounts.
  useEffect(() => {
    const fetchAllFoams = async () => {
      try {
        const res = await axios.get("/foam"); // Get the list of foams from the server.
        setFoam(res.data); // Update the foam state with the response data.
      } catch (err) {
        console.log(err); // Log any error that occurs.
      }
    };
    fetchAllFoams();
  }, []);

  // Set the foam data to the form for editing and mark the index as the one being edited.
  const handleEdit = (index, data) => {
    setEditingIndex(index);
    setFormData({ ...data });
  };

  // Cancel editing or adding a foam and reset the form data.
  const handleCancel = () => {
    setEditingIndex(null);
    setFormData({ foamType: "", foamId: "", status: 1 });
    setErrors({});
  };

  // Handle saving a new or edited foam entry.
  const handleSave = async () => {
    try {
      const validationErrors = Validation(formData); // Validate the form data.
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors); // Set validation errors if any.
        return;
      }

      let updatedFoam;
      // If editing an existing foam, update the data.
      if (formData.foamId && editingIndex !== foam.length) {
        await axios.put(`/updateFoam/${formData.foamId}`, formData); // Send a PUT request to update foam.
        const updatedFoams = [...foam];
        updatedFoams[editingIndex] = formData; // Update the local state with the edited foam.
        setFoam(updatedFoams);
        updatedFoam = formData;
      } else {
        // If creating a new foam, send a POST request.
        const res = await axios.post("/createFoam", formData);
        setFoam([...foam, res.data]); // Add the new foam to the local state.
        updatedFoam = res.data;
        window.location.reload(); // Reload the page (optional).
      }

      handleCancel(); // Reset form and state after saving.
    } catch (err) {
      console.error("Error saving foam:", err);
    }
  };

  // Update form data when input values change.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle the status of a foam (activate/deactivate).
  const handleActivateFoam = async (item) => {
    try {
      const newStatus = item.status === 1 ? 0 : 1; // Toggle status.
      const res = await axios.put(`/updateFoam/${item.foamId}`, {
        ...item,
        status: newStatus,
      }); // Send a PUT request to update foam status.
      if (res.status === 200) {
        const updatedFoam = foam.map((f) =>
          f.foamId === item.foamId ? { ...f, status: newStatus } : f
        );
        setFoam(updatedFoam); // Update foam status locally.
        setMessage({
          msgClass: "success",
          text:
            newStatus === 1
              ? "Foam activated successfully!"
              : "Foam deactivated successfully!",
        }); // Show a success message.
        setTimeout(() => setMessage({}), 2000); // Clear message after 2 seconds.
      } else {
        setMessage({ msgClass: "error", text: "Failed to update foam status" });
      }
    } catch (err) {
      console.error("Error updating foam status:", err);
      setMessage({ msgClass: "error", text: "Failed to update foam status" });
    }
  };

  // Handle changing the display filter (show active, inactive, or all foams).
  const handleChangeDisplay = (event) => {
    const option = event.target.value;
    if (option === "active") {
      setDisplayActiveOnly(1);
    } else if (option === "inactive") {
      setDisplayActiveOnly(0);
    } else {
      setDisplayActiveOnly(null);
    }
  };

  // Filter foams based on search query and active/inactive status.
  const filteredFoams = foam
    .filter((data) => (data.foamId || "").toString().includes(search)) // Filter by search term.
    .filter((item) =>
      displayActiveOnly === null ? true : item.status === displayActiveOnly
    ); // Filter by status (active/inactive).

  // Pagination: calculate the range of rows to display.
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredFoams.slice(indexOfFirstRow, indexOfLastRow);

  // Update the current page for pagination.
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle adding a new foam (set form data to defaults).
  const handleAddFoam = () => {
    setEditingIndex(foam.length);
    setFormData({ foamType: "", foamId: "", status: 1 });
  };

  return (
    <div className={classes.container}>
      {/* Main table component structure */}
      <div className={classes.tablef}>
        <h2 className="w-100 d-flex justify-content-center p-3">פרזול</h2>{" "}
        {/* Header */}
        {/* Control section for adding foams, changing display filter, and search bar */}
        <div className={classes.controls}>
          <button className="btn btn-primary" onClick={handleAddFoam}>
            <img src={addIcon} alt="Add" className={classes.icon} /> הוספת פרזול
            חדש
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
        {/* Table to display the foam data */}
        <table className={`table ${classes.table}`}>
          <thead>
            <tr>
              <th>פעולות</th>
              <th>סטטוס</th>
              <th>סוג פרזול</th>
              <th>מ'קט</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((data, index) => (
              <tr key={data.foamId || `newFoam-${index}`}>
                <td>
                  {editingIndex === index ? (
                    <div>
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
                    </div>
                  ) : (
                    <div>
                      <img
                        src={editIcon}
                        alt="Edit"
                        className={classes.icon}
                        onClick={() => handleEdit(index, data)}
                      />
                      <button
                        className="btn btn-link p-0"
                        onClick={() => handleActivateFoam(data)}
                      >
                        שנה סטטוס
                      </button>
                    </div>
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
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
                  {editingIndex === index ? (
                    <div>
                      <input
                        type="text"
                        name="foamType"
                        value={formData.foamType}
                        onChange={handleChange}
                        placeholder="סוג פרזול"
                        className="form-control"
                      />
                      {errors.foamType && (
                        <div className="text-danger">{errors.foamType}</div>
                      )}
                    </div>
                  ) : (
                    <div>{data.foamType}</div>
                  )}
                </td>
                <td>{data.foamId}</td>
              </tr>
            ))}
            {editingIndex === foam.length && ( // Render a new row for adding a foam.
              <tr key={`newFoam-${foam.length}`}>
                <td>
                  <div>
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
                  </div>
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
                  <div>
                    <input
                      type="text"
                      name="foamType"
                      value={formData.foamType}
                      onChange={handleChange}
                      placeholder="סוג פרזול"
                      className="form-control"
                    />
                    {errors.foamType && (
                      <div className="text-danger">{errors.foamType}</div>
                    )}
                  </div>
                </td>
                <td>
                  <input
                    type="text"
                    name="foamId"
                    value={formData.foamId}
                    onChange={handleChange}
                    placeholder="מ'קט"
                    className="form-control"
                  />
                  {errors.foamId && (
                    <div className="text-danger">{errors.foamId}</div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination controls */}
        <nav>
          <ul className="pagination justify-content-center">
            {Array.from({
              length: Math.ceil(filteredFoams.length / rowsPerPage),
            }).map((_, index) => (
              <li key={index + 1} className="page-item">
                <button
                  onClick={() => paginate(index + 1)}
                  className="page-link"
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Foam;
