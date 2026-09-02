import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
	return (
		<header className="bg-background border-b border-border h-16 px-5 md:px-8 flex justify-between items-center sticky top-0 z-50 shrink-0">
			{/* --- LEFT SIDE: Logo + wordmark --- */}
			<Link
				to="/"
				className="flex items-center gap-2.5 cursor-pointer select-none group"
			>
				<img
					src="/kgroups-light.svg"
					alt=""
					aria-hidden="true"
					className="block dark:hidden h-9 md:h-10 w-auto"
				/>
				<img
					src="/kgroups-dark.svg"
					alt=""
					aria-hidden="true"
					className="hidden dark:block h-9 md:h-10 w-auto"
				/>
				<div className="font-bold text-2xl md:text-3xl leading-none tracking-tight text-foreground">
					Groups
				</div>
			</Link>

			{/* --- RIGHT SIDE: Actions --- */}
			<nav className="flex items-center gap-2">
				<ThemeToggle />
			</nav>
		</header>
	);
}
