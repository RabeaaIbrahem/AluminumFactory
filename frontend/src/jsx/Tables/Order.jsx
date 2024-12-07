import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../searchBar/SearchBar.jsx";
import editIcon from "../../img/icon/edit.png";
import saveIcon from "../../img/icon/save.png";
import closeIcon from "../../img/icon/close.png";
import addIcon from "../../img/icon/add.png";
import classes from "../../css/table.module.css";
import OrderValidation from "../../js/validations/OrderValidation";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    idOrder: "",
    supplierId: "",
    idQuotation: "",
    status: 1, // Initialize status
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [displayActiveOnly, setDisplayActiveOnly] = useState(1); // Initialize to show active orders
  const [message, setMessage] = useState({}); // Added for activation messages
  const rowsPerPage = 6;

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const res = await axios.get("/order");
        setOrders(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllOrders();
  }, []);

  const handleEdit = (index, data) => {
    setEditingIndex(index);
    setFormData({ ...data });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setFormData({
      date: "",
      idOrder: "",
      supplierId: "",
      idQuotation: "",
      status: 0,
    }); // Reset status to 0 on cancel
    setErrors({});
  };

  const handleSave = async () => {
    try {
      const validationErrors = OrderValidation(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      let updatedOrder;
      if (formData.idOrder && editingIndex !== orders.length) {
        await axios.put(`/order/${formData.idOrder}`, formData);
        const updatedOrders = [...orders];
        updatedOrders[editingIndex] = formData;
        setOrders(updatedOrders);
        updatedOrder = formData;
      } else {
        const res = await axios.post("/order", formData);
        setOrders([...orders, res.data]);
        updatedOrder = res.data;
        window.location.reload();
      }

      handleCancel();
    } catch (err) {
      console.error("Error saving order:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleActivateTable = async (table) => {
    try {
      const newStatus = table.status === 1 ? 0 : 1; // Toggle status between 0 and 1
      const res = await axios.put(`/order/${table.idOrder}`, {
        ...table,
        status: newStatus,
      });
      if (res.status === 200) {
        const updatedData = orders.map((item) =>
          item.idOrder === table.idOrder ? { ...item, status: newStatus } : item
        );
        setOrders(updatedData);
        setMessage({
          msgClass: "success",
          text:
            newStatus === 1
              ? "Order activated successfully!"
              : "Order deactivated successfully!",
        });
        setTimeout(() => {
          setMessage({});
        }, 2000);
      } else {
        setMessage({
          msgClass: "error",
          text: "Failed to update order status",
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setMessage({
        msgClass: "error",
        text: "Failed to update order status",
      });
    }
  };

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

  const filteredOrders = orders
    .filter((data) => data.idOrder.toString().includes(search))
    .filter((order) => {
      if (displayActiveOnly === null) return true;
      return displayActiveOnly ? order.status === 1 : order.status === 0;
    });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredOrders.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddOrder = () => {
    setEditingIndex(orders.length);
    setFormData({
      date: "",
      idOrder: "",
      supplierId: "",
      idQuotation: "",
      status: 1,
    });
  };

  return (
    <div className={classes.container}>
      <div className={classes.tablef}>
        <h2 className="w-100 d-flex justify-content-center p-3">הזמנה</h2>
        <div className={classes.controls}>
          <button className="btn btn-primary" onClick={handleAddOrder}>
            <img src={addIcon} alt="Add" className={classes.icon} /> הוספת הזמנה
          </button>
          <select onChange={handleChangeDisplay} className="form-select">
            <option value="active">פעילה</option>
            <option value="inactive">לא פעילה</option>
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
              <th>מק"ט הצעת מחיר</th>
              <th>מזהה ספק</th>
              <th>מספר הזמנה</th>
              <th>תאריך</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((data, i) => (
              <tr key={data.idOrder}>
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
                        {data.status === 1 ? "שנה סטטוס" : "שנה סטטוס"}
                      </button>
                    </div>
                  )}
                </td>
                <td>
                  {editingIndex === i ? (
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
                        name="idQuotation"
                        id="idQuotation"
                        value={formData.idQuotation}
                        onChange={handleChange}
                        placeholder="מספר הצעת מחיר"
                        className="form-control"
                      />
                      {errors.idQuotation && (
                        <div className="text-danger">{errors.idQuotation}</div>
                      )}
                    </>
                  ) : (
                    data.idQuotation
                  )}
                </td>
                <td>
                  {editingIndex === i ? (
                    <input
                      type="text"
                      name="supplierId"
                      id="supplierId"
                      value={formData.supplierId}
                      onChange={handleChange}
                      placeholder="מזהה ספק"
                      className="form-control"
                    />
                  ) : (
                    data.supplierId
                  )}
                </td>
                <td>
                  {editingIndex === i ? (
                    <input
                      type="text"
                      name="idOrder"
                      id="idOrder"
                      value={formData.idOrder}
                      onChange={handleChange}
                      placeholder="מספר הזמנה"
                      className="form-control"
                      disabled={formData.idOrder !== ""}
                    />
                  ) : (
                    data.idOrder
                  )}
                </td>
                <td>
                  {editingIndex === i ? (
                    <input
                      type="date"
                      name="date"
                      id="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="form-control"
                    />
                  ) : (
                    data.date
                  )}
                </td>
              </tr>
            ))}
            {editingIndex === orders.length && (
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
                  <input
                    type="text"
                    name="idQuotation"
                    value={formData.idQuotation}
                    onChange={handleChange}
                    placeholder="מספר הצעת מחיר"
                    className="form-control"
                  />
                  {errors.idQuotation && (
                    <div className="text-danger">{errors.idQuotation}</div>
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={handleChange}
                    placeholder="מזהה ספק"
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="idOrder"
                    value={formData.idOrder}
                    onChange={handleChange}
                    placeholder="מספר הזמנה"
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="form-control"
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination justify-content-center">
          {[...Array(Math.ceil(filteredOrders.length / rowsPerPage)).keys()].map(
            (number) => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className="page-link"
              >
                {number + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
