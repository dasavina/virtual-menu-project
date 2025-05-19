import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import "./styles.css";

// Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBeZ5Zt0KVaee67rWMFqMoOLbTV7Rvk1Zo",
  authDomain: "restaurant-ea8e8.firebaseapp.com",
  databaseURL: "https://restaurant-ea8e8-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "restaurant-ea8e8",
  storageBucket: "restaurant-ea8e8.firebasestorage.app",
  messagingSenderId: "615424724015",
  appId: "1:615424724015:web:ba16efcbb59bf8ed1f4ada",
  measurementId: "G-ZZSK6XW14H"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Cart context
const CartContext = createContext();

const App = () => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
    alert(`${item.name} added to cart!`);
  };

  const removeFromCart = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      <Router>
        <div className="container">
          <header>
            <h1>Virtual Menu</h1>
            <nav>
              <Link to="/">Menu</Link>
              <Link to="/cart">Cart ({cartItems.length})</Link>
            </nav>
          </header>
          <div className="gap"></div>

          <Routes>
            <Route path="/" element={<CategoriesPage />} />
            <Route path="/category/:tag" element={<CategoryPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/payment" element={<PaymentPage />} />
          </Routes>

          <center>
            <div>
            <footer>
            <p>&copy; 2025 Virtual Restaurant</p>
          </footer>
          </div>
          </center>
          
        </div>
      </Router>
    </CartContext.Provider>
  );
};

// Categories page
const CategoriesPage = () => {
  const categories = [
    { name: "Pizza", tag: "pizza", image: "https://www.ezcater.com/wp-content/uploads/sites/2/2017/10/shutterstock_84904876.jpg" },
    { name: "Dessert", tag: "dessert", image: "https://www.lacademie.com/wp-content/uploads/2022/04/desserts-are-diverse-in-terms-of-types.jpg" },
    { name: "Drink", tag: "drink", image: "https://upload.wikimedia.org/wikipedia/commons/8/84/Ice_Milk_and_Lemon_Teas_-_Chilli_Cafe.jpg" },
    { name: "Salad", tag: "salad", image: "https://www.allrecipes.com/thmb/xPjN9EPyWjoB0Z6AUy0aJJ6lSyA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/pomegranate-spinach-salad-2000-f349c237fab7411398cd5b1abe9868cc.jpg" },
    { name: "Spaghetti", tag: "spaghetti", image: "https://cdn.britannica.com/60/236460-050-AFA6D24F/Cooked-Italian-spaghetti-being-put-in-the-pan-with-hot-Bolognese-sauce.jpg" },
    { name: "Special Offer", tag: "special-offer", image: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/especial-offer-restaurant-menu-flyer-poster-design-template-1f3298f83ea9db80c64a03da95b20684_screen.jpg?ts=1705653085" }
  ];

  return (
    <div className="grid">
      {categories.map((cat) => (
        <Link to={`/category/${cat.tag}`} key={cat.tag}>
          <div className="card">
            <img src={cat.image} alt={cat.name} />
            <h3>{cat.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

// Category items page
const CategoryPage = () => {
  const { tag } = useParams();
  const [items, setItems] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "menuItems"));
      const data = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().tag === `/tags/${tag}`) data.push(doc.data());
      });
      setItems(data);
    };
    fetchData();
  }, [tag]);

  return (
    <div>
      <h2 className="section-title">{tag.replace("-", " ").toUpperCase()}</h2>
      <div className="grid">
        {items.map((item, index) => (
          <div className="card" key={index}>
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>${item.price}</p>
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Cart page
const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const total = cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="section-title">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="grid">
            {cartItems.map((item, i) => (
              <div className="card" key={i}>
                <img src={item.image} alt={item.name} />
                <h3>{item.name}</h3>
                <p>${item.price}</p>
                <button onClick={() => removeFromCart(i)}>Remove</button>
              </div>
            ))}
          </div>
          <div className="total">
            <h3>Total: ${total}</h3>
            <button className="cartButton" onClick={() => navigate("/payment")}>Proceed to Payment</button>
            <button className="cartButton" onClick={clearCart}>Clear Cart</button>
          </div>
        </>
      )}
    </div>
  );
};

// Payment page
const PaymentPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const [form, setForm] = useState({ name: "", email: "", card: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const total = cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    let errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Valid email required.";
    if (!form.card.match(/^\d{16}$/)) errs.card = "16-digit card number required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert(`Payment of $${total} successful!`);
      clearCart();
      navigate("/");
    }
  };

  return (
    <div>
      <h2 className="section-title">Payment</h2>
      <form className="payment-form" onSubmit={handleSubmit}>
        <label>
          Name:
          <input name="name" value={form.name} onChange={handleChange} />
          {errors.name && <span className="error">{errors.name}</span>}
        </label>
        <label>
          Email:
          <input name="email" value={form.email} onChange={handleChange} />
          {errors.email && <span className="error">{errors.email}</span>}
        </label>
        <label>
          Card Number:
          <input name="card" value={form.card} onChange={handleChange} maxLength="16" />
          {errors.card && <span className="error">{errors.card}</span>}
        </label>
        <label>
          Total:
          <input value={`$${total}`} readOnly />
        </label>
        <button type="submit">Pay</button>
      </form>
    </div>
  );
};

export default App;
