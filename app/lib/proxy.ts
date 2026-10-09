export { auth as middleware } from "@/app/lib/auth";

export const config = {
  matcher: ["/products/:id/edit", "/products/:id/delete"],
};