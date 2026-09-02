import { createFileRoute } from "@tanstack/react-router";
import { ChooseGender } from "@/components/choose-gender";
import { Hero } from "@/components/hero";
import { Search } from "@/components/search";
import { SignInRequired } from "@/components/sign-in-required";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({ component: App });

function App() {
	const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

	if (isAuthLoading) return null;
	if (!isAuthenticated) return <SignInRequired showBackLink={false} />;
	if (user?.gender === "UNKNOWN") return <ChooseGender />;

	return (
		<main className="flex-1 flex flex-col items-center px-4 py-8 max-w-5xl mx-auto w-full">
			<Hero />
			<Search />
		</main>
	);
}
