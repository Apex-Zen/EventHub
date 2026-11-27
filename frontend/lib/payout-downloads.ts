import { formatAmount, type PayoutReceipt } from "./payouts";

function downloadBlob(content: BlobPart, type: string, filename: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function escapeCsv(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export function downloadReceipts(receipts: PayoutReceipt[]) {
  const rows = [
    ["Receipt no.", "Event", "Stage", "Net", "Paid on"],
    ...receipts.map((receipt) => [
      receipt.number,
      receipt.event,
      receipt.stage,
      formatAmount(receipt.net),
      receipt.date,
    ]),
  ];
  const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
  downloadBlob(csv, "text/csv;charset=utf-8", "eventhub-payout-receipts.csv");
}

export function downloadReceipt(receipt: PayoutReceipt) {
  const lines = [
    "EventHub payout receipt",
    `Receipt no.: ${receipt.number}`,
    `Event: ${receipt.event}`,
    `Stage: ${receipt.stage}`,
    `Net payout: ${formatAmount(receipt.net)}`,
    `Paid on: ${receipt.date}`,
  ];
  const content = [
    "BT",
    "/F1 18 Tf",
    "54 770 Td",
    `(${escapePdfText(lines[0])}) Tj`,
    "/F1 12 Tf",
    ...lines.slice(1).flatMap((line) => ["0 -32 Td", `(${escapePdfText(line)}) Tj`]),
    "ET",
  ].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const [index, object] of objects.entries()) {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  }
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  downloadBlob(pdf, "application/pdf", `${receipt.number}.pdf`);
}

function escapePdfText(value: string) {
  return value
    .replaceAll("–", "-")
    .replace(/[^\x20-\x7e]/g, "")
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}
