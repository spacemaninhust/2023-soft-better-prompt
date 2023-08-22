import os
import click
import shutil
from flask import Flask
from flask_cors import CORS

from src.extensions import db, cache
from src.blueprints.user import user_bp
from src.blueprints.admin import admin_bp
from src.settings import configs


def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_CONFIG', 'dev')

    app = Flask(
        __name__,
        static_url_path='',
        static_folder='templates'
    )
    app.config.from_object(configs[config_name])
    """ 蓝图路由设置 """
    register_blueprints(app)
    """ 注册命令 """
    register_commands(app)
    return app


def register_blueprints(app):
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')



def register_commands(app):
    @app.cli.command()
    @click.option('--drop', is_flag=True, help='Create after drop.')
    def initdb(drop):
        """ Initialize the database. """
        if drop:
            db.drop_all()
        db.create_all()

        storage_path = os.path.join(os.path.dirname(__file__), 'storage')
        caches_path = os.path.join(os.path.dirname(__file__), 'caches')

        if os.path.exists(storage_path):
            shutil.rmtree(storage_path)
        os.mkdir(storage_path)
        if os.path.exists(caches_path):
            shutil.rmtree(caches_path)
        os.mkdir(caches_path)
        click.echo('Initialized database.')


""" 创建 Flask 应用 """
app = create_app(config_name='development')

""" 数据库初始化 """
db.init_app(app)

""" Cache 初始化 """
cache.init_app(app)
# 保证跨域访问
cors = CORS(app, resources={r"/*": {"origins": "*"}}, methods=['GET', 'HEAD', 'POST', 'OPTIONS'])
# ! 以下引用不可移动
from src import views
