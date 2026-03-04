import firestore from '@react-native-firebase/firestore';

export interface Message {
  id?: string;
  text: string;
  senderId: string;
  senderType: 'user' | 'doctor';
  timestamp: any;
  type: 'text' | 'image' | 'voice';
  attachmentUrl?: string;
}

export interface Chat {
  id: string;
  consultationId: number;
  userId: string;
  doctorId: string;
  lastMessage: string;
  lastTimestamp: any;
  status: 'active' | 'completed';
  unreadCount: { [key: string]: number };
  typing: { [key: string]: boolean };
}

class FirebaseService {
  private get chatsCollection() {
    return firestore().collection('chats');
  }

  async getOrCreateChat(consultationId: number, userId: string, doctorId: string): Promise<string> {
    const chatId = consultationId.toString();
    const chatDoc = await this.chatsCollection.doc(chatId).get();

    if (!chatDoc.exists) {
      await this.chatsCollection.doc(chatId).set({
        consultationId,
        userId,
        doctorId,
        participants: [userId, doctorId],
        lastMessage: '',
        lastTimestamp: firestore.FieldValue.serverTimestamp(),
        status: 'active',
        unreadCount: {
          [userId]: 0,
          [doctorId]: 0,
        },
        typing: {
          [userId]: false,
          [doctorId]: false,
        },
      });
    }

    return chatId;
  }

  /**
   * Send a message to a specific chat.
   */
  async sendMessage(chatId: string, senderId: string, senderType: 'user' | 'doctor', text: string) {
    const batch = firestore().batch();
    const chatRef = this.chatsCollection.doc(chatId);
    const messageRef = chatRef.collection('messages').doc();

    const timestamp = firestore.FieldValue.serverTimestamp();

    // Add message
    batch.set(messageRef, {
      text,
      senderId,
      senderType,
      timestamp,
      type: 'text',
    });

    // Update chat head
    batch.update(chatRef, {
      lastMessage: text,
      lastTimestamp: timestamp,
    });

    await batch.commit();
  }

  /**
   * Subscribe to messages in a chat.
   */
  subscribeToMessages(chatId: string, onUpdate: (messages: Message[]) => void) {
    return this.chatsCollection
      .doc(chatId)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        const messages: Message[] = [];
        snapshot.forEach((doc) => {
          messages.push({ id: doc.id, ...doc.data() } as Message);
        });
        onUpdate(messages);
      });
  }

  /**
   * Update typing status.
   */
  async setTypingStatus(chatId: string, userId: string, isTyping: boolean) {
    await this.chatsCollection.doc(chatId).update({
      [`typing.${userId}`]: isTyping,
    });
  }

  /**
   * Mark chat as read for a specific user.
   */
  async markAsRead(chatId: string, userId: string) {
    await this.chatsCollection.doc(chatId).update({
      [`unreadCount.${userId}`]: 0,
    });
  }
}

export default new FirebaseService();
