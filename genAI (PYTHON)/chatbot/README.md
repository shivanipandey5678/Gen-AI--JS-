# 🧠 RAG-powered Health FAQ Chatbot

This is a **Retrieval-Augmented Generation (RAG)** chatbot that can answer questions from a PDF (`health.pdf`) using **open-source models** and a **simple web UI** built with Streamlit.

---

## 🚀 What It Does

- Loads a PDF file
- Splits it into chunks
- Creates embeddings using SentenceTransformer
- Stores embeddings in ChromaDB
- Uses a Hugging Face model (Falcon-7B or Mistral) to answer questions
- Shows responses in a friendly chat interface

---

## 📁 Project Structure

