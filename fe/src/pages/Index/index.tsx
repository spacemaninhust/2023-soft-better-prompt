// 此页面为菜单(介绍)页面
import { FC,useEffect,useState } from "react"
import {Link, useNavigate } from "react-router-dom"
import { createThrottle } from '../../component/help'
import 'swiper/swiper-bundle.css'
import {message} from 'antd'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper'
import axios from "axios"
import './index.css'
const Index:FC = ()=>{
    const nav = useNavigate()
    // 返回首页
    const jumptoindex = ()=>{
        nav('/')
    }
    const [log,setLog] = useState(false)
    // 使用axios获得用户名
    useEffect(()=>{
        axios.get('/api/user/index')
        .then((res)=>{
            // 依据返回的code确定三个状态
            const code = res.data.data.code
            if(code === 1){
                // const name = res.data.data.username
                // 设置登录状态
                setLog(true)
            }
        })
    },[])
    // 监听滚动位置，是否显示返回顶部
    const [show, switchShow] = useState(false)
    useEffect(()=>{
        const listener = createThrottle(()=>{
            const shouldShow = window.scrollY > 10
            if (shouldShow !== show) {
                switchShow(shouldShow)
            }
        }, 500) as EventListener;
        document.addEventListener('scroll', listener)
        return ()=>document.removeEventListener('scroll', listener)
    }, [show])
    // 图片是否出现
    // const [show1, switchShow1] = useState(false)
    // useEffect(()=>{
    //     const listener = createThrottle(()=>{
    //         const shouldShow = window.scrollY > 115
    //         if (shouldShow !== show1) {
    //             switchShow1(shouldShow)
    //         }
    //     }, 500) as EventListener;
    //     document.addEventListener('scroll', listener)
    //     return ()=>document.removeEventListener('scroll', listener)
    // }, [show1])
    // 文字是否出现
    const [show2, switchShow2] = useState(false)
    useEffect(()=>{
        const listener = createThrottle(()=>{
            const shouldShow = window.scrollY > window.innerHeight * 0.5
            if (shouldShow !== show2) {
                switchShow2(shouldShow)
            }
        }, 500) as EventListener;
        document.addEventListener('scroll', listener)
        return ()=>document.removeEventListener('scroll', listener)
    }, [show2])
    // 优势是否出现
    const [show3, switchShow3] = useState(false)
    useEffect(()=>{
        const listener = createThrottle(()=>{
            const shouldShow = window.scrollY > window.innerHeight
            if (shouldShow !== show3) {
                switchShow3(shouldShow)
            }
        }, 500) as EventListener;
        document.addEventListener('scroll', listener)
        return ()=>document.removeEventListener('scroll', listener)
    }, [show3])
    // 优势是否出现
    const [show4, switchShow4] = useState(false)
    useEffect(()=>{
        const listener = createThrottle(()=>{
            const shouldShow = window.scrollY > window.innerHeight * 1.2
            if (shouldShow !== show4) {
                switchShow4(shouldShow)
            }
        }, 500) as EventListener;
        document.addEventListener('scroll', listener)
        return ()=>document.removeEventListener('scroll', listener)
    }, [show4])
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
        <>
            <header className={show?"header-area header-sticky background-header":"header-area header-sticky"}>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <nav className="main-nav" style={show?{margin:'0 3%'}:{margin:'2% 5% 0 5%'}}>
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
                                        <Link to='/' className="active">首页</Link>
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
                                            <Link to='/Register'>注册</Link>
                                        </li>
                                    }
                                    <li>
                                        <Link to='/Author'>关于我们</Link>
                                    </li>
                                </ul>   
                                <a className='menu-trigger'>
                                    <span>Menu</span>
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
            <div className="main-banner">
                <div className="container">
                <div className="row">
                    <div className="col-lg-6 align-self-center">
                    <div className="header-text" style={{marginLeft:'5%',marginTop:'5%'}}>
                        <h6 style={{fontStyle:'italic'}}>Better Prompt</h6>
                        <h2 style={{fontStyle:'italic'}}>Faster &amp; more efficient.</h2>
                        <p>Better Prompt 用于补全润色prompt旨在提供实用性高、稳定性强、对社会有价值的promt,助力人机沟通.<br></br>
                            我们的服务理念是Faster and more efficient.
                        </p>
                        <div className="buttons">
                        <div className="border-button">
                            {
                                log?
                                <Link to='/Home'>继续使用</Link>
                                :
                                <Link to='/Login'>登录以开启新体验</Link>

                            }
                            
                        </div>
                        <div className="main-button">
                            <a id="docLink" target="_blank" rel="noopener noreferrer" href="https://github.com/reatcat/baidu_api">
                                我们的项目地址
                            </a>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div className="categories-collections" style={{padding:'120px 0 90px 0'}}>
                <div className="container">
                    <div className="row">
                        <div style={{textAlign:'center',fontSize:'40px',color:'white'}}>
                            适用场景
                        </div>
                        <div className={show2?"changjing-show":"changjing"}>
                            从日常生活到职业生涯规划,我们全覆盖.
                        </div>
                        {/* <div style={{display:'flex',marginTop:'20px'}}>
                            <div className={show1?"tupian-show":"tupian"}>
                                <h1 style={{color:'black'}}>
                                    日常生活
                                </h1>
                                <div className="tupian-img">
                                    <img src="./live.svg" alt="live"/>
                                </div>
                                <div style={{marginBottom:'10px'}}>
                                    <ul>
                                        <li>
                                            旅游指南 私人教练
                                        </li>
                                        <li>
                                            起名大师 定制妆容
                                        </li>
                                        <li>
                                            学习导师 敬请期待
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className={show1?"tupian-show2":"tupian"}>
                                <h1 style={{color:'black'}}>
                                    生涯规划
                                </h1>
                                <div className="tupian-img">
                                    <img src="./work.svg" alt="live"/>
                                </div>
                                <div style={{marginBottom:'10px'}}>
                                    <ul>
                                        <li>
                                            草拟标题 润色简历
                                        </li>
                                        <li>
                                            模拟面试 创业启发
                                        </li>
                                        <li>
                                            求职帮手 敬请期待
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div> */}
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
                                                                <div className="menu-item-name">
                                                                    <h2>{t.name}</h2>
                                                                    <p>{t.description}</p>
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
            </div>      
            <div className="create-nft">
                <div className="container">
                    <div>
                        <div style={{textAlign:'center',fontSize:'40px',color:'black'}}>
                            我们的优势
                        </div>
                        <div className={show3?"youshi-show":"youshi"}>
                            Better Prompt,让您的prompt更高效
                        </div>
                        <div>
                            <div className="first-wrap">
                                <div className={show4?"zhineng-show":"zhineng"}>
                                    <div className="youshi-img">
                                        <img src="./zhineng.svg" alt="zhineng"/>
                                    </div>
                                    <div className="jieshao">
                                        <h3>更智能</h3>
                                        <div className="line-dec"></div>
                                        <div>
                                            生成的promtp更快速、更高效
                                        </div>
                                    </div>
                                </div>
                                <div className={show4?"haoyong-show":"haoyong"}>
                                    <div className="youshi-img">
                                        <img src="./haoyong.svg" alt="haoyong"/>
                                    </div>
                                    <div className="jieshao">
                                        <h3>更好用</h3>
                                        <div className="line-dec"></div>
                                        <div>
                                            极简的交互设计，助您快速上手
                                        </div>
                                    </div>
                                </div>
                                <div className={show4?"gaoxiao-show":"gaoxiao"}>
                                    <div className="youshi-img">
                                        <img src="./gaoxiao.svg" alt="gaoxiao"/>
                                    </div>
                                    <div className="jieshao">
                                        <h3>更方便</h3>
                                        <div className="line-dec"></div>
                                        <div>
                                            自动补全prompt，轻松完成需求
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>                 
        </>
    )
}
export default Index