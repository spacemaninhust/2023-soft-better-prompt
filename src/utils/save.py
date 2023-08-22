import logging
import os
import shutil
from typing import Optional

import flask
from flask import jsonify, make_response

from src.extensions import db
from src.models import Save

def get_creator(save):
    return save.creator if save is not None else None

def get_creator_byid(save_id: int):
    target = get_save(save_id)
    return get_creator(target)

def get_save(save_id: int):
    target = Save.query.filter_by(id=save_id).first()
    return target

def create_save(prompt:str,commit:bool = False):
    new_save = Save(prompt=prompt)
    new_save.set_time()
    if commit:
        db.session.add(new_save)
        db.session.commit()
    return new_save

def delete_subdir(parent_dir: str, sub_dir: str):
    """

    Args:
        parent_dir: 上级目录
        sub_dir: 待删除的子目录

    Returns:
        __type__: None
    """
    subdir_path = os.path.join(parent_dir, sub_dir)
    if os.path.exists(subdir_path) and os.path.isdir(subdir_path):
        shutil.rmtree(subdir_path)
        print(f'Remove path {subdir_path}')
    else:
        print(f'Path {subdir_path} not exists or is not a directory!')

def delete_save(save):
    save_path = save.save_path
    try:
        print("save_path to be removed: ", save_path)
        delete_subdir(os.path.dirname(save_path), os.path.basename(save_path))
    except IOError:
        logging.error(f"Remove save_path failed! save_id: {save.id}\tpath: {save_path}")
        return 0
    # * 执行删除收集操作
    db.session.delete(save)
    db.session.commit()
    return 1

def delete_save_byid(save_id: int):
    save = get_save(save_id)
    stat_code = delete_save(save)
    return stat_code



def add_new_save_to_user(save,user):
    user.saves.append(save)
    save.creator = user
    save.creator_id = user.id
    db.session.add(user)
    db.session.commit()
    save.set_save_path()
    print(f'save_path: {save.save_path}')
    db.session.add(save)
    db.session.commit()
    return save.id

def create_save_from_str(data_info:str)->Save:
    """
    由传输的数据创建
    Args:
        data_info:

    Returns:

    """
    prompt = data_info
    new_save = create_save(
        prompt=prompt
    )
    return new_save

def get_save_info(save) -> dict:
    if save is None:
        return {}

    save_info_dict = {
        'Id': save.id,
        'Prompt': save.prompt,
        'Time': save.time.strftime("%Y-%m-%d %H:%M:%S"),
        'Name': save.name
    }

    if save.tag and ',' in save.tag:
        tags_list = save.tag.split(',')
        save_info_dict['Tag'] = tags_list
    elif save.tag:
        save_info_dict['Tag'] = [save.tag]
    else:
        save_info_dict['Tag'] = []

    return save_info_dict


def get_save_info_byid(save_id:int)->dict:
    save = get_save(save_id)
    return get_save_info(save)

def make_save_response(save)->Optional[flask.Response]:
    if save is None:
        return None
    save_info_dict = get_save_info(save)
    result = jsonify(
        data = {
            'save_info':save_info_dict,
            'code':1
        }
    )
    response = make_response(result)
    return response

def make_save_response_byid(save_id:int)->Optional[flask.Response]:
    save = get_save(save_id)
    return make_save_response(save)

def modify_save_from_data(data_info_dict:dict,save_id:int)->[Optional[Save]]:
    save = get_save(save_id)
    print(data_info_dict)
    save.prompt = data_info_dict['collectContent']
    save.name = data_info_dict['collectName']
    save.set_tag(data_info_dict['collectTag'])
    save.set_time()
    print(save)
    db.session.add(save)
    db.session.commit()