import { randomInt } from "crypto";

export async function random_code() {
    const code = randomInt(0, 1000000).toString().padStart(6, randomInt(0, 9).toString());

    return code;
}
