import { request } from "http";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return Response.json({
    ok: true,
  });
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  console.log(data);
  return Response.json(data);
}
