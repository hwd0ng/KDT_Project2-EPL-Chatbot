from fastapi import FastAPI, HTTPException, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from transformers import GPT2LMHeadModel, PreTrainedTokenizerFast
import torch
from fastapi.middleware.cors import CORSMiddleware
from server.middleware.session_middleware import add_session_middleware
from server.router.api_router import api_router

app = FastAPI()

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],  # 모든 출처 허용 (필요에 따라 제한 가능)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 세션 미들웨어 추가
add_session_middleware(app)

# 라우터 추가
app.include_router(api_router)

# Static 파일 설정 (CSS 등)
app.mount("/static", StaticFiles(directory="front"), name="static")

# Templates 설정 (HTML 파일 등)
templates = Jinja2Templates(directory="front")

# 모델과 토크나이저 로드
model_path = "./fine_tuned_kogpt2"
tokenizer = PreTrainedTokenizerFast.from_pretrained(model_path)
model = GPT2LMHeadModel.from_pretrained(model_path)


# Pydantic 모델 정의
class Query(BaseModel):
    question: str

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("intro.html", {"request": request})

@app.post("/chatbot/")
async def get_response(question: str = Form(...)):
    if not question:
        raise HTTPException(status_code=400, detail="질문이 비어있습니다.")

    input_text = f"질문: {question} 답변:"
    input_ids = tokenizer.encode(input_text, return_tensors='pt')

    with torch.no_grad():
        output = model.generate(input_ids, max_length=50, num_return_sequences=1)

    response_text = tokenizer.decode(output[0], skip_special_tokens=True)

    # "질문:"과 "답변:" 제거 및 응답 정리
    if "답변:" in response_text:
        response_text = response_text.split("답변:")[1].strip()

    # 모델 응답에 "질문:"이 포함되어 있을 경우 제거
    response_text = response_text.replace("질문:", "").strip()


    return {"response": response_text}


# 서버 실행
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
