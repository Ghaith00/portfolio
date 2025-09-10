"use client";
import ContactForm from "@/components/ContactForm";
import { useSite } from "@/lib/site-context";
import { FiMapPin } from "react-icons/fi";
import { MdOutlineAlternateEmail } from "react-icons/md";


export default function ContactPage() {
	const { site } = useSite();
	return (
		<div className="space-y-14 pt-25">
			<section className="grid md:grid-cols-2 gap-10 items-start">
				<div>
					<h1 className="text-3xl md:text-5xl font-bold leading-tight">
						Let&apos;s discuss your Project
					</h1>
					<p className="mt-4 text-base md:text-lg opacity-80 leading-relaxed">
						I&apos;m available for freelance work. Drop me a line if you have a project you think I&apos;d be a good fit for.
					</p>
					<div className=" justify-between items-center">
						<div className="max-w-84 pt-4 flex xs:not-odd:my-3 rounded">
							<div className="h-10 md:h-12 aspect-square rounded bg-purple-200/50 dark:bg-purple-400/20 text-purple-700 dark:text-purple-300 flex items-center justify-center"><FiMapPin className="svg-inline--fa fa-location-dot text-lg md:text-xl text-picto-primary" /></div>
							<div className="ms-3.25">
								<p className="text-[12px] md:text-[14px] text-zinc-600 dark:text-zinc-400 font-normal">Address</p>
								<p className="text-[14px] md:text-[16px] text-zinc-900 dark:text-zinc-100 font-medium">{site.address}</p>
							</div>
						</div>
					</div>
					<div className=" justify-between items-center ">
						<div className="max-w-84 pt-4 flex xs:not-odd:my-3 rounded">
							<div className="h-10 md:h-12 aspect-square rounded bg-purple-200/50 dark:bg-purple-400/20 text-purple-700 dark:text-purple-300 flex items-center justify-center">
								<MdOutlineAlternateEmail className="svg-inline--fa fa-location-dot text-lg md:text-xl text-picto-primary" /></div>
							<div className="ms-3.25">
								<p className="text-[12px] md:text-[14px] text-zinc-600 dark:text-zinc-400 font-normal">My Email</p>
								<p className="text-[14px] md:text-[16px] text-zinc-900 dark:text-zinc-100 font-medium">{site.email}</p>
							</div>
						</div>
					</div>
				</div>
				<ContactForm />
			</section>
		</div>
	);
}
