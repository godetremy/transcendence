import { isAccountExistByMail } from "@/database/users/isAccountExist";
import { forgotPasswordForm } from "@/schema/ForgotPasswordForm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) : Promise<NextResponse> {
    try {
        const body = await req.json();

        const field = forgotPasswordForm.safeParse({
                    email: body.email,
        });

        if (!field.success) {
			return NextResponse.json(
                {
                    message: field.error.issues[0].message,
                },
                { status: 400 }
            );
		}

        const exist = await isAccountExistByMail(field.data.email);

        if (!exist) {
            return NextResponse.json(
                {
                    message: `Error: Email not in database`,
                },
                { status: 400 }
            );
        }

        

        return NextResponse.json({ message: `Success` }, {
            status: 200,
        });
    } catch(err) {
        return NextResponse.json({ message: `Failed` }, {
            status: 500,
        });
    }
}
