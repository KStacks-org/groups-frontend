import {
	FaAtom,
	FaBiohazard,
	FaBookOpen,
	FaBriefcase,
	FaCalculator,
	FaChartBar,
	FaCode,
	FaComments,
	FaFlask,
	FaLanguage,
	FaMoon,
	FaMosque,
	FaPencilRuler,
	FaShieldAlt,
	FaUsers,
} from "react-icons/fa";
import { MdOutlineBiotech } from "react-icons/md";
import type { IconType } from "react-icons";
import { RiEnglishInput } from "react-icons/ri";
import { TbSpeakerphone } from "react-icons/tb";

export const courseIconMap: Record<string, IconType> = {
	// FCIT
	CPIS: FaCode,
	CPCS: FaCode,
	CPIT: FaCode,
	CS: FaCode,
	CYB: FaShieldAlt,

	// Science
	MATH: FaCalculator,
	STAT: FaChartBar,
	PHYS: FaAtom,
	CHEM: FaFlask,
	BIO: MdOutlineBiotech,
	BIOC: FaBiohazard,
	ASTR: FaMoon,

	// Engineering
	IE: FaPencilRuler,
	EE: FaPencilRuler,
	MENG: FaPencilRuler,
	ME: FaPencilRuler,

	// Communication
	AVP: FaComments,
	PR: FaComments,
	MRK: FaComments,
	COMM: FaComments,

	// Literature & Languages
	ENGL: RiEnglishInput,
	ELIS: RiEnglishInput,
	ARAB: FaLanguage,
	FLAN: FaLanguage,
	ISLS: FaMosque,
	SOC: FaUsers,
	SOCW: FaUsers,

	// Business & Management
	BUS: FaBriefcase,
	ACC: FaBriefcase,
	MRKT: TbSpeakerphone,
	MIS: FaBriefcase
};

export function getCourseIcon(fullCode: string): IconType {
	const prefix = fullCode.split("-")[0].trim().toUpperCase();
	return courseIconMap[prefix] ?? FaBookOpen;
}
