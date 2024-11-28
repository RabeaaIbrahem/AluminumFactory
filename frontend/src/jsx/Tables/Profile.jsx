import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../searchBar/SearchBar.jsx";
import editIcon from "../../img/icon/edit.png";
import saveIcon from "../../img/icon/save.png";
import closeIcon from "../../img/icon/close.png";
import addIcon from "../../img/icon/add.png";
import classes from "../../css/table.module.css";
import ProfileValidation from "../../js/validations/ProfileValidation";

const Profile = () => {
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    weight: "",
    perimeter: "",
    id: "",
    price: "",
    priceShutters: "",
    status: 1, // Initialize status
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [displayActiveOnly, setDisplayActiveOnly] = useState(1); // Initialize to show active profiles
  const [message, setMessage] = useState({}); // Added for activation messages
  const rowsPerPage = 6;

  useEffect(() => {
    const fetchAllProfiles = async () => {
      try {
        const res = await axios.get("/profiles");
        setProfiles(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllProfiles();
  }, []);

  const handleEdit = (index, data) => {
    setEditingIndex(index);
    setFormData({ ...data });
  };
  //a function to cancel the update
  const handleCancel = () => {
    setEditingIndex(null);
    setFormData({
      weight: "",
      perimeter: "",
      id: "",
      price: "",
      priceShutters: "",
      status: 0,
    }); // Reset status to 0 on cancel
    setErrors({});
  };
  //a function that adds or updates a profile
  const handleSave = async () => {
    try {
      const validationErrors = ProfileValidation(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      let updatedProfile;
      if (formData.id && editingIndex !== profiles.length) {
        await axios.put(`/profile/${formData.id}`, formData);
        const updatedProfiles = [...profiles];
        updatedProfiles[editingIndex] = formData;
        setProfiles(updatedProfiles);
        updatedProfile = formData;
      } else {
        const res = await axios.post("/profile", formData);
        setProfiles([...profiles, res.data]);
        updatedProfile = res.data;
        window.location.reload();
      }

      // Reset form and state after save
      handleCancel();
    } catch (err) {
      console.error("Error saving profile:", err);
      // Handle error or display error message
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleActivateTable = async (table) => {
    try {
      const newStatus = table.status === 1 ? 0 : 1; // Toggle status between 0 and 1
      const res = await axios.put(`/profile/${table.id}`, {
        ...table,
        status: newStatus,
      });
      if (res.status === 200) {
        const updatedData = profiles.map((item) =>
          item.id === table.id ? { ...item, status: newStatus } : item
        );
        setProfiles(updatedData);
        setMessage({
          msgClass: "success",
          text:
            newStatus === 1
              ? "Profile activated successfully!"
              : "Profile deactivated successfully!",
        });
        setTimeout(() => {
          setMessage({});
        }, 2000);
      } else {
        setMessage({
          msgClass: "error",
          text: "Failed to update profile status",
        });
      }
    } catch (error) {
      console.error("Error updating profile status:", error);
      setMessage({
        msgClass: "error",
        text: "Failed to update profile status",
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
  const filteredProfiles = profiles
    .filter((data) => data.id.toString().includes(search))
    .filter((profile) => {
      if (displayActiveOnly === null) return true;
      return displayActiveOnly ? profile.status === 1 : profile.status === 0;
    });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredProfiles.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddProfile = () => {
    setEditingIndex(profiles.length);
    setFormData({
      weight: "",
      perimeter: "",
      id: "",
      price: "",
      priceShutters: "",
      status: 1,
    });
  };

  return (
    <div className={classes.container}>
      <div className={classes.tablef}>
        <h2 className="w-100 d-flex justify-content-center p-3">פרופיל</h2>
        <div className={classes.controls}>
          <button className="btn btn-primary" onClick={handleAddProfile}>
            <img src={addIcon} alt="Add" className={classes.icon} /> הוספת
            פרופיל
          </button>
          <select onChange={handleChangeDisplay} className="form-select">
            <option value="active">פעילות</option>
            <option value="inactive">לא פעילות</option>
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
              <th>מחיר לתריס מ"מ</th>
              <th>מחיר ל מ"מ</th>
              <th>משקל בק"ג</th>
              <th>היקף ב מ"מ</th>
              <th>מק"ט</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((data, i) => (
              <tr key={data.id}>
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
                        id="status"
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
                        type="double"
                        name="priceShutters"
                        id="priceShutters"
                        value={formData.priceShutters}
                        onChange={handleChange}
                        placeholder="מחיר לתריס"
                        className="form-control"
                      />
                      {errors.priceShutters && (
                        <div className="text-danger">
                          {errors.priceShutters}
                        </div>
                      )}
                    </>
                  ) : (
                    data.priceShutters
                  )}
                </td>
                <td>
                  {editingIndex === i ? (
                    <>
                      <input
                        type="double"
                        name="price"
                        id="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="מחיר למטר מרובע"
                        className="form-control"
                      />
                      {errors.price && (
                        <div className="text-danger">{errors.price}</div>
                      )}
                    </>
                  ) : (
                    data.price
                  )}
                </td>
                <td>
                  {editingIndex === i ? (
                    <>
                      <input
                        type="text"
                        name="weight"
                        id="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="משקל"
                        className="form-control"
                      />
                      {errors.weight && (
                        <div className="text-danger">{errors.weight}</div>
                      )}
                    </>
                  ) : (
                    data.weight
                  )}
                </td>
                <td>
                  {editingIndex === i ? (
                    <>
                      <input
                        type="text"
                        name="perimeter"
                        id="perimeter"
                        value={formData.perimeter}
                        onChange={handleChange}
                        placeholder="היקף"
                        className="form-control"
                      />
                      {errors.perimeter && (
                        <div className="text-danger">{errors.perimeter}</div>
                      )}
                    </>
                  ) : (
                    data.perimeter
                  )}
                </td>
                <td>
                  {editingIndex === i ? (
                    <>
                      <input
                        type="text"
                        name="id"
                        id="id"
                        value={formData.id}
                        onChange={handleChange}
                        placeholder="מק'ט"
                        className="form-control"
                        disabled={formData.id !== ""}
                      />
                      {errors.id && (
                        <div className="text-danger">{errors.id}</div>
                      )}
                    </>
                  ) : (
                    data.id
                  )}
                </td>
              </tr>
            ))}
            {editingIndex === profiles.length && (
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
                <td></td>
                <td>
                  <>
                    <input
                      type="double"
                      name="priceShutters"
                      id="priceShutters"
                      value={formData.priceShutters}
                      onChange={handleChange}
                      placeholder="מחיר תריס"
                      className="form-control"
                    />
                    {errors.priceShutters && (
                      <div className="text-danger">{errors.priceShutters}</div>
                    )}
                  </>
                </td>
                <td>
                  <>
                    <input
                      type="double"
                      name="price"
                      id="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="מחיר"
                      className="form-control"
                    />
                    {errors.price && (
                      <div className="text-danger">{errors.price}</div>
                    )}
                  </>
                </td>
                <td>
                  <>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="משקל"
                      className="form-control"
                    />
                    {errors.weight && (
                      <div className="text-danger">{errors.weight}</div>
                    )}
                  </>
                </td>
                <td>
                  <>
                    <input
                      type="text"
                      name="perimeter"
                      value={formData.perimeter}
                      onChange={handleChange}
                      placeholder="היקף"
                      className="form-control"
                    />
                    {errors.perimeter && (
                      <div className="text-danger">{errors.perimeter}</div>
                    )}
                  </>
                </td>
                <td>
                  <>
                    <input
                      type="text"
                      name="id"
                      value={formData.id}
                      onChange={handleChange}
                      placeholder="מק'ט"
                      className="form-control"
                    />
                    {errors.id && (
                      <div className="text-danger">{errors.id}</div>
                    )}
                  </>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination justify-content-center">
          {[
            ...Array(Math.ceil(filteredProfiles.length / rowsPerPage)).keys(),
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

export default Profile;
