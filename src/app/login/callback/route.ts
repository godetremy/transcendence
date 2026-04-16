import { NextRequest, NextResponse } from "next/server";
import { redirect } from 'next/navigation';
import { getFortyTwoMe, getFortyTwoOauthToken } from "@/rest/fortytwo";

export async function GET(request: NextRequest): Promise<NextResponse> {
	const params: URLSearchParams = request.nextUrl.searchParams;
    const code: string | null = params.get('code');

    if (code === null)
        return redirect('/login');
    try {
        const authorization = await getFortyTwoOauthToken(code);
        const me = await getFortyTwoMe(authorization.access_token);
        console.log(me);
        return new NextResponse(`${me.displayname} is connected`);
    } catch(err: unknown) {
        return new NextResponse(`Failed to login. Please try again later.`, {
            status: 500
        });
    }
}
