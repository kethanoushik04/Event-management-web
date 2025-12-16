import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function Header({
  profiles,
  onCreateProfile,
  currentProfile,
  setCurrentProfile,
  setProfiles,
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [newProfileName, setNewProfileName] = useState("");

  const filteredProfiles = profiles.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProfile = async () => {
    if (!newProfileName.trim()) return;

    const created = await onCreateProfile(newProfileName);

    if (!created || !created._id) {
      console.log("Profile creation failed");
      return;
    }

    setProfiles((prev) => [created, ...prev]);
    setCurrentProfile(created);

    setNewProfileName("");
    setSearch("");
    setOpenMenu(false); // FIX
  };

  return (
    <div className="p-6 bg-white shadow-sm flex justify-between items-center relative">
      <div>
        <h1 className="text-xl font-semibold">Event Management</h1>
        <p className="text-gray-600 text-sm">
          Create and manage events across multiple timezones
        </p>
      </div>

      <div className="relative w-72">
        <div
          className="border rounded px-3 py-2 flex justify-between items-center cursor-pointer bg-white"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <span className="text-gray-700">
            {currentProfile ? currentProfile.name : "Select profile"}
          </span>
          <FiChevronDown size={18} className="text-gray-600" />
        </div>

        {openMenu && (
          <div className="absolute mt-2 w-full bg-white shadow-lg rounded p-3 z-20">
            <input
              className="border rounded px-2 py-1 w-full mb-2"
              placeholder="Search profiles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="max-h-40 overflow-y-auto border rounded p-2 mb-2">
              {filteredProfiles.length > 0 ? (
                filteredProfiles.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => {
                      setCurrentProfile(p);
                      setOpenMenu(false);
                    }}
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
                  >
                    {p.name}
                  </div>
                ))
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
                onClick={handleAddProfile}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}