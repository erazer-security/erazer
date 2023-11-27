import styles from "./PrivacyPolicy.module.css";
import { Document, Page, pdfjs } from "react-pdf";
import policyPdf from "/erazerPrivacyPolicy.pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PrivacyPolicy() {
  return (
    <div className={styles.container}>
      <Document file={policyPdf}>
        <Page pageNumber={1} renderTextLayer={false} />
        <Page pageNumber={2} renderTextLayer={false} />
        <Page pageNumber={3} renderTextLayer={false} />
        <Page pageNumber={4} renderTextLayer={false} />
        <Page pageNumber={5} renderTextLayer={false} />
      </Document>
    </div>
  );
}
