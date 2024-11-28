import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfileComponent from "./Profile/ProfileComponent";
import GlassComponent from "./GlassComponent";
import ShutterComponent from "./ShutterComponent";
import Validation from "../../js/validations/ProductValidation";
import styles from "./bidData.module.css"; 
import Door from "./DoorComponent";
import Window from "./WindowComponent";
// Product component manages the addition or update of a product, including its details like profile, glass, shutters, etc.
function Product({
  currentProduct,
  setCurrentProduct,
  setProducts,
  totalPrice,
  setTotalPrice,
  products,
}) {
  const [errors, setErrors] = useState({}); // To store validation errors
  const [successMessage, setSuccessMessage] = useState("");
  const [profile, setProfile] = useState({
    id: currentProduct.profileType || "", // Initial profile details from currentProduct
    perimeter: "",
    weight: "",
    price: "",
    priceShutters: "",
  });
  const [window, setWindow] = useState({
    windowId: currentProduct.idWindow || "", // Initial window details from currentProduct
    windowType: "",
  });
  const [door, setDoor] = useState({
    doorId: currentProduct.idDoor || "", // Initial door details from currentProduct
    doorType: "",
  });
  const [glass, setGlass] = useState({
    glassType: currentProduct.glassType || "", // Initial glass details from currentProduct
    Thickness: "",
    status: 1,
  });
  const [shutter, setShutter] = useState({
    shutterId: "", // Initial shutter details
    shutterType: "",
    status: 1,
  });
  // Recalculate price when height, width, or shutter/profile types change
  useEffect(() => {
    if (currentProduct.height && currentProduct.width) {
      const recalculatedPrice = calculateTotalPrice();
      setCurrentProduct((prevProduct) => ({
        ...prevProduct,
        pricePerUnit:
          recalculatedPrice !== "0.00"
            ? recalculatedPrice
            : prevProduct.pricePerUnit,
      }));
    }
  }, [
    currentProduct.height,
    currentProduct.width,
    currentProduct.shutterType,
    profile.id,
  ]);
  // Fetch profile, window, door, glass, and shutter data based on the current product's properties
  useEffect(() => {
    const fetchProfile = async () => {
      if (currentProduct.profileType !== "") {
        try {
          const response = await axios.get(
            `/profile/${currentProduct.profileType}`
          );
          setProfile({ ...response.data, id: currentProduct.profileType });
          console.log(response.data);
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      }
      if (currentProduct.idWindow !== 0) {
        try {
          const response = await axios.get(
            `/windows/${currentProduct.idWindow}`
          );
          setWindow({ ...response.data, windowId: currentProduct.idWindow });
          console.log(response.data);
        } catch (err) {
          console.error("Error fetching window:", err);
        }
      }
      if (currentProduct.idDoor !== 0) {
        try {
          const response = await axios.get(`/doors/${currentProduct.idDoor}`);
          setDoor({ ...response.data, doorId: currentProduct.idDoor });
          console.log(response.data);
        } catch (err) {
          console.error("Error fetching Door:", err);
        }
      }
      if (currentProduct.glassType !== 0) {
        try {
          setGlass({ ...glass, glassType: currentProduct.glassType });
        } catch (err) {
          console.error("Error fetching glass:", err);
        }
      }
      if (currentProduct.shutterType !== 0) {
        try {
          setShutter({ ...shutter, shutterType: currentProduct.shutterType });
        } catch (err) {
          console.error("Error fetching shutter:", err);
        }
      }
    };

    fetchProfile();
  }, [
    currentProduct.profileType,
    currentProduct.idWindow,
    currentProduct.idDoor,
    currentProduct.glassType,
    currentProduct.shutterType,
  ]);
  // Function to validate product details before submission
  const validateProduct = () => {
    const validationErrors = Validation(currentProduct);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }
    return true;
  };
  // Function to calculate the total price of the product based on its dimensions and profile prices
  const calculateTotalPrice = () => {
    const basePrice = profile.price ? parseFloat(profile.price) : 0;
    const shutterPrice = profile.priceShutters
      ? parseFloat(profile.priceShutters)
      : 0;
    const height = currentProduct.height || 0;
    const width = currentProduct.width || 0;

    const productTotalPrice =
      (basePrice + (currentProduct.shutterType ? shutterPrice : 0)) *
      (height / 100) *
      (width / 100);
    return productTotalPrice > 0 ? productTotalPrice.toFixed(2) : "0.00";
  };
  // Function to add a new product to the product list
  const addProduct = () => {
    if (!validateProduct()) {
      return;
    }

    const productTotalPrice =
      currentProduct.quantity * currentProduct.pricePerUnit;

    axios
      .post("/createProduct", currentProduct)
      .then((response) => {
        const newProduct = {
          ...currentProduct,
          idProduct: response.data.productId,
          totalPrice: productTotalPrice,
        };

        setProducts([...products, newProduct]);
        setTotalPrice(totalPrice + productTotalPrice);
        setSuccessMessage("המוצר נוספה בהצלחה");
        setErrors({});

        resetProductState();
      })
      .catch((error) => {
        setErrors({ addProduct: "נכשל בהוספת מוצר. אנא נסה שוב." });
      });
  };
  // Function to update an existing product in the product list
  const updateProduct = () => {
    const productTotalPrice =
      currentProduct.quantity * currentProduct.pricePerUnit;

    axios
      .put(`/updateProduct/${currentProduct.idProduct}`, currentProduct)
      .then(() => {
        const updatedProducts = products.map((product) =>
          product.idProduct === currentProduct.idProduct
            ? { ...currentProduct, totalPrice: productTotalPrice }
            : product
        );

        setProducts(updatedProducts);
        setTotalPrice(
          totalPrice -
            products.find((p) => p.idProduct === currentProduct.idProduct)
              .totalPrice +
            productTotalPrice
        );

        setSuccessMessage("המוצר עודכן בהצלחה");
        setErrors({});
        resetProductState();
      })
      .catch(() => {
        setErrors({ updateProduct: "נכשל בעדכון מוצר. אנא נסה שוב." });
      });
  };
  // Function to reset the product state and form fields
  const resetProductState = () => {
    setCurrentProduct({
      height: "",
      width: "",
      quantity: 1,
      pricePerUnit: "",
      profileType: "",
      shutterType: "",
      glassType: "",
      description: "",
      idDoor: "",
      idWindow: "",
    });
    setProfile({
      id: "",
      perimeter: "",
      weight: "",
      price: "",
      priceShutters: "",
    });
    setWindow({
      windowId: "",
      windowType: "",
    });
    setDoor({
      doorId: "",
      doorType: "",
    });
    setGlass({
      glassId: "",
      glassType: "",
      status: 1,
    });
    setShutter({
      shutterId: "",
      shutterType: "",
      status: 1,
    });
  };

  return (
    <div>
      <h2>הוספת/עדכון מוצר</h2>
      {/* Dropdown for selecting product description */}
      <label htmlFor="description" style={{ fontWeight: "bolder" }}>
        תיאור פריט
      </label>
      <br />
      <div className={styles.inputField}>
        <select
          id="description"
          value={currentProduct.description}
          onChange={(e) => {
            setCurrentProduct({
              ...currentProduct,
              description: e.target.value,
            });
            setErrors({ ...errors, description: undefined });
          }}
        >
          <option value="">בחר תיאור פריט</option>
          <option value="דלת">דלת</option>
          <option value="חלון">חלון</option>
        </select>
        {/* Conditional rendering for window and door components */}
        {currentProduct.description === "חלון" && (
          <Window
            window={window}
            setWindow={(newWindow) => {
              setWindow(newWindow);
              setCurrentProduct((prevProduct) => ({
                ...prevProduct,
                idWindow: newWindow.windowId,
                windowType: newWindow.windowType,
              }));
              setErrors({ ...errors, windowType: undefined });
            }}
          />
        )}
        {currentProduct.description === "דלת" && (
          <Door
            door={door}
            setDoor={(newDoor) => {
              setDoor(newDoor);
              setCurrentProduct((prevProduct) => ({
                ...prevProduct,
                idDoor: newDoor.doorId,
                doorType: newDoor.doorType,
              }));
              setErrors({ ...errors, doorType: undefined });
            }}
          />
        )}
        {errors.description && (
          <p style={{ color: "red" }}>{errors.description}</p>
        )}
      </div>
      {/* Profile component for managing product profile */}
      <ProfileComponent
        profile={profile}
        setProfile={(newProfile) => {
          setProfile(newProfile);
          setCurrentProduct((prevProduct) => ({
            ...prevProduct,
            profileType: newProfile.id,
          }));
          setErrors({ ...errors, profileType: undefined });
        }}
      />
      {errors.profileType && (
        <p style={{ color: "red" }}>{errors.profileType}</p>
      )}
      {/* Glass component for managing glass details */}
      <GlassComponent
        glass={glass}
        setGlass={(newGlass) => {
          setGlass(newGlass);
          setCurrentProduct((prevProduct) => ({
            ...prevProduct,
            glassType: newGlass.glassType,
          }));
          setErrors({ ...errors, glassType: undefined });
        }}
      />
      {errors.glassType && <p style={{ color: "red" }}>{errors.glassType}</p>}
      {/* Shutter component for managing shutter details */}
      <ShutterComponent
        shutter={shutter}
        setShutter={(newGlass) => {
          setShutter(newGlass);
          setCurrentProduct((prevProduct) => ({
            ...prevProduct,
            shutterType: newGlass.shutterType,
          }));
          setErrors({ ...errors, shutterType: undefined });
        }}
      />
      {/* Input fields for height, width, quantity, and price */}
      <label htmlFor="height" style={{ fontWeight: "bolder" }}>
        גובה
      </label>
      <input
        type="number"
        id="height"
        placeholder="גובה"
        value={currentProduct.height}
        onChange={(e) => {
          const value = Number(e.target.value);
          setCurrentProduct({ ...currentProduct, height: value });
          setErrors({ ...errors, height: undefined });
        }}
        min={100}
        max={750}
      />
      {errors.height && <p style={{ color: "red" }}>{errors.height}</p>}
      <label htmlFor="width" style={{ fontWeight: "bolder" }}>
        רוחב
      </label>
      <input
        type="number"
        id="width"
        placeholder="רוחב"
        value={currentProduct.width}
        onChange={(e) => {
          const value = Number(e.target.value);
          setCurrentProduct({ ...currentProduct, width: value });
          setErrors({ ...errors, width: undefined });
        }}
        min={100}
        max={750}
      />
      {errors.width && <p style={{ color: "red" }}>{errors.width}</p>}
      <label htmlFor="quantity" style={{ fontWeight: "bolder" }}>
        כמות
      </label>
      <input
        type="number"
        id="quantity"
        placeholder="כמות"
        value={currentProduct.quantity}
        onChange={(e) => {
          const quantity = e.target.value;
          setCurrentProduct({ ...currentProduct, quantity });
          setErrors({ ...errors, quantity: undefined });
        }}
      />
      {errors.quantity && <p style={{ color: "red" }}>{errors.quantity}</p>}

      <label htmlFor="pricePerUnit" style={{ fontWeight: "bolder" }}>
        מחיר ליחידה
      </label>
      <input
        type="number"
        id="pricePerUnit"
        placeholder="מחיר ליחידה"
        value={currentProduct.pricePerUnit || calculateTotalPrice()}
        onChange={(e) => {
          setCurrentProduct({
            ...currentProduct,
            pricePerUnit: e.target.value,
          });
        }}
      />
      {errors.pricePerUnit && (
        <p style={{ color: "red" }}>{errors.pricePerUnit}</p>
      )}
      {/* Button to either update or add a product */}
      <button
        className={styles.button}
        onClick={currentProduct.idProduct ? updateProduct : addProduct}
      >
        {currentProduct.idProduct ? "עדכון מוצר" : "הוספת מוצר"}
      </button>
      {/* Display errors or success messages */}
      {errors.addProduct && <p style={{ color: "red" }}>{errors.addProduct}</p>}
      {errors.updateProduct && (
        <p style={{ color: "red" }}>{errors.updateProduct}</p>
      )}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <h2>סכום כולל: {totalPrice.toFixed(2)}</h2>
    </div>
  );
}

export default Product;
