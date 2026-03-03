import { useState } from "react";
import API from "../services/api";

function UploadBook() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
  });

  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pdf) {
      alert("Please select a PDF file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("pdf", pdf);

      await API.post("/books/upload", formData);

      alert("Book uploaded successfully 🚀");

      setForm({ title: "", description: "", price: "" });
      setPdf(null);
    } catch (error) {
      alert(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-cyberCard p-8 rounded-xl shadow-neon w-full max-w-lg"
      >
        <h2 className="text-2xl text-neonPink mb-6">
          Upload New Book
        </h2>

        <input
          type="text"
          placeholder="Book Title"
          required
          value={form.title}
          className="w-full mb-4 p-2 rounded bg-black border border-neonBlue focus:outline-none focus:shadow-neon"
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          required
          value={form.description}
          className="w-full mb-4 p-2 rounded bg-black border border-neonBlue focus:outline-none focus:shadow-neon"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        ></textarea>

        <input
          type="number"
          placeholder="Price"
          required
          value={form.price}
          className="w-full mb-4 p-2 rounded bg-black border border-neonBlue focus:outline-none focus:shadow-neon"
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <input
          type="file"
          accept="application/pdf"
          required
          className="w-full mb-4 text-sm"
          onChange={(e) => setPdf(e.target.files[0])}
        />

        <button
          disabled={loading}
          className="w-full bg-gradient-to-r from-neonPink to-neonBlue p-2 rounded font-bold"
        >
          {loading ? "Uploading..." : "Publish Book"}
        </button>
      </form>
    </div>
  );
}

export default UploadBook;