import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);

  const API = `${import.meta.env.VITE_API_URL}/api/products`;

  // GET PRODUCTS
  const fetchProducts = async () => {
    const res = await axios.get(API);
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD OR UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`${API}/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(API, form);
    }

    setForm({ name: "", price: "", description: "", image: "" });
    fetchProducts();
  };

  // DELETE
  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchProducts();
  };

  // EDIT
  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product._id);
  };

  return (
    <div className="admin">
      <h1>Admin Panel</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="admin-form">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />

        <button>
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* PRODUCT LIST */}
      <div className="admin-grid">
        {products.map((p) => (
          <div key={p._id} className="admin-card">
            <img src={p.image} alt="" />
            <h3>{p.name}</h3>
            <p>${p.price}</p>

            <div className="admin-actions">
              <button onClick={() => handleEdit(p)}>Edit</button>
              <button onClick={() => handleDelete(p._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}