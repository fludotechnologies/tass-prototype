import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  vehicles,
  drivers,
  companyInfo,
  defaultFormData,
  calculateInvoice,
  numberToWords,
  type InvoiceFormData,
} from "../data/mockData";

export default function CreateInvoice() {
  const navigate = useNavigate();
  const [form, setForm] = useState<InvoiceFormData>(defaultFormData);

  const update = (field: keyof InvoiceFormData, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const vehicle = vehicles.find((v) => v.id === form.vehicleId);
  const driver = drivers.find((d) => d.id === form.driverId);

  const calc = useMemo(() => calculateInvoice(form), [form]);

  const handlePreview = () => {
    sessionStorage.setItem("invoiceData", JSON.stringify(form));
    navigate("/preview");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-white font-bold text-lg">★</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">{companyInfo.name}</h1>
              <p className="text-xs text-slate-500">Invoice Generator</p>
            </div>
          </div>
          <button
            onClick={handlePreview}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            Preview &amp; Generate PDF
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-5">

            {/* Invoice Meta */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xs font-bold">1</span>
                Invoice Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Invoice Number" value={form.invoiceNo} onChange={(v) => update("invoiceNo", v)} />
                <Field label="Invoice Date" type="date" value={form.invoiceDate} onChange={(v) => update("invoiceDate", v)} />
              </div>
            </section>

            {/* Customer */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xs font-bold">2</span>
                Customer Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Customer Name" value={form.customerName} onChange={(v) => update("customerName", v)} />
                <Field label="GSTIN" value={form.customerGstin} onChange={(v) => update("customerGstin", v)} />
                <Field label="Address" value={form.customerAddress} onChange={(v) => update("customerAddress", v)} className="sm:col-span-2" />
                <Field label="State & Code" value={form.customerState} onChange={(v) => update("customerState", v)} />
                <Field label="Mobile Number" value={form.customerMobile} onChange={(v) => update("customerMobile", v)} />
              </div>
            </section>

            {/* Trip Details */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xs font-bold">3</span>
                Trip Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Booking Person" value={form.bookingPerson} onChange={(v) => update("bookingPerson", v)} />
                <Field label="Reporting Place" value={form.reportingPlace} onChange={(v) => update("reportingPlace", v)} />
                <Field label="Reporting Time" type="time" value={form.reportingTime} onChange={(v) => update("reportingTime", v)} />
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Total Days</label>
                  <input value={calc.totalDays} readOnly className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-sm" />
                </div>
                <Field label="Start Date" type="date" value={form.startDate} onChange={(v) => update("startDate", v)} />
                <Field label="End Date" type="date" value={form.endDate} onChange={(v) => update("endDate", v)} />
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Trip Description</label>
                  <textarea
                    value={form.tripDescription}
                    onChange={(e) => update("tripDescription", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition-all resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Vehicle & Driver */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xs font-bold">4</span>
                Vehicle &amp; Driver
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Vehicle</label>
                  <select
                    value={form.vehicleId}
                    onChange={(e) => update("vehicleId", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm bg-white transition-all"
                  >
                    <option value="">Select vehicle</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>{v.number} ({v.type})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Driver</label>
                  <select
                    value={form.driverId}
                    onChange={(e) => update("driverId", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm bg-white transition-all"
                  >
                    <option value="">Select driver</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                {vehicle && (
                  <>
                    <ReadonlyField label="Vehicle Number" value={vehicle.number} />
                    <ReadonlyField label="Vehicle Type" value={vehicle.type} />
                  </>
                )}
                {driver && (
                  <>
                    <ReadonlyField label="Driver Name" value={driver.name} />
                    <ReadonlyField label="Driver Phone" value={driver.phone} />
                  </>
                )}
              </div>
            </section>

            {/* Distance */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xs font-bold">5</span>
                Distance
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <NumField label="Starting KM" value={form.startKm} onChange={(v) => update("startKm", v)} />
                <NumField label="Closing KM" value={form.closeKm} onChange={(v) => update("closeKm", v)} />
                <ReadonlyField label="Total KM" value={`${calc.totalKm} km`} highlight />
              </div>
            </section>

            {/* Pricing */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xs font-bold">6</span>
                Pricing
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <NumField label="Per Day Charge (₹)" value={form.perDayCharge} onChange={(v) => update("perDayCharge", v)} />
                <NumField label="Included KM/Day" value={form.includedKmPerDay} onChange={(v) => update("includedKmPerDay", v)} />
                <NumField label="Extra KM Charge (₹)" value={form.extraKmCharge} onChange={(v) => update("extraKmCharge", v)} />
                <NumField label="Extra Hour Charge (₹)" value={form.extraHourCharge} onChange={(v) => update("extraHourCharge", v)} />
                <NumField label="Toll / Parking (₹)" value={form.toll} onChange={(v) => update("toll", v)} />
                <NumField label="CGST %" value={form.cgstPercent} onChange={(v) => update("cgstPercent", v)} step="0.5" />
                <NumField label="SGST %" value={form.sgstPercent} onChange={(v) => update("sgstPercent", v)} step="0.5" />

                {/* Bata toggle + field */}
                <div className="sm:col-span-3">
                  <div className="flex items-center gap-3 mb-3">
                    <button
                      type="button"
                      onClick={() => update("includeBata", !form.includeBata)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${form.includeBata ? "bg-indigo-500" : "bg-slate-200"}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${form.includeBata ? "translate-x-6" : "translate-x-1"}`}
                      />
                    </button>
                    <span className="text-xs font-semibold text-slate-600">Include Driver Bata / Allowance</span>
                  </div>
                  {form.includeBata && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <NumField label="Bata / Day (₹)" value={form.bataPerDay} onChange={(v) => update("bataPerDay", v)} />
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Right: Summary Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* Calculation Card */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-indigo-100 p-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">💰 Calculation Summary</h3>
                <div className="space-y-3 text-sm">
                  <SummaryRow label={`Base Cost (${calc.totalDays}d × ₹${form.perDayCharge.toLocaleString()})`} value={calc.baseCost} />
                  <SummaryRow label={`Extra KM (${calc.extraKm} km × ₹${form.extraKmCharge})`} value={calc.extraKmCost} />
                  <SummaryRow label="Toll / Parking" value={form.toll} />
                  {form.includeBata && (
                    <SummaryRow label={`Bata (${calc.totalDays}d × ₹${form.bataPerDay})`} value={calc.bataTotal} />
                  )}
                  <div className="border-t border-slate-200 pt-3 flex justify-between font-semibold text-slate-700">
                    <span>Subtotal</span>
                    <span>₹{calc.subtotal.toLocaleString()}</span>
                  </div>
                  <SummaryRow label={`CGST (${form.cgstPercent}%)`} value={calc.cgstAmount} />
                  <SummaryRow label={`SGST (${form.sgstPercent}%)`} value={calc.sgstAmount} />
                  <div className="border-t-2 border-indigo-200 pt-3 flex justify-between text-lg font-bold text-indigo-600">
                    <span>Grand Total</span>
                    <span>₹{calc.grandTotal.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-400 italic pt-1">
                    {numberToWords(calc.grandTotal)} Rupees Only
                  </p>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-5 text-white">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-indigo-100">Quick Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-indigo-200">Total Days</span>
                    <span className="font-bold">{calc.totalDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-200">Total KM</span>
                    <span className="font-bold">{calc.totalKm.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-200">Included KM</span>
                    <span className="font-bold">{calc.totalIncludedKm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-200">Extra KM</span>
                    <span className="font-bold">{calc.extraKm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-200">Bata</span>
                    <span className="font-bold">{form.includeBata ? `₹${calc.bataTotal.toLocaleString()}` : "Not included"}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={handlePreview}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Generate Invoice
                </button>
                <button
                  onClick={() => alert("Draft saved!")}
                  className="w-full bg-white text-slate-700 py-3 rounded-xl font-semibold border border-slate-200 hover:bg-slate-50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                  Save Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---- Reusable field components ---- */

function Field({ label, value, onChange, type = "text", className = "" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition-all"
      />
    </div>
  );
}

function NumField({ label, value, onChange, step = "1" }: {
  label: string; value: number; onChange: (v: number) => void; step?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition-all"
      />
    </div>
  );
}

function ReadonlyField({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
      <input
        value={value}
        readOnly
        className={`w-full px-3 py-2 rounded-xl border text-sm font-semibold ${highlight ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-slate-50 text-slate-700"}`}
      />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-700">₹{value.toLocaleString()}</span>
    </div>
  );
}