import { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PageFlipBook({ file }) {
  const [numPages, setNumPages] = useState(null);
  const bookRef = useRef();

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="flex flex-col items-center">
      <HTMLFlipBook
        width={400}
        height={600}
        showCover={true}
        className="shadow-2xl"
        ref={bookRef}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <div key={index} className="bg-white flex justify-center items-center">
            <Document file={file} onLoadSuccess={onLoadSuccess}>
              <Page pageNumber={index + 1} width={380} />
            </Document>
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
}

export default PageFlipBook;