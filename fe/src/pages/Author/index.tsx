// 此页面为作者(介绍)页面
import { FC,useEffect,useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {ExclamationCircleOutlined} from '@ant-design/icons'
import { Modal, message,Popover} from 'antd'
import 'swiper/swiper-bundle.css'
import { createThrottle } from '../../component/help'
import axios from "axios"
import './index.css'
const Author:FC = ()=>{
    const nav = useNavigate()
    const [username,setUsername] = useState('')
    const [open,setOpen] = useState(false)
    const [log,setLog] = useState(false)
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
                setLog(true)
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
    // 跳到主页面
    const jumptoindex = ()=>{
        nav('/')
    }
    const [show1, switchShow] = useState(false)
    useEffect(()=>{
        const listener = createThrottle(()=>{
            const shouldShow = window.scrollY > 10
            if (shouldShow !== show1) {
                switchShow(shouldShow)
            }
        }, 500) as EventListener;
        document.addEventListener('scroll', listener)
        return ()=>document.removeEventListener('scroll', listener)
    }, [show1])
    const [show2, switchShow2] = useState(false)
    useEffect(()=>{
        const listener = createThrottle(()=>{
            const shouldShow = window.scrollY > window.innerHeight * 1.3
            if (shouldShow !== show2) {
                switchShow2(shouldShow)
            }
        }, 500) as EventListener;
        document.addEventListener('scroll', listener)
        return ()=>document.removeEventListener('scroll', listener)
    }, [show2])
    const [show3, switchShow3] = useState(false)
    useEffect(()=>{
        const listener = createThrottle(()=>{
            const shouldShow = window.scrollY > window.innerHeight * 2
            if (shouldShow !== show3) {
                switchShow3(shouldShow)
            }
        }, 500) as EventListener;
        document.addEventListener('scroll', listener)
        return ()=>document.removeEventListener('scroll', listener)
    }, [show3])
    return (
        <div>
            {/* head */}
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
                                    {
                                        log?
                                        <>
                                        <li>
                                            <Link to='/Home'>全新体验</Link>
                                        </li>
                                        <li>
                                            <Link to='/Chat'>文心实战</Link>
                                        </li>
                                        <li>
                                            <Link to='/Application'>最佳应用</Link>
                                        </li>
                                        </>
                                        :
                                        <li>
                                            <Link to='/Login'>登录</Link>
                                        </li>
                                    }
                                    {
                                        log?
                                        <></>
                                        :
                                        <li>
                                            <Link to='/Login'>注册</Link>
                                        </li>
                                    }
                                    <li>
                                        <Link to='/Author' className="active">关于我们</Link>
                                    </li>
                                    {
                                        log?
                                        <li>
                                            <Popover content={content} open={open} trigger="hover" onOpenChange={handleOpenChange}>
                                                <a onClick={(e) => e.preventDefault()}>
                                                    {username}
                                                </a>
                                            </Popover>
                                        </li>
                                        :
                                        <></>
                                    }
                                </ul>   
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
            <div className="page-heading" style={{minHeight:'10vh',paddingTop:'6%'}}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            {/* <h6>Better Prompt</h6> */}
                            <h2>View Details For Us</h2>
                        </div>
                    </div>
                </div>
            </div>
            {/* 项目介绍 */}
            <div className="author-page" style={{paddingTop:'0'}}>
                <div className="author-head">
                    <h1>产品介绍</h1>
                    <div style={{fontStyle:'italic',fontSize:'18px'}}>遇见，就现在，别样体验，立刻开始！</div>
                </div>
                <div className="author-item first">
                    <img className="intro-img" src="./intro-1.png" alt="intro-1" />
                    <div className="intro-text">
                        <h1 >简洁的页面设计</h1>
                        <div>
                            兼具美感和艺术感，散发浓郁的科技氛围.
                        </div>
                        <div>
                            完美融合了现代设计，细腻而独特.
                        </div>
                    </div>
                </div>
                <div className={`${show1? 'author-item second' : ''}`} >
                    <div className="intro-text" >
                        <h1>多样的场景分布</h1>
                        <div>
                            从日常生活到职业规划.
                        </div>
                        <div>
                            不同场景带来不同体验.
                        </div>
                    </div>
                    <img style={{marginLeft:'20%'}} className="intro-img" src="./intro-2.png" alt="intro-2" />    
                </div>
                <div className={`${show2? 'author-item third' : ''}`}>
                    <img className="intro-img" src="./intro-3.png" alt="intro-3" />
                    <div className="intro-text">
                        <h1 >强大的优势</h1>
                        <div>
                            更智能：生成的promtp更快速、更高效
                        </div>
                        <div>
                            更好用：极简的交互设计，助您快速上手
                        </div>
                        <div>
                            更方便：自动补全prompt，轻松完成需求
                        </div>
                    </div>
                </div>
                <div className={`${show3? 'author-item forth' : ''}`} >
                    <div className="intro-text" >
                        <h1>便捷的交互能力</h1>
                        <div>
                            实时对话，实时交互.
                        </div>
                        <div>
                            自动引导补全promt，助力您的每一步.
                        </div>
                    </div>
                    <img style={{marginLeft:'15%'}} className="intro-img" src="./intro-4.png" alt="intro-4" />    
                </div>
            </div>
            {/* 作者介绍 */}
            <div className="create-nft">
                <div className="container" style={{marginLeft:'5%'}}>
                    <div style={{display:'flex'}}>
                        <div className="col-lg-8" >
                            <div className="section-heading">
                                <div className="line-dec"></div>
                                <h2>View Details For Authors.</h2>
                            </div>
                        </div>
                        <div className="address">
                            <div className="main-button">
                                <a target="_blank" rel="noopener noreferrer" href="https://github.com/reatcat/baidu_api">我们的项目地址</a>
                            </div>
                        </div>
                    </div>
                    <div className="rows">
                        <div className="col-lg-4">
                            <div className="item first-item">
                                <div className="number">
                                <h6>1</h6>
                                </div>
                                <div className="icon">
                                    <img className="author-icon" src="./author01.jpg" alt="author01" />
                                </div>
                                <h4>队员1</h4>
                                <p>Email:1837271943@qq.com<br/>负责文档撰写,ppt与视频制作.</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="item second-item">
                                <div className="number">
                                <h6>2</h6>
                                </div>
                                <div className="icon">
                                    <img className="author-icon" src="./author02.jpg" alt="author02" />
                                </div>
                                <h4>队员2</h4>
                                <p>Email:2739904664@qq.com<br/>负责前端设计与实现.</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="item second-item">
                                <div className="number">
                                <h6>3</h6>
                                </div>
                                <div className="icon">
                                    <img className="author-icon" src="./author03.jpg" alt="author03" />
                                </div>
                                <h4>队员3</h4>
                                <p>Email:1875912440@qq.com<br/>负责后端设计与实现.</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="item">
                                <div className="icon">
                                    <img className="author-icon" src="./author04.jpg" alt="author04" />
                                </div>
                                <h4>队员4</h4>
                                <p>Email:2271519405@qq.com<br/>负责对话核心功能实现.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default Author