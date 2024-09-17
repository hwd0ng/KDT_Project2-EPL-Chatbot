### 개요
조원들의 공통 관심사인 EPL(잉글랜드 프리미어리그)에 대해 직접 수집한 데이터를 학습시켜 챗봇을 만들어보고자 하였습니다.

또한 프리미어리그에 속한 각 구단들에 대한 최근 기사를 요약해주는 기능과 관련 퀴즈들을 풀 수 있는 부가기능을 넣어

해외축구 팬들을 겨냥한 흥미로운 사이트(앱)를 만들고자 하였습니다.
<hr width="800">

### 활용 데이터
- EPL.csv: 직접 수집한 20개 구단들에 대한 질문 및 답변 데이터

<img width="800" alt="image" src="https://github.com/user-attachments/assets/a0ff300f-e502-4aba-b78c-a6cc2123a9e5">
<hr width="800">

### 주요 기능
- 메인화면
<img width="362" alt="image" src="https://github.com/user-attachments/assets/7c32271d-df07-4cf4-bb3d-8e7dad771b96">

- CHAT-BOT: EPL에 속한 구단들에 대한 질문과 답변을 주고받을 수 있습니다.
<img width="306" alt="image" src="https://github.com/user-attachments/assets/c5f36055-5ef8-4fd4-831b-c54c4e662140">

- Articles: 특정 구단 로고를 누르면 해당 구단에 대한 최신 뉴스 기사 원문 및 원문 핵심 내용을 요약해서 보여줍니다.
<img width="298" alt="image" src="https://github.com/user-attachments/assets/0f68cee9-f675-477e-b734-b7222d8504ad">

- Quiz: 특정 구단 로고를 누르면 해당 구단에 대한 랜덤 퀴즈가 출제되고 사용자가 정답을 선택하면 결과를 보여줍니다.
<img width="303" alt="image" src="https://github.com/user-attachments/assets/105a0397-27d8-4742-b848-7838d4a79d6a">
<hr width="800"> 



### 사용 방법
```bash
# 프로젝트 폴더 생성
git clone https://github.com/hwd0ng/KDT_Project2-EPL_Chatbot.git

# 라이브러리 설치
pip install -r requirements.txt

# 챗봇모델링코드.ipynb 차례로 실행 

# 프로젝트 폴더 루트에 fine_tuned_kogpt2 폴더 생성 확인

# 서버 실행(터미널)
pyhton main.py
```
<hr width="800"> 


### 활용 툴/모델
* **백엔드**
    - FastAPI

* **프론트엔드**
    - HTML, CSS, JavaScript

* **챗봇모델**
    - [skt/kogpt2-base-v2](https://huggingface.co/skt/kogpt2-base-v2)
    - 한국어 위키 백과, 뉴스, 모두의 말뭉치 v1.0, 국민청원 등 40GB 이상의 텍스트로 사전학습된 모델
    - <details>
      <summary>파라미터 정보 보기/접기</summary>
          <img width="800" alt="image" src="https://github.com/user-attachments/assets/bbcb5440-1e42-4cda-9326-275573d06c55">
      </details>

* **기사요약모델**
    - [digit82/kobart-summarization](https://huggingface.co/digit82/kobart-summarization)
    - 페이스북 AI 연구팀에서 제안한 텍스트 생성 모델로써 주로 텍스트 요약, 번역, 문장 생성 등 다양한 자연어 처리 작업에 사용
    - <details>
      <summary>파라미터 정보 보기/접기</summary>
          <img width="800" alt="image" src="https://github.com/user-attachments/assets/277d14de-e74d-4d3b-a9af-95757d1750c5">
      </details>
<hr width="800">

### 맡은 역할
- 조장으로서 아이디어를 모아 프로젝트 주제를 선정하고 서비스 기능 기획 및 역할 분배를 하였습니다.
- EPL 소속의 20개 구단 중 5개의 구단에 대한 정보(질문/답변)를 수집하고 최종적인 데이터셋을 통합시켰습니다.
- KoGPT2 모델을 활용하여 통합된 데이터셋을 학습시켜 챗봇 모델을 완성하였습니다.
- 챗봇 서비스 화면의 프론트 디자인을 구성하였습니다.
- FastAPI를 활용하여 전체적인 기능의 웹 프레임워크를 구성하였습니다.
- PPT를 제작하고 발표를 담당하였습니다.
<hr width="800">

### 프로젝트 후기
- BERT, T5, RoBERTa 등 여러 자연어 처리 모델에 커스텀 데이터를 파인튜닝하는 과정에서 챗봇 성능이 안 좋아 시간이 많이 소요되었고
  그렇게 챗봇 모델을 만들지 못할까 좌절하기도 했지만 최종적으로 KoGPT2 모델에 학습이 잘 되어서 안도감이 들었습니다.

- 직접 데이터를 모으는 과정과 모델에 학습 시키는 시간이 오래 소요되어서 더 많은 데이터를 학습시키지 못한 점이 아쉽게 느껴졌습니다.
  향후 데이터를 더 많이 모아서 학습시킨다면 챗봇 성능이 개선될 것입니다.

- EPL 소속의 구단 정보를 모으는 과정에서 비주류 팀(하위권)에 대한 정보의 신뢰성, 다양성 문제가 있었지만 여러 출처를 통해 조원들과 함께 교차검증해가며 정확도를 높인 점이 만족스러웠습니다.

- 이 프로젝트를 통해 다양한 자연어 처리 모델에 대해 접해볼 수 있었고 챗봇이 어떠한 알고리즘으로 동작을 하는지 배울 수 있는 시간이었습니다.
<hr width="800">





