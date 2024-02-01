export { default } from "next-auth/middleware";

// export const config = {
//   matcher: [],
// };

// This function can be marked `async` if using `await` inside
// export async function middleware(request) {
//   if (request.nextUrl.pathname.startsWith("/api/")) {
//     // const { user } = await getServerSession(request, NextResponse, authOptions);
//     if (user?.active === false) {
//       return NextResponse.redirect(new URL("/blocked", request.url));
//     }
//   }

//   if (request.nextUrl.pathname.startsWith("/dashboard/")) {
//     // const { data: session } = useSession();
//     // const { user } = await getServerSession(request, NextResponse, authOptions);
//     if (session?.user?.id === null) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//   }
// }

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard/:path*"],
};
