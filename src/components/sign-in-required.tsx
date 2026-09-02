import { Link } from "@tanstack/react-router";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const loginUrl = `${import.meta.env.VITE_API_URL}/auth/login`;

interface SignInRequiredProps {
	/** What the visitor is being asked to sign in for. */
	description?: string;
	/** Off on the landing page, where search is what this links back to. */
	showBackLink?: boolean;
}

export function SignInRequired({
	description,
	showBackLink = true,
}: SignInRequiredProps) {
	return (
		<main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-12">
			<div className="w-full max-w-md border border-border bg-card p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
				<img
					src="/kgroups-light.svg"
					alt=""
					aria-hidden="true"
					className="block dark:hidden h-12 w-auto mx-auto mb-6"
				/>
				<img
					src="/kgroups-dark.svg"
					alt=""
					aria-hidden="true"
					className="hidden dark:block h-12 w-auto mx-auto mb-6"
				/>

				<h1 className="text-xl font-bold tracking-tight mb-2">
					Sign in to continue
				</h1>
				<p className="text-sm text-muted-foreground mb-6 text-balance">
					{description ??
						"Groups is a KStack service that requires a valid account. Sign in through the portal to browse and share course groups."}
				</p>

				<a
					href={loginUrl}
					className={cn(buttonVariants({ size: "lg" }), "w-full")}
				>
					Sign in with KStack
					<LuArrowRight data-icon="inline-end" />
				</a>

				{showBackLink && (
					<Link
						to="/"
						className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
					>
						<LuArrowLeft className="h-3.5 w-3.5" />
						Back to search
					</Link>
				)}
			</div>
		</main>
	);
}
