// Tipos
import { Task } from "./Task";

// Tipo para parâmetros de rota
export type RootStackParamList = {
    List: undefined;
    Dashboard: undefined;
    Form: { task?: Task } | undefined;
    Settings: undefined;
};
