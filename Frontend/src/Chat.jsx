import './Chat.css';
import { useContext, useState, useEffect, useRef } from 'react';
import { MyContext } from './MyContext.jsx';
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChat } = useContext(MyContext);
  const [displayedText, setDisplayedText] = useState("");
  const [typingIndex, setTypingIndex] = useState(null);
  const typingRef = useRef(null);

  useEffect(() => {
    if (!prevChat || prevChat.length === 0) return;

    const lastIndex = prevChat.length - 1;
    const lastChat = prevChat[lastIndex];

    // Only type if it's a new chat + assistant message
    if (newChat && lastChat.role === "assistant" && typingIndex !== lastIndex) {
      setTypingIndex(lastIndex);
      setDisplayedText("");

      let i = 0;
      typingRef.current = setInterval(() => {
        setDisplayedText(lastChat.content.slice(0, i + 1));
        i++;
        if (i >= lastChat.content.length) {
          clearInterval(typingRef.current);
          typingRef.current = null;
        }
      }, 30);
    }

    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
    };
  }, [prevChat, newChat]);

  return (
    <>
      {newChat && <h1>What would you like me to do?</h1>}

      <div className="chats">
        {prevChat?.map((chat, idx) => {
          return (
            <div
              className={chat.role === "user" ? "userDiv" : "gptDiv"}
              key={idx}
            >
              {chat.role === "user" ? (
                <p className="userMsg">{chat.content}</p>
              ) : newChat && idx === typingIndex ? (
                // Typing effect only for new chat’s last assistant reply
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {displayedText}
                </ReactMarkdown>
              ) : (
                // All old messages render directly
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {chat.content}
                </ReactMarkdown>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Chat;
