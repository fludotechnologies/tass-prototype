import { HashRouter, Routes, Route } from "react-router-dom";
import CreateInvoice from "./pages/CreateInvoice";
import InvoicePreview from "./pages/InvoicePreview";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<CreateInvoice />} />
        <Route path="/preview" element={<InvoicePreview />} />
      </Routes>
    </HashRouter>
  );
}
