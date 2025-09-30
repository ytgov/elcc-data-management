/**
 * Don't overuse this, it's not a full SQL parser.
 * It's only purpose is to make SQL formatted by Sequelize 6 a bit more readable during development.
 */
export function compactSql(sql: string) {
  const multiLineCommentPattern = /\/\*[\s\S]*?\*\//g
  const singleLineCommentPattern = /--.*$/gm
  const multiWhitespacePattern = /\s+/g

  return sql
    .replace(multiLineCommentPattern, "")
    .replace(singleLineCommentPattern, "")
    .replace(multiWhitespacePattern, " ")
    .trim()
}

export default compactSql
