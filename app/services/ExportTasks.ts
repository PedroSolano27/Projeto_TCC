// Funções para exportar/importar tarefas

// Tipos
import { Task } from "../types/Task";

// Terceiros
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { TaskStorage } from "./TaskStorage";

// Elementos
import { Alert } from "react-native";

export function ExportTasks() {
    const { getAllTasks, addTask, updateTask } = TaskStorage();

    const [loading, setLoading] = useState<boolean>(false);

    // Gera um nome com timestamp e salva no diretorio de documentos
    const getExportFilename = () => {
        const ts = new Date().toISOString().replace(/[:.]/g, "-");
        return `tarefas-export-${ts}.json`;
    };

    // Exporta tarefas, abre a folha de compartilhamento
    async function exportTasks() {
        try {
            setLoading(true);
            const tasks = await getAllTasks();
            const json = JSON.stringify(tasks, null, 2);

            const filename = getExportFilename();
            const filepath = `${FileSystem.documentDirectory}${filename}`;

            await FileSystem.writeAsStringAsync(filepath, json, {
                encoding: FileSystem.EncodingType.UTF8,
            });

            // Compartilha o arquivo (abre a folha nativa)
            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
                await Sharing.shareAsync(filepath, {
                    mimeType: "application/json",
                });
            } else {
                Alert.alert("Exportar", `Arquivo salvo em: ${filepath}`);
            }
        } catch (err) {
            console.warn("Erro ao exportar tarefas", err);
            Alert.alert("Erro", "Não foi possível exportar as tarefas.");
        } finally {
            setLoading(false);
        }
    }

    // Importa tarefas, permite ao usuário selecionar um arquivo JSON
    async function importTasks() {
        try {
            setLoading(true);
            const res = await DocumentPicker.getDocumentAsync({
                type: "application/json",
                copyToCacheDirectory: true,
            });

            // Usuário cancelou
            if (res.canceled === true) {
                return;
            }

            const content = await FileSystem.readAsStringAsync(res.uri, {
                encoding: FileSystem.EncodingType.UTF8,
            });

            let imported: any;
            try {
                imported = JSON.parse(content);
            } catch (err) {
                Alert.alert(
                    "Importar",
                    "Arquivo inválido. Certifique-se de selecionar um arquivo JSON válido.",
                );
                return;
            }

            if (!Array.isArray(imported)) {
                Alert.alert(
                    "Importar",
                    "Arquivo inválido. Esperado um array de tarefas.",
                );
                return;
            }

            // Pergunta ao usuário se quer mesclar ou substituir
            Alert.alert(
                "Importar tarefas",
                "Deseja mesclar as tarefas do arquivo com as existentes, ou substituir todas as tarefas atuais?",
                [
                    { text: "Cancelar", style: "cancel" },
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
        } finally {
            setLoading(false);
        }
    }

    // Mescla as tarefas: adiciona novas e atualiza existentes pelo id
    async function mergeTasks(items: Task[]) {
        try {
            setLoading(true);
            const existing = await getAllTasks();
            const map = new Map(existing.map((t) => [t.id, t]));

            for (const it of items) {
                if (!it || !it.id) continue; // ignora entradas inválidas

                if (map.has(it.id)) {
                    // atualiza
                    await updateTask(it);
                } else {
                    // adiciona
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

    // Substitui todas as tarefas pelas do arquivo
    async function replaceTasks(items: Task[]) {
        // Para substituir, remover todas e re-adicionar
        try {
            setLoading(true);

            // Primeiro remove todas existentes
            const existing = await getAllTasks();
            for (const t of existing) {
                await TaskStorage().removeTask(t.id);
            }

            // Em seguida adiciona as importadas
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
