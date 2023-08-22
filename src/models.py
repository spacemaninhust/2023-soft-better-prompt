import os
import string
import random
from datetime import datetime

from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from src import db
from src.extensions import APP_FILE


class User(db.Model, UserMixin):
    """用户

    Attributes:
        id (db.Interger): 自增主键
        username (db.String): 用户名（非空，不可重复）
        nickname (db.String, optional): 昵称
        psw_hash (db.String): 密码散列值（非空）
        email (db.String, optional): 邮箱地址
        userspace (db.String): 用户空间路径（非空，不可重复）
    
    Methods:
        set_password(str): 设置密码
        validate_password(str) -> bool: 验证密码
        set_email(str): 设置邮箱地址
        set_userspace(): 设置用户空间路径
    """
    id = db.Column(db.Integer, primary_key=True)  # 主键
    username = db.Column(db.String(30), nullable=False, unique=True)  # 用户名
    nickname = db.Column(db.String(30))  # 昵称 (optional)
    psw_hash = db.Column(db.String(128), nullable=False)  # 密码散列值
    email = db.Column(db.String(30))  # 邮箱 (optional)
    userspace = db.Column(db.String(50), nullable=False, unique=True)  # 用户空间路径

    saves = db.relationship('Save',back_populates='creator',cascade = 'all')
    def set_password(self, password: str):
        """设置密码

        根据用户输入的密码生成密码散列值

        Args:
            password (str): 明文密码
        """
        self.psw_hash = generate_password_hash(password)

    def validate_password(self, password: str) -> bool:
        """验证密码

        判断用户输入的密码是否正确
        
        Args:
            password (str): 输入的密码

        Returns:
            bool: True - 密码正确; False - 密码错误
        """
        return check_password_hash(self.psw_hash, password)

    def set_email(self, email: str):
        """设置邮箱地址

        Args:
            email (str): 邮箱地址
        """
        self.email = email

    def set_userspace(self, username: str):
        """设置用户空间路径
        
        采用一定的规则生成不可重复的路径
        
        """

        def generate_userspace(username: str):
            userspace = username + ''.join(random.sample(
                string.ascii_letters + string.digits,
                30 - len(username)
            ))
            return os.path.join(APP_FILE, userspace)

        self.userspace = generate_userspace(username)
        if not os.path.exists(self.userspace):
            os.mkdir(self.userspace)

class Save(db.Model):
    """
    保存的收藏prompt
    """
    id = db.Column(db.Integer, primary_key=True)  # 主键
    prompt = db.Column(db.Text, nullable=False)  # prompt的文本内容
    time= db.Column(db.DateTime, nullable=False)  # 创建时间
    # name = db.Column(db.String) # 名称类型
    # tag = db.Column(db.ARRAY(db.String))
    name = db.Column(db.String, default="")  # 设置默认值为空字符串
    tag = db.Column(db.String,default="文生文")  # 标签用逗号分隔的字符串

    save_path = db.Column(db.String(50))  # 收集存放路径
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'))  # 创建者 ID
    creator = db.relationship('User', back_populates='saves')


    def set_prompt(self, prompt: str):
        self.prompt = prompt
    def set_time(self):
        self.time = datetime.now().replace(microsecond=0)

    def set_name(self, name: str):
        self.name = name

    # def set_tag(self, tags: list):
    #     self.tag = tags
    def set_tag(self, tags: list):
        if not tags or all(tag == '' for tag in tags):
            self.tag = ''  # 设置为空字符串
        elif len(tags) == 1:
            self.tag = tags[0]  # 单个元素作为标签
        else:
            self.tag = ', '.join(tags)  # 使用逗号和空格作为分隔符

    def set_save_path(self):
        # self.collection_path = os.path.join(self.creator.userspace, self.id)
        self.save_path = os.path.join(
            str(self.creator.userspace),
            'prompt_' + str(self.id)
        )
        if not os.path.exists(self.save_path):
            os.mkdir(self.save_path)
