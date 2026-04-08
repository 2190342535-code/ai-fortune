# AI运势小程序 - 部署指南

**更新日期：2026-04-08**

---

## 🚀 一键部署步骤

### 第一步：注册必要服务（需要你在浏览器操作）

#### 1. MongoDB Atlas（免费数据库）
1. 打开：https://www.mongodb.com/atlas
2. 点击 "Start Free" → 用邮箱注册
3. 选择 "Free" 套餐 → 创建集群
4. 设置用户名和密码（记住它！）
5. **网络访问**：Network Access → Add IP Address → 填 `0.0.0.0/0`
6. **获取连接字符串**：
   - Database → Connect → Connect your application
   - 复制类似：`mongodb+srv://username:password@cluster0.xxx.mongodb.net/?retryWrites=true&w=majority`

#### 2. DeepSeek API（免费额度）
1. 打开：https://platform.deepseek.com/
2. 注册账号 → 进入控制台
3. API Keys → 创建新密钥
4. 复制密钥（只显示一次！）

---

### 第二步：上传代码到GitHub

```bash
# 在GitHub创建新仓库：ai-fortune
# 然后推送代码：
cd C:\Users\12233\.openclaw\workspace\ai-fortune
git init
git add .
git commit -m "AI运势小程序 v1.0"
git remote add origin https://github.com/你的用户名/ai-fortune.git
git push -u origin main
```

---

### 第三步：Vercel部署

1. 打开：https://vercel.com
2. 用GitHub登录 → Import Project
3. 选择刚上传的仓库
4. **配置环境变量**（Settings → Environment Variables）：

| 变量名 | 值 |
|--------|-----|
| MONGODB_URI | mongodb+srv://...（你的Atlas连接字符串） |
| DEEPSEEK_API_KEY | sk-...（你的DeepSeek密钥） |
| MONGODB_DB | ai-fortune |

5. 点击 Deploy！🎉

---

## 📁 项目结构

```
ai-fortune/
├── frontend/          # Vue3前端（H5）
│   └── src/
│       ├── views/   # 14个页面
│       ├── stores/  # 状态管理
│       └── utils/  # 工具
├── backend/         # Vercel后端
│   ├── api/       # 11个API
│   └── services/  # 服务
├── prompts/        # 10个AI Prompt
└── docs/          # 文档
```

---

## ✅ 部署检查清单

- [ ] MongoDB Atlas 注册 + 连接字符串
- [ ] DeepSeek API 注册 + API Key  
- [ ] GitHub 仓库创建 + 代码推送
- [ ] Vercel 导入 + 环境变量配置
- [ ] 访问 https://your-project.vercel.app 测试

---

## 🔧 本地开发（可选）

```bash
# 安装依赖
cd ai-fortune/frontend
npm install

# 启动前端
npm run dev

# 后端需要Vercel CLI
npm i -g vercel
vercel dev
```

---

## 📞 支持

如果部署遇到问题，请检查：
1. 环境变量是否正确配置
2. MongoDB网络白名单是否设为0.0.0.0
3. DeepSeek API Key是否正确

---

**部署成功后就可以使用AI运势小程序了！** 🎉