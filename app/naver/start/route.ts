export async function GET() {
  const baseURL = "https://nid.naver.com/oauth2.0/authorize";
  const params = {
    client_id: process.env.NAVER_CLIENT_ID!,
    redirect_uri: process.env.NAVER_REDIRECT_URL!,
    response_type: "code",
    state: "YOUR_UNIQUE_STATE" // CSRF 보호를 위해 고유한 값을 설정합니다.
  };

  const formattedParams = new URLSearchParams(params).toString();
  const finalUrl = `${baseURL}?${formattedParams}`;
  return Response.redirect(finalUrl);
}
