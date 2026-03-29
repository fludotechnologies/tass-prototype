declare module "html2pdf.js" {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: { type?: "jpeg" | "png" | "webp"; quality?: number };
    html2canvas?: Record<string, unknown>;
    jsPDF?: { unit?: "pt" | "mm" | "cm" | "in"; format?: string; orientation?: "portrait" | "landscape" };
    pagebreak?: { mode?: string[]; before?: string[]; after?: string[]; avoid?: string[] };
  }

  interface Html2PdfInstance {
    set(opt: Html2PdfOptions): Html2PdfInstance;
    from(element: HTMLElement | string): Html2PdfInstance;
    save(): Promise<void>;
    toPdf(): Html2PdfInstance;
    get(type: string): Promise<unknown>;
    then(callback: (value: unknown) => void): Html2PdfInstance;
    output(type: string, options?: unknown): Promise<unknown>;
  }

  function html2pdf(): Html2PdfInstance;
  export default html2pdf;
}
