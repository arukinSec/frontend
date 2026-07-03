/**
 * Evaluates the access level for a given target member.
 * Returns: 'FREE', 'TRIAL', or 'PRO'
 */
export const getAccessLevel = (member) => {
  return member?.tier || 'FREE';
};

/**
 * Returns true if the user has either PRO or TRIAL access.
 * Useful for simple boolean checks in the UI to unlock features.
 */
export const hasProAccess = (member) => {
  const level = getAccessLevel(member);
  return level === 'PRO' || level === 'TRIAL';
};
