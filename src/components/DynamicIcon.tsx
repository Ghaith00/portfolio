import { IconName, ICONS } from "@/lib/types";


export function Icon({ name, ...props }: { name: IconName } & React.ComponentProps<"svg">) {
	const Cmp = ICONS[name];
	return Cmp ? <Cmp {...props} /> : null;
}
