import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const [books, setBooks] = useState([]);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await API.get("/books");
        setBooks(data);
      } catch (error) {
        console.error("Failed to fetch books");
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">

      {/* Top Section */}
      <div className="flex justify-between items-center mb-10">

        <h1 className="text-4xl text-neonPink">
          InkNova Library ⚡
        </h1>

      </div>

      {/* Books Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <div
            key={book._id}
            className="bg-gray-900 p-5 rounded-xl shadow-neon hover:scale-105 transition duration-300"
          >
            <h2 className="text-neonBlue text-lg mb-2">
              {book.title}
            </h2>

            <p className="text-gray-400 text-sm mb-4">
              {book.description.slice(0, 80)}...
            </p>

            <Link
              to={`/book/${book._id}`}
              className="bg-gradient-to-r from-neonPink to-neonBlue px-4 py-2 rounded font-bold inline-block"
            >
              View
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Home;