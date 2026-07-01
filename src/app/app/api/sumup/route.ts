import { SumupCreateCheckoutsSchema } from "@/schema/SumupCreateCheckoutsSchema";
import { SumupCreateCheckouts } from "@/types/SumupCreateCheckouts";
import { errorHandler, ERRORS_DETAILS } from "@/utils/errors";
import { parseBody } from "@/utils/parsing";
import SumUp from "@sumup/sdk";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const client = new SumUp({ apiKey: process.env.SUMUP_API_KEY ?? "" });

export async function POST(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const body = await parseBody<SumupCreateCheckouts>(req, SumupCreateCheckoutsSchema);
		const checkout = await client.checkouts.create({
			amount: body.amount,
			checkout_reference: randomUUID(),
			currency: "EUR",
			merchant_code: process.env.SUMUP_MERCHANT_CODE ?? "",
			...( body.description && { description: body.description, } ),
			redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/app/me/membership`,
			hosted_checkout: { enabled: true },
  		});

		if (!checkout.hosted_checkout_url) throw ERRORS_DETAILS.sumup_does_not_exist_url();

		return NextResponse.json({ success: true, redirect_url: checkout.hosted_checkout_url });
	});
}
