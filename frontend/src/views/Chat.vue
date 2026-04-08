<template>
  <div class="page chat-page">
    <div class="header">
      <h1 class="title">AI聊天</h1>
      <p class="subtitle">和AI聊聊你的运势</p>
    </div>

    <!-- 聊天记录 -->
    <div class="chat-list" ref="chatListRef">
      <div 
        v-for="(msg, idx) in messages" 
        :key="idx"
        :class="['message', msg.role]"
      >
        <div class="message-avatar">{{ msg.role === 'user' ? '你' : 'AI' }}</div>
        <div class="message-content">{{ msg.content }}</div>
      </div>
    </div>

    <!-- 输入 -->
    <div class="input-area">
      <input 
        type="text" 
        class="input" 
        v-model="input" 
        placeholder="问点什么..."
        @keyup.enter="send"
      >
      <button class="send-btn" @click="send" :disabled="!input || loading">
        {{ loading ? '...' : '发送' }}
      </button>
    </div>

    <!-- 返回 -->
    <div class="back-btn" @click="$router.back()">
      ← 返回
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { chatAPI } from '../utils/api.js'
import { useRoleStore } from '../stores/role.js'

const roleStore = useRoleStore()
const messages = ref([])
const input = ref('')
const loading = ref(false)
const chatListRef = ref(null)

onMounted(async () => {
  const role = roleStore.currentRole
  if (role?._id) {
    try {
      const result = await fetch(`/api/chat/history/${role._id}`).then(r => r.json())
      if (result.data?.messages) {
        messages.value = result.data.messages
      }
    } catch (e) {
      console.error('获取聊天历史失败:', e)
    }
  }
})

const send = async () => {
  const role = roleStore.currentRole
  if (!role?._id || !input.value) return
  
  const userMsg = input.value
  messages.value.push({ role: 'user', content: userMsg })
  input.value = ''
  loading.value = true
  
  await nextTick()
  scrollToBottom()
  
  try {
    const history = messages.value.slice(-10)
    const result = await chatAPI.sendMessage(role._id, userMsg, history)
    if (result.data?.message) {
      messages.value.push(result.data.message)
    }
  } catch (e) {
    console.error('发送消息失败:', e)
    messages.value.push({ role: 'assistant', content: '抱歉，出了点问题，请稍后再试。' })
  } finally {
    loading.value = false
    await nextTick()
    scrollToBottom()
  }
}

const scrollToBottom = () => {
  if (chatListRef.value) {
    chatListRef.value.scrollTop = chatListRef.value.scrollHeight
  }
}
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.chat-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}

.message-content {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.6;
}

.message.user .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.message.assistant .message-content {
  background: rgba(255, 255, 255, 0.1);
}

.input-area {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(26, 26, 46, 0.95);
}

.input-area .input {
  flex: 1;
}

.send-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.back-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  font-size: 16px;
  cursor: pointer;
  z-index: 100;
}
</style>