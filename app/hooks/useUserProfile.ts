import { UserProfile } from "../types/GamificationTypes";
import { useEffect, useState } from "react";
import { loadProfile } from "../services/UserProfileStorage";

export function useUserProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        let mounted = true;

        (async () => {
            const p = await loadProfile();
            if (mounted) setProfile(p);
        })();

        return () => {
            mounted = false;
        };
    }, []);

    return { profile, setProfile };
}
