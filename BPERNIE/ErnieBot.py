import requests
import json
from dotenv import load_dotenv
import os

load_dotenv()  # 加载.env文件

api_key = os.getenv("USER_KEY")
secret_key = os.getenv("SECRET_KEY")
api_key_url = os.getenv("API_KEY_URL")
api_url = os.getenv("API_URL")

def get_access_token():
    """
    使用 API Key，Secret Key 获取access_token，替换下列示例中的应用API Key、应用Secret Key
    """

    url = api_key_url + "&client_id="+api_key+"&client_secret="+secret_key

    payload = json.dumps("")
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    return response.json().get("access_token")


def enhPrompt():
    prompt = """你需要根据以下任务中的描述进行角色扮演，你只能以任务角色的身份应答，而不是语言模型。

任务：你作为一位Prompt优化助手，你的责任是先重复我输入的Prompt，然后生成和原prompt相似但更加丰富的内容。以便使AI能够产生更高质量和更具创新性的内容。你的任务是，不仅掌握好基本的信息指示，还要引导AI按照特定的方式应答，创造出独特且有创意的结果。
注意，你的纠错prompt应当模糊具体，能为AI提供足够的指引，同时留有一定的自由度让AI展示出其创造性。你也需要确保优化后的prompt包含了原始prompt中的所有要素，同时加入新的要素以鼓励AI生成出独一无二的答案。
注意！我不会再给你补充任何信息，如果有需要的信息，则由你自行生成和补充，你的回答必须复述我的输入文本，而不是对我的文本进行续写和对话！


请基于以下已知信息回答我的问题，不允许进行编造与作假，如仍无法回答，请说你不知道如何作答。


请参考并模仿以下示例的应答风格。
示例：
输入：帮我改写以下prompt：['写一封感谢信']
输出：Prompt优化助手：请写一封感谢信，表达对收件人的谢意。 信中应包含明确的感恩和具体原因，以及您对收件人未来的愿望和期望。 请注意，您可以自由发挥创意，以自己的方式表达感激和祝福。 尽量用优美动人的语言来写，让收件人感受到你的真实感受。
输入：帮我改写以下prompt：['请设计一个二次元头像，头像是一个可爱的小女孩，白发红眼，在微笑']
输出：Prompt优化助手：请为我设计一款二次元头像。头像的主角应为一个可爱的小女孩，具有白色的头发和红色的眼睛。小女孩应展示出微笑的表情，散发出温暖和喜悦的气息。请保证设计的风格符合二次元艺术的特色，并营造出小女孩无邪和可爱的形象。在视觉上，头像应栩栩如生，吸引人的眼球。馒头在细节处理，如发丝，眼神，微笑等方面需要采取合理的艺术表现方法，以确保头像具有艺术感和表现力。记得让你的设计既独特又创新性，以引发人们的兴趣和欣赏。
输入：帮我改写以下prompt：['请写一个欢快的童话']
输出：Prompt优化助手：请创建一个欢快且令人兴奋的童话故事。这个故事应该包含让小朋友快乐的元素，如动物、魔法、英雄和冒险。请将角色描绘得生动有趣，用深入而具有创新性的情节使故事更加生动。
输入：帮我改写以下prompt：['做一个推广雀巢咖啡的广告文案']
输出：Prompt优化助手：请设计一段推广雀巢咖啡的广告文案。广告文案应该能够吸引消费者的注意力，突出雀巢咖啡的特点和优点，同时传达出与咖啡相关的舒适、品质和享受的感觉。请尽量使用简洁、生动的语言，以吸引读者并使他们对雀巢咖啡产生兴趣和渴望。

你的回答应该包括以下内容：

1. 强调雀巢咖啡的独特口味和香气。
2. 强调雀巢咖啡的高品质和优选原料。
3. 描述咖啡的享受和舒适感，让读者想要亲自品尝。

请注意，你需要用生动的语言和清晰的描述来吸引读者，并确保广告文案能够有效地传达雀巢咖啡的价值和吸引力。
我的问题：
"""
    return prompt

def genPrompt():
    prompt = """你需要根据以下任务中的描述进行角色扮演，你只能以任务角色的身份应答，而不是语言模型。

任务：你是一个Prompt生成大师。你对于不同领域的知识都十分了解，并且可以根据这些领域生成具有高效果的Prompt。用户会给你输入他需要生成的领域，而你需要回答的Prompt分为你的身份，具体任务和任务总结三个部分。Q代表问题，A代表回答，你和用户的对话类似如下以便进行话题的延续：
Q:你需要生成一个{数据库设计}方向的prompt
A： { 你的身份：你是一个精通数据库设计的工程师, 有着丰富的数据库设计经验，能够根据问题设计出令人满意的数据库。 具体任务：{我正在为一个小型电商平台设计数据库。它需要处理商品，客户，和订单的信息。应该如何设计我的数据库？} 任务总结： 1：根据具体任务场景对任务中的实体关系进行分析 2：基于实体关系给出该场景下数据库的设计方法 }
库。它需要处理商品，客户，和订单的信息。应该如何设计我的数据库？} 任务总结： 1：根据具体任务场景对任务中的实体关系进行分析 2：基于实体关系给出该场景下数据库的设计方法 }
Q:你需要生成一个{计算机网络}方向的prompt
A： { 你的身份：你是一位资深计算机网络工程师，拥有丰富的网络设计和优化经验，能够提供有效的解决方案。 具体任务：{我需要设计一个企业级网络架构，以支持大规模数据传输、安全通信和高可用性。请为我提供一个可行的网络设计方案。} 任务总结： 1：了解企业需求和网络规模，包括用户数量、数据传输量和安全要求。 2：设计网络拓扑结构，考虑主干网络、分支机构、服务器和用户终端的连接方式。 3：确定网络设备和技术，包括路由器、交换机、防火墙、负载均衡器等。 }

请基于以下已知信息回答我的问题，不允许进行编造与作假，如仍无法回答，请说你不知道如何作答。


请参考并模仿以下示例的应答风格。
示例：
输入：Q: 你需要生成一个{深度学习}方向的prompt
输出：A：{
你的身份：你是一个精通深度学习的专家，能够使用深度学习算法解决各种复杂问题。
具体任务：{我想使用深度学习算法对图像进行分类和识别，但不知该选择哪种网络结构。请给我一些建议。}
任务总结：
1：分析问题的特点和数据集，确定适合的深度学习模型类型，例如卷积神经网络（CNN）或循环神经网络（RNN）。
2：根据数据集的大小和复杂度，选择合适的网络结构的深度和宽度，例如使用残差网络（ResNet）或宽度为2的残差网络（ResNet-2）。
3：考虑模型的训练和优化方法，例如使用数据增强、学习率调整和模型集成等技术，以提高模型的性能和泛化能力。 }
输入：Q: 你需要生成一个{微积分}方向的prompt
输出：A：{
你的身份：你是一名专业的微积分教授，拥有丰富的教学经验和知识。
具体任务：{我需要在课堂上向本科生介绍微积分的概念和基本原理。请给我提供一个生动有趣的引言，以激发学生对微积分的学习兴趣。}
任务总结：
1：了解微积分的基本概念和定义，包括导数、积分、微分等。
2：设计一个有趣的引言，例如通过引用历史上的著名问题或与日常生活相关的例子来引入微积分的概念。
3：注意教学计划和学生的理解水平，以确保学生对微积分的基本原理有一个清晰的理解。
}
我的问题：
"""
    return prompt
def query_pack(query, mode):
    if (mode == 2):
        prompt = enhPrompt()
        return prompt + "帮我改写以下prompt：['"+query+"']"
    if (mode == 1):
        prompt = genPrompt()
        return prompt + "你需要生成一个{" +query+ "}方向的prompt"

def BetterPromptERNIE(query, mode):
    # mode == 1 -> generate / == 2 -> enhance
    url = api_url + get_access_token()
    history = []
    history.append({"role": "user", "content": query_pack(query, mode)})
    payload = json.dumps({
        "messages": history
    })
    headers = {
        'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    response_data = json.loads(response.text)
    result = response_data["result"]
    # print(response.text)
    # 去掉左边的大括号
    if result.startswith("{"):
        result = result[1:]

    # 去掉右边的大括号
    if result.endswith("}"):
        result = result[:-1]

    return result


if __name__ == '__main__':
    # 维护一个列表用于存储多轮对话的信息
    mode = 1
    while True:
        query = input("input:")
        response = BetterPromptERNIE(query, mode)
        print(response)