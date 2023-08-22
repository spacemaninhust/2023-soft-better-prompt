// 此页面为具体应用页面
import { FC,useEffect,useState,useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import {ExclamationCircleOutlined} from '@ant-design/icons'
import { Modal, message,Popover,Switch} from 'antd'
import axios from "axios"
import 'swiper/swiper-bundle.css'
import copy from 'copy-to-clipboard'
import './index.css'
type Message = {
    content: string
    sender: 'user' | 'assistant'
    timestamp: string
    isfavorite: boolean
}
const Chat:FC = ()=>{
    // 获得路由
    // const location = useLocation()
    // 获得路由id
    // const id = Number(location.pathname.split('/')[2]) - 1
    const nav = useNavigate()
    const [username,setUsername] = useState('')
    const [open,setOpen] = useState(false)
    // 定义退出modal
    const [modal_logout, contextHolder] = Modal.useModal()
    // 定义注销modal
    const [modal_unregister, contextHolders] = Modal.useModal()
    // showmodal函数
    // 退出登录，应弹出窗口提示,确认后退出
    const showmodal_logout = () => {
        modal_logout.confirm({
        title: '警告',
        icon: <ExclamationCircleOutlined />,
        content: '确认退出登录吗',
        okText: '确认',
        cancelText: '取消',
        onOk:()=>{
            logout()
        },
        })
    }
    // 注销账户，应弹出窗口提示,确认后注销
    const showmodal_unregister = () => {
        setOpen(false)
        modal_unregister.confirm({
        title: '警告',
        icon: <ExclamationCircleOutlined />,
        content: '确认注销该账户吗,注销后该账户不再存在!',
        okText: '确认',
        cancelText: '取消',
        onOk:()=>{
            unregister()
        },
        })
    }
    // popover函数
    const content = (
        <div>
            <Link to="/Personal" className="personal">个人中心</Link>
            <div style={{marginTop:'5px'}}>
                <div onClick={showmodal_logout} className="unregister">退出登录</div>
                {contextHolder}
            </div>
            <div style={{marginTop:'5px'}}>
                <div className="unregister" onClick={showmodal_unregister}>注销账户</div>
                {contextHolders}
            </div>
        </div>
    )
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
    }
    // 使用axios获得用户名
    useEffect(()=>{
        axios.get('/api/user/index')
        .then((res)=>{
            // 依据返回的code确定三个状态
            const code = res.data.data.code
            if(code === 1){
                const name = res.data.data.username
                // 设置用户名
                setUsername(name)
                // setLog(true)
            }
        })
    },[])
    // 注销函数
    const unregister = ()=>{
        axios.post('/api/user/unregister')
        .then(()=>{
            // setLog(false)
            setUsername('')
            message.success('已注销当前账户')
            nav('/')
        })
    }
    // 退出函数
    const logout = () =>{
        axios.post('/api/user/logout')
        .then(()=>{
            // setLog(false)
            setUsername('')
            message.success('已退出当前账户')
            nav('/')
        })
    }
    // 跳到首页
    const jumptoindex = ()=>{
        nav('/')
    }
    const [messages, setMessages] = useState<Message[]>([{
        content:'您好，我是您的Prompt生成助手，可以帮助您生成特定场景的高质量Prompt，请告诉我您的场景。',
        sender:'assistant',
        timestamp:new Date().toLocaleString(),
        isfavorite:false
    }])
    const [isLoading, setIsLoading] = useState(false)// 添加isLoading状态
    const [textareaValue, setTextareaValue] = useState('')
    const messageRef = useRef<HTMLDivElement>(null)
    const handelSendmessage = ()=>{
        if(textareaValue.length === 0){
            message.warning("对话不能为空哦~")
        }else{
            const newMessage: Message = {
                content: textareaValue,
                sender: 'user',
                timestamp: new Date().toLocaleString(),
                isfavorite:false
            }
            setMessages([...messages, newMessage])
            // 发送请求前设置isLoading为true
            setTextareaValue('')
            setIsLoading(true)
            axios.post('/api/user/gen_by_wenxin',{data:{text:JSON.stringify(textareaValue),code:mode}})
                .then((res)=>{
                    console.log(res)
                    const text = res.data.data.message
                    const replyMessage: Message = {
                        content: text,
                        sender: "assistant",
                        timestamp: new Date().toLocaleString(),
                        isfavorite:false
                        };
                    setMessages((prevMessages) => [...prevMessages, replyMessage]);
                    setIsLoading(false);
             })
        }
    }
    const copyanwser = (text:string)=>{
        copy(text)
        message.success("复制成功!")
    }
    const newchat = ()=>{
        if(mode === 1){
            const newMessage: Message = {
                content: '您好，我是您的Prompt生成助手，可以帮助您生成特定场景的高质量Prompt，请告诉我您的场景。',
                sender: 'assistant',
                timestamp: new Date().toLocaleString(),
                isfavorite:false
            }
            setMessages([newMessage])
        }else{
            const newMessage: Message = {
                content: '您好，我是您的Prompt优化助手，可以帮助您优化输入的Prompt，快点来试试吧~',
                sender: 'assistant',
                timestamp: new Date().toLocaleString(),
                isfavorite:false
            }
            setMessages([newMessage])
        }
    }
    useEffect(() => {
        if (messageRef.current) {
          messageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages])
    const [mode,setMode] = useState(1)
    const changemode = (e:any)=>{
        if(e){
            setMode(1)
            const newMessage: Message = {
                content: '您好，我是您的Prompt生成助手，可以帮助您生成特定场景的高质量Prompt，请告诉我您的场景。',
                sender: 'assistant',
                timestamp: new Date().toLocaleString(),
                isfavorite:false
            }
            setMessages([newMessage])
        }else{
            setMode(2)
            const newMessage: Message = {
                content: '您好，我是您的Prompt优化助手，可以帮助您优化输入的Prompt，快点来试试吧~',
                sender: 'assistant',
                timestamp: new Date().toLocaleString(),
                isfavorite:false
            }
            setMessages([newMessage])   
        }
    }
    const [tid,setTid] = useState('')
    const handleClick = (text:string,isFavorite:boolean) => {
        // 分情况发送数据
        // 收藏
        if(!isFavorite){
            // 发送prompt
            console.log(text)
            axios.post('/api/user/save_prompt',{data:text})
            .then((res)=>{
                const tmid = res.data.data.cur_id
                message.success("收藏成功!")
                setTid(tmid)
            })
        }
        // 取消收藏
        else{
            axios.post(`/api/user/delete_prompt/${tid}`)
            .then((res)=>{
                const code = res.data.data.data
                if(code === 1){
                    message.success("已取消收藏!")
                }
            })
        }
        // setIsFavorite(!isFavorite) // 切换收藏状态
        const updatedList = messages.map((message) => {
            if (message.content === text) {
              return {
                ...message,
                isfavorite: !message.isfavorite, // 切换isfavorite状态
              };
            }
            return message
          });
          setMessages(updatedList)
    }
    return (
        <div>
            <header className={"header-area header-sticky background-header"}>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <nav className="main-nav" style={{margin:'0 3%'}}>
                                <div id="nav_productName" onClick={jumptoindex}>
                                    <img id="nav_image" style={{width:'45px'}} src="./nav.png" alt="nav"/>
                                    <div style={{marginLeft:'10px'}}>
                                        <div style={{color:'#7453FC',fontStyle:'italic'}}>
                                            Better Prompt
                                        </div>
                                        <div style={{ fontStyle:'italic',fontSize:'15px'}}>
                                            Faster and more efficient
                                        </div>
                                    </div>
                                </div>
                                <ul className="nav">
                                    <li>
                                        <Link to='/'>首页</Link>
                                    </li>
                                    <li>
                                        <Link to='/Home'>全新体验</Link>
                                    </li>
                                    <li>
                                        <Link to='/Chat'  className="active">文心实战</Link>
                                    </li>
                                    <li>
                                        <Link to='/Application'>最佳应用</Link>
                                    </li>
                                    <li>
                                        <Link to='/Author'>关于我们</Link>
                                    </li>
                                    <li>
                                        <Popover content={content} open={open} trigger="hover" onOpenChange={handleOpenChange}>
                                            <a onClick={(e) => e.preventDefault()}>
                                                {username}
                                            </a>
                                        </Popover>
                                    </li>
                                </ul>   
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
            <div className="page-heading" style={{paddingTop:'5%'}}>
                <div className="col-lg-13">
                    <div style={{display:'flex',margin:'auto'}}>
                        <div className="apps">Have a try</div>
                    </div>
                </div>
                <div className="box" style={{marginTop:'10px',backgroundColor:'#4e4b4b',color:'white'}}>
                    <div className="box-left" style={{backgroundColor:'#364a52'}}>
                        <div className="box-left-top">
                            <div className="box-letf-top-title">
                                Better Prompt
                            </div>
                            <div className="box-letf-top-title2">
                                Faster and more efficient.
                            </div>
                            <div className="box-icon">
                                <img src="./nav.png" alt="icon"  />
                            </div>
                        </div>
                        <div className="rule" style={{fontStyle:"italic"}}>
                            基于文心api版本
                        </div>
                        <div>
                            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'5%'}}>
                                <div style={{fontStyle:'italic',fontSize:'14px'}}>
                                    点击右侧进行需求模式切换
                                </div>
                                <div>
                                    <Switch onChange={(e)=>{changemode(e)}} style={{backgroundColor:'#4A2EB3'}} checkedChildren="生成" unCheckedChildren="优化" defaultChecked />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div style={{display:'block',letterSpacing:'2px',alignItems:'center',justifyContent:'space-between',marginTop:'5%'}}>
                                <div className="rule">
                                    Example:
                                </div>
                                {
                                    mode === 1?
                                    <div className="text" style={{marginTop:'10%',fontSize:'16px',fontStyle:'italic'}}>
                                        微积分
                                    </div>
                                    :
                                    <div className="text" style={{marginTop:'10%',fontSize:'16px',fontStyle:'italic'}}>
                                        请作为一个专业的撰稿人，为大学项目撰写高质量、清晰的论文。在撰写过程中，请确保遵循项目的具体要求，准确理解论文的主题和目的，并充分利用可靠的事实和数据来支持你的观点。
                                    </div>
                                }
                                
                            </div>
                        </div>
                        <div className="box-left-bottom" style={mode === 1?{paddingTop:'130%'}:{paddingTop:'76%'}}>
                            <div style={{display:'inline-flex'}}>
                                <div className="address">
                                    <a target="_blank" rel="noopener noreferrer" href="https://github.com/reatcat/baidu_api">
                                        <button className="box-button" style={{backgroundColor:'#434242'}}>
                                            <div className="address-icon">
                                                <img src="./address.svg" alt="address" />
                                            </div>
                                        </button>
                                    </a>
                                </div>
                            </div>
                            <div>
                                <button className="box-button" onClick={(e)=>newchat()} style={{backgroundColor:'#434242'}}>
                                    <div className="box-button-icon">
                                        <img src="./add.svg" alt="" />
                                    </div>
                                    <div className="newchat">
                                        新的对话
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="box-right">
                        <div className="box-right-box">
                            <div className="box-chat">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`message ${message.sender === 'user' ? 'user' : 'assistant'}`}
                                        ref={index === messages.length - 1 ? messageRef : null}
                                    >
                                        <div className="message-container">
                                            <div style={{marginTop:'20px'}}>
                                                <div className="user-avatar">
                                                    <img style={{width:'25px',height:'25px'}} src={message.sender === 'user' ?"./user1.svg":"./assistant1.svg"} alt="avatar" />
                                                </div>
                                            </div>
                                            <div className="message-item">
                                                {
                                                    message.sender === 'user'?
                                                    <></>
                                                    :
                                                    index === 0?
                                                    <></>
                                                    :
                                                    <div className="actions">
                                                        <div className="action2" onClick={(e)=>handleClick(message.content,message.isfavorite)} >
                                                            <div id="star" className={`${message.isfavorite ? 'fill' : ''}`} ></div>
                                                            <div>
                                                                {message.isfavorite ? "取消收藏":"点击收藏"}
                                                            </div>
                                                        </div>
                                                        <div className="action" onClick={(e)=>copyanwser(message.content)}>
                                                            复制
                                                        </div>
                                                    </div>
                                                }
                                                <div className="message-body" style={{whiteSpace:'pre-line',color:'#f0f2f4'}}>
                                                    {message.content}
                                                </div>
                                            </div>
                                            <div className="message-time">
                                                <div >
                                                    {message.timestamp} 
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="message assistant">
                                        <div className="message-container">
                                            <div style={{marginTop:'20px'}}>
                                                <div className="user-avatar">
                                                    <img src="./assistant1.svg" alt="avatar" style={{width:'25px',height:'25px'}} />
                                                </div>
                                            </div>
                                            <div className="message-item">
                                                <div className="message-body">
                                                    <div className="loading">
                                                        <div></div>
                                                        <div></div>
                                                        <div></div>
                                                    </div>
                                                   加载中
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="box-right-input">
                                <div className="box-right-input-bottom">
                                    <textarea value={textareaValue} style={{backgroundColor:'#4e4b4b',boxShadow:'0 -2px 5px rgb(0 0 0 / 45%)',color:'#faf7f7'}} className="send-question" placeholder="Ctrl + Enter发送" 
                                    onChange={(e) => setTextareaValue(e.target.value)}
                                    onKeyDown={(e) =>{if (e.ctrlKey && e.key === 'Enter') {
                                        e.preventDefault()
                                        handelSendmessage()
                                    }} }
                                    rows={3}></textarea>
                                    <button className="send-button" onClick={handelSendmessage}>
                                        <div className="send-button-icon">
                                            <img src="./send.svg" alt="send" />
                                        </div>
                                        <div className="send">
                                            发送
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Chat