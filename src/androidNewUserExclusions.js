// September 12 was corrected in both source workbooks and restored to reporting.
export const ANDROID_NEW_USER_EXCLUSIONS = {};

export function markAndroidNewUserExclusions(rows, comparisonExclusions = []) {
  return rows.map(row => {
    const exclusionReason = ANDROID_NEW_USER_EXCLUSIONS[row.date]
      || (comparisonExclusions.includes(row.date) ? '同星期对照已排除，非异常日' : null);
    return { ...row, excluded: Boolean(exclusionReason), exclusionReason };
  });
}
