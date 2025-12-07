import React from "react";
import EventCard from "./EventCard";

export default function EventList({
  events,
  viewTimezone,
  setViewTimezone,
  onEventUpdated,
}) {
  return (
    <div className="bg-white p-6 rounded shadow h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Events</h2>

        <select
          value={viewTimezone}
          onChange={(e) => setViewTimezone(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {["IST", "GMT", "CET", "ET", "PT"].map((tz) => (
            <option key={tz}>{tz}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 space-y-4">
        {events.map((ev) => (
          <EventCard
            key={ev._id}
            event={ev}
            viewTimezone={viewTimezone}
            onEventUpdated={onEventUpdated}
          />
        ))}
      </div>
    </div>
  );
}
