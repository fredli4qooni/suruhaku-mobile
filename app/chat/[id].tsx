/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║                    FREDLI FOURQONI                           ║
 * ║                  Software Developer                          ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * @author      Fredli Fourqoni
 * @github      https://github.com/fredli4qooni
 * @copyright   Copyright (c) 2026 Fredli Fourqoni. All rights reserved.
 * @license     Apache License, Version 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * ──────────────────────────────────────────────────────────────
 * @file        [id].tsx
 * @description Chat screen file
 * @created     2026-04-24
 * ──────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity,
    FlatList, KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc } from 'firebase/firestore';
import axios from 'axios';
import { db } from '../../src/infrastructure/firebase/firebaseService';
import { useAuthStore } from '../../src/presentation/store/authStore';
import { useTaskStore } from '../../src/presentation/store/taskStore';

export default function ChatScreen() {
    const { id, title } = useLocalSearchParams();
    const router = useRouter();
    const flatListRef = useRef<FlatList>(null);

    const { user } = useAuthStore();
    const { acceptBid, isLoading: isTaskLoading } = useTaskStore();

    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');
    const [roomData, setRoomData] = useState<any>(null);

    const API_URL = 'http://10.234.135.249:3000/api';

    useEffect(() => {
        if (!id) return;
        const roomRef = doc(db, 'chat_rooms', id as string);
        const unsubscribeRoom = onSnapshot(roomRef, (docSnap) => {
            if (docSnap.exists()) {
                setRoomData(docSnap.data());
            }
        });
        return () => unsubscribeRoom();
    }, [id]);

    useEffect(() => {
        if (!id) return;
        const messagesRef = collection(db, 'chat_rooms', id as string, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        const unsubscribeMessages = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(msgs);
        });

        return () => unsubscribeMessages();
    }, [id]);

    const sendMessage = async () => {
        if (inputText.trim() === '' || !user) return;
        try {
            const messagesRef = collection(db, 'chat_rooms', id as string, 'messages');
            await addDoc(messagesRef, {
                text: inputText,
                senderId: user.id,
                senderName: user.name,
                createdAt: serverTimestamp(),
            });
            setInputText('');
        } catch (error) {
            console.error("Gagal kirim pesan:", error);
        }
    };

    const sendSystemMessage = async (text: string) => {
        try {
            const messagesRef = collection(db, 'chat_rooms', id as string, 'messages');
            await addDoc(messagesRef, {
                text: text,
                senderId: 'system',
                senderName: 'Sistem',
                createdAt: serverTimestamp(),
                isSystem: true
            });
        } catch (error) {
            console.error("Gagal kirim pesan sistem:", error);
        }
    };

    const handleAcceptBid = async () => {
        if (!roomData?.bid_id) return;

        const executeAccept = async () => {
            const success = await acceptBid(roomData.bid_id, id as string);
            if (success) {
                await sendSystemMessage("🤝 Kesepakatan tercapai! Dana telah dikunci di Escrow. Pesuruh dipersilakan mulai bekerja.");
                if (Platform.OS === 'web') window.alert("Berhasil: Kesepakatan terkunci! Status berubah menjadi 'Taken'.");
                else Alert.alert("Berhasil", "Kesepakatan terkunci! Status tugas berubah menjadi 'Taken'.");
            } else {
                if (Platform.OS === 'web') window.alert("Gagal menyetujui penawaran.");
                else Alert.alert("Gagal", "Terjadi kesalahan saat menyetujui penawaran.");
            }
        };

        if (Platform.OS === 'web') {
            const confirmed = window.confirm("Apakah Anda yakin sepakat dengan harga penawaran saat ini? Dana Anda akan ditahan dengan aman di Escrow.");
            if (confirmed) await executeAccept();
        } else {
            Alert.alert(
                "Sepakat & Kunci Harga",
                "Apakah Anda yakin sepakat dengan harga penawaran saat ini? Dana Anda akan ditahan dengan aman di Escrow.",
                [
                    { text: "Batal", style: "cancel" },
                    { text: "Ya, Sepakat", onPress: executeAccept }
                ]
            );
        }
    };

    const handleCompleteTask = async () => {
        const executeComplete = async () => {
            try {
                const response = await axios.post(`${API_URL}/tasks/complete`, {
                    task_id: id,
                    pesuruh_id: roomData?.pesuruh_id,
                    proof_image_url: 'https://via.placeholder.com/150'
                });

                if (response.data.success) {
                    await sendSystemMessage("✅ Tugas Selesai! Dana telah dicairkan ke Pesuruh. Terima kasih telah menggunakan SuruhAKU.");
                    if (Platform.OS === 'web') {
                        window.alert("Berhasil! Tugas selesai dan dana telah diberikan ke Pesuruh.");
                        router.replace('/home');
                    } else {
                        Alert.alert("Berhasil!", "Tugas selesai dan dana telah diberikan ke Pesuruh.", [
                            { text: "OK", onPress: () => router.replace('/home') }
                        ]);
                    }
                }
            } catch (error: any) {
                const errorMsg = error.response?.data?.error || error.message;
                if (Platform.OS === 'web') window.alert("Gagal: " + errorMsg);
                else Alert.alert("Gagal", errorMsg);
            }
        };

        if (Platform.OS === 'web') {
            const confirmed = window.confirm("Apakah tugas ini sudah diselesaikan dengan baik? Dana akan langsung dicairkan ke Pesuruh.");
            if (confirmed) await executeComplete();
        } else {
            Alert.alert(
                "Konfirmasi Selesai",
                "Apakah tugas ini sudah diselesaikan dengan baik? Dana akan langsung dicairkan ke Pesuruh.",
                [
                    { text: "Batal", style: "cancel" },
                    { text: "Ya, Cairkan Dana", onPress: executeComplete }
                ]
            );
        }
    };

    const renderMessage = ({ item }: { item: any }) => {
        if (item.senderId === 'system' || item.isSystem) {
            return (
                <View style={styles.systemMessageContainer}>
                    <Text style={styles.systemMessageText}>{item.text}</Text>
                </View>
            );
        }

        const isMe = item.senderId === user?.id;
        return (
            <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage]}>
                {!isMe && <Text style={styles.senderName}>{item.senderName || 'Pesuruh'}</Text>}
                <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessageText]}>
                    {item.text}
                </Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={90}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={{ width: 60 }}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle} numberOfLines={1}>{title || 'Ruang Obrolan'}</Text>

                {user?.role === 'customer' ? (
                    roomData?.status === 'negotiating' ? (
                        <TouchableOpacity style={styles.dealBtn} onPress={handleAcceptBid} disabled={isTaskLoading}>
                            {isTaskLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.dealBtnText}>Sepakat 🤝</Text>}
                        </TouchableOpacity>
                    ) : roomData?.status === 'active' ? (
                        <TouchableOpacity style={styles.completeBtn} onPress={handleCompleteTask}>
                            <Text style={styles.completeBtnText}>Selesai ✓</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={{ width: 80 }} />
                    )
                ) : (
                    <View style={{ width: 80 }} />
                )}
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.chatList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Ketik pesan..."
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendButtonText}>Kirim</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f7fa' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, paddingTop: 40, borderBottomWidth: 1, borderBottomColor: '#eee' },
    backText: { color: '#0066ff', fontSize: 16, fontWeight: 'bold' },
    headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', flex: 1, textAlign: 'center', marginHorizontal: 10 },
    
    dealBtn: { backgroundColor: '#0066ff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, width: 90, alignItems: 'center' },
    dealBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
    completeBtn: { backgroundColor: '#00cc66', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, width: 80, alignItems: 'center' },
    completeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
    
    chatList: { padding: 15, paddingBottom: 30 },
    messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 15, marginBottom: 10 },
    myMessage: { alignSelf: 'flex-end', backgroundColor: '#0066ff', borderBottomRightRadius: 0 },
    theirMessage: { alignSelf: 'flex-start', backgroundColor: '#e6e6e6', borderBottomLeftRadius: 0 },
    senderName: { fontSize: 10, color: '#888', marginBottom: 4, fontWeight: 'bold' },
    messageText: { fontSize: 15 },
    myMessageText: { color: '#fff' },
    theirMessageText: { color: '#333' },

    systemMessageContainer: { alignSelf: 'center', backgroundColor: '#fff3cd', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, marginVertical: 10, maxWidth: '90%', borderWidth: 1, borderColor: '#ffeeba' },
    systemMessageText: { color: '#856404', fontSize: 12, textAlign: 'center', fontStyle: 'italic' },

    inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'center' },
    input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, fontSize: 16, marginRight: 10, maxHeight: 100 },
    sendButton: { backgroundColor: '#0066ff', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
    sendButtonText: { color: '#fff', fontWeight: 'bold' },
});