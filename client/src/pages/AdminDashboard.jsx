import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const fetchData = async () => {
    try {
      const statsRes = await API.get("/admin/stats");
      const usersRes = await API.get("/admin/users");
      const booksRes = await API.get("/admin/books");

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setBooks(booksRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("pdf", file);

    await API.post("/admin/upload", formData);

    setTitle("");
    setDescription("");
    setFile(null);

    fetchData();
  };

  const handleDeleteUser = async (id) => {
  try {
    await API.delete(`/admin/users/${id}`);
    fetchData();
  } catch (error) {
    console.error("Delete user error:", error);
  }
};

const handleDeleteBook = async (id) => {
  try {
    await API.delete(`/admin/books/${id}`);
    fetchData();
  } catch (error) {
    console.error("Delete book error:", error);
  }
};

  return (
    <div className="min-h-screen bg-black text-white p-8">

      <h1 className="text-4xl font-bold text-neonPink mb-10">
        👑 InkNova Admin Dashboard
      </h1>

      {/* ================= STATS ================= */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">

        <div className="bg-gray-900 p-6 rounded-xl shadow-neon">
          <p className="text-gray-400">Total Users</p>
          <h2 className="text-2xl text-neonBlue">
            {stats.totalUsers}
          </h2>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-neon">
          <p className="text-gray-400">Total Books</p>
          <h2 className="text-2xl text-neonPink">
            {stats.totalBooks}
          </h2>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-neon">
          <p className="text-gray-400">Subscribers</p>
          <h2 className="text-2xl text-green-400">
            {stats.subscribers}
          </h2>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-neon">
          <p className="text-gray-400">Free Users</p>
          <h2 className="text-2xl text-yellow-400">
            {stats.freeUsers}
          </h2>
        </div>

      </div>

      {/* ================= UPLOAD ================= */}
      <div className="bg-gray-900 p-8 rounded-xl shadow-neon mb-12">

        <h2 className="text-2xl text-neonPink mb-6">
          📤 Upload New Book
        </h2>

        <form onSubmit={handleUpload} className="space-y-4">

          <input
            type="text"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 bg-black border border-neonBlue rounded focus:outline-none focus:shadow-neon"
          />

          <textarea
            placeholder="Book Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-3 bg-black border border-neonBlue rounded focus:outline-none focus:shadow-neon"
          />

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="text-gray-400"
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-neonPink to-neonBlue px-6 py-3 rounded font-bold hover:scale-105 transition duration-300"
          >
            Upload Book
          </button>

        </form>
      </div>

      {/* ================= USERS ================= */}
      <div className="mb-12">

        <h2 className="text-2xl text-neonBlue mb-6">
          🧑‍💼 Users
        </h2>

        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-gray-900 p-4 rounded-xl flex justify-between items-center shadow-neon"
            >
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-gray-400 text-sm">
                  {user.email}
                </p>
                <p className="text-sm">
                  {user.role === "admin"
                    ? "👑 Admin"
                    : user.subscriptionActive
                    ? "⭐ Subscriber"
                    : "🆓 Free"}
                </p>
              </div>

              {user.role !== "admin" && (
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================= BOOKS ================= */}
      <div>

        <h2 className="text-2xl text-neonPink mb-6">
          📚 Books
        </h2>

        <div className="space-y-4">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-gray-900 p-4 rounded-xl flex justify-between items-center shadow-neon"
            >
              <div>
                <p className="font-semibold">{book.title}</p>
                <p className="text-gray-400 text-sm">
                  {book.description}
                </p>
              </div>

              <button
                onClick={() => handleDeleteBook(book._id)}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;