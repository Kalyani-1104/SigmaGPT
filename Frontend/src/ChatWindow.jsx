import './ChatWindow.css';
import Chat from "./Chat.jsx";
import { MyContext } from './MyContext.jsx';
import { useContext, useState, useEffect } from 'react';
import { PropagateLoader } from "react-spinners";

function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, setCurrThreadId, prevChat, setPrevChat } = useContext(MyContext);
    let [loding, setLoding] = useState(false);

    const getReply = async () => {
        setLoding(true);
        console.log(prompt, currThreadId);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            let response = await fetch("http://localhost:8080/api/chat", options);
            const res = await response.json();
            console.log(res);
            setReply(res.reply);
        } catch (error) {
            console.log(error);
        };
        setLoding(false);
    }

    useEffect(() => {
        if (prompt && reply) {
            setPrevChat((prevChat) => 
                [...prevChat,
                    {
                        role: "user",
                        content: prompt
                    },
                    {
                        role: "assistant",
                        content: reply
                    }
                ]
            )
        };

        setPrompt("");
    }, [reply]);

    return (
        <div className='chatWindow'>
            <div className='navbar'>
                <span>SigmaGPT &nbsp; <i className="fa-solid fa-angle-down"></i></span>
                <div className='userIconDiv'>
                    <i className="userIcon fa-solid fa-user"></i>
                </div>
            </div>

            <Chat />

            <PropagateLoader color='#fff' loading={loding} />

            <div className='chatInput'>
                <div className='inputBox'>
                    <input
                        type="text"
                        placeholder='Ask Anything'
                        value={prompt}
                        onChange={
                            (e) => setPrompt(e.target.value)
                        }
                        onKeyDown={
                            (e) => e.key === "Enter" ? getReply() : null
                        }
                    />
                    <div className='submit' onClick={getReply}>
                        <i className="fa-regular fa-paper-plane"></i>
                    </div>
                </div>
                <p className='info'>
                    SigmaGPT can make mistakes. Check important info.&nbsp;
                    <a href="">See Cookie Preferences.</a>
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;