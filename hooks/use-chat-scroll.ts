import { useEffect, useState } from "react";

type ChatScrollProps = {
    chatRef: React.RefObject<HTMLDivElement>;
    bottonRef: React.RefObject<HTMLDivElement>;
    shouldLoadMore: boolean;
    loadMore: () => void;
    count: number;
};

// Used to scroll the messages
export const useChatScroll = ({
    chatRef,
    bottonRef,
    shouldLoadMore,
    loadMore,
    count
}: ChatScrollProps) => {
    const [hasInitialized, setHasInitialized] = useState(false);

    // Loads more messages if scrolling up
    useEffect(() => {
        const topDiv = chatRef?.current;

        const handleScroll = () => {
            const scrollTop = topDiv?.scrollTop;

            if (scrollTop === 0 && shouldLoadMore) {
                loadMore();
            }
        };

        topDiv?.addEventListener("scroll", handleScroll);

        return () => {
            topDiv?.removeEventListener("scroll", handleScroll);
        }
    }, [shouldLoadMore, loadMore, chatRef]);

    // Automatically scrolls the user to the bottom if sending new message
    useEffect(() => {
        const bottonDiv = bottonRef?.current;
        const topDiv = chatRef.current;
        const shouldAutoScroll = () => {
            if (!hasInitialized && bottonDiv) {
                setHasInitialized(true);
                return true;
            }

            if (!topDiv) {
                return false;
            }

            const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
            return distanceFromBottom <= 100;
        }

        if (shouldAutoScroll()) {
            setTimeout(() => {
                bottonRef.current?.scrollIntoView({
                    behavior: "smooth"
                });
            }, 100);
        }
    }, [bottonRef, chatRef, count, hasInitialized]);
}