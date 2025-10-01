// Tipos
import { Task } from "./Task";

// Tipo para parâmetros de rota
export type RootStackParamList = {
    List: undefined;
    Form: { task?: Task } | undefined;
};
