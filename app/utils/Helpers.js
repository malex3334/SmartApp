import { useNavigation, useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

function formatTimestamp(timestamp) {
  const date = new Date(timestamp * 1000);
  const options = {
    // weekday: "long",
    // year: "numeric",
    month: "numeric",
    day: "2-digit",
    // hour: '2-digit',
    // minute: '2-digit',
    // second: '2-digit',
    hour12: false,
  };
  return date.toLocaleDateString("pl-PL", options);
}

export default formatTimestamp;

export function getHours(timestamp) {
  const date = new Date(timestamp * 1000);
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const HHMM = date.toLocaleString("pl-PL", options).slice(-5);
  return HHMM;
}

export function formatGarageTimestamp(timestamp, options) {
  const date = new Date(timestamp * 1000);
  // const options = {
  //   // weekday: "long",
  //   year: "numeric",
  //   month: "numeric",
  //   day: "2-digit",
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   second: "2-digit",
  //   hour12: false,
  // };
  return date.toLocaleDateString("pl-PL", options);
}
