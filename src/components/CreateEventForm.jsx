import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { FaCalendarAlt, FaClock, FaPlus } from "react-icons/fa";

const TIMEZONES = [
  { code: "IST", label: "Indian Standard Time (IST)" },
  { code: "GMT", label: "Greenwich Mean Time (GMT)" },
  { code: "CET", label: "Central European Time (CET)" },
  { code: "PT", label: "Pacific Time (PT)" },
  { code: "ET", label: "Eastern Time (ET)" },
  { code: "UTC", label: "Coordinated Universal Time (UTC)" },
  { code: "MT", label: "Mountain Time (MT)" },
];

// ---------- Generate Initial Time (React 19 Safe) ----------
const now = new Date();
let hrs = now.getHours();
let mins = now.getMinutes();

const isPM = hrs >= 12;
const meridian = isPM ? "PM" : "AM";

// Convert 24hr → 12hr format
let displayHour =
  hrs === 0 ? 12 :
  hrs > 12 ? hrs - 12 :
  hrs;

const format = (h, m) =>
  `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;

const initialTime = format(displayHour, mins);
// -----------------------------------------------------------

export default function CreateEventForm({
  profiles,
  setProfiles,
  onCreate,
  onCreateProfile,
}) {
  const [selectedProfiles, setSelectedProfiles] = useState([]);

  // Profile dropdown
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [newProfileName, setNewProfileName] = useState("");

  const filteredProfiles = profiles.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addProfileInsideDropdown = async () => {
    if (!newProfileName.trim()) return;

    const created = await onCreateProfile(newProfileName);

    setProfiles((prev) => [created, ...prev]);
    setSelectedProfiles((prev) => [...prev, created]);

    setNewProfileName("");
    setSearch("");
  };

  // Date + Time State
  const [timezone, setTimezone] = useState("IST");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState(initialTime);
  const [startMeridian, setStartMeridian] = useState(meridian);
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState(initialTime);
  const [endMeridian, setEndMeridian] = useState(meridian);

  const convertToDateObject = (date, time, meridian) => {
    if (!date || !time) return null;

    let [hh, mm] = time.split(":").map(Number);

    if (meridian === "PM" && hh !== 12) hh += 12;
    if (meridian === "AM" && hh === 12) hh = 0;

    return new Date(`${date}T${hh}:${mm}:00`);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!startDate || !startTime || !endDate || !endTime) {
      alert("Please select start and end date/time");
      return;
    }

    if (selectedProfiles.length === 0) {
      alert("Please select at least one profile");
      return;
    }

    const startDateTime = convertToDateObject(startDate, startTime, startMeridian);
    const endDateTime = convertToDateObject(endDate, endTime, endMeridian);

    if (!startDateTime || !endDateTime) {
      alert("Invalid start or end time");
      return;
    }

    if (endDateTime < startDateTime) {
      alert("End date must be after start date");
      return;
    }

    try {
      await onCreate({
        profiles: selectedProfiles.map((p) => p._id),
        timezone,
        startDate: startDateTime,
        endDate: endDateTime,
      });

      // Reset only after successful creation
      setSelectedProfiles([]);
      setStartDate("");
      setStartTime(initialTime);
      setEndDate("");
      setEndTime(initialTime);
      setOpenProfileMenu(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create event");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Create Event</h2>

      <form onSubmit={submit} className="space-y-5">
        <div className="relative">
          <label className="text-sm font-medium">Profiles</label>

          <div
            className="border rounded px-3 py-2 mt-1 bg-white cursor-pointer flex justify-between items-center"
            onClick={() => setOpenProfileMenu(!openProfileMenu)}
          >
            <span className="text-gray-700">
              {selectedProfiles.length > 0
                ? `${selectedProfiles.length} selected`
                : "Select profiles"}
            </span>
            <FiChevronDown size={18} />
          </div>

          {openProfileMenu && (
            <div className="absolute mt-2 w-full bg-white shadow-lg rounded p-3 z-20">
              <input
                className="border rounded px-2 py-1 w-full mb-2"
                placeholder="Search profiles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="max-h-40 overflow-y-auto border rounded p-2 mb-2">
                {filteredProfiles.length > 0 ? (
                  filteredProfiles.map((p) => {
                    const isSelected = selectedProfiles.some((sp) => sp._id === p._id);
                    return (
                      <div
                        key={p._id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedProfiles((prev) =>
                              prev.filter((item) => item._id !== p._id)
                            );
                          } else {
                            setSelectedProfiles((prev) => [...prev, p]);
                          }
                        }}
                        className={`px-2 py-1 rounded cursor-pointer ${
                          isSelected ? "bg-blue-100" : "hover:bg-gray-100"
                        }`}
                      >
                        {p.name}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-sm">No profiles found</p>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  className="border rounded px-2 py-1 flex-1"
                  placeholder="New profile name"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                />
                <button
                  type="button"
                  onClick={addProfileInsideDropdown}
                  className="bg-pink-500 text-white px-3 py-1 rounded"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Timezone</label>
          <select
            className="w-full border rounded px-3 py-2 mt-1"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            {TIMEZONES.map((t) => (
              <option key={t.code} value={t.code}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Start Date & Time</label>

          <div className="flex gap-3 mt-1">
            <div className="relative w-full">
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-500" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border w-full px-10 py-2 rounded"
              />
            </div>

            <div className="relative w-full flex gap-2">
              <div className="relative w-full">
                <FaClock className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border w-full px-10 py-2 rounded"
                />
              </div>

              <select
                value={startMeridian}
                onChange={(e) => setStartMeridian(e.target.value)}
                className="border px-3 py-2 rounded"
              >
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">End Date & Time</label>

          <div className="flex gap-3 mt-1">
            <div className="relative w-full">
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-500" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border w-full px-10 py-2 rounded"
              />
            </div>

            <div className="relative w-full flex gap-2">
              <div className="relative w-full">
                <FaClock className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="border w-full px-10 py-2 rounded"
                />
              </div>

              <select
                value={endMeridian}
                onChange={(e) => setEndMeridian(e.target.value)}
                className="border px-3 py-2 rounded"
              >
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-3 rounded w-full flex justify-center gap-2 items-center hover:bg-blue-700"
        >
          <FaPlus /> Create Event
        </button>
      </form>
    </div>
  );
}
