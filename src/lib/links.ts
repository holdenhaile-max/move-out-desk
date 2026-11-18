export function outboundRel(affiliateUrl: string | null | undefined): string {
  if (affiliateUrl) return "sponsored nofollow noopener noreferrer";
  return "noopener noreferrer";
}

export function outboundHref(
  website: string,
  affiliateUrl: string | null | undefined,
): string {
  return affiliateUrl || website;
}
