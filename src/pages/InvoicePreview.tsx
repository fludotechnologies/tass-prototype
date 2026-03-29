import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  vehicles,
  drivers,
  companyInfo,
  defaultFormData,
  calculateInvoice,
  numberToWords,
  formatDate,
  type InvoiceFormData,
} from "../data/mockData";

export default function InvoicePreview() {
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<InvoiceFormData>(defaultFormData);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("invoiceData");
    if (stored) {
      try {
        setForm(JSON.parse(stored));
      } catch {
        // use defaults
      }
    }
  }, []);

  const vehicle = vehicles.find((v) => v.id === form.vehicleId);
  const driver = drivers.find((d) => d.id === form.driverId);
  const calc = calculateInvoice(form);

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setGenerating(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: 0,
        filename: `${form.invoiceNo || "Invoice"}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: {
          unit: "mm" as const,
          format: "a4",
          orientation: "portrait" as const,
        },
        pagebreak: { mode: ["css", "legacy"] },
      };
      await html2pdf().set(opt).from(printRef.current).save();
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Toolbar - hidden on print */}
      <div className="print:hidden bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[220mm] mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg
              className="w-5 h-5 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-slate-800 flex-1">
            Invoice Preview
          </h1>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={generating}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-200 hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-60"
          >
            {generating ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Invoice Pages Container */}
      <div ref={printRef} className="print:m-0">
        {/* ========== PAGE 1: BILLING DETAILS ========== */}
        <div
          className="invoice-page bg-white"
          style={{
            width: "210mm",
            minHeight: "297mm",
            padding: "12mm 15mm",
            margin: "0 auto",
            boxSizing: "border-box",
            fontFamily: "'Segoe UI', Arial, sans-serif",
            color: "#1a1a1a",
            fontSize: "11px",
            lineHeight: "1.4",
          }}
        >
          {/* Company Header */}
          <div
            style={{
              textAlign: "center",
              borderBottom: "3px double #1a1a1a",
              paddingBottom: "8px",
              marginBottom: "8px",
            }}
          >
            <h1
              style={{
                fontSize: "24px",
                fontWeight: 800,
                letterSpacing: "2px",
                margin: "0 0 2px 0",
                color: "#1a1a1a",
              }}
            >
              {companyInfo.name}
            </h1>
            <p style={{ fontSize: "10px", margin: "1px 0", color: "#555" }}>
              {companyInfo.address}
            </p>
            <p style={{ fontSize: "10px", margin: "1px 0", color: "#555" }}>
              Phone: {companyInfo.phone} &nbsp;|&nbsp; Email:{" "}
              {companyInfo.email}
            </p>
            <p style={{ fontSize: "10px", margin: "1px 0", color: "#555" }}>
              GSTIN: {companyInfo.gst}
            </p>
          </div>

          {/* Title Banner */}
          <div
            style={{
              textAlign: "center",
              background: "#1a1a1a",
              color: "#fff",
              padding: "6px 0",
              marginBottom: "8px",
              letterSpacing: "4px",
              fontSize: "14px",
              fontWeight: 800,
            }}
          >
            TAX INVOICE
          </div>

          {/* Invoice No & Date */}
          <table
            style={{ width: "100%", marginBottom: "6px", fontSize: "11px" }}
          >
            <tbody>
              <tr>
                <td style={{ fontWeight: 700 }}>
                  Invoice No:{" "}
                  <span style={{ color: "#4338ca" }}>{form.invoiceNo}</span>
                </td>
                <td style={{ textAlign: "right", fontWeight: 700 }}>
                  Date: {formatDate(form.invoiceDate)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Bill To */}
          <table
            className="inv-tbl"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "8px",
            }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "6px 8px",
                    width: "50%",
                    verticalAlign: "top",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "10px",
                      textTransform: "uppercase",
                      color: "#888",
                      marginBottom: "4px",
                    }}
                  >
                    Bill To
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "12px" }}>
                    {form.customerName}
                  </div>
                  <div>{form.customerAddress}</div>
                </td>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "6px 8px",
                    verticalAlign: "top",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "10px",
                      textTransform: "uppercase",
                      color: "#888",
                      marginBottom: "4px",
                    }}
                  >
                    Customer Info
                  </div>
                  <div>
                    <strong>GSTIN:</strong> {form.customerGstin}
                  </div>
                  <div>
                    <strong>State:</strong> {form.customerState}
                  </div>
                  <div>
                    <strong>Mobile:</strong> {form.customerMobile}
                  </div>
                  <div>
                    <strong>Contact:</strong> {form.bookingPerson}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Vehicle & Driver */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "8px",
            }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "5px 8px",
                    width: "50%",
                  }}
                >
                  <strong>Vehicle:</strong> {vehicle?.number || "N/A"} &nbsp;(
                  {vehicle?.type || "N/A"})
                </td>
                <td style={{ border: "1px solid #333", padding: "5px 8px" }}>
                  <strong>Driver:</strong> {driver?.name || "N/A"} &nbsp;|&nbsp;{" "}
                  <strong>Mob:</strong> {driver?.phone || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Date & KM Summary */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "10px",
            }}
          >
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                <th
                  style={{
                    border: "1px solid #333",
                    padding: "5px 8px",
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  Start Date
                </th>
                <th
                  style={{
                    border: "1px solid #333",
                    padding: "5px 8px",
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  End Date
                </th>
                <th
                  style={{
                    border: "1px solid #333",
                    padding: "5px 8px",
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  Days
                </th>
                <th
                  style={{
                    border: "1px solid #333",
                    padding: "5px 8px",
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  Start KM
                </th>
                <th
                  style={{
                    border: "1px solid #333",
                    padding: "5px 8px",
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  Close KM
                </th>
                <th
                  style={{
                    border: "1px solid #333",
                    padding: "5px 8px",
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  Total KM
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ textAlign: "center" }}>
                <td style={{ border: "1px solid #333", padding: "5px 8px" }}>
                  {formatDate(form.startDate)}
                </td>
                <td style={{ border: "1px solid #333", padding: "5px 8px" }}>
                  {formatDate(form.endDate)}
                </td>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "5px 8px",
                    fontWeight: 700,
                  }}
                >
                  {calc.totalDays}
                </td>
                <td style={{ border: "1px solid #333", padding: "5px 8px" }}>
                  {form.startKm.toLocaleString()}
                </td>
                <td style={{ border: "1px solid #333", padding: "5px 8px" }}>
                  {form.closeKm.toLocaleString()}
                </td>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "5px 8px",
                    fontWeight: 700,
                  }}
                >
                  {calc.totalKm.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Billing Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "10px",
            }}
          >
            <thead>
              <tr style={{ background: "#1a1a1a", color: "#fff" }}>
                <th
                  style={{
                    border: "1px solid #333",
                    padding: "6px 8px",
                    textAlign: "left",
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  Sr.
                </th>
                <th
                  style={{
                    border: "1px solid #333",
                    padding: "6px 8px",
                    textAlign: "left",
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  Description
                </th>
                <th
                  style={{
                    border: "1px solid #333",
                    padding: "6px 8px",
                    textAlign: "center",
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    border: "1px solid #333",
                    padding: "6px 8px",
                    textAlign: "right",
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  Rate (₹)
                </th>
                <th
                  style={{
                    border: "1px solid #333",
                    padding: "6px 8px",
                    textAlign: "right",
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  Amount (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              <BillingRow
                sr={1}
                desc={`Vehicle Hire Charges (${vehicle?.type || "N/A"}) — ${calc.totalDays} Day(s)`}
                qty={calc.totalDays}
                rate={form.perDayCharge}
                amount={calc.baseCost}
              />
              <BillingRow
                sr={2}
                desc={`Extra KM Charges (Total: ${calc.totalKm} km, Included: ${calc.totalIncludedKm} km, Extra: ${calc.extraKm} km)`}
                qty={calc.extraKm}
                rate={form.extraKmCharge}
                amount={calc.extraKmCost}
              />
              {calc.extraHours > 0 && (
                <BillingRow
                  sr={3}
                  desc={`Extra Hour Charges (${calc.extraHours} hr)`}
                  qty={calc.extraHours}
                  rate={form.extraHourCharge}
                  amount={calc.extraHourCost}
                />
              )}
              <BillingRow
                sr={4}
                desc="Toll / Parking Charges"
                qty={1}
                rate={form.toll}
                amount={form.toll}
              />
              <BillingRow
                sr={5}
                desc={`Driver Bata / Allowance (${calc.totalDays} Day(s))`}
                qty={calc.totalDays}
                rate={form.bataPerDay}
                amount={calc.bataTotal}
              />

              {/* Grand Total */}
              <tr
                style={{
                  background: "#1a1a1a",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "13px",
                }}
              >
                <td
                  colSpan={4}
                  style={{
                    border: "1px solid #333",
                    padding: "8px",
                    textAlign: "right",
                  }}
                >
                  GRAND TOTAL
                </td>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "8px",
                    textAlign: "right",
                  }}
                >
                  ₹{calc.grandTotal.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Amount in Words */}
          <div
            style={{
              border: "2px solid #1a1a1a",
              padding: "6px 10px",
              marginBottom: "10px",
              fontSize: "11px",
            }}
          >
            <strong>Amount in Words:</strong>{" "}
            <em>{numberToWords(calc.grandTotal)} Rupees Only</em>
          </div>

          {/* Bank Details */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "10px",
            }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "6px 8px",
                    width: "50%",
                    verticalAlign: "top",
                    fontSize: "10px",
                  }}
                >
                  <div style={{ fontWeight: 800, marginBottom: "3px" }}>
                    Bank Details
                  </div>
                  <div>Bank: State Bank of India</div>
                  <div>A/C No: 38274619283</div>
                  <div>IFSC: SBIN0001234</div>
                  <div>Branch: MG Road, Pune</div>
                </td>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "6px 8px",
                    verticalAlign: "top",
                    fontSize: "10px",
                  }}
                >
                  <div style={{ fontWeight: 800, marginBottom: "3px" }}>
                    Terms & Conditions
                  </div>
                  <div>1. Payment due within 15 days of invoice date.</div>
                  <div>2. Interest @ 18% p.a. on delayed payments.</div>
                  <div>3. Subject to Pune jurisdiction.</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Signatures */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "40px",
              paddingTop: "0",
            }}
          >
            <div style={{ textAlign: "center", width: "40%" }}>
              <div
                style={{
                  borderTop: "1px solid #1a1a1a",
                  paddingTop: "6px",
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                Customer Signature
              </div>
            </div>
            <div style={{ textAlign: "center", width: "40%" }}>
              <div
                style={{
                  borderTop: "1px solid #1a1a1a",
                  paddingTop: "6px",
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                For {companyInfo.name}
              </div>
              <div style={{ fontSize: "9px", color: "#888" }}>
                (Authorised Signatory)
              </div>
            </div>
          </div>
        </div>

        {/* ========== PAGE 2: TRIP DETAILS ========== */}
        <div
          className="invoice-page bg-white html2pdf__page-break"
          style={{
            width: "210mm",
            minHeight: "297mm",
            padding: "12mm 15mm",
            margin: "0 auto",
            boxSizing: "border-box",
            fontFamily: "'Segoe UI', Arial, sans-serif",
            color: "#1a1a1a",
            fontSize: "11px",
            lineHeight: "1.4",
            pageBreakBefore: "always",
          }}
        >
          {/* Company Header (repeated) */}
          <div
            style={{
              textAlign: "center",
              borderBottom: "3px double #1a1a1a",
              paddingBottom: "8px",
              marginBottom: "8px",
            }}
          >
            <h1
              style={{
                fontSize: "24px",
                fontWeight: 800,
                letterSpacing: "2px",
                margin: "0 0 2px 0",
              }}
            >
              {companyInfo.name}
            </h1>
            <p style={{ fontSize: "10px", margin: "1px 0", color: "#555" }}>
              {companyInfo.address}
            </p>
            <p style={{ fontSize: "10px", margin: "1px 0", color: "#555" }}>
              GSTIN: {companyInfo.gst}
            </p>
          </div>

          {/* Title */}
          <div
            style={{
              textAlign: "center",
              background: "#1a1a1a",
              color: "#fff",
              padding: "6px 0",
              marginBottom: "10px",
              letterSpacing: "4px",
              fontSize: "14px",
              fontWeight: 800,
            }}
          >
            TRIP DETAILS &amp; DISPATCH SHEET
          </div>

          {/* Reference */}
          <table
            style={{ width: "100%", marginBottom: "8px", fontSize: "11px" }}
          >
            <tbody>
              <tr>
                <td style={{ fontWeight: 700 }}>
                  Ref. Invoice No:{" "}
                  <span style={{ color: "#4338ca" }}>{form.invoiceNo}</span>
                </td>
                <td style={{ textAlign: "right", fontWeight: 700 }}>
                  Date: {formatDate(form.invoiceDate)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Customer Info Box */}
          <div
            style={{
              border: "2px solid #1a1a1a",
              padding: "10px 12px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: "12px",
                marginBottom: "6px",
                textDecoration: "underline",
              }}
            >
              CUSTOMER INFORMATION
            </div>
            <table style={{ width: "100%", fontSize: "11px" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "2px 0", width: "50%" }}>
                    <strong>Name:</strong> {form.customerName}
                  </td>
                  <td style={{ padding: "2px 0" }}>
                    <strong>Mobile:</strong> {form.customerMobile}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "2px 0" }}>
                    <strong>Address:</strong> {form.customerAddress}
                  </td>
                  <td style={{ padding: "2px 0" }}>
                    <strong>GSTIN:</strong> {form.customerGstin}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "2px 0" }}>
                    <strong>Booking Person:</strong> {form.bookingPerson}
                  </td>
                  <td style={{ padding: "2px 0" }}>
                    <strong>State:</strong> {form.customerState}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Vehicle & Driver Details */}
          <div
            style={{
              border: "2px solid #1a1a1a",
              padding: "10px 12px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: "12px",
                marginBottom: "6px",
                textDecoration: "underline",
              }}
            >
              VEHICLE &amp; DRIVER DETAILS
            </div>
            <table style={{ width: "100%", fontSize: "11px" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "2px 0", width: "50%" }}>
                    <strong>Vehicle No:</strong> {vehicle?.number || "N/A"}
                  </td>
                  <td style={{ padding: "2px 0" }}>
                    <strong>Vehicle Type:</strong> {vehicle?.type || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "2px 0" }}>
                    <strong>Driver Name:</strong> {driver?.name || "N/A"}
                  </td>
                  <td style={{ padding: "2px 0" }}>
                    <strong>Driver Mobile:</strong> {driver?.phone || "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Trip Schedule */}
          <div
            style={{
              border: "2px solid #1a1a1a",
              padding: "10px 12px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: "12px",
                marginBottom: "6px",
                textDecoration: "underline",
              }}
            >
              TRIP SCHEDULE
            </div>
            <table style={{ width: "100%", fontSize: "11px" }}>
              <tbody>
                <tr>
                  <td>
                    <strong>Start:</strong> {formatDate(form.startDate)}{" "}
                    {form.startTime}
                  </td>
                  <td>
                    <strong>End:</strong> {formatDate(form.endDate)}{" "}
                    {form.endTime}
                  </td>
                  <td>
                    <strong>Total Days:</strong> {calc.totalDays}
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>Total Hours:</strong> {calc.totalHours.toFixed(1)}{" "}
                    hrs
                  </td>
                  <td colSpan={2}>
                    <strong>Reporting Place:</strong> {form.reportingPlace}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Trip Description */}
          <div
            style={{
              border: "2px solid #1a1a1a",
              padding: "10px 12px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: "12px",
                marginBottom: "6px",
                textDecoration: "underline",
              }}
            >
              TRIP DESCRIPTION / ITINERARY
            </div>
            <p style={{ fontSize: "11px", lineHeight: "1.6", margin: 0 }}>
              {form.tripDescription}
            </p>
          </div>

          {/* KM Details */}
          <div
            style={{
              border: "2px solid #1a1a1a",
              padding: "10px 12px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: "12px",
                marginBottom: "6px",
                textDecoration: "underline",
              }}
            >
              DISTANCE LOG
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "11px",
              }}
            >
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  <th style={{ border: "1px solid #555", padding: "5px 8px" }}>
                    Starting KM
                  </th>
                  <th style={{ border: "1px solid #555", padding: "5px 8px" }}>
                    Closing KM
                  </th>
                  <th style={{ border: "1px solid #555", padding: "5px 8px" }}>
                    Total KM
                  </th>
                  <th style={{ border: "1px solid #555", padding: "5px 8px" }}>
                    Included KM
                  </th>
                  <th style={{ border: "1px solid #555", padding: "5px 8px" }}>
                    Extra KM
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ textAlign: "center" }}>
                  <td style={{ border: "1px solid #555", padding: "5px 8px" }}>
                    {form.startKm.toLocaleString()}
                  </td>
                  <td style={{ border: "1px solid #555", padding: "5px 8px" }}>
                    {form.closeKm.toLocaleString()}
                  </td>
                  <td
                    style={{
                      border: "1px solid #555",
                      padding: "5px 8px",
                      fontWeight: 700,
                    }}
                  >
                    {calc.totalKm.toLocaleString()}
                  </td>
                  <td style={{ border: "1px solid #555", padding: "5px 8px" }}>
                    {calc.totalIncludedKm}
                  </td>
                  <td
                    style={{
                      border: "1px solid #555",
                      padding: "5px 8px",
                      fontWeight: 700,
                      color: calc.extraKm > 0 ? "#dc2626" : "#333",
                    }}
                  >
                    {calc.extraKm}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Agreement / Rate Card */}
          <div
            style={{
              border: "2px solid #1a1a1a",
              padding: "10px 12px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: "12px",
                marginBottom: "6px",
                textDecoration: "underline",
              }}
            >
              RATE AGREEMENT
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "11px",
              }}
            >
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  <th
                    style={{
                      border: "1px solid #555",
                      padding: "5px 8px",
                      textAlign: "left",
                    }}
                  >
                    Particular
                  </th>
                  <th
                    style={{
                      border: "1px solid #555",
                      padding: "5px 8px",
                      textAlign: "right",
                    }}
                  >
                    Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: "1px solid #555", padding: "4px 8px" }}>
                    Per Day Charge (up to {form.includedKmPerDay} KM/day)
                  </td>
                  <td
                    style={{
                      border: "1px solid #555",
                      padding: "4px 8px",
                      textAlign: "right",
                    }}
                  >
                    ₹{form.perDayCharge.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #555", padding: "4px 8px" }}>
                    Extra KM Charge
                  </td>
                  <td
                    style={{
                      border: "1px solid #555",
                      padding: "4px 8px",
                      textAlign: "right",
                    }}
                  >
                    ₹{form.extraKmCharge} / km
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #555", padding: "4px 8px" }}>
                    Extra Hour Charge
                  </td>
                  <td
                    style={{
                      border: "1px solid #555",
                      padding: "4px 8px",
                      textAlign: "right",
                    }}
                  >
                    ₹{form.extraHourCharge} / hr
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #555", padding: "4px 8px" }}>
                    Driver Bata (per day)
                  </td>
                  <td
                    style={{
                      border: "1px solid #555",
                      padding: "4px 8px",
                      textAlign: "right",
                    }}
                  >
                    ₹{form.bataPerDay}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #555", padding: "4px 8px" }}>
                    Toll / Parking
                  </td>
                  <td
                    style={{
                      border: "1px solid #555",
                      padding: "4px 8px",
                      textAlign: "right",
                    }}
                  >
                    As per actual
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Notes */}
          <div
            style={{
              fontSize: "10px",
              color: "#666",
              marginBottom: "12px",
              lineHeight: "1.6",
            }}
          >
            <strong>Note:</strong> This is a computer-generated trip dispatch
            sheet issued along with Invoice No. {form.invoiceNo}. Please verify
            all details at the time of reporting. Any discrepancy should be
            reported to the office immediately.
          </div>

          {/* Signatures */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "30px",
            }}
          >
            <div style={{ textAlign: "center", width: "30%" }}>
              <div
                style={{
                  borderTop: "1px solid #1a1a1a",
                  paddingTop: "6px",
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                Driver Signature
              </div>
            </div>
            <div style={{ textAlign: "center", width: "30%" }}>
              <div
                style={{
                  borderTop: "1px solid #1a1a1a",
                  paddingTop: "6px",
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                Customer Signature
              </div>
            </div>
            <div style={{ textAlign: "center", width: "30%" }}>
              <div
                style={{
                  borderTop: "1px solid #1a1a1a",
                  paddingTop: "6px",
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                For {companyInfo.name}
              </div>
              <div style={{ fontSize: "9px", color: "#888" }}>
                (Authorised Signatory)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BillingRow({
  sr,
  desc,
  qty,
  rate,
  amount,
}: {
  sr: number;
  desc: string;
  qty: number;
  rate: number;
  amount: number;
}) {
  return (
    <tr>
      <td
        style={{
          border: "1px solid #333",
          padding: "5px 8px",
          textAlign: "center",
        }}
      >
        {sr}
      </td>
      <td style={{ border: "1px solid #333", padding: "5px 8px" }}>{desc}</td>
      <td
        style={{
          border: "1px solid #333",
          padding: "5px 8px",
          textAlign: "center",
        }}
      >
        {qty}
      </td>
      <td
        style={{
          border: "1px solid #333",
          padding: "5px 8px",
          textAlign: "right",
        }}
      >
        ₹{rate.toLocaleString()}
      </td>
      <td
        style={{
          border: "1px solid #333",
          padding: "5px 8px",
          textAlign: "right",
        }}
      >
        ₹{amount.toLocaleString()}
      </td>
    </tr>
  );
}
