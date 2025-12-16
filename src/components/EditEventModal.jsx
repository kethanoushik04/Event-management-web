import { useState } from "react";
import API from "../api";

const TIMEZONES = [
  { code: "IST", label: "Indian Standard Time (IST)" },
  { code: "GMT", label: "Greenwich Mean Time (GMT)" },
  { code: "CET", label: "Central European Time (CET)" },
  { code: "ET", label: "Eastern Time (ET)" },
  { code: "PT", label: "Pacific Time (PT)" },
  { code: "UTC", label: "Coordinated Universal Time (UTC)" },
  { code: "MT", label: "Mountain Time (MT)" },
];

const toLocalDatetime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function EditEventModal({
  event,
  isOpen,
  onClose,
  onUpdated,
  profiles = [],
  onCreateProfile,
}) {
  const [selectedProfiles, setSelectedProfiles] = useState(
    () => event?.profiles?.map((p) => p._id) || []
  );
  const [start, setStart] = useState(() =>
    toLocalDatetime(event?.startDate)
  );
  const [end, setEnd] = useState(() =>
    toLocalDatetime(event?.endDate)
  );
  const [timezone, setTimezone] = useState(event?.timezone || "IST");

  const [search, setSearch] = useState("");
  const [newProfileName, setNewProfileName] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);

  if (isOpen && event && selectedProfiles.length === 0) {
    setSelectedProfiles(event.profiles.map((p) => p._id));
    setStart(toLocalDatetime(event.startDate));
    setEnd(toLocalDatetime(event.endDate));
    setTimezone(event.timezone || "IST");
  }

  const filteredProfiles = profiles.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProfile = async () => {
    if (!newProfileName.trim()) return;
    const newProfile = await onCreateProfile(newProfileName);
    setSelectedProfiles((prev) => [...prev, newProfile._id]);
    setNewProfileName("");
  };

  const handleSave = async () => {
    if (!start || !end) return alert("Start & End date required");
    if (new Date(end) < new Date(start))
      return alert("End cannot be before Start");

    try {
      const res = await API.put(`/events/${event._id}`, {
        profiles: selectedProfiles,
        startDate: start,
        endDate: end,
        timezone,
      });

      onUpdated(res.data.event);
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update event");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Edit Event</h2>

        {/* Profiles */}
        <label className="block font-medium">Profiles</label>
        <div
          className="border rounded p-2 cursor-pointer mb-4"
          onClick={() => setOpenDropdown(!openDropdown)}
        >
          {selectedProfiles.length
            ? profiles
                .filter((p) => selectedProfiles.includes(p._id))
                .map((p) => p.name)
                .join(", ")
            : "Select profiles..."}
        </div>

        {openDropdown && (
          <div className="border rounded p-3 mb-4">
            <input
              className="border rounded px-2 py-1 w-full mb-2"
              placeholder="Search profiles"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {filteredProfiles.map((p) => (
              <div
                key={p._id}
                className="cursor-pointer"
                onClick={() =>
                  setSelectedProfiles((prev) =>
                    prev.includes(p._id)
                      ? prev.filter((id) => id !== p._id)
                      : [...prev, p._id]
                  )
                }
              >
                {p.name} {selectedProfiles.includes(p._id) && "✔"}
              </div>
            ))}

            <div className="flex gap-2 mt-2">
              <input
                className="border rounded px-2 py-1 flex-1"
                placeholder="New profile"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
              />
              <button
                onClick={handleAddProfile}
                className="bg-blue-600 text-white px-3 rounded"
              >
                Add
              </button>
            </div>
          </div>
        )}

        <select
          className="border rounded p-2 w-full mb-4"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
        >
          {TIMEZONES.map((tz) => (
            <option key={tz.code} value={tz.code}>
              {tz.label}
            </option>
          ))}
        </select>

          <input
          type="datetime-local"
          className="border rounded p-2 w-full mb-2"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <input
          type="datetime-local"
          className="border rounded p-2 w-full mb-4"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded w-1/2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded w-1/2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
