import React, { useEffect, useState } from "react";
import API from "./api";
import Header from "./components/Header";
import CreateEventForm from "./components/CreateEventForm";
import EventList from "./components/EventList";

export default function App() {
  const [profiles, setProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [viewTimezone, setViewTimezone] = useState("IST");

  const loadProfiles = async () => {
    const res = await API.get("/profiles");
    setProfiles(res.data);
  };

  const loadEvents = async (profileId = currentProfile?._id) => {
    if (!profileId) return setEvents([]);
    const res = await API.get(`/events/profile/${profileId}`);
    setEvents(res.data);
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  useEffect(() => {
    if (currentProfile) loadEvents(currentProfile._id);
  }, [currentProfile]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        profiles={profiles}
        onCreateProfile={async (name) => {
          const res = await API.post("/profiles", { name });
          setProfiles([res.data, ...profiles]);
          return res.data;
        }}
        currentProfile={currentProfile}
        setCurrentProfile={setCurrentProfile}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <CreateEventForm
          profiles={profiles}
          onCreate={async (payload) => {
            await API.post("/events", payload);
            loadEvents();
          }}
        />

        <EventList
          events={events}
          viewTimezone={viewTimezone}
          setViewTimezone={setViewTimezone}
          onEventUpdated={loadEvents}
        />
      </div>
    </div>
  );
}
