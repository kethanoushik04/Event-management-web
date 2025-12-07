import React, { useState } from "react";
import EditEventModal from "./EditEventModal";
import ViewLogsModal from "./ViewLogsModal";

export default function EventCard({ event, onEventUpdated }) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openLogs, setOpenLogs] = useState(false);

  return (
    <>
      <div className="border rounded p-4 shadow-sm bg-gray-50">
        <div className="flex justify-between">
          <div>
            <p className="text-gray-700">
              <span className="font-medium">Timezone:</span> {event.timezone}
            </p>
            <p>
              <span className="font-medium">Start:</span>{" "}
              {new Date(event.startDate).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">End:</span>{" "}
              {new Date(event.endDate).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Profiles: {event.profiles.map((p) => p.name).join(", ")}
            </p>
          </div>

          <div className="space-y-2">
            <button
              className="bg-yellow-500 text-white px-3 py-1 rounded"
              onClick={() => setOpenEdit(true)}
            >
              Edit
            </button>

            <button
              className="bg-blue-600 text-white px-3 py-1 rounded"
              onClick={() => setOpenLogs(true)}
            >
              View Logs
            </button>
          </div>
        </div>
      </div>

      {openEdit && (
        <EditEventModal
          event={event}
          isOpen={openEdit}
          onClose={() => setOpenEdit(false)}
          onUpdated={onEventUpdated}
        />
      )}

      {openLogs && (
        <ViewLogsModal eventId={event._id} close={() => setOpenLogs(false)} />
      )}
    </>
  );
}
