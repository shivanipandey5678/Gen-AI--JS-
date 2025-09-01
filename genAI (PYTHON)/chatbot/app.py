# app.py
import streamlit as st
from rag_core import load_qa_chain

st.set_page_config(page_title="Health RAG Chatbot")

st.title("💬 Health FAQ Chatbot (RAG)")
st.markdown("Ask any question from the uploaded health PDF document.")

# Load the QA chain
qa_chain = load_qa_chain()

# User input
question = st.text_input("Your question:")

if question:
    with st.spinner("Thinking..."):
        answer = qa_chain.run(question)
    st.success("📜 Answer:")
    st.write(answer)
