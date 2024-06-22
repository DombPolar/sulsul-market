export async function GET() {
  const baseURL = "https://kauth.kakao.com/oauth/authorize";
  const params = {
    client_id: process.env.KAKAO_CLIENT_ID!,
    redirect_uri: process.env.KAKAO_REDIRECT_URL!,
    response_type: "code",
  };

  const formattedParams = new URLSearchParams(params).toString();
  const finalUrl = `${baseURL}?${formattedParams}`;
  return new Response(null, { status: 302, headers: { Location: finalUrl } });
}
