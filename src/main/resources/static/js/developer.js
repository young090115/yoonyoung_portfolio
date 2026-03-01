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
    sections.forEach(sec => {
        sec.classList.toggle("active", sec.id === id);
    });

    navButtons.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.section === id);
    });

    if(window.innerWidth < 768) {
        const container = document.querySelector('.dev-container');
        if(container) {
            window.scrollTo({ top: container.offsetTop - 20, behavior: 'smooth' });
        }
    }

    if (id === 'visitor') {
        loadComments();
    }
}

function goToSection(sectionId) {
    document.querySelectorAll('.dev-section').forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    const targetNav = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
    if (targetNav) {
        targetNav.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}


/* ===================================================
   4. VISITOR LOG (CRUD) & PAGINATION LOGIC
   =================================================== */

let currentPage = 1;
const itemsPerPage = 10;
let allComments = []; 

// [조회] DB에서 댓글 목록 가져오기
async function loadComments() {
    const listElement = document.getElementById('comment-list');
    if (!listElement) return;

    try {
        const response = await fetch('/api/comments');
        if (!response.ok) throw new Error("Network response was not ok");
        
        allComments = await response.json(); 
        
        // 최신 글이 위로 오도록 정렬 (DB ID 기준 내림차순)
        allComments.sort((a, b) => b.id - a.id);

        displayComments(currentPage); 
        setupPagination();            
        
    } catch (error) {
        console.error('Fetch error:', error);
        listElement.innerHTML = '<p style="color: #ef4444;">// SYSTEM_ERROR: Failed to connect to DB</p>';
    }
}

// 데이터를 화면에 그리는 함수
function displayComments(page) {
    const listElement = document.getElementById('comment-list');
    listElement.innerHTML = ''; 

    if (allComments.length === 0) {
        listElement.innerHTML = '<p style="color: #475569; font-size: 0.8rem;">// No logs found in system database...</p>';
        return;
    }

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pagedComments = allComments.slice(start, end);

    // 전체 개수에서 현재 순서를 빼서 "내림차순 번호" 계산
    // 예: 전체 15개면 1페이지 첫글은 No.15, 마지막글은 No.6
    const totalCount = allComments.length;

    pagedComments.forEach((comment, index) => {
        const displayNo = totalCount - (start + index); // 가상 번호 계산 로직
        const dateObj = new Date(comment.created_at);
        const date = isNaN(dateObj.getTime()) ? "SYSTEM_TIME_ERROR" : dateObj.toLocaleString();

    // 40자 제한
    const limit = 40;
    const shortText = comment.text.length > limit 
        ? comment.text.substring(0, limit) + "..." 
        : comment.text;

        listElement.innerHTML += `
            <div class="comment-item">
                <div class="comment-meta">
                    <span class="comment-id">No.${displayNo}</span> 
                    <span class="comment-author">@${comment.author}</span>
                    <span class="comment-date">${date}</span>
                    <button class="delete-btn" onclick="deleteComment(${comment.id})">DELETE</button>
                </div>
                <div class="comment-title">> TITLE: ${comment.title}</div>
                <div class="comment-text" title="${comment.text}">${shortText}</div>
            </div>
        `;
    });
}

// 하단 페이지 번호 버튼 생성 함수
function setupPagination() {
    const navContainer = document.getElementById('pagination-container');
    if (!navContainer) return;

    navContainer.innerHTML = ''; 
    const pageCount = Math.max(1, Math.ceil(allComments.length / itemsPerPage));
    
    const navWrapper = document.createElement('div');
    navWrapper.style.cssText = "display: flex; gap: 8px; justify-content: center; margin-top: 20px;";

    for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className = `page-btn ${currentPage === i ? 'active' : ''}`;
        btn.onclick = () => {
            currentPage = i;
            displayComments(i);
            setupPagination(); 
            
            const visitorSection = document.getElementById('visitor');
            window.scrollTo({ top: visitorSection.offsetTop, behavior: 'smooth' });
        };
        navWrapper.appendChild(btn);
    }
    navContainer.appendChild(navWrapper);
}

// [저장] DB에 새 댓글 저장하기
async function saveComment() {
    const author = document.getElementById('author').value;
    const title = document.getElementById('title').value;
    const text = document.getElementById('text').value;

    if (!author.trim() || !title.trim() || !text.trim()) {
        alert("모든 시스템 로그 필드를 채워주세요.");
        return;
    }

    if (author.length > 10 || title.length > 20 || text.length > 100) {
        alert("입력 제한 글자 수를 초과했습니다.");
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
            currentPage = 1; 
            loadComments();
        } else {
            alert("서버 오류로 저장에 실패했습니다.");
        }
    } catch (error) {
        console.error('Save error:', error);
        alert("데이터 전송 실패.");
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
            loadComments(); 
        } else {
            alert("삭제 실패.");
        }
    } catch (error) {
        console.error('Delete error:', error);
    }
}

/* ===================================================
   5. INITIALIZATION (DOM LOAD)
   =================================================== */
document.addEventListener("DOMContentLoaded", () => {
    typeEffect();

    if (enterBtn) {
        enterBtn.addEventListener("click", enterSite);
    }

    document.addEventListener("keydown", e => {
        if (e.key === "Enter" && introScreen && introScreen.style.display !== "none") {
            enterSite();
        }
    });

    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const section = btn.dataset.section;

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

    activateSection("intro");
});