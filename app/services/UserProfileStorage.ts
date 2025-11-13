import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile } from "../types/GamificationTypes";

const STORAGE_KEY = "@user_profile_v1";

const defaults: UserProfile = {
    xp: 0,
    level: 1,
    coins: 0,
    streak: 0,
    points: 0,
    badges: [],
    id: "local",
    lastCompletionDate: null,
};

export async function loadProfile(): Promise<UserProfile> {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
            return defaults;
        }
        return JSON.parse(raw) as UserProfile;
    } catch (err) {
        console.warn("loadProfile error", err);
        return defaults;
    }
}

export async function saveProfile(profile: UserProfile): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (err) {
        console.warn("saveProfile error", err);
    }
}

export function requiredXpForLevel(l: number) {
    return Math.round(100 * Math.pow(1.4, l - 1));
}
