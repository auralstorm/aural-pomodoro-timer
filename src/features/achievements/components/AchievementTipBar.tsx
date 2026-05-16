import { drawerTipsBackground } from "../data/drawerIconAssets";

export function AchievementTipBar() {
  return (
    <div
      className="mt-5 flex min-h-14 items-center justify-center overflow-hidden bg-cover bg-center px-6 py-4 text-sm font-semibold text-muted-foreground"
      style={{ backgroundImage: `url(${drawerTipsBackground})` }}
    >
      <span>继续加油，你的每一次专注都在让未来的你更优秀！</span>
    </div>
  );
}
