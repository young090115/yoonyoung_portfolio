/* ===================================================
   1. INTRO TYPING EFFECT
   =================================================== */
const typingText = "Hello, World.";
const typingTarget = document.getElementById("typing-text");
let typingIndex = 0;

function typeEffect() {
    if (typingTarget && typingIndex < typingText.length) {
        typingTarget.textContent += typingText.charAt(typingIndex++);
        setTimeout(typeEffect, 120);
    }
}

/* ===================================================
   2. INTRO ENTER LOGIC
   =================================================== */
const enterBtn = document.getElementById("enter-btn");
const introScreen = document.getElementById("intro-screen");

function enterSite() {
    if (introScreen) {
        introScreen.style.opacity = "0";
        setTimeout(() => {
            introScreen.style.display = "none";
        }, 500);
    }
}

/* ===================================================
   3. SECTION ACTIVATION (Navigation)
   =================================================== */
const sections = document.querySelectorAll(".dev-section");
const navButtons = document.querySelectorAll(".nav-item, .sub-menu button");
const subMenus = document.querySelectorAll(".sub-menu");

function activateSection(id) {
    // 섹션 전환
    sections.forEach(sec => {
        sec.classList.toggle("active", sec.id === id);
    });

    // 버튼 활성화 표시
    navButtons.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.section === id);
    });

    // 모바일 배려: 섹션 변경 시 위로 스크롤
    if(window.innerWidth < 768) {
        const container = document.querySelector('.dev-container');
        if(container) {
            window.scrollTo({ top: container.offsetTop - 20, behavior: 'smooth' });
        }
    }

    // 방명록 섹션(visitor)이 활성화될 때 DB에서 댓글 목록을 가져옴
    if (id === 'visitor') {
        loadComments();
    }
}

function goToSection(sectionId) {

    // 모든 section 비활성화
    document.querySelectorAll('.dev-section').forEach(section => {
        section.classList.remove('active');
    });

    // 선택된 section 활성화
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // 사이드바 active 상태 변경
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // data-section이 같은 버튼 찾기
    const targetNav = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
    if (targetNav) {
        targetNav.classList.add('active');
    }

    // 부드럽게 위로 이동
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


/* ===================================================
   4. VISITOR LOG (CRUD) API CALLS
   =================================================== */

// [조회] DB에서 댓글 목록 가져오기
async function loadComments() {
    const listElement = document.getElementById('comment-list');
    if (!listElement) return;

    try {
        const response = await fetch('/api/comments');
        if (!response.ok) throw new Error("Network response was not ok");
        
        const comments = await response.json();
        
        listElement.innerHTML = ''; // 기존 목록 초기화

        if (comments.length === 0) {
            listElement.innerHTML = '<p style="color: #475569; font-size: 0.8rem;">// No logs found in system database...</p>';
            return;
        }

        comments.forEach(comment => {
            const date = new Date(comment.created_at).toLocaleString();
            listElement.innerHTML += `
                <div class="comment-item">
                    <div class="comment-meta">
                        <span class="comment-id">#${comment.id}</span> 
                        <span class="comment-author">@${comment.author}</span>
                        <span class="comment-date">${date}</span>
                        <button class="delete-btn" onclick="deleteComment(${comment.id})">DELETE</button>
                    </div>
                    <div class="comment-title">> TITLE: ${comment.title}</div>
                    <div class="comment-text">${comment.text}</div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Fetch error:', error);
        listElement.innerHTML = '<p style="color: #ef4444;">// SYSTEM_ERROR: Failed to connect to DB</p>';
    }
}

// [저장] DB에 새 댓글 저장하기
async function saveComment() {
    const author = document.getElementById('author').value;
    const title = document.getElementById('title').value;
    const text = document.getElementById('text').value;

    if (!author || !title || !text) {
        alert("모든 시스템 로그 필드(ID, TITLE, MESSAGE)를 채워주세요.");
        return;
    }

    const data = { author, title, text };

    try {
        const response = await fetch('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            document.getElementById('author').value = '';
            document.getElementById('title').value = '';
            document.getElementById('text').value = '';
            loadComments();
        } else {
            alert("서버 오류로 저장에 실패했습니다.");
        }
    } catch (error) {
        console.error('Save error:', error);
        alert("데이터 전송 실패. 백엔드 서버가 켜져 있는지 확인하세요.");
    }
}

// [삭제] 특정 ID의 댓글 삭제하기
async function deleteComment(id) {
    if (!confirm(`댓글을 영구적으로 삭제하시겠습니까?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/comments/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log(`Log #${id} deleted successfully.`);
            loadComments(); // 삭제 완료 후 목록 새로고침
        } else {
            alert("삭제 권한이 없거나 서버 오류가 발생했습니다.");
        }
    } catch (error) {
        console.error('Delete error:', error);
        alert("서버와 통신할 수 없습니다.");
    }
}

/* ===================================================
   5. INITIALIZATION (DOM LOAD)
   =================================================== */
document.addEventListener("DOMContentLoaded", () => {
    // 타이핑 효과 시작
    typeEffect();

    // 엔터 버튼 이벤트
    if (enterBtn) {
        enterBtn.addEventListener("click", enterSite);
    }

    // 키보드 엔터 키 입력 시 진입
    document.addEventListener("keydown", e => {
        if (e.key === "Enter" && introScreen && introScreen.style.display !== "none") {
            enterSite();
        }
    });

    // 네비게이션 버튼 이벤트 바인딩
    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const section = btn.dataset.section;

            // 서브메뉴 제어
            subMenus.forEach(menu => {
                const isParent = menu.dataset.parent === section;
                const isChildClicked = Array.from(menu.querySelectorAll('button')).some(b => b.dataset.section === section);
                
                if (isParent) {
                    menu.style.display = (menu.style.display === "flex") ? "none" : "flex";
                } else if (!isChildClicked) {
                    menu.style.display = "none";
                }
            });

            activateSection(section);
        });
    });

    // 시작 시 항상 인트로 화면 활성화
    activateSection("intro");
});