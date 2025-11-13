import { Task } from "./Task";

export type RootStackParamList = {
    List: undefined;
    Dashboard: undefined;
    Form: { task?: Task } | undefined;
    Settings: undefined;
};
