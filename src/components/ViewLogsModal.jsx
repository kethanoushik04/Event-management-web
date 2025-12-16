import { useEffect, useState } from "react";
import API from "../api";
import { FaClock } from "react-icons/fa";

export default function ViewLogsModal({ eventId, isOpen, onClose }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (isOpen && eventId) {
      API.get(`/events/${eventId}/logs`)
        .then((res) => {
          setLogs(Array.isArray(res.data) ? res.data : []);
        })
        .catch((err) => console.error(err));
    }
  }, [eventId, isOpen]);

  if (!isOpen) return null;

  /* ---------- Helpers ---------- */

  // Short time → 10:30 AM
  const formatShortTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  // Date → 15/12/2025
  const formatDate = (date) => new Date(date).toLocaleDateString();

  // Full timezone names
  const TIMEZONE_MAP = {
    IST: "Indian Standard Time (IST)",
    GMT: "Greenwich Mean Time (GMT)",
    CET: "Central European Time (CET)",
    ET: "Eastern Time (ET)",
    PT: "Pacific Time (PT)",
    UTC: "Coordinated Universal Time (UTC)",
    MT: "Mountain Time (MT)",
  };

  const getTimezoneLabel = (value) => TIMEZONE_MAP[value] || value || "—";

  const formatTimeOnly = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  // Date + time → 12-12-2025 10:15 AM
  const formatDateTime = (date) => {
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    const time = d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${day}-${month}-${year} ${time}`;
  };

  const renderValue = (field, value) => {
    if (!value) return "—";

    // startDate / endDate → always show full date + time
    if (field === "startDate" || field === "endDate") {
      return formatDateTime(value);
    }

    // timezone
    if (field === "timezone") {
      return getTimezoneLabel(value);
    }

    // profiles (array)
    if (Array.isArray(value)) {
      return value.join(", ");
    }

    return value;
  };

  /* ---------- UI ---------- */

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Event Update History</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ×
          </button>
        </div>

        {/* Logs */}
        <div className="max-h-80 overflow-y-auto space-y-3">
          {logs.length === 0 ? (
            <p className="text-gray-500 text-center">No updates yet</p>
          ) : (
            logs.map((log) => (
              <div key={log._id} className="border rounded-md p-3 bg-gray-50">
                {/* Time */}
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <FaClock className="mr-2" />
                  {formatDate(log.editedAt)} • {formatShortTime(log.editedAt)}
                </div>

                {/* Field */}
                <p className="text-gray-700 font-medium">{log.field} updated</p>

                {/* From */}
                <p className="text-sm text-gray-600">
                  From:{" "}
                  <span className="font-medium">
                    {renderValue(log.field, log.previousValue)}
                  </span>
                </p>

                {/* To */}
                <p className="text-sm text-gray-600">
                  To:{" "}
                  <span className="font-medium">
                    {renderValue(log.field, log.newValue)}
                  </span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
