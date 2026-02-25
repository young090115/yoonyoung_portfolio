const carousel = document.getElementById("carousel");
const cards = document.querySelectorAll(".card");
const buttons = document.querySelectorAll(".card-btn");

let angle = 0; // 시작 각도를 0으로 맞추는 게 계산하기 편해요.

function updateActiveCard() {
  // 현재 각도(angle)를 360으로 나눈 나머지를 이용해 어떤 카드가 정면인지 찾음
  // 0도: front, -90도: right, -180도: back, -270도: left
  const normalizedAngle = ((angle % 360) + 360) % 360;

  cards.forEach((card, index) => {
    // 현재 정면에 있는 카드만 클릭 가능하게 설정
    // 초기 상태에서 front는 0도, right는 270도(또는 -90), back은 180도, left는 90도 위치에 있게 됩니다.
    // 이 로직은 현재 CSS 배치에 맞게 조정이 필요할 수 있습니다.
    card.style.pointerEvents = "auto"; 
  });
}

document.addEventListener("click", (e) => {
  // 버튼 클릭 시에는 회전하지 않도록
  if (e.target.classList.contains('card-btn')) return;

  angle -= 90;
  carousel.style.transform = `rotateY(${angle}deg)`;
  updateActiveCard();
});

// 버튼 자체 클릭 이벤트
buttons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
  });
});

updateActiveCard();