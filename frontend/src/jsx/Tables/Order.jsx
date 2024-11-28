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
    orderNumber: "",
    productId: "",
    profileType: "",
    supplierId: "",
    customersId: "",
    status: 1, // default to active
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [displayActiveOnly, setDisplayActiveOnly] = useState(1);
  const [message, setMessage] = useState({});
  const rowsPerPage = 6;
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/order");
        console.log("Fetched Orders:", response.data); // Log fetched data
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const handleEdit = (index, data) => {
    setEditingIndex(index); // Set the current row as editable
    setFormData({ ...data }); // Populate formData with the row's data
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setFormData({
      orderNumber: "",
      productId: "",
      profileType: "",
      supplierId: "",
      customersId: "",
      count: "",
      status: 1,
    });
    setErrors({});
  };

  const handleSave = async () => {
    try {
      const validationErrors = OrderValidation(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      if (editingIndex !== null && editingIndex < orders.length) {
        // Update existing order
        await axios.put(`/order/${formData.orderNumber}`, formData);
        const updatedOrders = [...orders];
        updatedOrders[editingIndex] = formData;
        setOrders(updatedOrders);
      } else {
        // Add new order
        const res = await axios.post("/createOrder", formData);
        setOrders([...orders, res.data]); // Add the new order to the state
      }

      handleCancel(); // Reset form and editing index after save
      setMessage({ msgClass: "success", text: "Order saved successfully!" });
      setTimeout(() => setMessage({}), 2000);
    } catch (err) {
      console.error("Error saving order:", err);
      setMessage({ msgClass: "error", text: "Failed to save order." });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleActivateOrder = async (order) => {
    try {
      const newStatus = order.status === 1 ? 0 : 1;
      const res = await axios.put(`/order/${order.orderNumber}`, {
        ...order,
        status: newStatus,
      });
      if (res.status === 200) {
        const updatedOrders = orders.map((item) =>
          item.orderNumber === order.orderNumber
            ? { ...item, status: newStatus }
            : item
        );
        setOrders(updatedOrders);
        setMessage({
          msgClass: "success",
          text: newStatus === 1 ? "Order activated!" : "Order deactivated!",
        });
        setTimeout(() => setMessage({}), 2000);
      } else {
        setMessage({
          msgClass: "error",
          text: "Failed to update order status",
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setMessage({ msgClass: "error", text: "Failed to update order status" });
    }
  };

  const handleChangeDisplay = (event) => {
    const option = event.target.value;
    setDisplayActiveOnly(
      option === "active" ? 1 : option === "inactive" ? 0 : null
    );
  };

  const filteredOrders = orders
    .filter((order) => {
      return order.orderNumber && order.orderNumber.toString().includes(search);
    })
    .filter((order) => {
      if (displayActiveOnly === null) return true;
      return displayActiveOnly ? order.status === 1 : order.status === 0;
    });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredOrders.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddOrder = () => {
    setEditingIndex(orders.length); // Set the editing index to a new row
    setFormData({
      orderNumber: "", // Initialize with empty or default values
      count: "",
      status: 1, // Default status as active
    });
  };

  return (
    <div className={classes.container}>
      <div className={classes.tablef}>
        <h2 className="w-100 d-flex justify-content-center p-3">הזמנות</h2>
        <div className={classes.controls}>
          <button className="btn btn-primary" onClick={handleAddOrder}>
            <img src={addIcon} alt="Add" className={classes.icon} /> הוספת הזמנה
          </button>
          <select onChange={handleChangeDisplay} className="form-select">
            <option value="active">פעיל</option>
            <option value="inactive">לא פעיל</option>
            <option value="">הכל</option>
          </select>
          <SearchBar searchVal={search} setSearchVal={setSearch} />
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
              <th>כמות</th>
              <th>מספר הזמנה</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((data, i) => (
              <tr key={`${data.orderNumber}-${i}`}>
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
                          onClick={() => handleActivateOrder(data)}
                        >
                          שנה סטטוס
                        </button>
                      ) : (
                        <button
                          className="btn btn-link p-0"
                          onClick={() => handleActivateOrder(data)}
                        >
                          שנה סטטוס
                        </button>
                      )}
                    </div>
                  )}
                </td>
                <td>{data.status === 1 ? "פעיל" : "לא פעיל"}</td>
                <td>
                  {editingIndex === i ? (
                    <input
                      type="number"
                      name="count"
                      value={formData.count || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  ) : (
                    data.count
                  )}
                </td>
                <td>
                  {editingIndex === i ? (
                    <input
                      type="text"
                      name="orderNumber"
                      value={formData.orderNumber || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  ) : (
                    data.orderNumber
                  )}
                </td>
              </tr>
            ))}
            {editingIndex === orders.length && (
              <tr key={`new-order-${orders.length}`}>
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
                    type="number"
                    name="status"
                    value={formData.status || ""}
                    onChange={handleChange}
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity || ""}
                    onChange={handleChange}
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="orderNumber"
                    value={formData.orderNumber || ""}
                    onChange={handleChange}
                    className="form-control"
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination justify-content-center">
          {Array.from(
            { length: Math.ceil(filteredOrders.length / rowsPerPage) },
            (_, index) => (
              <button
                key={`page-${index}`} // Ensure each button has a unique key
                className={index + 1 === currentPage ? classes.active : ""}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
