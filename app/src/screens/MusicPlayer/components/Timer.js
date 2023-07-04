import React, { useState, useEffect, useContext } from "react";
import { Text } from "react-native";
import { AudioContext } from "../../../providers/audio.context";

function Timer() {
  const { audioObj, timerDurationRef, timerVisible } = useContext(AudioContext);
  const [timeLeft, setTimeLeft] = useState(timerDurationRef.current / 1000);
  useEffect(() => {
    setTimeLeft(timerDurationRef.current / 1000);
  }, [timerDurationRef.current]);
  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft((timeLeft) => {
        if (timeLeft > 0) {
          return timeLeft - 1;
        } else {
          if (audioObj.current) {
            pauseAudio();
          }
          clearInterval(timerId);
          return 0;
        }
      });
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);
  const pauseAudio = async () => {
    await audioObj.current.pauseAsync();
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };
  return <></>;
  if (timerVisible == false) {
  }
  return (
    <Text style={{ color: "white", fontWeight: 500 }}>
      {timeLeft > 0 ? formatTime(timeLeft) : ""}
    </Text>
  );
}

export default Timer;
