export const weatherImages = {
  sunny: require("../assets/weather/01d.png"),
  sunnyN: require("../assets/weather/01n.png"),
  cloudy: require("../assets/weather/02d.png"),
  cloudyN: require("../assets/weather/02n.png"),
  clouds: require("../assets/weather/03d.png"),
  cloudsN: require("../assets/weather/03n.png"),
  sunnyRain: require("../assets/weather/09d.png"),
  sunnyRainN: require("../assets/weather/09n.png"),
  cloudyRain: require("../assets/weather/10d.png"),
  cloudyRainN: require("../assets/weather/10n.png"),
  stormy: require("../assets/weather/11d.png"),
  stormyN: require("../assets/weather/11n.png"),
  snowy: require("../assets/weather/13d.png"),
  snowyN: require("../assets/weather/13n.png"),
  foggy: require("../assets/weather/50d.png"),
  foggyN: require("../assets/weather/50n.png"),
};

const mapImage = (iconString) => {
  switch (iconString) {
    case "01d":
      return weatherImages.sunny;
    case "01n":
      return weatherImages.sunnyN;
    case "02d":
      return weatherImages.cloudy;
    case "02n":
      return weatherImages.cloudyN;
    case "03d":
      return weatherImages.clouds;
    case "03n":
      return weatherImages.cloudsN;
    case "04d":
      return weatherImages.clouds;
    case "04n":
      return weatherImages.cloudsN;
    case "09d":
      return weatherImages.sunnyRain;
    case "09n":
      return weatherImages.sunnyRainN;
    case "10d":
      return weatherImages.cloudyRain;
    case "10n":
      return weatherImages.cloudyRainN;
    case "11d":
      return weatherImages.stormy;
    case "11n":
      return weatherImages.stormyN;
    case "13d":
      return weatherImages.snowy;
    case "13n":
      return weatherImages.snowyN;
    case "50d":
      return weatherImages.foggy;
    case "50n":
      return weatherImages.foggyN;
    default:
      weatherImages.clouds;
  }
};

export default mapImage;
