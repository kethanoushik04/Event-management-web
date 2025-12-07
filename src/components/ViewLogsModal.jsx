import { useEffect, useState } from "react";
import axios from "axios";

export default function ViewLogsModal({ eventId, isOpen, onClose }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (eventId) {
      axios.get(`/api/event/${eventId}/logs`)
        .then((res) => setLogs(res.data))
        .catch((err) => console.error(err));
    }
  }, [eventId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-xl p-6 shadow-xl relative">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Event Logs</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-2xl">×</button>
        </div>

        {/* Logs */}
        <div className="max-h-80 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-600 text-center">No logs available</p>
          ) : (
            logs.map((log) => (
              <div key={log._id} className="border rounded p-3 mb-3 bg-gray-50">
                <p><strong>Field:</strong> {log.field}</p>
                <p><strong>Previous:</strong> {log.oldValue || "—"}</p>
                <p><strong>Updated To:</strong> {log.newValue || "—"}</p>
                <p className="text-sm text-gray-500">
                  Edited On: {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
