import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function ReadBook() {
  const { id } = useParams();
  const { user, activateSubscription } = useContext(AuthContext);

  const [book, setBook] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  // ===============================
  // Check Ad Access
  // ===============================
  const hasAdAccess = user?.adUnlocks?.some(
    (unlock) =>
      unlock.book?.toString() === id &&
      new Date(unlock.expiresAt) > new Date()
  );

  // ===============================
  // Fetch Book Details
  // ===============================
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await API.get("/books");
        const found = data.find(
          (b) => b._id.toString() === id.toString()
        );
        setBook(found);
      } catch (error) {
        console.error("Book fetch error:", error);
      }
    };

    fetchBook();
  }, [id]);

  // ===============================
  // Unlock Book (LOCAL FUNCTION)
  // ===============================
  const unlockBook = async () => {
    try {
      await API.post(`/books/unlock/${id}`);
      window.location.reload(); // refresh to re-check access
    } catch (error) {
      console.error("Unlock failed:", error);
    }
  };

  // ===============================
  // Fetch PDF
  // ===============================
  useEffect(() => {
    const fetchPdf = async () => {
      try {
        setLoadingPdf(true);

        const response = await API.get(
          `/books/stream/${id}`,
          { responseType: "blob" }
        );

        const file = new Blob([response.data], {
          type: "application/pdf",
        });

        const fileURL = URL.createObjectURL(file);
        setPdfUrl(fileURL);

      } catch (error) {
        console.error("PDF load error", error);
      } finally {
        setLoadingPdf(false);
      }
    };

    if (user?.subscriptionActive || hasAdAccess) {
      fetchPdf();
    }

  }, [id, user, hasAdAccess]);

  if (!book)
    return <div className="p-10 text-white">Loading...</div>;

  // ===============================
  // LOCK SCREEN
  // ===============================
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

  // ===============================
  // PDF VIEW
  // ===============================
  return (
    <div className="bg-black min-h-screen text-white p-6">

      <h1 className="text-3xl text-neonPink mb-4 text-center">
        {book.title}
      </h1>

      <div className="flex justify-center py-8">
        <div
          className="relative w-full max-w-4xl bg-gray-900 shadow-2xl rounded-lg overflow-hidden"
          style={{ height: "90vh" }}
          onContextMenu={(e) => e.preventDefault()}
        >

          {loadingPdf && (
            <div className="flex items-center justify-center h-full">
              Loading PDF...
            </div>
          )}

          {pdfUrl && (
            <iframe
              src={`${pdfUrl}#toolbar=0&view=FitH`}
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title="PDF Viewer"
            />
          )}

          {/* Watermark */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-full h-full flex flex-wrap justify-center items-center opacity-10 text-white text-xl font-bold rotate-[-30deg] select-none">
              {Array.from({ length: 40 }).map((_, i) => (
                <span key={i} className="m-10 whitespace-nowrap">
                  {user?.email} • {new Date().toLocaleString()}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default ReadBook;