// 此页面为个人中心页面
// 个人中心包括我的信息，修改密码，,我的收藏，返回主页
import { FC,useEffect,useState } from "react"
import { Link } from "react-router-dom"
import {
    Form,
    Input,
    message
} from 'antd'
// 局部生效样式
import styles from './index.module.css'
import Modals from "../../component/Modals"
import copy from 'copy-to-clipboard'
import './index.css'
import axios from "axios"
const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 30 },
      sm: { span: 16 },
    },
}
const iniuserinfo = {
    username:'',
    email:''
}
type favorite = {
    id:string
    content: string
    time: string
    name:string
    tag:Array<string>
}
const Personal:FC = ()=>{
    const [form] = Form.useForm()
    const [modify,setModify] = useState(false) 
    const [modified,setModified] = useState(0)
    const [userinfo,setUserinfo] = useState(iniuserinfo)
    // 定义item
    const [item,setItem] = useState<favorite[]>([])
    // 修改信息完成
    const finishmodify = (values:string)=>{
        userinfo.username = JSON.parse(JSON.stringify(values)).username === undefined?userinfo.username:JSON.parse(JSON.stringify(values)).username
        userinfo.email = JSON.parse(JSON.stringify(values)).email === undefined?userinfo.email:JSON.parse(JSON.stringify(values)).email
        setUserinfo({...userinfo})
        console.log(userinfo)
        console.log(values)
        axios.post('/api/admin/personalinfo',{data:JSON.stringify(userinfo)})
        .then((res)=>{
            const code = res.data.data.data
            if(code === 1){
                message.success('修改成功!')
                setModify(false)
            }
        })
    }
    const set =(e:any)=>{
        if(e.keyCode === 13){
            e.preventDefault()
        }
    }
    // 修改密码完成
    const finishchange = (values:string)=>{
        let datas = {
            oldpassword:JSON.parse(JSON.stringify(values)).oldpassword,
            newpassword:JSON.parse(JSON.stringify(values)).newpassword
        }
        console.log(datas)
        // 发送
        axios.post('/api/admin/password',{data:JSON.stringify(datas)})
        .then((res)=>{
            const code = res.data.data.data
            if(code === 1){
                message.success('修改密码成功!')
            }else{
                message.error('原密码不对!')
            }
        })
    }
    // 获得userinfo
    const getuserinfo = ()=>{
        axios.get('/api/admin/personalinfo')
        .then((res)=>{
            userinfo.username = res.data.data.Username
            userinfo.email = res.data.data.Email
            setUserinfo({...userinfo})
        })
    }
    // 获得item
    const getitem = ()=>{
        axios.get('/api/user/get_saved_prompt')
        .then((res)=>{
            // 获得传递的item列表
            // 传给我一个列表我自己解析就可以
            console.log(res)
            const itemlist = res.data.data.data
            for(let i = 0;i < itemlist.length;i++){
                let tmp:favorite = {
                    id:itemlist[i].Id,
                    content:itemlist[i].Prompt,
                    time:itemlist[i].Time,
                    name:itemlist[i].Name,
                    tag:itemlist[i].Tag
                }
                item[i] = tmp
                // item.push(tmp)
            }
            setItem([...item])
        })
    }
    useEffect(()=>{
        getuserinfo()
        getitem()
    },[])
    const copytext = (text:string)=>{
        copy(text)
        message.success("复制成功!")
        window.open('https://yiyan.baidu.com/welcome', '_blank');
    }
    const deleteitem = (index:number,id:string)=>{
        // 删除某一个item
        // 传递索引过去删除，返回一个code=1
        axios.post(`/api/user/delete_prompt/${id}`)
            .then((res)=>{
                const code = res.data.data.data
                if(code === 1){
                    message.success("删除成功!")
                    // 重新渲染item
                    const updatedData = [...item]
                    updatedData.splice(index, 1)
                    setItem(updatedData)
                }
        })
    }
    const editFinish = ()=>{
        console.log(111)
        getitem()
    }
  return (
    <div className="Personal-page">
        <div className="navss">
            {/* <!--头像--> */}
            <div className="myicon">
                <div className="icon-img"><img src="./portrait.png" alt="portrait" /></div>
                <div className="icon-con">
                    <p style={{color:'black',marginLeft:'1px'}}>您好</p>
                    <h2 style={{color:'black'}}>{userinfo.username}</h2>
                </div>
            </div>
            {/* <!-- 分隔线 --> */}
            <div className="line"></div>
                <div className="tab_list">
                    <div className="tab_list_item" id="item1" onClick={()=>setModified(0)}>
                        <div className="light"></div>
                        <div className="con">
                            <img className="home" style={{width:'20px'}} src="./personel.svg" alt="svg1" />
                            我的信息
                        </div>
                    </div>
                    <div className="tab_list_item" id="item2" onClick={()=>setModified(1)}>
                        <div className="light"></div>
                        <div className="con">
                            <img className="home" style={{width:'20px'}} src="./password.svg" alt="svg1" />
                            修改密码
                        </div>
                    </div>
                    <div className="tab_list_item" id="item2" onClick={()=>setModified(2)}>
                        <div className="light"></div>
                        <div className="con">
                            <img className="home" style={{width:'20px'}} src="./favorite.svg" alt="svg1" />
                            我的收藏
                        </div>
                    </div>
                    <div className="tab_list_item" id="item3">
                        <div className="light"></div>
                        <div className="con">
                            <Link to="/" id="goback">
                                <img className="home" style={{width:'20px'}} src="./home.svg" alt="svg1" />
                                <div style={{marginTop:'5px'}}>
                                    返回首页
                                </div>
                            </Link>
                        </div>
                    </div>
            </div>
        </div>
        <div className="item user_information" style={{display:modified === 0?'flex':'none'}}>
            <div className="user_data">
                <img src="./portrait.png" alt="" className="photo"/>
                <div id="data1" style={{display:modify?'none':'flex'}}>
                    <div className="input_boxs"> 用户名称：<input type="text" name="username" className="inputs" disabled={true} id="input4_1" value={userinfo.username}/> 
                    </div>
                    <button className="btn" onClick={()=>setModify(true)}>点击修改信息</button> 
                </div>
                <div id="data2" style={{display:modify?'flex':'none'}}>
                    <div id="goBackToData1" onClick={()=>setModify(false)}>
                        <img src="./back.svg" alt="back" className="home" style={{width:'20px',paddingTop:'2px'}} />
                        <div style={{marginTop:'5px'}}>
                            返回
                        </div>
                    </div>
                    <Form onFinish={finishmodify} id="Form">
                        <Form.Item name="username">
                            <div className="input_boxs">
                                用户名称：
                                <input onKeyDown={(e)=>set(e)} type="text" name="username" className="inputs"defaultValue={userinfo.username}/>
                            </div>
                        </Form.Item>
                        <span className="tip_box1" id="tip4"></span>
                        <span className="tip_box1" id="tip5"></span>
                        {/* <Form.Item name="email">
                            <div className="input_boxs">
                                用户邮箱：
                                <input onKeyDown={(e)=>set(e)} type="email" name="email" className="inputs" defaultValue={userinfo.email}/>
                            </div>
                        </Form.Item> */}
                        {/* <Form.Item name="status">
                            <div className="input_boxs">
                                邮箱授权：
                                <input onKeyDown={(e)=>set(e)} type="text" name="authorization-code" className="inputs" defaultValue="未设置"/>
                            </div>
                        </Form.Item> */}
                        <button type="submit" className="btn">提交修改</button>
                    </Form>
                </div>
            </div>
        </div>
        <div className="item change_password" style={{display:modified === 1?'flex':'none'}}>
            <div className="user_data" >
                 <Form
                    className={styles.coupon}
                    {...formItemLayout}
                    form={form}
                    name="changepw"
                    onFinish={finishchange}
                    style={{ width:"90%" }}
                    scrollToFirstError
                >
                    {/* 旧密码 */}
                    <Form.Item
                        name="oldpassword"
                        rules={[
                        {
                            required: true,
                            message: '请输入密码!',
                        }
                        ]}
                    >
                        <Form.Item>
                            <div className="label">
                                旧密码:
                            </div>
                            <Input.Password />
                        </Form.Item>
                    </Form.Item>
                    {/* 新密码 */}
                    <Form.Item
                        name="newpassword"
                        rules={[
                            { required: true, message: '请输入新密码' },
                            { pattern:/^[0-9a-zA-Z]{1,}$/g,message:'只允许数字字母组合'},
                            { min:6,message:"长度不得小于6位"}
                        ]}
                    >
                        <Form.Item>
                            <div className="label">
                                新密码:
                            </div>
                            <Input.Password />
                        </Form.Item>
                    </Form.Item>
                    {/* 确认密码 */}
                    <Form.Item
                        name="confirm"
                        dependencies={['Password']}
                        rules={[
                        {
                            required: true,
                            message: '请确认密码!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                            if (!value || getFieldValue('newpassword') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('两次密码不同!'));
                            },
                        }),
                        ]}
                    >
                        <Form.Item>
                            <div className="label">
                                确认密码:
                            </div>
                            <Input.Password />
                        </Form.Item>
                    </Form.Item>
                    <Form.Item id="last">
                        <button type="submit" className="btn" id="btn2" >
                            提交修改
                        </button>
                    </Form.Item>
                </Form>
            </div>
        </div>
        <div className="item myfaovrite" style={{display:modified === 2?'block':'none'}}>
            {
                item.length === 0?
                <div className="rule" style={{textAlign:'center',fontSize:'20px',marginTop:'10%'}}>暂无收藏哦</div>
                :
                <></>
            }
            {item.map((t,i)=>(
                <div className="card">
                    <div className="cardHead" >
                        <div className='cardItems cardTitleBox' >
                            <div className='itemTitles cardTitle'>
                                收藏时间
                            </div>
                            <div className="member_title" style={{color:'grey'}}>
                                {t.time}
                            </div>
                        </div>
                        <div className='cardItems'>
                            <div className='itemTitles cardTitle'>
                                收藏名称
                            </div>
                            <div className="member_title" style={{color:'grey'}}>
                                {t.name === ""?"待起名":t.name}
                            </div>
                        </div>
                        <div className='cardItems'>
                            <div className='itemTitles cardTitle'>
                                收藏标签
                            </div>
                            <div className="member_title" style={{color:'grey'}}>
                                {t.tag}
                            </div>
                        </div>
                    </div>
                    <div className="cardBody">
                        <div className="cardItems cardTimesBox">
                            <div className="member_times" style={{whiteSpace:'pre-line'}}>
                                {t.content}
                            </div>
                        </div>
                        
                    </div>
                    <div className="cardItems cardOperateBox">
                        <div className="member_operate">
                            <Modals editFinish={editFinish} item={t}></Modals>
                            <div className="operate" onClick={(e)=>copytext(t.content)}>复制</div>
                            <div className="operate" onClick={(e)=>deleteitem(i,t.id)}>删除</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}
export default Personal