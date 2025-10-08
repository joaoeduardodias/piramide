export function getBasePath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length >= 2) {
    return `/${parts[0]}/${parts[1]}`;
  }
  return `/${parts[0] || ""}`;
}