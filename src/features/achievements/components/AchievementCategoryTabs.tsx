import { SegmentedTabs } from "@/components/common/SegmentedTabs";

import { achievementCategories } from "../data/achievementCategories";
import { drawerCategoryIcons } from "../data/drawerIconAssets";
import type { AchievementCategoryFilter } from "../types";

type AchievementCategoryTabsProps = {
  value: AchievementCategoryFilter;
  onChange: (value: AchievementCategoryFilter) => void;
};

export function AchievementCategoryTabs({
  value,
  onChange,
}: AchievementCategoryTabsProps) {
  const options = achievementCategories.map((category) => ({
    ...category,
    icon: (
      <img
        alt=""
        className="size-4 object-contain"
        draggable={false}
        src={drawerCategoryIcons[category.value]}
      />
    ),
  }));

  return (
    <SegmentedTabs
      className="w-full overflow-x-auto"
      onChange={onChange}
      options={options}
      value={value}
    />
  );
}
