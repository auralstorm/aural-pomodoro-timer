import { RouterProvider } from "react-router-dom";

import { router } from "@/router";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
// 副作用：注册 taskStore→timerStore 响应式同步
import "@/features/focus/focusTaskBinding";

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
