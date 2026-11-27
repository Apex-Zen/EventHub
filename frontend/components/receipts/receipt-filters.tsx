import type { ChangeEvent } from "react";
import { SelectField } from "@/components/ui/select-field";

export function ReceiptFilters({
  events,
  years,
  eventFilter,
  year,
  onEventChange,
  onYearChange,
}: {
  events: string[];
  years: string[];
  eventFilter: string;
  year: string;
  onEventChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onYearChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="receipts-filters" aria-label="Receipt filters">
      <SelectField
        label="Event"
        options={["All events", ...events]}
        value={eventFilter}
        onChange={onEventChange}
      />
      <SelectField
        label="Year"
        options={years}
        value={year}
        onChange={onYearChange}
      />
    </div>
  );
}
