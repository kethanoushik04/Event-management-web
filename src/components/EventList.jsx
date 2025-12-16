import React from "react";
import EventCard from "./EventCard";

// Full form timezone list (VIEW ONLY)
const TIMEZONES = [
  { code: "", label: "Browser Timezone" },
  { code: "IST", label: "Indian Standard Time (IST)" },
  { code: "GMT", label: "Greenwich Mean Time (GMT)" },
  { code: "CET", label: "Central European Time (CET)" },
  { code: "ET", label: "Eastern Time (ET)" },
  { code: "PT", label: "Pacific Time (PT)" },
  { code: "UTC", label: "Coordinated Universal Time (UTC)" },
  { code: "MT", label: "Mountain Time (MT)" }
];

export default function EventList({
  events,
  viewTimezone,
  setViewTimezone,
  onEventUpdated,
  profiles,
  onCreateProfile
}) {
  return (
    <div className="bg-white p-6 rounded shadow h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Events</h2>

        {/* Timezone dropdown */}
        <select
          value={viewTimezone}
          onChange={(e) => setViewTimezone(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz.code} value={tz.code}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 space-y-4">
        {events && events.length > 0 ? (
          events.map((ev) => (
            <EventCard
              key={ev._id}
              event={ev}
              viewTimezone={viewTimezone}  
              onEventUpdated={onEventUpdated}
              profiles={profiles}
              onCreateProfile={onCreateProfile}
            />
          ))
        ) : (
          <p className="text-gray-500">No events found</p>
        )}
      </div>
    </div>
  );
}
