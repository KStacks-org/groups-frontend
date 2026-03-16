import { Link } from "@tanstack/react-router";
import { LuInfo, LuMenu, LuHouse } from "react-icons/lu";
import type { IconType } from "react-icons";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";

interface NavLink {
	href: string;
	label: string;
	icon: IconType;
	/** Whether this is an internal TanStack Router route */
	internal?: boolean;
	/** Whether to show in the desktop nav bar */
	desktop?: boolean;
}

const navLinks: NavLink[] = [
	{ href: "/", label: "Home", icon: LuHouse, internal: true, desktop: false },
	{ href: "/about", label: "About", icon: LuInfo, desktop: true },
];


export function Navbar() {
	const [open, setOpen] = useState(false);

	return (
		<header className="bg-background border-b border-border py-4 px-6 flex justify-between items-center sticky top-0 z-50">
			{/* --- LEFT SIDE: Logo --- */}
			<Link to="/" className="flex items-center gap-3 select-none group">
				<div className="font-bold text-2xl tracking-tight text-foreground">
					KAUStack <span className="text-green-600 dark:text-green-400">Groups</span>
				</div>
			</Link>

			{/* --- RIGHT SIDE: Actions --- */}
			<nav className="flex items-center gap-3">
			{/* DESKTOP LINKS (Hidden on mobile) */}
			<div className="hidden md:flex items-center gap-6 mr-2">
				{navLinks.filter((l) => l.desktop).map((link) => (
					<a
						key={link.href}
						href={link.href}
						className="flex items-center font-medium text-sm text-muted-foreground hover:text-green-600 dark:hover:text-green-400 transition-colors"
					>
						<span>{link.label}</span>
					</a>
				))}
			</div>

				{/* Theme Toggle (Visible on all screens) */}
				<ThemeToggle />

				{/* MOBILE MENU (Visible only on mobile) */}
				<div className="md:hidden">
					<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger render={<Button variant="outline" size="icon" />}>
						<LuMenu className="h-5 w-5" />
						<span className="sr-only">Toggle menu</span>
					</SheetTrigger>
						<SheetContent side="right">
							<SheetHeader className="text-left border-b pb-4 mb-4">
								<SheetTitle className="flex items-center gap-2">
									{/*<img src="/favicon.svg" alt="Logo" className="h-6 w-6" />*/}
									<span>Menu</span>
								</SheetTitle>
							</SheetHeader>

						<div className="flex flex-col gap-4 ml-auto mr-auto w-[90%]">
							{navLinks.map((link) =>
								link.internal ? (
									<Link
										key={link.href}
										to={link.href as "/"}
										onClick={() => setOpen(false)}
										className="flex items-center gap-3 px-2 py-2 text-lg font-medium hover:bg-muted transition-colors"
										activeProps={{ className: "bg-muted text-green-600 dark:text-green-400" }}
									>
										<link.icon className="h-5 w-5" />
										{link.label}
									</Link>
								) : (
									<a
										key={link.href}
										href={link.href}
										onClick={() => setOpen(false)}
										className="flex items-center gap-3 px-2 py-2 text-lg font-medium hover:bg-muted transition-colors"
									>
										<link.icon className="h-5 w-5" />
										{link.label}
									</a>
								)
							)}
						</div>
						</SheetContent>
					</Sheet>
				</div>
			</nav>
		</header>
	);
}