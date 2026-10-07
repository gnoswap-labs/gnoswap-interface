interface Verifiable {
  isVerified?: boolean;
}

/**
 * Verification visibility predicate shared by the Main > Tokens and Portfolio > Assets screens.
 *
 * The shared token list (GET /v1/token-metas) stays complete in the cache; verification
 * filtering is applied only to the locally derived table rows of those two screens.
 * When showUnverified is false (the default), only tokens with isVerified === true are kept.
 * A missing isVerified flag is treated as unverified.
 */
export function isVerificationVisible<T extends Verifiable>(item: T, showUnverified: boolean): boolean {
  return showUnverified || item.isVerified === true;
}

export function keepVerified<T extends Verifiable>(items: T[], showUnverified: boolean): T[] {
  return items.filter(item => isVerificationVisible(item, showUnverified));
}
