import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../searchBar/SearchBar.jsx";
import editIcon from "../../img/icon/edit.png";
import saveIcon from "../../img/icon/save.png";
import closeIcon from "../../img/icon/close.png";
import addIcon from "../../img/icon/add.png";
import classes from "../../css/table.module.css";
import emailIcon from "../../img/icon/email.png"; // Add an icon for sending email
import Validation from "../../js/validations/SuppliersValidation";

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    address: "",
    contact: "",
    email: "",
    phoneNumber: "",
    name: "",
    id: "", // Ensure id field is initialized
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  useEffect(() => {
    fetchSuppliers();
  }, []);
  //fetching all the suppliers to get the data
  const fetchSuppliers = async () => {
    try {
      const suppliersResponse = await axios.get("/suppliers");
      setSuppliers(suppliersResponse.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };
  // Set the supplier data to the form for editing and mark the index as the one being edited.
  const handleEdit = (index, data) => {
    setEditingIndex(index);
    setFormData({ ...data });
    setErrors({});
  };
  // Cancel editing or adding a supplier and reset the form data.
  const handleCancel = () => {
    setEditingIndex(null);
    setFormData({
      address: "",
      contact: "",
      email: "",
      phoneNumber: "",
      name: "",
      id: "", // Ensure id field is reset
    });
    setErrors({});
  };
  // Handle saving a new or edited supplier.
  const handleSave = async () => {
    const validationErrors = Validation(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      let endpoint;
      let updatedSuppliers;

      if (editingIndex !== null && editingIndex < suppliers.length) {
        // Update existing supplier
        endpoint = `/suppliers/${formData.id}`;
        await axios.put(endpoint, formData);
        updatedSuppliers = suppliers.map((item, index) =>
          index === editingIndex ? formData : item
        );
      } else {
        // Add new supplier
        const res = await axios.post("/createSupplier", formData);
        updatedSuppliers = [...suppliers, res.data.data];
        window.location.reload();
      }

      setSuppliers(updatedSuppliers);
      handleCancel(); // Reset form and state after saving.
    } catch (err) {
      console.error("Error saving supplier:", err);
    }
  };
  // Update form data when input values change.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Filter suppliers based on search query.
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier && supplier.id ? supplier.id.toString().includes(search) : false
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredSuppliers.slice(indexOfFirstRow, indexOfLastRow);
  // Pagination: calculate the range of rows to display.
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // Handle adding a new suppliers (set form data to defaults).
  const handleAddSupplier = () => {
    setEditingIndex(suppliers.length); // Set index to the end to add a new supplier
    setFormData({
      address: "",
      contact: "",
      email: "",
      phoneNumber: "",
      name: "",
      id: "", // Ensure id field is initialized
    });
    setErrors({});
  };

  return (
    <div className={classes.container}>
      <div className={classes.tablef}>
        <h2 className="w-100 d-flex justify-content-center p-3">ספקים</h2>
        {/* Control section for adding suppliers, changing display filter, and search bar */}
        <div className={classes.controls}>
          <button className="btn btn-primary" onClick={handleAddSupplier}>
            <img src={addIcon} alt="Add" className={classes.icon} /> הוספת ספק
            חדש
          </button>
          <SearchBar
            searchVal={search}
            setSearchVal={setSearch}
            className="search-bar"
          />
        </div>
        <table className={`table ${classes.table}`}>
          <thead>
            <tr>
              <th>פעולות</th>
              <th>כתובת</th>
              <th>איש קשר</th>
              <th>מייל</th>
              <th>טלפון</th>
              <th>שם מפעל</th>
              <th>ת.ז</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((supplier, index) => (
              <tr key={supplier.id}>
                <td>
                  {editingIndex === index ? (
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
                    <img
                      src={editIcon}
                      alt="Edit"
                      className={classes.icon}
                      onClick={() => handleEdit(index, supplier)}
                    />
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="כתובת"
                      className={`form-control ${
                        errors.address ? "is-invalid" : ""
                      }`}
                    />
                  ) : (
                    supplier.address
                  )}
                  {editingIndex === index && errors.address && (
                    <div className="invalid-feedback">{errors.address}</div>
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      placeholder="איש קשר"
                      className={`form-control ${
                        errors.contact ? "is-invalid" : ""
                      }`}
                    />
                  ) : (
                    supplier.contact
                  )}
                  {editingIndex === index && errors.contact && (
                    <div className="invalid-feedback">{errors.contact}</div>
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="מייל"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                    />
                  ) : (
                    supplier.email
                  )}
                  {editingIndex === index && errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="טלפון"
                      className={`form-control ${
                        errors.phoneNumber ? "is-invalid" : ""
                      }`}
                    />
                  ) : (
                    supplier.phoneNumber
                  )}
                  {editingIndex === index && errors.phoneNumber && (
                    <div className="invalid-feedback">{errors.phoneNumber}</div>
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="שם מפעל"
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                    />
                  ) : (
                    supplier.name
                  )}
                  {editingIndex === index && errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </td>
                <td>{supplier.id}</td>
              </tr>
            ))}
            {editingIndex === suppliers.length && (
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
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="כתובת"
                    className={`form-control ${
                      errors.address ? "is-invalid" : ""
                    }`}
                  />
                  {errors.address && (
                    <div className="invalid-feedback">{errors.address}</div>
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="איש קשר"
                    className={`form-control ${
                      errors.contact ? "is-invalid" : ""
                    }`}
                  />
                  {errors.contact && (
                    <div className="invalid-feedback">{errors.contact}</div>
                  )}
                </td>
                <td>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="מייל"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </td>
                <td>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="טלפון"
                    className={`form-control ${
                      errors.phoneNumber ? "is-invalid" : ""
                    }`}
                  />
                  {errors.phoneNumber && (
                    <div className="invalid-feedback">{errors.phoneNumber}</div>
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="שם מפעל"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    placeholder="ת.ז"
                    className={`form-control ${errors.id ? "is-invalid" : ""}`}
                  />
                  {errors.id && (
                    <div className="invalid-feedback">{errors.id}</div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination controls */}
        <div className="d-flex justify-content-center">
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
              {Array.from({
                length: Math.ceil(filteredSuppliers.length / rowsPerPage),
              }).map((_, index) => (
                <li key={index} className={`page-item`}>
                  <button
                    className="page-link"
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Supplier;
