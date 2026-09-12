/**
 * Clean & lightweight time formatter for chat messages and notifications
 * No external heavy libraries (like moment or date-fns) needed!
 */
export const formatMessageTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  // Format time as 10:30 AM
  const timeStr = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) {
    return timeStr;
  }

  // Check if yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return `Yesterday ${timeStr}`;
  }

  // Older than yesterday: Mon, 12 Sep 10:30 AM
  return `${date.toLocaleDateString([], { month: "short", day: "numeric" })} ${timeStr}`;
};
