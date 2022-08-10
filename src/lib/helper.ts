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

export function getLocalWorkspaceId(): string {
  const workspaceId: string | null = localStorage.getItem('workspaceId')!;
  return workspaceId;
}
