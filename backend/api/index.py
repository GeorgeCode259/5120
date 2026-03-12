import os
import sys

# 将后端根目录添加到路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def get_app():
    # 在函数内部导入，避免 'app' 模块进入全局命名空间
    from app import create_app
    _app = create_app()
    return _app


# 变量名使用 app，但确保它指向的是 Flask 实例，而不是模块
app = get_app()

# 如果需要初始化数据库，可以在这里安全调用
with app.app_context():
    from app.extensions import db
    try:
        db.create_all()
    except Exception as e:
        print(f"Database initialization skipped or failed: {e}")
