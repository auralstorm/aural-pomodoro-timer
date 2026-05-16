import { useEffect } from "react";
import { Live2DCanvas } from "@/components/assistant/AssistantLive2D";

export function DesktopAssistantPage() {
  useEffect(() => {
    document.body.dataset.layout = "assistant";
    return () => {
      delete document.body.dataset.layout;
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      <Live2DCanvas />
    </div>
  );
}
