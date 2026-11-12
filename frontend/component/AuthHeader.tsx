import type { ReactNode } from "react";
import Brand from "./Brand";
export default function AuthHeader({ onHome, children, brandVariant = "auth" }: { onHome: () => void; children: ReactNode; brandVariant?: "auth" | "landing" }) {
 return <header className="topbar"><Brand variant={brandVariant} onClick={onHome} />{children}</header>;
}
