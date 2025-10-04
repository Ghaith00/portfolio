import { readJsonLocal } from "@/lib/data";
import { ProfileContent } from "./types";


export async function getProfileContent(): Promise<ProfileContent> {
	const data = await readJsonLocal<ProfileContent>("profile.json");
	return data ?? {};
}
