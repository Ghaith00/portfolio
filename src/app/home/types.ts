import { IconName } from "@/lib/types";


export type ExperienceContent = {
    company: string;
    logo: string;
    role: string;
    range: string;
    details: string[];
    stack: string[];
}

export type SkillContent = {
    title: string;
    color: string;
    icon: IconName;
    items: string[];
}

export type EducationContent = {
    school: string;
    degree: string;
    range: string;
    location: string;
    logo: string;
    details: string;
}

export type ProfileContent = {
    hero: {
        title: string;
        position: string;
        description: string;
        buttons: {
            label: string;
            href: string;
        }[];
        image: {
            alt: string;
            src: string;
        };
    };
    experience: ExperienceContent[];
    skills: SkillContent[];
    education: EducationContent[];
};