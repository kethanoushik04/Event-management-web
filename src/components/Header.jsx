import React, { useState } from "react";
import Select from "react-select";

export default function Header({
  profiles,
  onCreateProfile,
  currentProfile,
  setCurrentProfile,
}) {
  const [openAdd, setOpenAdd] = useState(false);
  const [profileName, setProfileName] = useState("");

  const options = profiles.map((p) => ({
    label: p.name,
    value: p._id,
  }));

  const createProfile = async () => {
    if (!profileName.trim()) return;
    const created = await onCreateProfile(profileName);
    setCurrentProfile(created);
    setProfileName("");
    setOpenAdd(false);
  };

  return (
    <div className="p-6 bg-white shadow-sm flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold">Event Management</h1>
        <p className="text-gray-600 text-sm">
          Create and manage events across multiple timezones
        </p>
      </div>

      <div className="w-72">
        <Select
          options={options}
          placeholder="Select profile"
          value={
            currentProfile
              ? { label: currentProfile.name, value: currentProfile._id }
              : null
          }
          onChange={(sel) => {
            const found = profiles.find((p) => p._id === sel.value);
            setCurrentProfile(found);
          }}
          isClearable
        />

        <div className="mt-3">
          {!openAdd && (
            <button
              className="text-sm text-blue-600 underline"
              onClick={() => setOpenAdd(true)}
            >
              + Create new profile
            </button>
          )}

          {openAdd && (
            <div className="flex gap-2">
              <input
                className="border rounded px-2 py-1 w-full"
                placeholder="Profile name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />
              <button
                onClick={createProfile}
                className="bg-blue-600 text-white px-3 rounded"
              >
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
