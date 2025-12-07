import { useEffect, useState } from "react";
import axios from "axios";

export default function EditEventModal({ event, isOpen, onClose, onUpdated }) {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [timezone, setTimezone] = useState("IST");

  // Load event data into modal
  useEffect(() => {
    if (event) {
      setSelectedProfiles(event.profiles || []);
      setStart(event.start || "");
      setEnd(event.end || "");
      setTimezone(event.timezone || "IST");
    }
  }, [event]);

  // Fetch profiles list
  useEffect(() => {
    axios
      .get("/api/profile")
      .then((res) => {
        // Ensure array
        const data = Array.isArray(res.data) ? res.data : [];
        setProfiles(data);
      })
      .catch((err) => console.error("Profile API Error:", err));
  }, []);

  const handleSave = async () => {
    if (!start || !end) return alert("Start & End Date required");

    if (new Date(end) < new Date(start))
      return alert("End cannot be before Start");

    const payload = {
      profiles: selectedProfiles,
      start,
      end,
      timezone,
    };

    try {
      await axios.put(`/api/event/${event?._id}`, payload);
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Update Error:", err);
      alert("Failed to update event");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl relative">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Event</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-2xl">
            ×
          </button>
        </div>

        {/* Profiles */}
        <label className="block font-medium">Profiles</label>
        <div className="border p-2 rounded h-28 overflow-y-auto mb-4">
          {profiles.length === 0 ? (
            <p className="text-gray-400 text-sm">No profiles found</p>
          ) : (
            profiles.map((p) => (
              <div key={p._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedProfiles.includes(p._id)}
                  onChange={() => {
                    if (selectedProfiles.includes(p._id)) {
                      setSelectedProfiles(selectedProfiles.filter((id) => id !== p._id));
                    } else {
                      setSelectedProfiles([...selectedProfiles, p._id]);
                    }
                  }}
                />
                <span>{p.name}</span>
              </div>
            ))
          )}
        </div>

        {/* Timezone */}
        <label className="block font-medium">Time Zone</label>
        <select
          className="border rounded p-2 w-full mb-4"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
        >
          <option>IST</option>
          <option>London</option>
          <option>Mountain</option>
          <option>Paris</option>
          <option>Berlin</option>
          <option>Pacific</option>
        </select>

        {/* Start Date */}
        <label className="block font-medium">Start Date</label>
        <input
          type="datetime-local"
          className="border rounded p-2 w-full mb-4"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />

        {/* End Date */}
        <label className="block font-medium">End Date</label>
        <input
          type="datetime-local"
          className="border rounded p-2 w-full mb-4"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
