// 此页面为应用页面
import { FC,useEffect,useState,useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import {ExclamationCircleOutlined} from '@ant-design/icons'
import { Modal, message,Popover,Switch} from 'antd'
import axios from "axios"
import 'swiper/swiper-bundle.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper'
import './index.css'
const Application:FC = ()=>{
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
    // 菜单栏数据3类
    const data = [
        {
            id:1,
            name:"旅游指南",
            img:"./lvyou.svg",
            description:"经济蓬勃，旅游复苏。在忙碌时代，用文心一言快速得到最佳旅游攻略，玩得尽兴！"
        },
        {
            id:2,
            name:"草拟标题",
            img:"./biaoti.svg",
            description:"吸睛利器：文心一言助你打造引人入胜的文章标题。"
        },
        {
            id:3,
            name:"私人教练",
            img:"./jiaolian.svg",
            description:"私人教练太贵？健康需求不明？文心一言为你量身定制训练，避免盲目，助你健康前行。。"
        },
        {
            id:4,
            name:"起名大师",
            img:"./qiming.svg",
            description:"如何迅速为新生儿起个有文化的悦耳之名？文心一言助创作，结合经典，轻松解决命名难题。"
        },
        {
            id:5,
            name:"定制妆容",
            img:"./zhuangrong.svg",
            description:"不知道怎么打造高质量形象？利用文心一言，结合条件，为不同场景提供精美妆容建议。"
        },
        {
            id:6,
            name:"润色简历",
            img:"./jianli.svg",
            description:"求职困难？高质量简历关键。文心一言优化语言、结构，确保您脱颖而出！"
        },
        {
            id:7,
            name:"模拟面试",
            img:"./mianshi.svg",
            description:"面试经历少，不知道哪些问题容易考？无所谓！文心一言会给出他的解决方案。"
        },
        {
            id:8,
            name:"创业启发",
            img:"./chuangye.svg",
            description:"好的创业idea是成功的一半，让文心一言作为您创业idea的启发者，点燃灵感，助力创业者探索多元创业领域。"
        },
        {
            id:9,
            name:"求职帮手",
            img:"./qiuzhi.svg",
            description:"求职变复杂？求职信写作烦恼？文心一言化身求职小助手，帮忙解决问题，提供指导和帮助。"
        },
        {
            id:10,
            name:"学习导师",
            img:"./daoshi.svg",
            description:"信息爆炸，高效学习才能脱颖而出，文心一言助您个性化、有效学习，解决庞大知识体系困扰。"
        },
        {
            id:11,
            name:"敬请期待……",
            img:"./more.svg",
            description:"开发中，敬请期待……"
        }
    ]
    const jumptoapp = (id:number)=>{
        if(id === 11){
            message.warning('正在开发中,敬请期待……')
        }else{
            nav(`/Apps/${id}`)
        }
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
                                        <Link to='/Chat'>文心实战</Link>
                                    </li>
                                    <li>
                                        <Link to='/Application' className="active">最佳应用</Link>
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
                <div className="col-lg-12" style={{marginTop:'40px'}}>
                    <h6>Try Our Best Application</h6> 
                </div>
                <div id="certify" style={{top:"20px"}}>
                    <div className="swiper-container">
                            <Swiper
                                            
                                            key={data.length}
                                            className="swiper-wrapper"
                                            loop={true} //循环切换
                                            autoplay={true}
                                            watchSlidesProgress={true}  //Progress（进度、进程）分为swiper的progress 和每个slide单独的progress。
                                            loopedSlides={5} //可视slide有3个，loopedSlides可设为5个或以上
                                            slidesPerView={'auto'}
                                            pagination={{ clickable: true }} //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
                                            navigation={true} //前后进退按纽
                                            centeredSlides={true} //设定为true时，active slide会居中，而不是默认状态下的居左。
                                            initialSlide={Math.floor(data.length/2)} //与centeredSlide结合使用，指定初始化的索引
                                            modules={[Navigation,Pagination,Autoplay]}
                                            // onProgress={onProgress} //回调函数，当Swiper的progress被改变时执行。接受swiper实例和此Swiper的progress作为参数（返回值范围一般在0-1）。
                                            // onSetTransition={onSetTransition} //回调函数，每当设置Swiper开始过渡动画时执行。transtion获取到的是Swiper的speed值。
                                            >
                                        {data.map(t => {
                                            return (
                                                <SwiperSlide key={t.id} >
                                                    <div className="menu-item" onClick={(e)=>jumptoapp(t.id)}>
                                                        <div className="menu-item-box"></div>
                                                        <div className="menu-item-img">
                                                            <img src={t.img} alt={t.name} />
                                                        </div>
                                                        <div className="menu-item-names">
                                                            <h2 style={{fontStyle:'italic'}}>{t.name}</h2>
                                                            <p style={{fontStyle:'italic'}}>{t.description}</p>
                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                            )
                                        })}
                            </Swiper>
                    </div>
                </div>


            </div>



        </div>
    )
}
export default Application