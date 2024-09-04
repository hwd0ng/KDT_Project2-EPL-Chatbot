from fastapi import APIRouter
from server.controller.quiz_controller import router as quiz_router

api_router = APIRouter()
api_router.include_router(quiz_router, prefix="/api")  # /static로 API 경로 설정