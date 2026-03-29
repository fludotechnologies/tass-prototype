export const customers = [
  {
    id: "c1",
    name: "Sun Pharmaceuticals Ltd",
    address: "Infopark, Kakkanad, Kochi – 682042",
    gstin: "32AAECA4561K1ZB",
    state: "Kerala – 32",
    mobile: "+91 9895123456",
  },
  {
    id: "c2",
    name: "Travancore Traders Ltd",
    address: "MG Road, Thiruvananthapuram – 695001",
    gstin: "32AABCT6789L1ZX",
    state: "Kerala – 32",
    mobile: "+91 9847011122",
  },
  {
    id: "c3",
    name: "Calicut Builders Ltd",
    address: "Beach Road, Kozhikode – 673032",
    gstin: "32AACCB1122M1ZA",
    state: "Kerala – 32",
    mobile: "+91 9847022233",
  },
];

export const vehicles = [
  {
    id: "v1",
    number: "KL-01-AB-1234",
    type: "Sedan",
    pricing: {
      perDay: 2300,
      bata: 225,
      nightHalt: 300,
      extraKm: 19,
      extraHour: 200,
    },
  },
  {
    id: "v2",
    number: "KL-07-CD-5678",
    type: "Innova",
    pricing: {
      perDay: 3000,
      bata: 375,
      nightHalt: 425,
      extraKm: 23,
      extraHour: 250,
    },
  },
  {
    id: "v3",
    number: "KL-11-EF-9012",
    type: "Innova Crysta",
    pricing: {
      perDay: 3300,
      bata: 400,
      nightHalt: 450,
      extraKm: 25,
      extraHour: 275,
    },
  },
  {
    id: "v4",
    number: "KL-15-GH-3456",
    type: "Toyota Hycross",
    pricing: {
      perDay: 3600,
      bata: 425,
      nightHalt: 475,
      extraKm: 26,
      extraHour: 300,
    },
  },
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
  tripDescription: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
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
  includeBata: boolean;
  cgstPercent: number;
  sgstPercent: number;
}

const defaultVehicle = vehicles.find((v) => v.id === "v1");

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

  tripDescription: "Kochi – Munnar – Kochi...",

  startDate: "2026-03-20",
  endDate: "2026-03-22",

  startTime: "08:00",
  endTime: "18:00",

  vehicleId: "v1",
  driverId: "d1",

  startKm: 23000,
  closeKm: 23580,

  // 🔥 dynamic from vehicle
  perDayCharge: defaultVehicle?.pricing.perDay || 0,
  includedKmPerDay: 80,
  extraKmCharge: defaultVehicle?.pricing.extraKm || 0,
  extraHourCharge: defaultVehicle?.pricing.extraHour || 0,

  toll: 450,

  bataPerDay: defaultVehicle?.pricing.bata || 0,
  includeBata: true,

  cgstPercent: 2.5,
  sgstPercent: 2.5,
};

export function numberToWords(num: number): string {
  if (num === 0) return "Zero";
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (num < 20) return ones[num];
  if (num < 100)
    return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
  if (num < 1000)
    return (
      ones[Math.floor(num / 100)] +
      " Hundred" +
      (num % 100 ? " and " + numberToWords(num % 100) : "")
    );
  if (num < 100000)
    return (
      numberToWords(Math.floor(num / 1000)) +
      " Thousand" +
      (num % 1000 ? " " + numberToWords(num % 1000) : "")
    );
  if (num < 10000000)
    return (
      numberToWords(Math.floor(num / 100000)) +
      " Lakh" +
      (num % 100000 ? " " + numberToWords(num % 100000) : "")
    );
  return (
    numberToWords(Math.floor(num / 10000000)) +
    " Crore" +
    (num % 10000000 ? " " + numberToWords(num % 10000000) : "")
  );
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
export function calculateInvoice(data: InvoiceFormData) {
  const startDateMs = new Date(data.startDate).getTime();
  const endDateMs = new Date(data.endDate).getTime();

  const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
  const endDateTime = new Date(`${data.endDate}T${data.endTime}`);

  if (endDateTime < startDateTime) {
    return {
      totalDays: 0,
      totalKm: 0,
      totalIncludedKm: 0,
      extraKm: 0,
      totalHours: 0,
      extraHours: 0,
      baseCost: 0,
      extraKmCost: 0,
      extraHourCost: 0,
      bataTotal: 0,
      subtotal: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      grandTotal: 0,
    };
  }

  const totalDays = Math.max(
    1,
    Math.ceil((endDateMs - startDateMs) / (1000 * 60 * 60 * 24)) + 1,
  );

  const totalKm = Math.max(0, data.closeKm - data.startKm);
  const totalIncludedKm = totalDays * data.includedKmPerDay;
  const extraKm = Math.max(0, totalKm - totalIncludedKm);

  // 🔥 TOTAL HOURS
  const totalHours =
    (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);

  // 🔥 MINIMUM BILLING (8 hrs per day)
  const minimumHours = totalDays * 8;

  // 🔥 BILLABLE HOURS
  const billableHours = Math.max(totalHours, minimumHours);

  // 🔥 EXTRA HOURS
  const extraHours = Math.max(0, Math.ceil(billableHours - minimumHours));

  // 🔥 COSTS
  const baseCost = totalDays * data.perDayCharge;
  const extraKmCost = extraKm * data.extraKmCharge;
  const extraHourCost = extraHours * data.extraHourCharge;
  const bataTotal = data.includeBata ? totalDays * data.bataPerDay : 0;

  const subtotal =
    baseCost + extraKmCost + extraHourCost + data.toll + bataTotal;

  const cgstAmount = (subtotal * data.cgstPercent) / 100;
  const sgstAmount = (subtotal * data.sgstPercent) / 100;

  const grandTotal = Math.round(subtotal + cgstAmount + sgstAmount);

  return {
    totalDays,
    totalKm,
    totalIncludedKm,
    extraKm,
    totalHours,
    extraHours,
    baseCost,
    extraKmCost,
    extraHourCost,
    bataTotal,
    subtotal,
    cgstAmount,
    sgstAmount,
    grandTotal,
  };
}
