import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-change-me"
);

// Which roles can access each route prefix
const ROUTE_ROLES: Array<{ prefix: string; exact?: boolean; roles: string[] }> = [
  { prefix: "/dashboard", exact: true, roles: ["admin", "equipo"] },
  { prefix: "/equipo", roles: ["admin"] },
  { prefix: "/clientes", roles: ["admin", "ventas"] },
  { prefix: "/presupuesto", roles: ["admin", "ventas", "equipo"] },
  { prefix: "/ajustes", roles: ["admin"] },
];

function getAllowedRoles(pathname: string): string[] {
  // Sorted longest-first for specificity
  const sorted = [...ROUTE_ROLES].sort((a, b) => b.prefix.length - a.prefix.length);
  for (const entry of sorted) {
    if (entry.exact ? pathname === entry.prefix : pathname.startsWith(entry.prefix)) {
      return entry.roles;
    }
  }
  return ["admin", "ventas", "equipo"];
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow these
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("session")?.value;

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);
    const rol = payload.rol as string;

    // API routes: authenticated users pass (route handlers do their own checks)
    if (pathname.startsWith("/api/")) {
      return NextResponse.next();
    }

    // Page routes: check role
    const allowed = getAllowedRoles(pathname);
    if (!allowed.includes(rol)) {
      const redirect = rol === "ventas" ? "/presupuesto" : "/dashboard";
      return NextResponse.redirect(new URL(redirect, req.url));
    }

    return NextResponse.next();
  } catch {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("session");
    return res;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
