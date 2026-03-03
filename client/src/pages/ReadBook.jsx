import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function ReadBook() {
  const { id } = useParams();
  const { user, setUser, activateSubscription } = useContext(AuthContext);

  const [book, setBook] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const hasAdAccess = user?.adUnlocks?.some(
    (unlock) =>
      unlock.book?.toString() === id &&
      new Date(unlock.expiresAt) > new Date()
  );

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await API.get("/books");
        const found = data.find((b) => b._id === id);
        setBook(found);
      } catch (error) {
        console.error("Book fetch error:", error);
      }
    };

    fetchBook();
  }, [id]);

  const unlockBook = async () => {
  try {
    await API.post(`/books/unlock/${id}`);

    const { data } = await API.get("/auth/me");

    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);

  } catch (error) {
    console.error("Unlock failed:", error);
  }
};

  useEffect(() => {
    if (user?.subscriptionActive || hasAdAccess) {
      setLoadingPdf(true);
      setPdfUrl(
        `https://inknova-1-7j3i.onrender.com/api/books/stream/${id}`
      );
      setLoadingPdf(false);
    }
  }, [id, user, hasAdAccess]);

  if (!book)
    return <div className="p-10 text-white">Loading...</div>;

  if (!user?.subscriptionActive && !hasAdAccess) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl text-neonPink mb-4">
          🔒 Locked Content
        </h1>

        <button
          onClick={unlockBook}
          className="bg-gradient-to-r from-neonPink to-neonBlue px-6 py-3 rounded font-bold mb-4"
        >
          🎬 Watch Ad
        </button>

        <button
          onClick={activateSubscription}
          className="border border-neonPink px-6 py-3 rounded"
        >
          💳 Subscribe
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h1 className="text-3xl text-neonPink mb-4 text-center">
        {book.title}
      </h1>

      <div className="flex justify-center py-8">
        <div
          className="relative w-full max-w-4xl bg-gray-900 shadow-2xl rounded-lg overflow-hidden"
          style={{ height: "90vh" }}
        >
          {loadingPdf && (
            <div className="flex items-center justify-center h-full">
              Loading PDF...
            </div>
          )}

          {pdfUrl && (
            <>
              <iframe
                src={pdfUrl}
                width="100%"
                height="100%"
                style={{ border: "none" }}
                title="PDF Viewer"
              />

              {/* Mobile fallback */}
              <div className="block md:hidden text-center mt-4">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neonPink underline"
                >
                  Open PDF in new tab
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReadBook;