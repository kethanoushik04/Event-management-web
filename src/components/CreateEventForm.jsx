import React, { useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TIMEZONES = [
  "IST",
  "GMT",
  "CET",
  "PT",
  "ET",
  "UTC",
  "MT",
];

export default function CreateEventForm({ profiles, onCreate }) {
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [timezone, setTimezone] = useState("IST");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!selectedProfiles.length)
      return alert("Select at least one profile");

    await onCreate({
      profiles: selectedProfiles.map((p) => p.value),
      timezone,
      startDate,
      endDate,
    });

    setSelectedProfiles([]);
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Create Event</h2>

      <form onSubmit={submit} className="space-y-4">

        <div>
          <label className="text-sm font-medium">Profiles</label>
          <Select
            isMulti
            options={profiles.map((p) => ({
              label: p.name,
              value: p._id,
            }))}
            value={selectedProfiles}
            onChange={setSelectedProfiles}
          />
          <p className="text-xs text-gray-500 mt-1">
            (Select 1 or more profiles)
          </p>
        </div>

        <div>
          <label className="text-sm font-medium">Timezone</label>
          <select
            className="w-full border rounded px-2 py-2 mt-1"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            {TIMEZONES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Start Date & Time</label>
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            showTimeSelect
            dateFormat="Pp"
            className="border rounded w-full px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">End Date & Time</label>
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            showTimeSelect
            dateFormat="Pp"
            className="border rounded w-full px-3 py-2 mt-1"
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Create Event
        </button>
      </form>
    </div>
  );
}
