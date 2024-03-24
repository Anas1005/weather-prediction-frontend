import axios from "axios";
import WeatherInfo from "./WeatherInfo";
import WeatherForecast from "./WeatherForecast";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import "./SearchForm.css"; // Import CSS file for styling

var newSocket;

function SearchForm(props) {
  const [weatherData, setWeatherData] = useState({ ready: false });
  const [city, setCity] = useState(props.defaultCity);

  useEffect(() => {
    console.log("Inside UE...");
    newSocket = io("https://weather-prediction-xfpl.onrender.com");
    newSocket.on("connect", () => {
      console.log("Socket Connected");
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    newSocket.on("sensorData", (weatherData) => {
      console.log("Sensor...");
      setWeatherData({
        ready: true,
        city: "Rourkela",
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        pressure: weatherData.pressure,
        icon: "01d",
        date: new Date(),
        coordinates: { lat: -23.5475, lon: -46.6361 },
      });
    });

    return () => {
      newSocket.off("sensorData");
    };
  }, []);

  return (
    <div className={`SearchForm ${weatherData.ready ? 'loaded' : ''}`}>
      {weatherData.ready ? (
        <>
          <WeatherInfo data={weatherData} />
          <WeatherForecast coordinates={weatherData.coordinates} />
        </>
      ) : (
        <div>Loading....</div>
      )}
    </div>
  );
}

export default SearchForm;
