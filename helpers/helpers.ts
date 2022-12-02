export const cutTimeFromDate = ({ date }: { date: Date }) => {
  return String(date).slice(0, String(date).indexOf("T"));
};
