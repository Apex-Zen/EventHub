import type { ReactNode } from "react";
import Brand from "./Brand";
export default function AuthHeader({ onHome, children }: { onHome: () => void; children: ReactNode }) {
 return <header className="topbar"><Brand onClick={onHome} />{children}</header>;
}
