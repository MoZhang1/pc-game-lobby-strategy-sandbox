// Operational exclusion confirmed by the user. Raw source rows remain intact.
export const ANDROID_NEW_USER_EXCLUSIONS = {
  '2026-09-12': '异常数据已排除，原因待排查',
};

export function markAndroidNewUserExclusions(rows, comparisonExclusions = []) {
  return rows.map(row => {
    const exclusionReason = ANDROID_NEW_USER_EXCLUSIONS[row.date]
      || (comparisonExclusions.includes(row.date) ? '同星期对照已排除，非异常日' : null);
    return { ...row, excluded: Boolean(exclusionReason), exclusionReason };
  });
}
