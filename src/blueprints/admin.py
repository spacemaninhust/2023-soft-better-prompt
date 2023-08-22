import os
import json
import logging

from flask import request, render_template, redirect, url_for, Blueprint, session, jsonify, make_response, send_file
from flask_login import login_required, logout_user

import src.utils.user as u_utils
def get_username_from_session(url_of_request: str):
    username = session.get('username')
    if username is None:
        logging.error(f"Unlogin user behavior at {url_of_request}.")
    return username


admin_bp = Blueprint('admin', __name__)
@admin_bp.route('/personalinfo', methods=['GET', 'POST'])
def personal_information():
    username = session.get('username')
    if username is None:
        err_msg = f'Error: unlogin user {username} request url {request.url}'
        logging.error(err_msg)
        print(err_msg)
        return err_msg
    user = u_utils.get_user_by_name(username)
    if user is None:
        err_msg = f'Error: user {username} not exists!'
        logging.error(err_msg)
        print(err_msg)
        return err_msg

    if request.method == 'GET':
        print("username: {}\temail: {}".format(user.username, user.email))
        result = jsonify(data={
            'Username': user.username,
            'Email': user.email,
            'data': 1
        })
        response = make_response(result)
        return response
    elif request.method == 'POST':
        data = request.get_json()
        data_info = json.loads(data['data'])
        # ! DEBUG
        print(data_info)
        print(type(data_info))
        # ! DEBUG

        new_username = data_info['username']
        new_email = data_info['email']
        stat_code = u_utils.modify_userinfo(user, new_username, new_email)
        # 返回响应
        result = jsonify(data={'data': stat_code})
        response = make_response(result)
        return response
    else:
        msg = f'Request url {request.url} method {request.method}'
        return msg


@admin_bp.route('/password', methods=['GET', 'POST'])
def change_password():
    if request.method == 'POST':
        username = session.get('username')
        if username is None:
            err_msg = f'Error: unlogin user {username} request url {request.url}'
            logging.error(err_msg)
            print(err_msg)
            return err_msg
        user = u_utils.get_user_by_name(username)
        if user is None:
            err_msg = f'Error: user {username} not exists!'
            logging.error(err_msg)
            print(err_msg)
            return err_msg
        data = request.get_json()
        data_info = json.loads(data['data'])
        # ! DEBUG
        print(data_info)
        print(type(data_info))
        # ! DEBUG
        original_password = data_info['oldpassword']
        new_password = data_info['newpassword']
        stat_code = u_utils.modify_password(user, original_password, new_password)
        # 返回响应
        result = jsonify(data={'data': stat_code})
        response = make_response(result)
        return response
    msg = f'Request {request.url} method {request.method}'
    return msg
