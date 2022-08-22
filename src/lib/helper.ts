/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const formatDate = (date: Date | string): string =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });

export function deleteAllCookies() {
  document.cookie.split(';').forEach((c) => {
    document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
  });
}

//use specific formats to return correct result
export const generateDateAndTime = (timeStamp: string, format: string) => {
  const dateString = String(new Date(timeStamp)).split(' ');
  if (format === 'MM-DD-YYYY') {
    try {
      return `${dateString[1]} ${dateString[2]} ${dateString[3]}`;
    } catch (error) {}
  } else if (format === 'MM-DD') {
    try {
      return `${dateString[1]} ${dateString[2]}`;
    } catch (error) {}
  } else if (format === 'HH:MM') {
    try {
      const time = dateString[4].split(':');
      const timeWithoutSeconds = `${time[0]}:${time[1]}  `;
      return timeWithoutSeconds;
    } catch (error) {}
  }
};

export function getLocalWorkspaceId(): string {
  const workspaceId: string | null = localStorage.getItem('workspaceId')!;
  return workspaceId;
}
