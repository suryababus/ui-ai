import { type NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
type User = {
  name: string;
  picture: string;
  iss: string;
  aud: string;
  auth_time: number;
  user_id: string;
  sub: string;
  iat: number;
  exp: number;
  email: string;
  email_verified: boolean;
  firebase: Firebase;
};

interface Firebase {
  identities: Identities;
  sign_in_provider: string;
}

interface Identities {
  "google.com": string[];
  email: string[];
}

export async function middleware(request: NextRequest) {
  try {
    console.log("middleware", request.url);
    console.log("middleware");
    const token = request.cookies.get("token")?.value;
    const user = jose.decodeJwt(token ?? "") as User;
    console.log("middlewareToken", user);
    const resp = NextResponse.next();
    resp.headers.set("email", user.email);
    resp.headers.set("profile-img", user.picture);

    // const decodedToken = await verifyToken(token);
    // console.log("email", decodedToken.email);

    return resp;
  } catch (error) {
    // return NextResponse.redirect("http://localhost:3000/");
    return NextResponse.next();
  }
}
