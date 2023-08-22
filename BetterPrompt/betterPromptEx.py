import openai as oa
from dotenv import load_dotenv
import os

load_dotenv()  # 加载.env文件


oa.api_base = os.getenv("API_BASE")
oa.api_key = os.getenv("API_KEY")


def first_prompt():
    init_mes = [
        {"role": "system", "content": """You are a prompt generator. Your task is to create prompt used by LLM.
        I will provide you with the following information:

    Role: [The specific role I want you to take on]

    Objective: [The clear goal or objective of the prompt]

    Background: [Any relevant background information or context that would help in addressing the objective]

    Criteria: [The Specific standards or criteria that the generated prompt should meet]

    Once I provide this information, you will generate a prompt that is effective, professional, and capable of producing the expected results. The prompt will be formatted as per your requirements.
    
    Your response will be in the following format:
    "You will act as an ___,..."
    
    Your response should be ONLY the prompt, WITHOUT ANY INTRODUCTORY TEXT.
    ALL YOUR ANSWER SHOULD BE IN CHINESE. """},
        {"role": "assistant", "content": """"""}
    ]
    return init_mes


def second_prompt():
    init_mes = [
        {"role": "system", "content": """"你是一个LLM的Prompt提示词生成器，我将提供一个prompt提示词和修改要求，而你用一个改进的、更连贯的版本来回应。在回答时务必遵从以下规则：规则1.只回答修改后的prompt，不要有任何前缀和后缀。2.修改promp时一定关注修改要求。3.修改后的版本要以：\"请作为作为一个___，\"开头。接下来我会提供我的初始prompt和我的修改要求:"""},
        {"role": "assistant", "content": "好的，请告诉我你的初始提示词和修改要求。"}
    ]
    return init_mes


def generate_answer(messages):
    completion = oa.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=0.7
    )
    res_msg = completion.choices[0].message
    return res_msg["content"].strip()


def betterPrompt(query, mode, query2):
    if mode == 1:
        prompt = first_prompt()
        history = prompt
        history.append({"role": "user", "content": "角色、目标、背景和标准" + query})
        res_msg = generate_answer(history)
        res_msg = res_msg.replace("ChatGPT", "LLM")
        return res_msg
    else:
        prompt = second_prompt()
    history = prompt
    history.append({"role": "user", "content": "初始prompt:"+query+"  修改要求："+query2})
    res_msg = generate_answer(history)
    res_msg = res_msg.replace("ChatGPT", "LLM")
    return res_msg


if __name__ == '__main__':
    # 维护一个列表用于存储多轮对话的信息
    history = []
    while True:
        query = input("input:")
        response = dialoguePromptMaster(query, history, 3)
        print(response)
