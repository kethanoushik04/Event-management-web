import React, { useState } from "react";
import {
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaEdit,
  FaListAlt,
} from "react-icons/fa";
import EditEventModal from "./EditEventModal";
import ViewLogsModal from "./ViewLogsModal";

export default function EventCard({
  event,
  onEventUpdated,
  profiles,
  onCreateProfile,
}) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openLogs, setOpenLogs] = useState(false);

  const formatDateTime = (date) => {
    const d = new Date(date);
    return {
      date: d.toLocaleDateString(),
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const start = formatDateTime(event.startDate);
  const end = formatDateTime(event.endDate);
  const created = formatDateTime(event.createdAt);
  const updated = event.updatedAt ? formatDateTime(event.updatedAt) : null;

  return (
    <>
      <div className="border rounded p-4 shadow-sm bg-gray-50">
        {/* Profiles */}
        <div className="flex items-center mb-3">
          <FaUser className="text-gray-500 mr-2" />
          <span className="text-gray-700 text-sm">
            {event.profiles.map((p) => p.name).join(", ")}
          </span>
        </div>

        {/* Start Date */}
        <div className="flex items-center mb-2">
          <FaCalendarAlt className="text-gray-500 mr-2" />
          <div>
            <p className="text-gray-700 font-medium">Start:</p>
            <p className="text-gray-500 text-sm">
              {start.date} <FaClock className="inline mx-1 text-gray-400" />{" "}
              {start.time}
            </p>
          </div>
        </div>

        {/* End Date */}
        <div className="flex items-center mb-2">
          <FaCalendarAlt className="text-gray-500 mr-2" />
          <div>
            <p className="text-gray-700 font-medium">End:</p>
            <p className="text-gray-500 text-sm">
              {end.date} <FaClock className="inline mx-1 text-gray-400" />{" "}
              {end.time}
            </p>
          </div>
        </div>

        <hr className="my-3 border-gray-300" />

        <div className="text-gray-500 text-sm mb-3">
          <p>
            Created on: {created.date} at {created.time}
          </p>
          {event.updatedAt && event.updatedAt !== event.createdAt && (
            <p>
              Updated on: {updated.date} at {updated.time}
            </p>
          )}
        </div>

        <div className="flex gap-3 mt-2">
          <button
            className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
            onClick={() => setOpenEdit(true)}
          >
            <FaEdit /> Edit
          </button>

          <button
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            onClick={() => setOpenLogs(true)}
          >
            <FaListAlt /> View Logs
          </button>
        </div>
      </div>

      {openEdit && (
        <EditEventModal
          event={event}
          isOpen={openEdit}
          onClose={() => setOpenEdit(false)}
          onUpdated={onEventUpdated}
          profiles={profiles} 
          onCreateProfile={onCreateProfile} 
        />
      )}

      {openLogs && (
        <ViewLogsModal
          eventId={event._id}
          isOpen={openLogs}
          onClose={() => setOpenLogs(false)}
        />
      )}
    </>
  );
}
