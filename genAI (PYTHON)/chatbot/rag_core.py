# rag_core.py
import os
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.llms import HuggingFacePipeline
from transformers import pipeline

def load_qa_chain():
    pdf_path = "document/health.pdf"

    loader = PyPDFLoader(pdf_path)
    docs = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    chunks = splitter.split_documents(docs)

    embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

    db = Chroma.from_documents(chunks, embedding_model, persist_directory="vectordb")
    retriever = db.as_retriever(search_kwargs={"k": 3})

    generator = pipeline(
        "text-generation",
        model="tiiuae/falcon-7b-instruct",
        max_new_tokens=256,
        temperature=0.7
    )
    llm = HuggingFacePipeline(pipeline=generator)

    qa = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)
    return qa
