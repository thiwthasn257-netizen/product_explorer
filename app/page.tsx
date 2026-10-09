import Link from "next/link";
import { auth } from "@/app/lib/auth";
import { AuthButtons } from "./components/auth-buttons";
import ProductExplorer from "./components/ProductExplorer";

export default async function Home() {
  const session = await auth();
  const isLoggedIn = Boolean(session?.user);

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>Product<span className="brand-accent">Explorer</span></span>
        </Link>
        <AuthButtons
          isLoggedIn={isLoggedIn}
          userName={session?.user?.name}
        />
      </header>
      <ProductExplorer isLoggedIn={isLoggedIn} />
    </div>
  );
}
