// 此组件为编辑我的收藏组件
import { FC,useState } from "react"
import {
    Form,
    Input,
    Modal,
    Button,
    Select,
    message
} from 'antd'
import './index.css'
import axios from "axios"
type favorite = {
    id:string
    content: string
    time: string
    name:string
    tag:Array<string>
}
interface Props{
    item:favorite
    editFinish:()=>void
}
const { Option } = Select
const Modals: FC<Props> = (props) =>{
    const [open,setOpen] = useState(false)
    const [values,setValues] = useState({})
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [visible,setVisable] = useState(false)
    const showmodal = ()=>{
        setOpen(true)
    }
    const hideModal = ()=>{
        setOpen(false)
    }
    const onFinish = (values:any) => {
        message.success("编辑成功")
        setVisable(true)
        setValues(values)
    }
    const handleok = () => {
        setConfirmLoading(true)
        axios.post(`/api/user/edit_prompt/${props.item.id}`,{data:values}).then(()=>{
            // 异步操作完成后关闭
            props.editFinish()
        })
        setTimeout(() => {
            setOpen(false)
            setConfirmLoading(false)
        }, 1000)
    }
    return (
        <>
            <div className="operate" onClick={showmodal}>编辑</div>
            <Modal
                title="编辑收藏"
                open={open}
                okText="确认提交"
                closable={false}
                footer={[
                    <Button key="back" onClick={hideModal}>
                      取消编辑
                    </Button>,
                    visible && ( 
                      <Button key="submit" onClick={handleok} type="primary">
                        确认提交
                      </Button>
                    ),
                ]}
                confirmLoading={confirmLoading}
                cancelText="取消编辑"
                style={{textAlign:'center'}}
                destroyOnClose={true}
            >
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item label="收藏内容" name="collectContent" initialValue={props.item.content} rules={[{ required: false }]}>
                        <Input.TextArea rows={8}/>
                    </Form.Item>
                    <Form.Item label="收藏名称" name="collectName" initialValue={props.item.name} rules={[{ required: false}]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="收藏标签" name="collectTag" initialValue={props.item.tag} rules={[{ required: false}]}>
                        <Select mode="tags" style={{ width: '100%' }} placeholder="选择或输入标签">
                        <Option value="文化名人">文化名人</Option>
                        <Option value="交通出行">交通出行</Option>
                        <Option value="短视频创作">短视频创作</Option>
                        <Option value="职业生涯规划">职业生涯规划</Option>
                        <Option value="情感问题">情感问题</Option>
                        <Option value="日常生活">日常生活</Option>
                        <Option value="电影音乐">电影音乐</Option>
                        <Option value="营销文案">营销文案</Option>
                        <Option value="论文写作">论文写作</Option>
                        <Option value="作业辅助">作业辅助</Option>
                        <Option value="演讲辩论">演讲辩论</Option>
                        <Option value="市场营销">市场营销</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            编辑完成
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
export default Modals