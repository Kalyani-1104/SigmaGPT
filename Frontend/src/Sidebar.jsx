import './Sidebar.css'
import { useContext, useEffect } from 'react';
import { MyContext } from './MyContext';
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
    let { allThreads, setAllThreads, currThreadId, setPrompt, setReply, setCurrThreadId, setNewChat, setPrevChat } = useContext(MyContext);

    let getAllThreads = async () => {
        try {
            let response = await fetch("http://localhost:8080/api/thread");
            let res = await response.json();
            let filterData = res.map((thread) => ({
                threadId: thread.threadId,
                title: thread.title
            })
            )
            setAllThreads(filterData);
            // console.log(filterData);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getAllThreads()
    }, [currThreadId])

    let createNewChat = () => {
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setNewChat(true);
        setPrevChat([])
    };

    let changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChat(res.message || []);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            console.log(err);
        }
    }

    let deleteThread = async (threadId) => {
        try {
            let response = await fetch(`http://localhost:8080/api/thread/${threadId}`, { method: "DELETE" });
            let res = response.json();
            console.log(res);

            setAllThreads((prev => prev.filter((thread) => thread.threadId !== threadId)));

            if (threadId === currThreadId) {
                createNewChat();
            }

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <section className='sidebar'>
            <button onClick={createNewChat}>
                <img src="src/assets/logo-transparent-svg.svg" alt="" className='logo' />
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            {/* scrollable history */}
            <ul className='history'>
                {allThreads?.map((thread, idx) => (
                    <li key={idx} onClick={(e) => changeThread(thread.threadId)}>{thread.title}<i className="fa-solid fa-trash" onClick={(e) => {
                        e.stopPropagation();
                        deleteThread(thread.threadId);
                    }}></i>
                    </li>
                ))}
            </ul>
            
            {/* fixed footer */}
            <div className='sign'>
                <p>Kalyani B. Jadhav &hearts;</p>
            </div>
        </section>
    )
}

export default Sidebar;