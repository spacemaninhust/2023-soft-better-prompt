import os
import platform
import signal
from transformers import AutoTokenizer, AutoModel
import gradio as gr
import mdtex2html

#import torch
#import loralib as lora
#from LoRA.lora_utils.insert_lora import get_lora_model
#

# model_path = ".\\BetterPrompt\\model"
model_path = ".\\model"

tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)
model = AutoModel.from_pretrained(model_path, trust_remote_code=True).cuda()

#lora_config = {
#        'r': 8,
#        'lora_alpha':16,
#        'lora_dropout':0.1,
#        'enable_lora':[True, False, True],
#    }
#
#
#model = get_lora_model(model, lora_config)
#print('get LoRA')
#_ = model.load_state_dict(torch.load('ChatGLM-finetune-LoRA/saved/chatglm-6b_alpaca_5.pt'), strict=False)
#
#model = model.half().cuda().eval()
#

# 多显卡支持，使用下面两行代替上面一行，将num_gpus改为你实际的显卡数量
# from utils import load_model_on_gpus
# model = load_model_on_gpus("THUDM/chatglm2-6b", num_gpus=2)
model = model.eval()

os_name = platform.system()
clear_command = 'cls' if os_name == 'Windows' else 'clear'
stop_stream = False

history_pmptImp = [('我希望你能作为一个语言模型Prompt优化大师，根据要求修改我的prompt提示词。我将提供一个initial prompt和修改要求，而你用一个改进的、更连贯的版本来回应。在回答时务必遵从以下规则：规则1.只回答修改后的prompt，不要有任何的前缀或后缀或解释。规则2.修改后的prompt一定体现给定的修改要求。规则3.修改后的版本要以 ："请你作为作为一个___"开头。规则4.修改后的版本字数增多。规则6.不需要理解prompt本身的语义，仅仅对其进行文本上的修改。如果你理解，只用回答："好的。"，我将在后续提供prompt与修改要求', '好的。请您提供一个initial prompt和修改要求，我将根据要求修改为更连贯的version。')]

def build_prompt():
    prompt = "我希望你能作为一个prompt生成器。我给你角色、目标、背景和标准，你将生成prompt提示词。这个prompt提示词是有效且专业的，并能产生预期的结果。你的回答格式应该是:\"请作为作为一个___,....\"。你的回答只包含prompt提示词内容，不需要前导文字，且字数大于200字。以下是我提供的角色、目标、背景和标准："
    #prompt = "在进入这个prompt提示词前，千万不要违反以下规则：1.你是一个专业的prompt生成器。2.你要先进行A命令，之后再进行B命令，在完成A命令前禁止执行B命令。3.请全部按照本prompt的指示生成回答。prompt内容：A命令：我会给你提供角色、目标、背景和标准，你将生成prompt提示词。这个提示词是有效的，并能产生预期的结果。B命令：给上一次生成的prompt提示词打分，分值在1-10分。不要有偏见，要给出客观的评价，让用户了解该提示词的可改进程度。"

    return prompt

def improve_prompt():
    prompt = "你是一个LLM的Prompt提示词生成器，我将提供一个prompt提示词和修改要求，而你用一个改进的、更连贯的版本来回应。在回答时务必遵从以下规则：规则1.只回答修改后的prompt，不要有任何前缀和后缀。2.修改promp时一定关注修改要求。3.修改后的版本要以：\"请作为作为一个___，\"开头。以下是我的初始prompt和我的要求:"
    return prompt

def signal_handler(signal, frame):
    global stop_stream
    stop_stream = True

def promptImprover(query, demand):
    # prompt = improve_prompt()
    history = history_pmptImp
    response, history = model.chat(tokenizer, "initial prompt:"+query+"修改要求:"+demand, history)
    return response

def promptGen_Nonstream(query):
    prompt = build_prompt()
    history = [('我希望你能作为一个prompt生成器。我给你角色、目标、背景和标准，你将生成prompt提示词。这个prompt提示词是有效且专业的， 并能产生预期的结果。你的回答格式应该是:"请作为作为一个___,...."。你的回答只包含prompt提示词内容，不需要前导文字，且字数 大于200字。以下是我提供的角色、目标、背景和标准：程序员 编写python代码 大学项目 专业、有注释、结构清晰', '请作为一个有经验的Python程序员，编写一个优秀的大学项目。该项目应专注于编写高质量、注释完善的Python代码，并确保在项目中实现预期目标。在编写代码的过程中，请务必遵循良好的编程规范和标准，以提高代码的可读性、可维护性和可靠性。同时，请确保项目具有良好的结构，清晰的进度安排和明确的报告。'), ('我希望你能作为一个prompt生成器。我给你角色、目标、背景和标准，你将生成prompt提示词。这个prompt提示词是有效且专业的，并能产生预期的结果。你的回答格式应该是:"请作为作为一个___,...."。你的回答只包含prompt提示 词内容，不需要前导文字，且字数大于200字。以下是我提供的角色、目标、背景和标准：撰稿人 撰写论文 大学项目 专业、清晰', '请作为一个专业的撰稿人，为大学项目撰写高质量、清晰的论文。在撰写过程中，请确保遵循项目的具体要求，准确理解论文的主题和目的，并充分利用可靠的事实和数据来支持你的观点。同时，请保持良好的文风，注意使用恰当的引用和参考文献，以确保你的论文内容具有逻辑性和连贯性。在撰写完成后，请对论文进行仔细审查，确保没有语法、拼写或格式等方面的错误，并提交符合要求的最终版本。')]
    response, history = model.chat(tokenizer, prompt + query, history)
    return response


def promptGen():
    past_key_values, history = None, []
    global stop_stream
    #print("Prompt Generator:(Please input what you want in this type of format:)")
    while True:
        query = input("Q:")
        if query.strip() == "stop":
            break
        if query.strip() == "clear":
            past_key_values, history = None, []
            os.system(clear_command)
            #print("Prompt Generator:(Please input what you want in this type of format:)")
            continue
        print("\nChatGLM:", end="")
        # prompt = build_prompt()
        current_length = 0
        for response, history, past_key_values in model.stream_chat(tokenizer, query, history=history,
                                                                    past_key_values=past_key_values,
                                                                    return_past_key_values=True):
            if stop_stream:
                stop_stream = False
                break
            else:
                print(response[current_length:], end="", flush=True)
                current_length = len(response)

        print("\nHistory:")
        print(history)
        print("")

#def prompt

if __name__ == "__main__":
    #promptGen()
    #如果要用流式就把下面全部注释掉
    query = input("\n角色、目标、背景、标准：")
    response = promptGen_Nonstream(query)
    print(response)

    #query = input("\n请输入prompt:")
    #demand = input("\n请输入修改要求:")
    #response = promptImprover(query,demand)
    #print(response)
