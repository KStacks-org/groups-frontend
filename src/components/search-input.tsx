import { LuSearch } from "react-icons/lu";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchInputProps {
    setSearchQuery: Dispatch<SetStateAction<string>>;
}

export function SearchInput({ setSearchQuery }: SearchInputProps) {
    const [inputValue, setInputValue] = useState("");
    const debouncedValue = useDebounce(inputValue, 1000);

    useEffect(() => {
        setSearchQuery(debouncedValue);
    }, [debouncedValue, setSearchQuery]);

    return (
        <div className="relative w-full">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder="ARAB-101, رياضيات 1, etc."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pl-10 h-12 text-base bg-background shadow-sm"
            />
        </div>
    );
}
