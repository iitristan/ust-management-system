export const formatTime = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const date = new Date(0, 0, 0, hours, minutes);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
