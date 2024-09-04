from starlette.middleware.sessions import SessionMiddleware
import secrets

def add_session_middleware(app):
    # 안전한 secret_key 생성
    secret_key = secrets.token_hex(32)
    # 세션 미들웨어 추가
    app.add_middleware(SessionMiddleware, secret_key=secret_key, session_cookie="session", same_site="lax")
