import { useEffect, useState } from "react";

// Hook used to read the current URL (aka localhost:3000)
export const useOrigin = () => {
    // Explanation on mount: https://www.geeksforgeeks.org/what-does-it-mean-for-a-component-to-be-mounted-in-reactjs/
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // If typeof window is not undefined and if there's a window.location.origin, render the window.location.origin, otherwise render an empty string
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";

    // If the component is not mounted, render an empty string
    if (!mounted) {
        return "";
    }

    return origin;
}