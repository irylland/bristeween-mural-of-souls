export function canAccessCommunity(status: string | null | undefined, isAdmin: boolean) {
  return isAdmin || status === "approved";
}