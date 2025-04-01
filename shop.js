// Обновленная функция для работы с рейтингом
document.addEventListener("DOMContentLoaded", function() {
    const ratingContainers = document.querySelectorAll(".rating");
    
    ratingContainers.forEach(container => {
      const stars = container.querySelectorAll(".star");
      const ratingValue = container.querySelector(".rating-value");
      let currentRating = parseFloat(ratingValue.textContent);
      
      // Инициализация звезд по умолчанию
      stars.forEach(star => {
        const starValue = parseInt(star.getAttribute("data-rating"));
        
        if (starValue <= Math.round(currentRating)) {
          star.classList.add("active");
        }
      });
      
      // Обработка кликов
      stars.forEach(star => {
        star.addEventListener("click", function() {
          const newRating = parseInt(this.getAttribute("data-rating"));
          
          // Обновляем визуальное отображение звезд
          stars.forEach((s, index) => {
            if (index < newRating) {
              s.classList.add("active");
            } else {
              s.classList.remove("active");
            }
          });
          
          // Обновляем значение рейтинга (можно отправить на сервер)
          ratingValue.textContent = newRating.toFixed(1);
          console.log(`Пользователь поставил оценку: ${newRating} для товара`);
        });
      });
    });
  
    // Обработчики для кнопок "Заказать"
    const orderButtons = document.querySelectorAll(".order-btn");
    orderButtons.forEach(button => {
      button.addEventListener("click", function() {
        const productName = this.closest(".product-card").querySelector("h3").textContent;
        alert(`Товар "${productName}" добавлен в корзину!`);
      });
    });

    // Инициализация ночного режима
    initNightMode();
});

function initNightMode() {
    if (document.body.classList.contains('night-mode')) {
        document.body.style.backgroundColor = '#111';
    }
}