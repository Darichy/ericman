import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const TableToPrint = () => {
  const tableRef = useRef(null);

  return <table ref={tableRef}>{/* Your table content */}</table>;
};

const PrintButton = () => {
  const tableRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
  });

  return (
    <div>
      <button onClick={handlePrint}>Print Table</button>
    </div>
  );
};

const PrintPage = () => {
  return (
    <div>
      <TableToPrint />
      <PrintButton />
    </div>
  );
};

export default PrintPage;
