import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../searchBar/SearchBar.jsx";
import editIcon from "../../img/icon/edit.png";
import saveIcon from "../../img/icon/save.png";
import closeIcon from "../../img/icon/close.png";
import addIcon from "../../img/icon/add.png";
import classes from "../../css/table.module.css";
import ShutterValidation from "../../js/validations/ShtterValidation";

const Shutter = () => {
  const [shutters, setShutters] = useState([]);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    shutterType: "",
    shutterId: "",
    status: 1, // Default to active
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [displayActiveOnly, setDisplayActiveOnly] = useState(1); // Show active shutters by default
  const [message, setMessage] = useState({}); // Added for activation messages
  const rowsPerPage = 6;
  // fetch all the shutters using use effect
  useEffect(() => {
    const fetchAllShutters = async () => {
      try {
        const res = await axios.get("/shutters");
        setShutters(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllShutters();
  }, []);
  //a function to update the values
  const handleEdit = (index, data) => {
    setEditingIndex(index);
    setFormData({ ...data });
  };
  //a function to cancel the update
  const handleCancel = () => {
    setEditingIndex(null);
    setFormData({ shutterType: "", shutterId: "", status: 0 });
    setErrors({});
  };
  //a function that adds or updates a shutter
  const handleSave = async () => {
    try {
      const validationErrors = ShutterValidation(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      if (formData.shutterId) {
        await axios.put(`/shutters/${formData.shutterId}`, formData);
        const res = await axios.get("/shutters");
        setShutters(res.data);
      } else {
        const res = await axios.post("/shutters", formData);
        setShutters([...shutters, res.data]);
        window.location.reload();
      }
      // Reset form and state after save
      handleCancel();
    } catch (err) {
      console.error("Error saving shutter:", err);
    } // Handle error or display error message
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleActivateTable = async (shutter) => {
    try {
      const newStatus = shutter.status === 1 ? 0 : 1; // Toggle status
      const res = await axios.put(`/shutters/${shutter.shutterId}`, {
        ...shutter,
        status: newStatus,
      });
      if (res.status === 200) {
        const updatedData = shutters.map((item) =>
          item.shutterId === shutter.shutterId
            ? { ...item, status: newStatus }
            : item
        );
        setShutters(updatedData);
        setMessage({
          msgClass: "success",
          text:
            newStatus === 1
              ? "Shutter activated successfully!"
              : "Shutter deactivated successfully!",
        });
        setTimeout(() => {
          setMessage({});
        }, 2000);
      } else {
        setMessage({
          msgClass: "error",
          text: "Failed to update shutter status",
        });
      }
    } catch (error) {
      console.error("Error updating shutter status:", error);
      setMessage({
        msgClass: "error",
        text: "Failed to update shutter status",
      });
    }
  };
//a function that handles the activation of the status
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
//a function to search
  const filteredShutters = shutters
    .filter((data) => data.shutterId.toString().includes(search))
    .filter((shutter) => {
      if (displayActiveOnly === null) return true;
      return displayActiveOnly ? shutter.status === 1 : shutter.status === 0;
    });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredShutters.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddShutter = () => {
    setEditingIndex(shutters.length);
    setFormData({ shutterType: "", shutterId: "", status: 1 });
  };

  return (
    <div className={classes.container}>
      <div className={classes.tablef}>
        <h2 className="w-100 d-flex justify-content-center p-3">תריס</h2>
        <div className={classes.controls}>
          <button className="btn btn-primary" onClick={handleAddShutter}>
            <img src={addIcon} alt="Add" className={classes.icon} /> הוספת תריס
          </button>
          <select onChange={handleChangeDisplay} className="form-select">
            <option value="active">פעילים</option>
            <option value="inactive">לא פעילים</option>
            <option value="">הכל</option>
          </select>
          <SearchBar
            searchVal={search}
            setSearchVal={setSearch}
            className="search-bar"
          />
        </div>
        {message.text && (
          <div
            className={`alert ${
              message.msgClass === "success" ? "alert-success" : "alert-danger"
            }`}
          >
            {message.text}
          </div>
        )}
        <table className={`table ${classes.table}`}>
          <thead>
            <tr>
              <th>פעולות</th>
              <th>סטטוס</th>
              <th>סוג תריס</th>
              <th>מספר תריס</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((data, i) => (
              <tr key={data.shutterId}>
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
                      {data.status === 1 ? (
                        <button
                          className="btn btn-link p-0"
                          onClick={() => handleActivateTable(data)}
                        >
                          שנה סטטוס
                        </button>
                      ) : (
                        <button
                          className="btn btn-link p-0"
                          onClick={() => handleActivateTable(data)}
                        >
                          שנה סטטוס
                        </button>
                      )}
                    </div>
                  )}
                </td>
                <td>
                  {editingIndex === i ? (
                    <>
                      <input
                        type="text"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        placeholder="סטטוס"
                        className="form-control"
                        disabled
                      />
                    </>
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
                        name="shutterType"
                        value={formData.shutterType}
                        onChange={handleChange}
                        placeholder="סוג תריס"
                        className="form-control"
                      />
                      {errors.shutterType && (
                        <div className="text-danger">{errors.shutterType}</div>
                      )}
                    </>
                  ) : (
                    data.shutterType
                  )}
                </td>
                <td>{data.shutterId}</td>
              </tr>
            ))}
            {editingIndex === shutters.length && (
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
                  <>
                    <input
                      type="text"
                      name="shutterType"
                      value={formData.shutterType}
                      onChange={handleChange}
                      placeholder="סוג תריס"
                      className="form-control"
                    />
                    {errors.shutterType && (
                      <div className="text-danger">{errors.shutterType}</div>
                    )}
                  </>
                </td>
                <td>
                  {/* Status will be inactive initially and change after adding */}
                  פעיל
                </td>
                <td>חדש</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination justify-content-center">
          {[
            ...Array(Math.ceil(filteredShutters.length / rowsPerPage)).keys(),
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

export default Shutter;
