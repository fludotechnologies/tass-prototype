export const vehicles = [
  { id: "v1", number: "KL-01-AB-1234", type: "Sedan (Swift Dzire)", rate: 14 },
  { id: "v2", number: "KL-07-CD-5678", type: "SUV (Innova)", rate: 18 },
  { id: "v3", number: "KL-11-EF-9012", type: "Tempo Traveller", rate: 22 },
  { id: "v4", number: "KL-15-GH-3456", type: "Bus (45 Seater)", rate: 28 },
];

export const drivers = [
  { id: "d1", name: "Suresh Nair", phone: "9847012345", vehicleId: "v1" },
  { id: "d2", name: "Ramesh Pillai", phone: "9847012346", vehicleId: "v2" },
  { id: "d3", name: "Manoj Kumar", phone: "9847012347", vehicleId: "v3" },
  { id: "d4", name: "Aneesh Varghese", phone: "9847012348", vehicleId: "v4" },
];

export const companyInfo = {
  name: "TASS TOURS & TRAVELS ",
  address: "MG Road, Ernakulam, Kochi, Kerala – 682011",
  phone: "+91 9847012345",
  email: "info@tasstravels.com",
  gst: "32AABCT1234F1ZH",
};

export interface InvoiceFormData {
  // Invoice meta
  invoiceNo: string;
  invoiceDate: string;
  // Customer
  customerName: string;
  customerAddress: string;
  customerGstin: string;
  customerState: string;
  customerMobile: string;
  // Trip
  bookingPerson: string;
  reportingPlace: string;
  reportingTime: string;
  tripDescription: string;
  startDate: string;
  endDate: string;
  // Vehicle & Driver
  vehicleId: string;
  driverId: string;
  // KM
  startKm: number;
  closeKm: number;
  // Pricing
  perDayCharge: number;
  includedKmPerDay: number;
  extraKmCharge: number;
  extraHourCharge: number;
  toll: number;
  bataPerDay: number;
  includeBata: boolean;   // ← new: controls whether bata is applied
  cgstPercent: number;
  sgstPercent: number;
}

export const defaultFormData: InvoiceFormData = {
  invoiceNo: "TRV-2026-0042",
  invoiceDate: "2026-03-23",
  customerName: "M/s. Malabar Tech Solutions Pvt. Ltd.",
  customerAddress: "Infopark, Kakkanad, Kochi 682042",
  customerGstin: "32AAECA4561K1ZB",
  customerState: "Kerala – 32",
  customerMobile: "+91 9895123456",
  bookingPerson: "Mr. Ravi Pillai",
  reportingPlace: "Ernakulam Junction",
  reportingTime: "08:00",
  tripDescription: "Kochi – Munnar – Kochi (Round Trip). Pickup from Ernakulam Junction, drop to Munnar, sightseeing at Mattupetty Dam, Echo Point, Tea Museum, return via Adimali.",
  startDate: "2026-03-20",
  endDate: "2026-03-22",
  vehicleId: "v1",
  driverId: "d1",
  startKm: 78540,
  closeKm: 79020,
  perDayCharge: 3500,
  includedKmPerDay: 80,
  extraKmCharge: 14,
  extraHourCharge: 150,
  toll: 450,
  bataPerDay: 300,
  includeBata: true,      // ← default: bata is on
  cgstPercent: 2.5,
  sgstPercent: 2.5,
};

export function numberToWords(num: number): string {
  if (num === 0) return "Zero";
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if (num < 20) return ones[num];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
  if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " and " + numberToWords(num % 100) : "");
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + numberToWords(num % 1000) : "");
  if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + " Lakh" + (num % 100000 ? " " + numberToWords(num % 100000) : "");
  return numberToWords(Math.floor(num / 10000000)) + " Crore" + (num % 10000000 ? " " + numberToWords(num % 10000000) : "");
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function calculateInvoice(data: InvoiceFormData) {
  const startDateMs = new Date(data.startDate).getTime();
  const endDateMs = new Date(data.endDate).getTime();
  const totalDays = Math.max(1, Math.ceil((endDateMs - startDateMs) / (1000 * 60 * 60 * 24)) + 1);
  const totalKm = Math.max(0, data.closeKm - data.startKm);
  const totalIncludedKm = totalDays * data.includedKmPerDay;
  const extraKm = Math.max(0, totalKm - totalIncludedKm);
  const baseCost = totalDays * data.perDayCharge;
  const extraKmCost = extraKm * data.extraKmCharge;
  // Bata only applied when includeBata is true
  const bataTotal = data.includeBata ? totalDays * data.bataPerDay : 0;
  const subtotal = baseCost + extraKmCost + data.toll + bataTotal;
  const cgstAmount = (subtotal * data.cgstPercent) / 100;
  const sgstAmount = (subtotal * data.sgstPercent) / 100;
  const grandTotal = Math.round(subtotal + cgstAmount + sgstAmount);

  return {
    totalDays,
    totalKm,
    totalIncludedKm,
    extraKm,
    baseCost,
    extraKmCost,
    bataTotal,
    subtotal,
    cgstAmount,
    sgstAmount,
    grandTotal,
  };
}