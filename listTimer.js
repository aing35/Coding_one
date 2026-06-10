// 페이지의 DOM 요소들을 가져옵니다.
const todoForm = document.querySelector('.todo-form');
const todoInput = document.querySelector('.todo-input');
const todoList = document.querySelector('.todo-list');

// 고유한 ID 생성을 위한 카운터 (기존 1, 2번이 있으므로 3부터 시작)
let todoIdCounter = 3;

// [기능 1] 할 일 등록 이벤트 리스너
todoForm.addEventListener('submit', function(event) {
    // 폼 제출 시 페이지가 새로고침되는 기본 동작을 막습니다.
    event.preventDefault();

    // 입력창의 값을 가져오고 앞뒤 공백을 제거합니다.
    const todoText = todoInput.value.trim();

    // 입력값이 비어있지 않은 경우에만 실행합니다.
    if (todoText !== "") {
        createTodoItem(todoText);
        
        // 등록 후 입력창을 비우고 포커스를 유지합니다.
        todoInput.value = "";
        todoInput.focus();
    }
});

// [기능 2] 새로운 할 일 아이템(DOM)을 생성하는 함수
function createTodoItem(text) {
    // 1. 새로운 li 요소 생성 및 클래스 부여
    const li = document.createElement('li');
    li.classList.add('todo-item');

    // 2. 체크박스에 사용할 고유 ID 생성
    const currentId = `todo-${todoIdCounter++}`;

    // 3. 내부 HTML 구조 생성 (체크박스, 라벨, 삭제 버튼)
    li.innerHTML = `
        <input type="checkbox" id="${currentId}">
        <label for="${currentId}">${text}</label>
        <button type="button" class="btn-todo-delete">×</button>
    `;

    // 4. 삭제 버튼에 클릭 이벤트 추가
    const deleteBtn = li.querySelector('.btn-todo-delete');
    deleteBtn.addEventListener('click', function() {
        li.remove(); // 해당 리스트 아이템 삭제
    });

    // 5. 기존 목록(ul)의 맨 뒤에 새로 만든 li를 추가합니다.
    todoList.appendChild(li);
}

// [기능 3] 기존에 HTML에 이미 하드코딩되어 있던 샘플 리스트에도 삭제 이벤트 적용
// (처음 페이지가 로드되었을 때 기존 1, 2번 버튼 동작용)
const existingDeleteButtons = document.querySelectorAll('.btn-todo-delete');
existingDeleteButtons.forEach(button => {
    button.addEventListener('click', function() {
        button.closest('.todo-item').remove();
    });
});

// ==========================================
// [기능 4] 포모도로 타이머 로직
// ==========================================

// 타이머 관련 DOM 요소 가져오기
const minutesDisplay = document.querySelector('.timer-display .minutes');
const secondsDisplay = document.querySelector('.timer-display .seconds');
const startBtn = document.querySelector('.btn-start');
const stopBtn = document.querySelector('.btn-stop');
const resetBtn = document.querySelector('.btn-reset');

let timerInterval = null;
let totalSeconds = 1500; // 25분 * 60초 = 1500초
let isRunning = false;   // 타이머가 작동 중인지 확인하는 플래그

// 화면의 분:초(mm:ss)를 업데이트하는 함수
function updateTimerDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // String.prototype.padStart를 이용해 1자리 수일 때 앞에 '0'을 붙여줍니다 (예: 5분 -> 05)
    minutesDisplay.textContent = String(minutes).padStart(2, '0');
    secondsDisplay.textContent = String(seconds).padStart(2, '0');
}

// 타이머 시작 함수
function startTimer() {
    // 이미 작동 중이라면 중복 실행 방지
    if (isRunning) return;
    
    isRunning = true;

    // 1초(1000ms)마다 내부 로직을 실행하는 인터벌 생성
    timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--;
            updateTimerDisplay();
        } else {
            // 0초에 도달했을 때 (타이머 종료)
            clearInterval(timerInterval);
            timerInterval = null;
            isRunning = false;
            
            // 브라우저 기본 알림창 띄우기
            alert('집중 시간이 끝났습니다! 휴식을 취하세요.');
            
            // 알림 확인 후 타이머를 다시 25분으로 리셋
            resetTimer();
        }
    }, 1000);
}

// 타이머 일시정지 함수
function stopTimer() {
    if (!isRunning) return;
    
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
}

// 타이머 초기화 함수
function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    
    totalSeconds = 1500; // 25분으로 원복
    updateTimerDisplay();
}

// 버튼에 이벤트 리스너 연결
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
