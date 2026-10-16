// September 12 was corrected in both source workbooks and restored to reporting.
export const ANDROID_NEW_USER_EXCLUSIONS = {"2026-10-09":"新增数据异常，已排除","2026-10-13":"新增数据异常，已排除","2026-10-14":"用户确认恶意刷量，安卓新增相关分子分母同步排除"};

export function markAndroidNewUserExclusions(rows, comparisonExclusions = []) {
  return rows.map(row => {
    const exclusionReason = ANDROID_NEW_USER_EXCLUSIONS[row.date]
      || (comparisonExclusions.includes(row.date) ? '同星期对照已排除，非异常日' : null);
    return { ...row, excluded: Boolean(exclusionReason), exclusionReason };
  });
}
