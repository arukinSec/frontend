/**
 * Evaluates the access level for a given target member.
 * Returns: 'FREE', 'TRIAL', or 'PRO'
 */
export const getAccessLevel = (member) => {
  const auditorEmail = localStorage.getItem('auditor_email') || '';
  const auditorTier = localStorage.getItem('auditor_tier') || 'FREE';
  
  if (auditorTier === 'PRO') {
    return 'PRO';
  }
  
  const isSelfAudit = member?.email && auditorEmail && (member.email.toLowerCase() === auditorEmail.toLowerCase());
  if (isSelfAudit) {
    return 'TRIAL';
  }
  
  return 'FREE';
};

/**
 * Returns true if the user has either PRO or TRIAL access.
 * Useful for simple boolean checks in the UI to unlock features.
 */
export const hasProAccess = (member) => {
  const level = getAccessLevel(member);
  return level === 'PRO' || level === 'TRIAL';
};
