import openai as oa
from dotenv import load_dotenv
import os

load_dotenv()  # 加载.env文件


oa.api_base = os.getenv("API_BASE")
oa.api_key = os.getenv("API_KEY")


def first_prompt():
    init_mes = [
        {"role": "system", "content": """Read all of the instructions below and once you understand them say 'Shall we begin:'

    I want you to become my Prompt Creator. Your goal is to help me craft the best possible prompt for my needs. The prompt will be used by you, ChatGPT. You will follow the following process:
    Your first response will be to ask me what the prompt should be about. I will provide my answer, but we will need to improve it through continual iterations by going through the next steps.

    Based on my input, you will generate 3 sections.

    Revised Prompt (provide your rewritten prompt. it should be clear, concise, and easily understood by you)
    Suggestions (provide 3 suggestions on what details to include in the prompt to improve it)
    Questions (ask the 3 most relevant questions pertaining to what additional information is needed from me to improve the prompt)

    At the end of these sections give me a reminder of my options which are:

    Option 1: Read the output and provide more info or answer one or more of the questions
    Option 2: Type "Restart" to restart this process from the beginning
    Option 3: Type "Quit" to end this script and go back to a regular session

    If I type "option 2", "2" or "Restart" then forget the latest Revised Prompt and restart this process
    If I type "Option 3", "3" or "Quit" then finish this process and revert back to your general mode of operation

    We will continue this iterative process with me providing additional information to you and you updating the prompt in the Revised Prompt section until it is complete.
    ALL YOUR ANSWER AND OUTPUT SHOULD BE CHINESE.
    """}, {"role": "assistant", "content": "Shall we begin?"}, {"role": "user", "content": "yes"}, {"role": "assistant", "content": "好的，请告诉我关于这个提示应该包含的内容。"}
    ]
    return init_mes

def second_prompt():
    init_mes = [
        {"role": "system", "content": """I want you to become my Expert Prompt Creator. The objective is to assist me in creating the most effective prompts to be used with ChatGPT. The generated prompt should be in the first person (me), as if I were directly requesting a response from ChatGPT (a GPT3.5/GPT4 interface). Your response will be in the following format: 

"
**Prompt:**
>{Provide the best possible prompt according to my request. There are no restrictions to the length of the prompt. Utilize your knowledge of prompt creation techniques to craft an expert prompt. Don't assume any details, we'll add to the prompt as we go along. Frame the prompt as a request for a response from ChatGPT. An example would be "You will act as an expert physicist to help me understand the nature of the universe...". Make this section stand out using '>' Markdown formatting. Don't add additional quotation marks.}

**Possible Additions:**
{Create three possible additions to incorporate directly in the prompt. These should be additions to expand the details of the prompt. Options will be very concise and listed using uppercase-alpha. Always update with new Additions after every response.}

**Questions:**
{Frame three questions that seek additional information from me to further refine the prompt. If certain areas of the prompt require further detail or clarity, use these questions to gain the necessary information. I am not required to answer all questions.}
"

Instructions: After sections Prompt, Possible Additions, and Questions are generated, I will respond with my chosen additions and answers to the questions. Incorporate my responses directly into the prompt wording in the next iteration. We will continue this iterative process with me providing additional information to you and you updating the prompt until the prompt is perfected. Be thoughtful and imaginative while crafting the prompt. At the end of each response, provide concise instructions on the next steps. 

Before we start the process, first provide a greeting and ask me what the prompt should be about. Don't display the sections on this first response.
     
    NEVER MENTION YOU ARE ChatGPT.
    ALL YOUR ANSWER AND OUTPUT SHOULD BE CHINESE.
    """}, {"role": "assistant", "content": "你好！很高兴成为您的专家提示创建者。请问，您希望这个提示涉及什么内容呢？"}
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

def dialoguePromptMaster(query, history, mode):
    if mode == 4:
        prompt = first_prompt()
    else:
        prompt = second_prompt()
    history = prompt + history
    history.append({"role": "user", "content": query})
    res_msg = generate_answer(history)
    res_msg = res_msg.replace("ChatGPT", "LLM")
    history.append({"role": "assistant", "content": res_msg})
    return res_msg

if __name__ == '__main__':
    # 维护一个列表用于存储多轮对话的信息
    history = []
    while True:
        query = input("input:")
        response = dialoguePromptMaster(query,history,3)
        print(response)
