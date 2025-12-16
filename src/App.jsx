import React, { useEffect, useState } from "react";
import API from "./api.js";
import Header from "./components/Header";
import CreateEventForm from "./components/CreateEventForm";
import EventList from "./components/EventList";

export default function App() {
  const [profiles, setProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [viewTimezone, setViewTimezone] = useState("IST");

  // Load all profiles
  const loadProfiles = async () => {
    const res = await API.get("/profiles");
    setProfiles(res.data);
    if (!currentProfile && res.data.length > 0) setCurrentProfile(res.data[0]);
  };

  // Load events for selected profile
  const loadEvents = async (profileId = currentProfile?._id) => {
    if (!profileId) {
      setEvents([]);
      return;
    }
    const res = await API.get(`/events/profile/${profileId}`);
    setEvents(res.data);
  };

  // Load profiles on mount
  useEffect(() => {
    loadProfiles();
  }, []);

  // Load events when profile changes
  useEffect(() => {
    if (currentProfile) loadEvents(currentProfile._id);
  }, [currentProfile]);

  // Create profile API call
  const onCreateProfile = async (name) => {
    const res = await API.post("/profiles", { name });
    setProfiles((prev) => [res.data, ...prev]);
    return res.data; // return new profile
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        profiles={profiles}
        setProfiles={setProfiles}
        onCreateProfile={onCreateProfile}
        currentProfile={currentProfile}
        setCurrentProfile={setCurrentProfile}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <CreateEventForm
          profiles={profiles}
          setProfiles={setProfiles}
          onCreate={async (payload) => {
            if (!currentProfile) {
              alert("Please select a profile first");
              return;
            }

            try {
              await API.post("/events", payload);
              // Reload events for current profile
              await loadEvents(currentProfile._id);
              alert("Event created successfully");
            } catch (err) {
              alert(err.response?.data?.message || "Failed to create event");
            }
          }}
          onCreateProfile={onCreateProfile}
        />

        <EventList
          events={events}
          viewTimezone={viewTimezone}
          setViewTimezone={setViewTimezone}
          onEventUpdated={() => loadEvents(currentProfile._id)}
          profiles={profiles} // add this
          onCreateProfile={onCreateProfile} // add this
        />
      </div>
    </div>
  );
}