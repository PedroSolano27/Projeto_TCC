// Funções para exportar/importar tarefas

// Tipos
import { Task } from "../types/Task";

// Terceiros
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { Alert } from "react-native";
import { TaskStorage } from "./TaskStorage";

// Hook que fornece export/import de tarefas
export function ExportTasks() {
    const { getAllTasks, addTask, updateTask, removeTask } = TaskStorage();
    const [loading, setLoading] = useState<boolean>(false);

    function getExportFilename() {
        const ts = new Date().toISOString().replace(/[:.]/g, "-");
        return `tarefas-export-${ts}.json`;
    }

    // Exporta Trefas
    async function exportTasks() {
        try {
            setLoading(true);
            const tasks: Task[] = await getAllTasks();
            const json = JSON.stringify(tasks, null, 2);
            const filename = getExportFilename();

            const filepath = `${FileSystem.documentDirectory}${filename}`;
            await FileSystem.writeAsStringAsync(filepath, json, {
                encoding: "utf8",
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(filepath, {
                    mimeType: "application/json",
                });
                setLoading(false);

                return;
            }

            Alert.alert("Exportar", `Arquivo salvo em: ${filepath}`);
            setLoading(false);

            return;
        } catch (err) {
            console.warn("Erro ao exportar tarefas", err);
            Alert.alert("Erro", "Não foi possível exportar as tarefas.");
        } finally {
            setLoading(false);
        }
    }

    // Importa Tarefas
    async function importTasks() {
        try {
            setLoading(true);
            const res = await DocumentPicker.getDocumentAsync({
                type: "application/json",
                copyToCacheDirectory: true,
            });

            if (res.canceled === true) {
                setLoading(false);
                return;
            }

            // Algumas plataformas retornam fileCopyUri, outras uri, outras assets[0].uri
            const uri = res.assets?.[0]?.uri ?? null;

            if (!uri) {
                Alert.alert("Importar", "URI do arquivo não encontrada.");
                setLoading(false);

                return;
            }

            const content = await FileSystem.readAsStringAsync(uri, {
                encoding: "utf8",
            });

            let imported: any;
            try {
                imported = JSON.parse(content);
            } catch (err) {
                console.warn("Erro ao parsear JSON importado", err);
                Alert.alert(
                    "Importar",
                    "Arquivo inválido. Certifique-se de selecionar um JSON válido.",
                );
                setLoading(false);
                return;
            }

            if (!Array.isArray(imported)) {
                Alert.alert(
                    "Importar",
                    "Arquivo inválido. Esperado um array de tarefas.",
                );
                setLoading(false);

                return;
            }

            // Opções de importação
            Alert.alert(
                "Importar tarefas",
                "Deseja mesclar as tarefas do arquivo com as existentes, ou substituir todas as tarefas atuais?",
                [
                    {
                        text: "Cancelar",
                        style: "cancel",
                        onPress: () => setLoading(false),
                    },
                    {
                        text: "Mesclar",
                        onPress: async () => {
                            await mergeTasks(imported as Task[]);
                        },
                    },
                    {
                        text: "Substituir",
                        style: "destructive",
                        onPress: async () => {
                            await replaceTasks(imported as Task[]);
                        },
                    },
                ],
            );
        } catch (err) {
            console.warn("Erro ao importar tarefas", err);
            Alert.alert("Erro", "Não foi possível importar as tarefas.");
            setLoading(false);
        }
    }

    // Atualiza por id ou adiciona
    async function mergeTasks(items: Task[]) {
        try {
            setLoading(true);
            const existing = await getAllTasks();
            const map = new Map(existing.map((t) => [t.id, t]));

            for (const it of items) {
                if (!it || !it.id) continue;
                if (map.has(it.id)) {
                    await updateTask(it);
                } else {
                    await addTask(it);
                }
            }

            Alert.alert("Importar", "Tarefas mescladas com sucesso.");
        } catch (err) {
            console.warn("Erro ao mesclar tarefas", err);
            Alert.alert("Erro", "Falha ao mesclar tarefas.");
        } finally {
            setLoading(false);
        }
    }

    // Remove todas e adiciona as importadas
    async function replaceTasks(items: Task[]) {
        try {
            setLoading(true);
            const existing = await getAllTasks();
            for (const t of existing) {
                await removeTask(t.id);
            }
            for (const it of items) {
                if (!it || !it.id) continue;
                await addTask(it);
            }
            Alert.alert("Importar", "Tarefas substituídas com sucesso.");
        } catch (err) {
            console.warn("Erro ao substituir tarefas", err);
            Alert.alert("Erro", "Falha ao substituir tarefas.");
        } finally {
            setLoading(false);
        }
    }

    return {
        exportTasks,
        importTasks,
        loading,
    };
}
