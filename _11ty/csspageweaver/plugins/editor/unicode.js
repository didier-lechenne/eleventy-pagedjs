/**
 * Caractères Unicode pour la typographie
 * @see https://unicode.org/charts/
 */
export const UNICODE_CHARS = {
  // ========================
  // ESPACES SPÉCIAUX
  // ========================

  NO_BREAK_THIN_SPACE: "\u202F", /** Espace fine insécable (U+202F) - Utilisée avant ; ! ? en français */
  NO_BREAK_SPACE: "\u00A0", /** Espace insécable (U+00A0) - Utilisée avant : en français */

  // ========================
  // GUILLEMETS ET APOSTROPHES
  // ========================

  LDQUO: "\u201C", /** Guillemet ouvrant anglais (U+201C) " */
  RDQUO: "\u201D", /** Guillemet fermant anglais (U+201D) " */

  LAQUO: "\u00AB", /** Guillemet français ouvrant (U+00AB) */
  RAQUO: "\u00BB", /** Guillemet français fermant (U+00BB) */

  MIDDLE_DOT: "\u00B7", // U+00B7
  
  // ========================
  // LETTRES ACCENTUÉES
  // ========================
  A_GRAVE: "\u00C0", // À
  A_ACUTE: "\u00C1", // Á  
  A_CIRC: "\u00C2",  // Â
  A_UML: "\u00C4",   // Ä
  C_CEDIL: "\u00C7", // Ç
  E_GRAVE: "\u00C8", // È
  E_ACUTE: "\u00C9", // É
  E_CIRC: "\u00CA",  // Ê
  E_UML: "\u00CB",   // Ë
  I_GRAVE: "\u00CC", // Ì
  I_ACUTE: "\u00CD", // Í
  I_CIRC: "\u00CE",  // Î
  I_UML: "\u00CF",   // Ï
  O_GRAVE: "\u00D2", // Ò
  O_ACUTE: "\u00D3", // Ó
  O_CIRC: "\u00D4",  // Ô
  O_UML: "\u00D6",   // Ö
  U_GRAVE: "\u00D9", // Ù
  U_ACUTE: "\u00DA", // Ú
  U_CIRC: "\u00DB",  // Û
  U_UML: "\u00DC",   // Ü

  // ========================
  // TIRETS
  // ========================

  EN_DASH: "\u2013", /** Tiret demi-cadratin (U+2013) – Pour les plages (ex: 87–90) */
  EM_DASH: "\u2014", /** Tiret cadratin (U+2014) — Pour les incises */

};