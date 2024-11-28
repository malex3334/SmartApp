import { Vibration } from "react-native";
import * as Haptics from "expo-haptics";

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

export const launchVibrations = (option) => {
  switch (option) {
    case "success":
      console.log(option);
      Vibration.vibrate([200, 100, 500]);
      break;
    case "fail":
      Vibration.vibrate([200, 100, 200, 100, 200]);
      break;
    case "confirm":
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      break;
    default:
      console.log("def", option);
      Vibration.vibrate([200]);
  }
};
