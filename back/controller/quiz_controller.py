from fastapi import APIRouter, Request, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates
from server.service.quiz_service import generate_random_quiz, validate_sheetname

templates = Jinja2Templates(directory="front")
router = APIRouter()

@router.get("/", response_class=JSONResponse)
async def home(request: Request):
    return {"message": "Hello World"}

@router.get("/quiz", response_class=JSONResponse)
async def quiz(request: Request):
    try:
        print("Received request for /quiz")

        # Get sheetname from query parameters
        sheetname = request.query_params.get("sheetname", "default_sheetname")

        if not validate_sheetname(sheetname):
            raise HTTPException(status_code=400, detail="Invalid sheetname")

        # Check if the user has already received 5 questions
        session = request.session
        question_count = session.get("question_count", 0)
        if question_count >= 5:
            raise HTTPException(status_code=400, detail="Quiz limit reached")

        quiz = generate_random_quiz(sheetname)
        print(f"Generated quiz: {quiz}")

        # Increment question count
        session['question_count'] = question_count + 1

        # Save quiz in session
        session['quiz'] = quiz
        print(f"Session quiz set: {session.get('quiz')}")
        print(f"Session items: {list(session.items())}")

        response = JSONResponse(content=quiz)
        response.set_cookie(key="session", value=request.cookies.get("session"))
        return response

    except HTTPException as he:
        print(f"HTTPException: {he.detail}")
        raise he
    except Exception as e:
        print(f"Error in /quiz endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/check_answer", response_class=JSONResponse)
async def check_answer(request: Request, option: str = Form(...)):
    try:
        print("Checking answer...")
        print(f"Session data before check: {list(request.session.items())}")
        quiz = request.session.get('quiz')
        if quiz is None:
            raise ValueError("Quiz data not found in session.")
        correct_answer = quiz['answer']
        print(f"Received answer: {option}, Correct answer: {correct_answer}")
        if option == correct_answer:
            result = "정답입니다!"
        else:
            result = f"오답입니다! 정답은: {correct_answer} 입니다."
        return {"result": result}
    except ValueError as ve:
        print(f"ValueError: {ve}")
        return JSONResponse(content={"error": str(ve)}, status_code=400)
    except Exception as e:
        print(f"Error checking answer: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)

@router.post("/reset", response_class=JSONResponse)
async def reset_quiz(request: Request):
    try:
        request.session.clear()
        return {"message": "Session reset successfully"}
    except Exception as e:
        print(f"Error resetting session: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)
