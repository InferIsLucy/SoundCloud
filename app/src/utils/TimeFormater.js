export const formatTime = (durationMillis) => {
  //279.902

  const minutes = Math.floor(durationMillis / 1000 / 60);
  const seconds = Math.floor((durationMillis / 1000) % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
export function convertFirebaseTimestamp(timestamp) {
  const date = timestamp.toDate();
  const hours = date.getHours();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${hours} giờ ${day}/${month}/${year}`;
}
