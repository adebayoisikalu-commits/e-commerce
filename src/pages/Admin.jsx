import { useState } from "react";
import axios from "axios";

export default function Admin() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products`,
        form
      );

      alert("Product added!");
      setForm({ name: "", price: "", description: "", image: "" });
    } catch (err) {
      alert("Error adding product");
    }
  };

  return (
    <div className="container">
      <h1>Admin - Add Product</h1>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Product name" onChange={handleChange} value={form.name} />
        <input name="price" placeholder="Price" onChange={handleChange} value={form.price} />
        <input name="image" placeholder="Image URL" onChange={handleChange} value={form.image} />
        <textarea name="description" placeholder="Description" onChange={handleChange} value={form.description} />

        <button>Add Product</button>
      </form>
    </div>
  );
}