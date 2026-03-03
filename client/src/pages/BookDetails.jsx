import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await API.get("/books");
        const found = data.find((b) => b._id === id);
        setBook(found);
      } catch (error) {
        console.error("Failed to fetch book", error);
      }
    };

    fetchBook();
  }, [id]);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-3xl mx-auto bg-cyberCard p-8 rounded-xl shadow-neon">
        
        <h1 className="text-4xl text-neonPink mb-6">
          {book.title}
        </h1>

        <p className="text-gray-400 mb-8 leading-relaxed">
          {book.description}
        </p>

        <button
          onClick={() => navigate(`/read/${book._id}`)}
          className="bg-gradient-to-r from-neonPink to-neonBlue px-6 py-3 rounded font-bold hover:scale-105 transition duration-300"
        >
          ⚡ Read Now
        </button>

      </div>
    </div>
  );
}

export default BookDetails;