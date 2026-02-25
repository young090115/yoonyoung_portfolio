document.addEventListener("DOMContentLoaded", () => {
  fetch("components/footer.html")
    .then(res => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.text();
    })
    .then(html => {
      const footerElement = document.getElementById("footer");
      if (footerElement) {
        footerElement.innerHTML = html;
      }
    })
    .catch(err => console.error("Footer load failed", err));
});