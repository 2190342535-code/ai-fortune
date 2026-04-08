# AI运势小程序 - 账号信息

**创建日期：2026-04-08**

---

## 📋 需要你注册的服务

### 1. MongoDB Atlas（免费数据库）
- **网址**: https://www.mongodb.com/atlas
- **注册方式**: Google邮箱 或 GitHub账号 登录
- **套餐选择**: Free (M0) 免费

**注册后获取连接字符串**：
1. Database → Connect → Connect your application
2. 选择 "Node.js" 
3. 复制连接字符串，格式如下：
```
mongodb+srv://username:password@clusterxxx.mongodb.net/?retryWrites=true&w=majority
```
**注意**：把 `username` 和 `password` 替换成你创建的用户名密码

---

### 2. DeepSeek API（LLM服务）
- **网址**: https://platform.deepseek.com/
- **注册方式**: 邮箱注册

**获取API Key**：
1. API Keys → Create New Key
2. 复制密钥（只显示一次！）

---

### 3. Vercel（部署平台）
- **网址**: https://vercel.com
- **注册方式**: GitHub账号登录

**部署步骤**：
1. Import Project → 选择GitHub仓库
2. 设置环境变量：
   - MONGODB_URI = 你的Atlas连接字符串
   - DEEPSEEK_API_KEY = 你的DeepSeek密钥
   - MONGODB_DB = ai-fortune

---

## 📝 需要记录的信息

| 服务 | 记录位置 | 状态 |
|------|----------|------|
| MongoDB 连接字符串 | 稍后填写 | ⏳ |
| DeepSeek API Key | 稍后填写 | ⏳ |