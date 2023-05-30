export const formatTime = (durationMillis) => {
  //279.902

  const minutes = Math.floor(durationMillis / 1000 / 60);
  const seconds = Math.floor((durationMillis / 1000) % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
