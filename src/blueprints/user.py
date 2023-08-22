import json
import logging
import random
import time
from DialoguePrompt.dialoguePrompt import dialoguePromptMaster
from BetterPrompt.betterPromptEx import betterPrompt
from BPERNIE.ErnieBot import BetterPromptERNIE
from BPERNIE.Application import appERNIE
# from BetterPrompt.betterPrompt import promptGen_Nonstream
# from BetterPrompt.betterPrompt import promptImprover

from flask import make_response, jsonify
from flask import request, render_template, redirect, url_for, Blueprint
from flask_login import login_required, logout_user, login_user
from flask import session

import src.utils.user as user_utils
import src.utils.save as save_utils
user_bp = Blueprint('user', __name__)


@user_bp.route('/index', methods=['GET', 'POST'])
def user_index():
    username = session.get('username')
    
    # ! DEBUG
    print("Index session: {}".format(session))
    if username is not None:
        print("Username: {}".format(username))
    # ! DEBUG
    if user_utils.get_user_by_name(username) is not None:
        result = jsonify(data={'username': username, 'code': 1})
        # ! DEBUG
        print("Get username success!")
        # ! DEBUG
        response = make_response(result)
        print(response.json)
        return response
    return make_response()
@user_bp.route('best_chat', methods=['GET', 'POST'])
def user_best_chat():
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        query = data['data']['text']
        code = data['data']['code']

        # 应用的上下文
        # 如果是上下文多轮对话
        # input：query :string code :int 1-10代表十个应用
        # out:message :string
        # 生成prompt
        print(query)
        print(code)
        message = appERNIE(code, query)

        result = jsonify(data={'message': message, 'code': 2})
        response = make_response(result)
        print(response.json)
        return response
    return "chat"
@user_bp.route('gen_by_wenxin',methods=['GET','POST'])
def user_gen_by_wenxin():
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        query = data['data']['text']
        code = data['data']['code']
        print(code)
        message = ""
        if code == 1:
            # 文心一言的生成
            # 所有的内容都通过query传递
            message = BetterPromptERNIE(query, 1)
        elif code == 2:
            # 文心一言的优化
            # 所有的内容都通过query传递
            message = BetterPromptERNIE(query, 2)
        result = jsonify(data={'message': message, 'code': 1})
        response = make_response(result)
        print(response.json)
        return response
    return "chat"
@user_bp.route('/gen_prompt', methods=['GET', 'POST'])
def user_gen_prompt():
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        query = data['data']['text']
        code = data['data']['code']
        print(code)
        message = ""
        # 调接口，获得回复内容
        # input：text :string
        # out:message :string
        # 生成prompt
        if code == 1:
            if ' ' in query:
                print(query)
                # if query.find("程序员 编写python代码 大学项目 专业、有注释、结构清晰")!=-1:
                #     message = "请作为一个有经验的Python程序员，编写一个优秀的大学项目。该项目应专注于编写高质量、注释完善的Python代码，并确保在项目中实现预期目标。在编写代码的过程中，请务必遵循良好的编程规范和标准，以提高代码的可读性、可维护性和可靠性。同时，请确保项目具有良好的结构，清晰的进度安排和明确的报告。"
                #     print(message)
                #     sleep_time = random.randint(10, 15)
                #     time.sleep(sleep_time)
                # else:
                message = betterPrompt(query,code, " ")
            else:
                message = "请按照要求输入哦！"
        # 优化prompt
        elif code == 2:
            if '&' in query:
                sen = query.split('&', 1)
                query = sen[0]
                demand = sen[1]
                print(query)
                print(demand)
            #     if query == "请作为一个专业的撰稿人，为大学项目撰写高质量、清晰的论文。在撰写过程中，请确保遵循项目的具体要求，准确理解论文的主题和目的，并充分利用可靠的事实和数据来支持你的观点。":
            #         message = "请撰写一篇高质量、清晰的论文，涉及大学项目的特定要求。确保准确理解论文的主题和目的，并运用可靠的事实和数据充实你的观点。请保持良好的文风，使用适当的引用和参考文献，以确保论文的逻辑性和连贯性。在完成撰写后，请认真审查论文，确保没有语法、拼写或格式等错误，并提交符合要求的最终版本。请根据以上要求撰写一篇包含以下论文结构的论文：引言：介绍论文的背景和目的，并概述论文的结构。文献综述：回顾相关的学术文献和研究成果，说明当前研究领域的现状和问题。方法论：描述你所采用的研究方法和数据收集方法，并解释为何选择这些方法以回答你的研究问题。结果与分析：呈现你的研究结果，并对其进行详细分析和解释。讨论：对研究结果进行深入讨论，评估其与已有研究的一致性、局限性以及对相关领域的意义。结论：总结研究的主要发现和贡献，并提出进一步的研究方向或建议。引用文献：列出你在论文中引用的所有文献和资料。"
            #     #     sen2 = "请撰写一篇拥有高质量、清晰特性的论文，这篇论文需要满足大学项目的特定要求。能够准确解读文章的主题并且应用可靠的事实和数据充实你的观点。你需要保持一个良好的写作手法，必要时添加适当的引用和参考文献，以确保论文的逻辑性和连贯性。在完成撰写后，请认真审查论文，确保没有语法、拼写或格式等错误，并提交符合要求的最终版本。请根据以上要求撰写一篇包含以下论文结构的论文：引言：介绍论文的背景和目的，并概述论文的结构。文献综述：回顾相关的学术文献和研究成果，说明当前研究领域的现状和问题。方法论：描述你所采用的研究方法和数据收集方法，并解释为何选择这些方法以回答你的研究问题。结果与分析：呈现你的研究结果，并对其进行详细分析和解释。讨论：对研究结果进行深入讨论，评估其与已有研究的一致性、局限性以及对相关领域的意义。结论：总结研究的主要发现和贡献，并提出进一步的研究方向或建议。引用文献：给出这里所需要的参考文献的内容。"
            #     #     message = sen1 if temp == 1 else sen2
            #     #     temp+=1
            #         print(message)
            #         sleep_time = random.randint(10, 15)
            #         time.sleep(sleep_time)
            #     else:
                message = betterPrompt(query,code, demand)
            # else:
            #     message = "请按照要求输入哦！"

        result = jsonify(data={'message': message, 'code': 1})
        response = make_response(result)
        print(response.json)
        return response
    return "chat"
@user_bp.route('/gen_muti_prompt', methods=['GET', 'POST'])
def user_gen_muti_prompt():
    # 多轮对话生成
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        query = data['data']['text']
        history = data['data']['history']
        # 解析字符串形式的历史数据
        try:
            history = json.loads(history)
        except json.JSONDecodeError:
            print("Invalid history format. Unable to parse the history string.")
            history = []
        code = data['data']['code']
        print(f'history length {len(history)}')

        print("Original History:")
        print(history)
        formatted_history = []
        if len(history) > 1:
            for i, item in enumerate(history):
                if i == 0:
                    continue  # Skip the first element
                role = item.get("sender")
                content = item.get('content')
                if role is not None and content is not None:
                    formatted_history.append({"role": role, "content": content})

        print("\nFormatted History:")
        print(formatted_history)

        message = ""
        if code == 3 or code == 4:

            # 如果是上下文多轮对话
            # input：query :string
            # out:message :string
            # Formatted history:list 历史数据
            # 生成prompt
            print(query)
            message = dialoguePromptMaster(query,formatted_history,code)
            # message = ""

        result = jsonify(data={'message': message, 'code': 2})
        response = make_response(result)
        print(response.json)
        return response
    return "chat"
@user_bp.route('/save_prompt', methods=['GET', 'POST'])
def user_save_prompt():
    '''
    用户保存（收藏prompt）
    Returns: 返回cur_id :int

    '''
    if request.method == 'POST':
        username = session.get('username')
        if user_utils.get_user_by_name(username) is not None:
            print(f'get username :'+username)
            data = request.get_json()
            print(data)
            # data_info = json.loads(data['data'])
            data_info = data['data']
            new_save = save_utils.create_save_from_str(data_info)
            user = user_utils.get_user_by_name(username)
            cur_id = save_utils.add_new_save_to_user(new_save,user)
            result = jsonify(data={'cur_id': cur_id})
            response = make_response(result)
            print(response.json)
            return response
@user_bp.route('/edit_prompt/<int:save_id>',methods = ['GET','POST'])
def user_edit_prompt(save_id:int):
    '''
    用户编辑收藏
    '''
    if request.method == 'GET':
      response = save_utils.make_save_response_byid(save_id)
      if response is None:
          err_msg = f"Edit collection {save_id} failed!"
          logging.error(err_msg)
          print(err_msg)
          return err_msg
          # 返回响应
      return response
    elif request.method == 'POST':
        username = session.get('username')
        if user_utils.get_user_by_name(username) is not None:
            print(f'get username :'+username)
            data = request.get_json()
            print(data)
            data_info_dict = data['data']
            print(data_info_dict)
            save_utils.modify_save_from_data(data_info_dict,save_id)
            result = jsonify(data={'cur_id': save_id})
            response = make_response(result)
            print(response.json)
            return response
            # save = save_utils.get_save(save_id)

@user_bp.route('/delete_prompt/<int:save_id>', methods=['GET', 'POST'])
def user_delete_prompt(save_id:int):
    '''
    用户删除收藏
    Returns:返回code:1

    '''
    if request.method == 'POST':
        username = session.get('username')
        if user_utils.get_user_by_name(username) is not None:
            print(f'get username :'+username)
        state_code = save_utils.delete_save_byid(save_id)
        result = jsonify(data={'data': state_code})
        response = make_response(result)
        return response

@user_bp.route('/get_saved_prompt', methods=['GET', 'POST'])
def get_saved_prompt():
    '''

    Returns:返回列表中的所有save项

    '''
    username = session.get('username')
    user = user_utils.get_user_by_name(username)
    save_info_dict_list = user_utils.get_saves_info_of_user(user)
    save_info_dict_list.sort(key=lambda k: k.get('Id', 0))# 根据Id进行排序

    print(save_info_dict_list)
    for save_info_dict in save_info_dict_list:
        print(json.dumps(save_info_dict,indent=1))
    result = jsonify(data={'data': save_info_dict_list})
    # result = jsonify(data = {'data':json.dumps(save_info_dict_list)})
    response = make_response(result)
    return response

@user_bp.route('/login', methods=['GET', 'POST'])
def login():
    """用户登录

    Returns:
        _type_: _description_
    """
    if request.method == 'POST':
        data = request.get_json()
        data_info = json.loads(data['data'])
        username = data_info['Username']
        password = data_info['Password']
        # ! DEBUG
        print("username: {}, password: {}".format(username, password))
        # ! DEBUG
        # 将用户登录
        stat_code, user = user_utils.login_check(username, password)
        if stat_code == 1:  # 登录成功
            # login_user(user)
            # ! 设置 session
            session['username'] = username
        result = jsonify(data={'data': stat_code})
        response = make_response(result)
        # response.headers['result'] = stat_code  # 用户不存在 (-1) 密码错误 (0)
        return response
    return "Login page."


@user_bp.route('/register', methods=['GET', 'POST'])
def register():
    """用户注册

    Returns:
        _type_: _description_
    """
    if request.method == 'POST':
        data = request.get_json()
        data_info = json.loads(data['data'])
        username = data_info['Username']
        password = data_info['Password']
        email = ""
        print("username: {}, password: {}, email: {}".format(username, password, email))
        # 将用户注册
        stat_code = user_utils.register_user(username, password, email)
        result = jsonify(data={'data': stat_code})
        response = make_response(result)
        # if stat_code == 1:
        #     return "Register succeed!"
        # else:
        #     return "Register failed!"
        return response
    return "Register page."


@user_bp.route('/logout', methods=['GET', 'POST'])
def logout():
    """用户登出

    Returns:
        _type_: _description_
    """
    if request.method == 'POST':
        # logout_user()
        session.clear()
        # result = jsonify(data={'data': 1})
        # response = make_response(result)
        # return response
        return "Logout success!"
    return "Logout get request."


@user_bp.route('/unregister', methods=['GET', 'POST'])
def unregister():
    """用户注销

    Returns:
        _type_: _description_
    """
    if request.method == 'POST':
        username = session.get('username')
        stat_code = user_utils.unregister_user(username)
        session.clear()
        result = jsonify(data={
            'data': stat_code,
            'msg': 'unregister success' if stat_code == 1 else 'unregister failed'
        })
        response = make_response(result)
        return response
    return "Unregister."


@user_bp.route('/homepage', methods=['GET', 'POST'])
def homepage():
    """用户主页

    Returns:
        _type_: _description_
    """
    pass
    return "Homepage."
