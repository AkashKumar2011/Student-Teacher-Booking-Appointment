// src/utils/helpers.js
export function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export function formatTime(timeString) {
  return timeString.replace(/(\d+):(\d+) - (\d+):(\d+)/, (match, h1, m1, h2, m2) => {
    const period1 = h1 >= 12 ? 'PM' : 'AM';
    const period2 = h2 >= 12 ? 'PM' : 'AM';
    const displayH1 = h1 > 12 ? h1 - 12 : h1;
    const displayH2 = h2 > 12 ? h2 - 12 : h2;
    return `${displayH1}:${m1} ${period1} - ${displayH2}:${m2} ${period2}`;
  });
}

export function getUserInitials(name) {
  if (!name) return '';
  return name.split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('');
}