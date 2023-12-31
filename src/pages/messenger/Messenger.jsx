import { useContext, useEffect, useRef, useState } from 'react'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import Conversation from '../../components/conversation/Conversation'
import Message from '../../components/message/Message'
import Topbar from '../../components/topbar/Topbar'
import './messenger.css'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import io from 'socket.io-client';
import Lottie from 'react-lottie';


const Messenger = () => {

    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const socket = useRef();
    const { user } = useContext(AuthContext);
    const [chatBoxClass, setChatBoxClass] = useState(false);
    const [chatMenuClass, setChatMenuClass] = useState(false);
    const [currentChatUser, setCurrentChatUser] = useState(null);
    const scrollRef = useRef();
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    


    useEffect(() => {
        socket.current = io("https://sociosync.onrender.com");
        // socket.on("typing", () => setIsTyping(true));
        // socket.on("stop typing", () => setIsTyping(false));
        socket.current.on("getMessage", data => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            })
        })
    }, [])

    useEffect(() => {
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat])

    useEffect(() => {
        socket.current.emit("addUser", user._id);
        socket.current.on("getUsers", users => {
            setOnlineUsers(user.followings.filter((f) => users.some((u) => u.userId === f)));
        })
    }, [user]);

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get("https://sociosync.onrender.com/api/conversation/" + user._id);
                setConversations(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        getConversations();
    }, [user._id])

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get("https://sociosync.onrender.com/api/message/" + currentChat?._id);
                setMessages(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        const getUser = async () => {
            try {
                const res = await axios.get("https://sociosync.onrender.com/api/user?userId=" + currentChat?.members[0]);
                setCurrentChatUser(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        getMessages();
        getUser();
    }, [currentChat]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id
        };

        const receiverId = currentChat.members.find((member) => member !== user._id);
        console.log(receiverId);
        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId: receiverId,
            text: newMessage,
        });

        try {
            const res = await axios.post("https://sociosync.onrender.com/api/message/", message);
            setMessages([...messages, res.data]);
        } catch (error) {
            console.log(error);
        }
        setNewMessage("");
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView();
    });

    const handleChatbox = async (c) => {
        setCurrentChat(c);
        setChatBoxClass(true);
        setChatMenuClass(true);
    }

    const handleBackButton = () => {
        setChatBoxClass(false);
        setChatMenuClass(false);
        setCurrentChat(null);
    }

    // const typingHandler = (e) => {
    //     setNewMessage(e.target.value);

    //     //Typing indicator logic

    //     if (!typing) {
    //         setTyping(true);
    //         socket.emit('typing', currentChat._id);
    //     }
    //     let lastTypingTime = new Date().getTime();
    //     var timerLength = 3000;
    //     setTimeout(() => {
    //         var timeNow = new Date().getTime();
    //         var timeDiff = timeNow - lastTypingTime;

    //         if (timeDiff >= timerLength && typing) {
    //             socket.emit("stop typing", currentChat._id);
    //             setTyping(false);
    //         }
    //     }, timerLength);

    // }


    return (
        <>
            <Topbar />
            <div className='messenger' >
                <div className={chatMenuClass ? "chatMenu-Mobile" : "chatMenu"}>
                    <div className="chatMenuWrapper">
                        <input type="text" className="chatMenuInput" placeholder='Srach For Friends' />
                        {conversations.map(c => (
                            <div onClick={() => handleChatbox(c)}>
                                <Conversation key={c._id} conversations={c} currentUser={user} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className={chatBoxClass ? "chatBox-Mobile" : "chatBox"}>

                    <div className="chatBoxWrapper">
                        <div className={chatBoxClass ? "chatBoxHeader" : "d-none"} >
                            <ArrowCircleLeftIcon onClick={handleBackButton} className='closeIcon' fontSize='large' />
                            <span className='chatBoxUsername' >{currentChatUser?.username}</span>
                        </div>
                        {currentChat ? <>
                            <div className="chatBoxTop">
                                {messages.map((m) => (
                                    <div ref={scrollRef} >
                                        <Message key={m._id} message={m} own={m.sender === user._id} />
                                    </div>
                                ))}
                            </div>
                            {/* {isTyping ? <div>
                                <Lottie
                                    options={defaultOptions}
                                    width={70}
                                    height={40}
                                    style={{ marginBottom: 15, marginLeft: 0 }}
                                />
                            </div> : (<></>)} */}
                            <div className="chatBoxBottom">
                                <textarea
                                    className='chatMessageInput'
                                    placeholder='Write something'
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    value={newMessage}
                                ></textarea>
                                <button className='chatSubmitButton' onClick={handleSubmit} >Send</button>
                            </div>
                        </> : <span className='noConversationText' >Open a conversation to start a chat</span>}
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Messenger
