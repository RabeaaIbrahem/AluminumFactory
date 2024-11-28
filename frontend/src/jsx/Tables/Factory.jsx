import React, { useState, useEffect } from "react";
import axios from "axios";
import phone from "../../img/icon/phone.png";
import email from "../../img/icon/email.png";
import id from "../../img/icon/id.png";
import name from "../../img/icon/factory.png";
import contact from "../../img/icon/contact.png";
import vat from "../../img/icon/vat.png";
import address from "../../img/icon/address.png";
import edit from "../../img/icon/edit.png";
import save from "../../img/icon/save.png";
import close from "../../img/icon/close.png";
import classes from "../../css/factory.module.css";
import FactoryValidation from "../../js/validations/FactoryValidation";

const Factory = () => {
  const [factory, setFactory] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    factoryName: "",
    id: "",
    contact: "",
    address: "",
    phoneNumber: "",
    email: "",
    vat: "",
  });

  useEffect(() => {
    const fetchAllFactories = async () => {
      try {
        const res = await axios.get("/factory");
        setFactory(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllFactories();
  }, []);

  const handleEdit = (index, data) => {
    // Check if already editing the same index, prevent redundant state updates
    if (editingIndex !== index) {
      setEditingIndex(index); // Set editing index to the current factory index
      setFormData({ ...data }); // Populate form data with current factory data
      setErrors({}); // Clear any previous errors
    }
  };

  const handleCancel = () => {
    setEditingIndex(null); // Exit edit mode by resetting editing index
    setFormData({
      factoryName: "",
      id: "",
      contact: "",
      address: "",
      phoneNumber: "",
      email: "",
      vat: "",
    }); // Clear form data
    setErrors({}); // Clear errors
  };

  const handleSave = async () => {
    console.log("handleSave called");
    const validationErrors = FactoryValidation(formData);
    console.log("Validation errors:", validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      console.log("Sending PUT request to backend API");
      console.log("FormData:", formData);
      const response = await axios.put(
        `/updateFactory/${formData.id}`,
        formData
      );
      console.log("Response from backend API:", response);
      console.log("PUT request successful");
      const updatedFactories = [...factory];
      updatedFactories[editingIndex] = { ...formData };
      console.log("Updated factories:", updatedFactories);
      setFactory(updatedFactories);
      setEditingIndex(null);
      setFormData({
        factoryName: "",
        id: "",
        contact: "",
        address: "",
        phoneNumber: "",
        email: "",
        vat: "",
      });
    } catch (err) {
      console.error("Error sending PUT request:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Update form data on input change
    setErrors({ ...errors, [e.target.name]: undefined }); // Clear errors for the changed field
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.container}>
        <h2>הגדרות</h2>
        {factory.map((data, i) => (
          <div key={i} className={classes.card}>
            <div className={classes.item}>
              <div className={classes.details}>
                {editingIndex === i ? (
                  <>
                    <input
                      type="text"
                      name="factoryName"
                      value={formData.factoryName}
                      onChange={handleChange}
                    />
                    {errors.factoryName && (
                      <span className={classes.error}>
                        {errors.factoryName}
                      </span>
                    )}
                  </>
                ) : (
                  <a>{data.factoryName}</a>
                )}
                <span>שם עסק</span>
              </div>
              <img src={name} alt="factory" className={classes.icon} />
            </div>
            <div className={classes.item}>
              <div className={classes.details}>
                <a>{data.id}</a>
                <span>ח"פ</span>
              </div>
              <img src={id} alt="id" className={classes.icon} />
            </div>
            <div className={classes.item}>
              <div className={classes.details}>
                {editingIndex === i ? (
                  <>
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                    />
                    {errors.contact && (
                      <span className={classes.error}>{errors.contact}</span>
                    )}
                  </>
                ) : (
                  <a>{data.contact}</a>
                )}
                <span>איש קשר</span>
              </div>
              <img src={contact} alt="contact" className={classes.icon} />
            </div>
            <div className={classes.item}>
              <div className={classes.details}>
                {editingIndex === i ? (
                  <>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                    {errors.address && (
                      <span className={classes.error}>{errors.address}</span>
                    )}
                  </>
                ) : (
                  <a>{data.address}</a>
                )}
                <span>כתובת</span>
              </div>
              <img src={address} alt="address" className={classes.icon} />
            </div>
            <div className={classes.item}>
              <div className={classes.details}>
                {editingIndex === i ? (
                  <>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                    {errors.phoneNumber && (
                      <span className={classes.error}>
                        {errors.phoneNumber}
                      </span>
                    )}
                  </>
                ) : (
                  <a>{data.phoneNumber}</a>
                )}
                <span>טלפון</span>
              </div>
              <img src={phone} alt="phone" className={classes.icon} />
            </div>
            <div className={classes.item}>
              <div className={classes.details}>
                {editingIndex === i ? (
                  <>
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <span className={classes.error}>{errors.email}</span>
                    )}
                  </>
                ) : (
                  <a>{data.email}</a>
                )}
                <span>מייל</span>
              </div>
              <img src={email} alt="Email" className={classes.icon} />
            </div>
            <div className={classes.item}>
              {" "}
              <div className={classes.details}>
                {" "}
                {editingIndex === i ? (
                  <>
                    {" "}
                    <input
                      type="text"
                      name="vat"
                      value={formData.vat}
                      onChange={handleChange}
                    />{" "}
                    {errors.vat && (
                      <span className={classes.error}>{errors.vat}</span>
                    )}{" "}
                  </>
                ) : (
                  <a>{data.vat}</a>
                )}{" "}
                <span>מע"ם</span>{" "}
              </div>{" "}
              <img src={vat} alt="vat" className={classes.icon} />{" "}
            </div>
            <div className={classes.item}>
              {editingIndex === i ? (
                <>
                  <img
                    src={save}
                    alt="save"
                    className={classes.icon}
                    onClick={handleSave}
                  />
                  <img
                    src={close}
                    alt="cancel"
                    className={classes.icon}
                    onClick={handleCancel}
                  />
                </>
              ) : (
                <img
                  src={edit}
                  alt="edit"
                  className={classes.icon}
                  onClick={() => handleEdit(i, data)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Factory;
