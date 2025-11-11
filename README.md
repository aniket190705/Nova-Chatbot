# 🤖 Company Assistant Chatbot  
*A context-aware AI assistant powered by Hugging Face LLMs, Astra DB Vector Database, and LangFlow.*

---

## 🚀 Overview
Company Assistant Chatbot is an **AI-powered retrieval-augmented generation (RAG)** chatbot that answers questions from internal company documents such as policies, handbooks, and guides.  

Built using **LangFlow’s visual pipeline builder**, it connects:
- 🧠 **Google Gemini** for natural-language reasoning  
- 📄 **PDF / document ingestion** for custom knowledge  
- 🪣 **Astra DB Vector Store** for fast semantic search  
- ⚙️ **Nvidia** for text-vector conversion  

Users can upload a document and chat naturally with the model — every answer is generated using the most relevant context retrieved from your files.

---

## 🧩 Tech Stack

| Layer | Technology | Description |
|--------|-------------|-------------|
| 💬 LLM | `meta-llama/Llama-3.3-70B-Instruct` | Hosted on Hugging Face Inference API |
| 🔍 Vector DB | **Astra DB Serverless (Vector)** | Stores & retrieves embeddings |
| 🧠 Embeddings | `BAAI/bge-large-en-v1.5` (1024 dims) | Sentence embeddings for chunked text |
| 🧰 Builder | **LangFlow Cloud** | No-code orchestration for LLM pipelines |
| 🗃️ Data Source | PDFs / DOCX / text files | Uploaded via LangFlow File Loader |

---


⚙️ Setup Instructions

1️⃣ Clone the Repository
```
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

2️⃣ Environment Variables

Create a .env file and add:
```
ASTRA_DB_APPLICATION_TOKEN=your_astra_token_here
ASTRA_DB_DATABASE_NAME=company-assistant
ASTRA_DB_COLLECTION_NAME=CompanyAssistant
HUGGINGFACE_API_TOKEN=your_huggingface_token_here
```

🪪 License
`
This project is released under the MIT License — feel free to modify and build upon it.
`
