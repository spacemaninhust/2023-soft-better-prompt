// 此页面为具体应用页面
import { FC,useEffect,useState,useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import {ExclamationCircleOutlined} from '@ant-design/icons'
import { Modal, message,Popover } from 'antd'
import axios from "axios"
import 'swiper/swiper-bundle.css'
import copy from 'copy-to-clipboard'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './index.css'
type Message = {
    content: string
    sender: 'user' | 'assistant'
    timestamp: string
    isfavorite: boolean
}
const Apps:FC = ()=>{
    // 获得路由
    const location = useLocation()
    // 获得路由id
    const id = Number(location.pathname.split('/')[2]) - 1
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
    const data = [
        {
            id:1,
            name:"旅游指南",
            img:"./lvyou1.svg",
            message:'您好，我是您的旅行小助手，请问有什么可以帮到您的？',
            description:"暑假&2000&武汉&和朋友&饮食清淡并且有山有水"  
        },
        {
            id:2,
            name:"草拟标题",
            img:"./biaoti1.svg",
            message:'您好，我是您的写作助手，请问有什么可以帮到您的？\n下面是一个示例:\n战地记者&严肃工整&当地时间5月29日，乌克兰首都基辅市中心再次响起了爆炸声，防空警报同时拉响，居民们纷纷赶往避难所。在乌克兰首都正在从27日夜间的大规模无人机袭击中恢复之际，基辅再度遭受空袭。据乌克兰当局称，27日夜间，大批俄罗斯无人机瞄准了基辅，这是自冲突开始以来对乌克兰首都最大规模的无人机袭击。本月，基辅居民被迫应对几乎每晚都会响起的空袭警报和爆炸。法新社记者称，29日在乌克兰首都基辅听到了至少10次爆炸声。基辅政府称：“在对基辅发动了最大规模的无人机袭击后仅18小时，敌人再次袭击了首都，这是5月以来的第15次空袭”！基辅市长维塔利·克利奇科说：“基辅市中心发生了爆炸，这在白天是罕见的”。他要求居民待在避难所里，他还说：“这次袭击表明敌人改变了战术，在经过长时间的夜间袭击后，他们在白天袭击了一个和平的城市，当时大多数居民都在工作或外出”。乌克兰武装部队则表示，他们在白天的袭击中击落了俄罗斯发射的11枚伊斯坎德尔导弹。另据法新社5月29日报道，乌克兰当局当天表示，俄罗斯对乌克兰西部的一处军事设施实施打击，并摧毁了5架飞机，同时基辅击退了新一波大规模彻夜空袭。乌克兰西部城市赫梅利尼茨基地方当局表示，俄罗斯军队连夜袭击了当地一处军事设施。他们承认遭受了损失，称“5架飞机被摧毁”。声明还说，当地正在努力控制燃料和润滑油仓库的火势。 报道指出，这是乌克兰地方当局罕见地承认军事设施受到俄方袭击。俄罗斯国防部随后表示，其部队袭击了乌克兰机场，摧毁了所有目标。',
            description:"见右侧提示语"
        },
        {
            id:3,
            name:"私人教练",
            img:"./jiaolian1.svg",
            message:'我是一名私人教练，请告诉我您的身高体重以及性别，您有什么需求（减肥/增肌/健美）？',
            description:"180cm&90kg&想减肥&女性&3"
        },
        {
            id:4,
            name:"起名大师",
            img:"./qiming1.svg",
            message:'您好！作为您的起名小助手，我感到非常荣幸能够为您提供起名服务。请告诉我关于您的孩子和您家庭的更多信息，以便我能够为您提供个性化、符合您期望的名字选项。我将竭尽全力为您找到一个独特而富有意义的名字，成为您孩子一生中的宝贵礼物。请随时告诉我您的要求和喜好，让我们一起为您的孩子选择一个单字或者双字姓名吧！',
            description:"我的孩子姓周，是一个男孩，出生于2023年7月2日。我希望我的孩子以后能健健康康，有一个幸福美满的家庭，能够投身于自己喜欢的事物，有所成就。"
        },
        {
            id:5,
            name:"定制妆容",
            img:"./zhuangrong1.svg",
            message:'亲爱的主人，您好！作为您的私人妆容定制师，我将为您提供个性化的妆容建议和服务。无论是日常还是特殊场合，我将为您打造精美、符合场景的妆容。请随时向我咨询，期待与您一同探索妆容的奇妙世界！请您输入即将参加的活动以及自身条件。',
            description:"我要去政府上班，并且我的皮肤很白，黄色头发，戴眼镜，身高163cm，拥有一头柔顺的长发。"
        },
        {
            id:6,
            name:"润色简历",
            img:"./jianli1.svg",
            message:'你好，我能够为你润色你的简历，请给出你的简历内容。\n下面是一个示例:\n个人信息：\n'+
            '姓名：张三\n'+
            '联系方式：手机：123456789 （微信：123456789） 邮箱：123456789@example.com\n'+
            '求职目标：\n'+
            '寻找一份与我的专业和经验相关的职位，利用我的技能和经验为公司做出贡献。\n'+
            '教育背景：\n'+
            '学历：本科\n'+
            '专业：计算机科学与技术专业\n'+
            '毕业时间：2020年6月\n'+
            '学校名称：华中科技大学\n'+
            '工作经历：\n'+
            '公司名称：腾讯科技\n'+
            '职位：数据分析师\n'+
            '工作时间：2020年6月 - 2021年12月\n'+
            '工作内容：负责业务部门的数据分析工作，从数据中挖掘用户需求，为产品制定优化方案。负责设计和实现数据仓库，为业务部门提供数据支持。参与团队合作，与开发人员、产品经理等共同推进项目。\n'+
            '成绩或奖项：\n'+
            '- 2021年6月，获得公司优秀员工称号。\n'+
            '- 2020年12月，获得数据分析大赛一等奖。\n'+
            '技能与证书：\n'+
            '掌握的技能：熟练使用SQL进行数据提取和数据分析，熟练掌握Python进行数据可视化和机器学习建模。\n'+
            '相关证书：获得CFA二级证书、Python编程证书、数据分析师证书等。\n'+
            '自我评价：\n'+
            '我是一个认真负责、勤奋好学的人，善于利用自己的能力和经验解决问题。在工作中，我注重团队合作，乐于与同事分享经验和知识。我具有良好的数据分析能力和逻辑思维，能够快速解决复杂问题。\n'+
            '实习/社会工作经验：\n'+
            '有一定的实习和社会工作经验。\n'+
            '其他：\n'+
            '个人特点：具有高度的责任感、学习能力和适应能力。注重工作效率和质量，追求卓越。\n'+
            '兴趣爱好：喜欢阅读、旅行、健身等。\n',
            description:"见右侧提示语"
        },
        {
            id:7,
            name:"模拟面试",
            img:"./mianshi1.svg",
            message:'您好，我能够为你模拟面试中可能出现的问题并给出相应的参考，请给出你面试的岗位。',
            description:"C++编程岗位"
        },
        {
            id:8,
            name:"创业启发",
            img:"./chuangye1.svg",
            message:'您好，我是一个创业idea的启发者，请告诉我你的创业目标，我将生成一个商业计划书。',
            description:"我希望在市中心开一个火锅店"
        },
        {
            id:9,
            name:"求职帮手",
            img:"./qiuzhi1.svg",
            message:'您好，我是一个帮助你写求职信的小帮手，告诉我您的求职目标、相关技能和经验。\n下面是一个示例:\n市场经理&技能：市场调研、品牌管理、市场推广、数字营销、团队管理&经验：在一家知名消费品公司担任市场调研专员，负责制定市场调研计划和执行调研项目；在另一家广告代理公司担任品牌经理，负责品牌策略制定和推广活动的执行。',
            description:"见右侧提示语"
        },
        {
            id:10,
            name:"学习导师",
            img:"./daoshi1.svg",
            message:'您好，我是一位知识学习导师，你可以向我提问你所不了解的任何领域，我将向你科普。',
            description:"双缝实验"
        }
    ]
    const [messages, setMessages] = useState<Message[]>([{
        content:data[id].message,
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
        }
        else if (messages.length >= 3){
            message.warning("对话过多,请新开启一轮对话吧~")
        }
        else{
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
            axios.post('/api/user/best_chat',{data:{text:JSON.stringify(textareaValue),code:id+1}})
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
        const newMessage: Message = {
            content: data[id].message,
            sender: 'assistant',
            timestamp: new Date().toLocaleString(),
            isfavorite:false
        }
        setMessages([newMessage])
    }
    useEffect(() => {
        if (messageRef.current) {
          messageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages])
    const renderers = {
        list: (props:any) => <ul>{props.children}</ul>,
        listItem: (props:any) => <li>{props.children}</li>,
      };
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
                <div className="col-lg-13">
                    <div style={{display:'flex',margin:'auto'}}>
                        <div className="apps" onClick={(e)=>{nav('/Application')}}>应用 &gt; </div>
                        <div>{data[id].name}</div>
                    </div>
                </div>
                <div className="box" style={{marginTop:'10px',backgroundColor:'#f4eded',color:'black'}}>
                    <div className="box-left" style={{backgroundColor:'rgb(255 255 255 / 87%)'}}>
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
                        <div>
                            <div style={{display:'block',letterSpacing:'2px',alignItems:'center',justifyContent:'space-between',marginTop:'5%'}}>
                                <div className="rule">
                                    用户指导
                                </div>
                                <div className="text" style={{marginTop:'10%',fontSize:'16px',fontStyle:'italic'}}>
                                    您好!这里是Better Prompt 最佳应用中的<span style={{color:'#f10d95'}}>{data[id].name}</span>应用部分,
                                    您可以按照指示直接与其进行对话并得到您所期望的结果,希望您使用顺利~<br />
                                    请严格按照示例内容格式进行对话哦
                                </div>
                                <div className="rule">
                                    Examples:
                                </div>
                                <div className="text">
                                    {data[id].description}
                                </div>

                            </div>
                        </div>
                        <div className="box-left-bottom" style={id === 3?{paddingTop:'15%'}:id === 4?{paddingTop:'35%'}:{paddingTop:'60%'}}>
                            <div style={{display:'inline-flex'}}>
                                <div className="address">
                                    <a target="_blank" rel="noopener noreferrer" href="https://github.com/reatcat/baidu_api">
                                        <button className="box-button" style={{backgroundColor:'#262828'}}>
                                            <div className="address-icon">
                                                <img src="./address.svg" alt="address" />
                                            </div>
                                        </button>
                                    </a>
                                </div>
                            </div>
                            <div>
                                <button className="box-button" onClick={(e)=>newchat()} style={{backgroundColor:'#262828'}}>
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
                                        <div className="message-container" >
                                            <div style={{marginTop:'20px'}}>
                                                <div className="user-avatar" style={{boxShadow:'0px 2px 4px 0px rgb(22 21 21 / 62%)'}}>
                                                    <img style={{width:'25px',height:'25px'}} src={message.sender === 'user' ?"./user2.svg":data[id].img} alt="avatar" />
                                                </div>
                                            </div>
                                            <div className="message-item" style={{backgroundColor:'rgb(22 21 21 / 45%)',color:'#2d2c2c'}}>
                                                {
                                                    message.sender === 'user'?
                                                    <></>
                                                    :
                                                    index === 0?
                                                    <></>
                                                    :
                                                    <div className="actions">
                                                        <div className="action3" onClick={(e)=>copyanwser(message.content)}>
                                                            复制
                                                        </div>
                                                    </div>
                                                }
                                                <div className="message-body" style={{whiteSpace:'pre-line',color:'#2d2c2c'}}>
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown">{message.content}</ReactMarkdown>
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
                                                    <img style={{width:'25px',height:'25px'}} src={data[id].img} alt="avatar" />
                                                </div>
                                            </div>
                                            <div className="message-item" style={{backgroundColor:'rgb(22 21 21 / 45%)',color:'#fff'}}>
                                                <div className="message-body" style={{whiteSpace:'pre-line',color:'#fff'}}>
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
                                    <textarea value={textareaValue} className="send-question" style={{backgroundColor:'white',color:'#2d2c2c'}} placeholder="Ctrl + Enter发送" 
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
export default Apps