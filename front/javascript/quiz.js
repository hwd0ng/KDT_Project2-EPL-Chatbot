document.addEventListener('DOMContentLoaded', () => {
    let currentQuestionIndex = 0;
    let currentQuizIndex = 0;
    let maxQuizzes = 5;  // 최대 퀴즈 수
    let currentTeamName = ""; // 현재 팀 이름 저장
    let correctAnswersCount = 0; // 정답 횟수 저장

    async function handleTeamClick(event) {
        try {
            // 초기화
            await resetSession();  // 팀을 클릭할 때 세션 초기화
            const team = event.target.alt;
            console.log("Clicked team:", team); // 팀 이름 반환 확인
            currentQuestionIndex = 0;
            console.log("currentQuestionIndex:", currentQuestionIndex); // 현재 질문 인덱스 확인
            currentTeamName = team; // 현재 팀 이름 저장
            console.log("currentTeamName:", currentTeamName); // 현재 팀 이름 확인
            currentQuizIndex = 0; // 퀴즈 인덱스 초기화
            correctAnswersCount = 0; // 정답 횟수 초기화
            startQuiz(team); // 퀴즈 시작
            document.getElementById('resultBox').innerText = ''; // 결과 메시지 초기화
        } catch (error) {
            console.error("Error in handleTeamClick:", error);
        }
    }

    async function startQuiz(team) {
        console.log("Starting quiz for team:", team);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/quiz?sheetname=${team}`, { credentials: 'include' });
            console.log("Fetch response:", response);
            if (response.ok) {
                const data = await response.json();
                console.log("Quiz data:", data);
                document.getElementById('questionBox').innerText = 'Q: ' + data.question;
                const options = data.options;
                let optionsHtml = '<div class="radio-group">';
                options.forEach((option, index) => {
                    optionsHtml += `
                        <div>
                            <input type="radio" id="option${index + 1}" name="option" value="${option}">
                            <label class="radio-label" for="option${index + 1}">${index + 1}. ${option}</label>
                        </div>
                    `;
                });
                optionsHtml += '</div><button type="button" onclick="submitAnswer()">제출</button>';
                displayPagination(); // 페이징 초기화
                document.getElementById('optionsBox').innerHTML = `
                    <form id="quizForm">
                        ${optionsHtml}
                    </form>
                `;
                updatePagination();
//                disableNextButton(); // "Next" 버튼 비활성화
            } else {
                const errorData = await response.json();
                console.error("Failed to fetch quiz:", errorData.error);
                document.getElementById('questionBox').innerText = errorData.error;
                document.getElementById('optionsBox').innerHTML = '';
            }
        } catch (error) {
            console.error("Error fetching quiz:", error);
        }
    }

    async function resetSession() {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/reset', {
                method: 'POST',
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Session reset:", data);
            } else {
                console.error("Failed to reset session");
            }
        } catch (error) {
            console.error("Error resetting session:", error);
        }
    }

    async function submitAnswer() {
        console.log("Submitting answer...");
        try {
            const form = document.getElementById('quizForm');
            const formData = new FormData(form);
            const response = await fetch('http://127.0.0.1:8000/api/check_answer', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            console.log("Fetch response:", response);
            if (response.ok) {
                const data = await response.json();
                console.log("Answer data:", data);
                document.getElementById('resultBox').innerText = data.result;
                if (data.result === "정답입니다!") {
                    correctAnswersCount++; // 정답 횟수 증가
                }
                document.getElementById('nextButton').style.display = 'block';
                enableNextButton(); // "Next" 버튼 활성화
                if (currentQuizIndex >= maxQuizzes - 1) {
                    document.getElementById('nextButton').innerText = '결과 보기';
                } else {
                    document.getElementById('nextButton').innerText = 'Next';
                }
            } else {
                console.error("Failed to check answer");
            }
        } catch (error) {
            console.error("Error checking answer:", error);
        }
    }

    async function nextQuiz() {
        try {
            if (currentQuizIndex < maxQuizzes - 1) {
                currentQuizIndex++;
                console.log("Starting next quiz...");
                await startQuiz(currentTeamName); // 다음 퀴즈로 넘어갈 때 현재 팀 이름 전달
                updatePagination(); // 페이징 업데이트
            } else {
                showResults();
            }
        } catch (error) {
            console.error("Error in nextQuiz:", error);
        }
    }

    function updatePagination() {
        const paginationBox = document.getElementById('paginationBox');
        if (paginationBox) {
            let paginationHtml = '';
            for (let i = 1; i <= maxQuizzes; i++) {
                paginationHtml += `<span class="pagination-number ${i === currentQuizIndex + 1 ? 'active' : ''}">${i}</span>`;
            }
            paginationBox.innerHTML = paginationHtml;
        } else {
            console.error("paginationBox element not found");
        }
    }

    function displayQuiz(quiz) {
        document.getElementById('questionBox').innerText = 'Q: ' + quiz.question;
        const optionsBox = document.getElementById('optionsBox');
        optionsBox.innerHTML = '';

        let optionsHtml = '';
        quiz.options.forEach((option, index) => {
            optionsHtml += `
                <div>
                    <input type="radio" id="option${index + 1}" name="option" value="${option}">
                    <label for="option${index + 1}">${index + 1}. ${option}</label>
                </div>
            `;
        });
        optionsHtml += `<button type="button" onclick="submitAnswer()">제출</button>`;
        optionsBox.innerHTML = `
            <form id="quizForm">
                ${optionsHtml}
            </form>
        `;

        displayPagination(); // 페이징 표시
    }

    function displayPagination() {
        const paginationBox = document.getElementById('pagination');
        if (paginationBox) {
            paginationBox.innerHTML = ''; // 초기화

            for (let i = 1; i <= maxQuizzes; i++) {
                const pageNumber = document.createElement('span');
                pageNumber.classList.add('pagination-number');
                if (i === currentQuizIndex + 1) {
                    pageNumber.classList.add('active');
                }
                pageNumber.innerText = i;
                pageNumber.onclick = () => goToQuestion(i);
                paginationBox.appendChild(pageNumber);
            }
        } else {
            console.error("Pagination box not found");
        }
    }

    function goToQuestion(index) {
        currentQuizIndex = index - 1;
        startQuiz(currentTeamName);
    }

    function showResults() {
        document.getElementById('questionBox').innerText = '퀴즈 종료!';
        document.getElementById('optionsBox').innerHTML = `정답 횟수: ${correctAnswersCount} / ${maxQuizzes}`;
        document.getElementById('resultBox').innerText = '';
        document.getElementById('nextButton').style.display = 'none';
        document.getElementById('resultButtons').style.display = 'block';
    }

    function goHome() {
        window.location.href = "./main.html"; // 홈으로 이동
    }

    function restartQuiz() {
        window.location.reload();
        currentQuestionIndex = 0;
        currentQuizIndex = 0;
        correctAnswersCount = 0;
        startQuiz(currentTeamName);
        document.getElementById('resultBox').innerText = '';
    }

    // "Next" 버튼 활성화 함수
    function enableNextButton() {
        document.getElementById('nextButton').disabled = false;
    }

    // "Next" 버튼 비활성화 함수
    function disableNextButton() {
        document.getElementById('nextButton').disabled = true;
    }

    // 모든 함수 전역으로 설정
    window.handleTeamClick = handleTeamClick;
    window.submitAnswer = submitAnswer;
    window.nextQuiz = nextQuiz;
    window.goToQuestion = goToQuestion;
    window.goHome = goHome;
    window.restartQuiz = restartQuiz;
    window.enableNextButton = enableNextButton; // "Next" 버튼 활성화
//    window.disableNextButton = disableNextButton; // "Next" 버튼 비활성화
});
