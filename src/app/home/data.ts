import { readJsonBlob, readJsonLocal, USE_BLOB } from "@/lib/data";
import { ProfileContent } from "./types";


export async function getProfileContent(): Promise<ProfileContent> {
	const data = USE_BLOB
		? await readJsonBlob<ProfileContent>("profile.json")
		: await readJsonLocal<ProfileContent>("profile.json");
	return data ?? {};
}
