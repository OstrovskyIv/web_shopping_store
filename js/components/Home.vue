<template>
    <div>
      <!-- Прелоадер -->
      <div id="preloader" v-if="loading">
        <div class="preloader-content">
          <div class="loading-bar"></div>
          <div class="question-mark">?</div>
          <div class="question-mark-fill">?</div>
        </div>
      </div>
  
      <!-- Основное содержимое -->
      <div class="backSharck">
        <img src="pictures/backSharck.png" alt="Фоновое изображение Хижины чудес">
        <div class="welcome-message day-mode" v-if="!isNightMode">
          Добро пожаловать в Хижину чудес! Здесь вы найдете самые загадочные и мистические товары.
        </div>
        <div class="welcome-message night-mode" v-else>
          Приветствую, странник! Ты попал в мир, где реальность переплетается с тайнами. Готов ли ты к приключениям?
        </div>
      </div>
  
      <section id="aboutText">
        <h1>Добро пожаловать в Хижину чудес</h1>
      </section>
  
      <div class="about-section">
        <div class="leftSharck">
          <img src="pictures/famPains.png" alt="Семья Пайнс">
        </div>
  
        <div class="text-and-buttons">
          <section id="aboutText">
            <h2>О Хижине чудес</h2>
            <div id="mainText">
              <p><strong>Добро пожаловать в Хижину чудес — место, где реальность переплетается с тайнами, а каждый предмет хранит свою историю.</strong></p>
              <p>Здесь, среди скрипучих половиц и шепчущих стен, вы найдете не просто товары, а настоящие артефакты. Загадочные книги, наполненные древними знаниями, кристаллы, мерцающие неведомой энергией, и карты, ведущие туда, куда не ступала нога обычного человека.</p>
              <p>Хижина чудес спрятана в самом сердце Гравити Фолз, и те, кто осмелится войти, уже не выйдут прежними. Что вас ждет за прилавком? Мистика? Открытия? А, может, что-то, о чем лучше не знать?</p>
              <p>Но одно можно сказать наверняка — скучно не будет. Готовы ли вы раскрыть тайны, скрытые в тени? Тогда шагните вперед… если осмелитесь.</p>
            </div>
          </section>
  
          <div class="buttons">
            <button @click="setDayMode">День</button>
            <button id="nightButton" @click="setNightMode">Ночь</button>
          </div>
        </div>
      </div>
  
      <div id="overlay"></div>
  
      <!-- Карусель товаров -->
      <section class="product-section">
        <h2>Популярные сувениры</h2>
        <div class="carousel">
          <button class="carousel-button prev" @click="moveCarousel(-1)">&#10094;</button>
          <div class="carousel-container">
            <div class="carousel-item" v-for="(product, index) in featuredProducts" :key="index">
              <div class="product">
                <div class="product-image">
                  <img :src="product.image" :alt="product.name">
                </div>
                <div class="product-info">
                  <h3>{{ product.name }}</h3>
                  <p class="price">{{ product.price }} $</p>
                  <p class="description">{{ product.description }}</p>
                </div>
              </div>
            </div>
          </div>
          <button class="carousel-button next" @click="moveCarousel(1)">&#10095;</button>
        </div>
      </section>
  
      <!-- Экспонаты -->
      <section class="excursions-section ancient-scroll-theme">
        <h2 class="section-title">Таинственные экспонаты</h2>
        
        <div class="letter-container">
          <div class="ancient-letter">
            <div class="letter-content">
              <p class="letter-text">Только для избранных...</p>
            </div>
          </div>
        </div>
        
        <div class="discovery-interface">
          <button id="discoveryBtn" class="discovery-btn">
            <i class="fas fa-scroll"></i>
            <span class="btn-tooltip">Развернуть древние свитки</span>
          </button>
          
          <div class="discovery-animation">
            <div class="animation-path"></div>
            <div class="animation-sphere"></div>
          </div>
        </div>
        
        <div class="exhibits-wrapper">
          <div class="exhibit" v-for="(exhibit, index) in exhibits" :key="index" :data-index="index+1">
            <div class="exhibit-content">
              <div class="exhibit-info">
                <h3><i class="fas" :class="exhibit.icon" style="margin-right: 10px;"></i>{{ exhibit.title }}</h3>
                <p>{{ exhibit.description }}</p>
                <div class="exhibit-meta">
                  <span v-for="(meta, i) in exhibit.meta" :key="i">
                    <i class="fas" :class="meta.icon"></i> {{ meta.text }}
                  </span>
                </div>
              </div>
              <img :src="exhibit.image" :alt="exhibit.title" class="exhibit-img">
            </div>
          </div>
        </div>
      </section>
  
      <!-- Сотрудники -->
      <section class="employee-section">
        <h2>Наши сотрудники</h2>
        <div class="employee-container">
          <div class="employee" v-for="(employee, index) in employees" :key="index">
            <div class="employee-image">
              <img :src="employee.image" :alt="employee.name">
            </div>
            <div class="employee-info">
              <h3>{{ employee.name }}</h3>
              <p class="description">{{ employee.description }}</p>
              <button class="contact-button" @click="showEmployeeModal(employee)">Контакты</button>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Регистрация -->
      <section class="registration-section">
        <h2 id="discount-text">Получи скидку в 0% за регистрацию!</h2>
        <p id="uncle-story-text">А также историю от Дяди Стэна!</p>
        <button @click="openRegistrationModal">Зарегистрироваться</button>
        <button @click="openLoginModal">Войти</button>
      </section>
  
      <!-- Карта -->
      <section class="map">
        <div class="map-header">
          <h2 class="day-title" v-if="!isNightMode">Тайные координаты Хижины</h2>
          <h2 class="night-title" v-else>Давай заключим сделку, гений!</h2>
          <div class="map-subtitle day-subtitle" v-if="!isNightMode">Где реальность искажается...</div>
          <div class="map-subtitle night-subtitle" v-else>Я покажу тебе путь, если ты покажешь мне душу...</div>
        </div>
        
        <div class="map-container">
          <div class="map-frame">
            <div style="position: relative; overflow: hidden; width: 100%; height: 100%;">
              <iframe src="https://yandex.by/map-widget/v1/?from=mapframe&l=sat%2Cskl&ll=-107.045527%2C29.239074&z=2" 
                      width="100%" height="500" frameborder="0" allowfullscreen="true" style="position: relative;"></iframe>
            </div>
            
            <div class="map-overlay night-only" v-if="isNightMode"></div>
          </div>
          
          <div class="map-notes day-only" v-if="!isNightMode">
            <div class="note note-left">
              <h3>Подсказка от Стэна</h3>
              <p>"Ищите старый дуб с вырезанным глазом - там поворот на нашу дорогу."</p>
            </div>
            <div class="note note-right">
              <h3>Координаты</h3>
              <p>46°45' N<br>122°45' W</p>
              <div class="compass">
                <i class="fas fa-compass"></i>
              </div>
            </div>
          </div>
          
          <div class="map-notes night-only" v-if="isNightMode">
            <div class="note note-left">
              <h3>Шепот Теней</h3>
              <p>"Ищи врата там, где время течёт вспять, а камни поют..."</p>
            </div>
            <div class="note note-right">
              <h3>Истинные координаты</h3>
              <p>∞°∞' N<br>∞°∞' W</p>
              <div class="compass">
                <i class="fas fa-eye"></i>
              </div>
            </div>
          </div>
          
          <div class="map-riddle day-only" v-if="!isNightMode">
            <p>Карта показывает, но не рассказывает. Приходите после заката.</p>
          </div>
          
          <div class="map-riddle night-only" v-if="isNightMode">
            <p>Ты нашел то, что искал? Или это нашло тебя?</p>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        loading: true,
        isNightMode: false,
        featuredProducts: [
          {
            name: "Глазные яблоки",
            image: "pictures/eyeballs.png",
            price: "14.99",
            description: "Эти глаза смотрят прямо в душу (и кошелёк)!"
          },
          {
            name: "Мороженое \"Сюрприз\"",
            image: "pictures/nightImage.jpg",
            price: "1.99",
            description: "Вкуснейшее мороженое ручной работы с самыми загадочными вкусами."
          },
          {
            name: "Брелки",
            image: "pictures/wendyFace.png",
            price: "12.99",
            description: "Коллекция данных брелков всегда будет вам напоминать о нашей хижине."
          },
          {
            name: "Журналы \"Для ванной\"",
            image: "pictures/stanlyFace.png",
            price: "5.99",
            description: "Коллекция от модных тенденций 1920-х до рецептов сомнительных зелий!"
          }
        ],
        exhibits: [
          {
            title: "Камень, похожий на лицо",
            icon: "fa-crystal",
            description: "Уникальный камень с естественным узором, напоминающим человеческое лицо. Найден в карьере близ Гравити Фолз. Геологи не могут объяснить природу этого сходства. Посетители утверждают, что выражение \"лица\" меняется в зависимости от угла обзора.",
            meta: [
              { icon: "fa-history", text: "Происхождение: природное образование" },
              { icon: "fa-calendar-alt", text: "Обнаружен: 1982 год" },
              { icon: "fa-eye", text: "Особенность: меняющееся выражение" }
            ],
            image: "pictures/exhibit1.jpg"
          },
          {
            title: "Дневник №3",
            icon: "fa-book",
            description: "Легендарный дневник с исследованиями паранормальных явлений Гравити Фолз. Содержит зашифрованные записи, чертежи и предупреждения об опасностях. Последняя страница отсутствует...",
            meta: [
              { icon: "fa-user", text: "Автор: Стэнфорд Пайнс" },
              { icon: "fa-lock", text: "Защита: несколько уровней шифрования" },
              { icon: "fa-exclamation-triangle", text: "Опасность: содержит запретные знания" }
            ],
            image: "pictures/exhibit2.jpg"
          },
          {
            title: "Портативный телепорт",
            icon: "fa-atom",
            description: "Экспериментальное устройство для мгновенного перемещения в пространстве. Работает нестабильно - может отправить вас не туда, куда вы планировали. Использовать с крайней осторожностью!",
            meta: [
              { icon: "fa-flask", text: "Технология: квантовая физика" },
              { icon: "fa-bolt", text: "Питание: кристаллы гравитацита" },
              { icon: "fa-radiation", text: "Побочные эффекты: временная дематериализация" }
            ],
            image: "pictures/exhibit3.jpg"
          },
          {
            title: "Коллекция кристаллов",
            icon: "fa-gem",
            description: "Уникальные кристаллы, обладающие необычными свойствами. Некоторые светятся в темноте, другие меняют цвет в зависимости от настроения смотрящего. Есть экземпляры, которые... шепчут.",
            meta: [
              { icon: "fa-mountain", text: "Место добычи: пещеры под Гравити Фолз" },
              { icon: "fa-magic", text: "Свойства: магические (не подтверждено наукой)" },
              { icon: "fa-volume-up", text: "Особенность: некоторые издают звуки" }
            ],
            image: "pictures/exhibit4.jpg"
          },
          {
            title: "Чучело Гнома",
            icon: "fa-hat-wizard",
            description: "Загадочное существо, пойманное в лесах Гравити Фолз. По легендам, гномы исполняют желания, но требуют плату... часто неожиданную. Это чучело иногда исчезает из витрины.",
            meta: [
              { icon: "fa-tree", text: "Место обитания: лес Гравити Фолз" },
              { icon: "fa-star", text: "Особенность: исполняет желания (возможно)" },
              { icon: "fa-question", text: "Предупреждение: будьте осторожны в формулировках" }
            ],
            image: "pictures/exhibit5.jpg"
          }
        ],
        employees: [
          {
            name: "Владелец магазина Стэнли Пайнс",
            image: "pictures/StanFace.png",
            description: "Стэнли — хитрый и жадный, но в душе добряк."
          },
          {
            name: "Старший сотрудник Венди Кордрой",
            image: "pictures/wendyFace.png",
            description: "Венди — крутая, саркастичная, но всегда готовая помочь."
          },
          {
            name: "Главный помощник Зус Рамирес",
            image: "pictures/zooseFace.png",
            description: "Зус — добрый, наивный и преданный друг."
          },
          {
            name: "Младший сотрудник Диппер Пайнс",
            image: "pictures/DipperFace.png",
            description: "Диппер — зануда, так что лучше ничего у него не спрашивайте."
          },
          {
            name: "Младший сотрудник Мэйбл Пайнс",
            image: "pictures/MabelFace.png",
            description: "Мэйбл — энергичная, весёлая и немного хаотичная."
          },
          {
            name: "Владелец хижины Стэнфорд Пайнс",
            image: "pictures/StanfordFace.png",
            description: "Стэнфорд — гениальный, но загадочный учёный."
          },
          {
            name: "Временный сотрудник Пухля",
            image: "pictures/Puhla.png",
            description: "Пухля — милая, преданная и неожиданно умная свинка."
          }
        ],
        nightEmployees: [
          {
            name: "Билл Шифр",
            image: "pictures/BillFace.png",
            description: "Билл Шифр — загадочный и могущественный. Никто не знает, что у него на уме."
          },
          {
            name: "Криптос",
            image: "pictures/CryptosFace.png",
            description: "Криптос — мастер шифров и тайн. Всегда знает, как скрыть информацию."
          },
          {
            name: "Восьмёрка",
            image: "pictures/EightFace.png",
            description: "Восьмёрка — механический помощник Билла. Никогда не спит и всегда начеку."
          },
          {
            name: "Аморфник",
            image: "pictures/AmorphFace.png",
            description: "Аморфник — меняет форму и облик. Никто не знает, как он выглядит на самом деле."
          },
          {
            name: "Зантар",
            image: "pictures/ZantarFace.png",
            description: "Зантар — хранитель древних знаний. Знает всё, что скрыто во тьме."
          },
          {
            name: "Шестигран",
            image: "pictures/HexagonFace.png",
            description: "Шестигран — слуга Билла. Всегда готов на пакости и хитрости."
          },
          {
            name: "Зубы",
            image: "pictures/TeethFace.png",
            description: "Зубы — тайный агент Билла. Его улыбка пугает даже самых смелых."
          },
          {
            name: "Пустышка",
            image: "pictures/DummyFace.png",
            description: "Пустышка — мастер маскировки. Никто не знает, где он находится."
          },
          {
            name: "Пироньяка",
            image: "pictures/PyronyakFace.png",
            description: "Пироньяка — огненный дух. Всегда готов поджечь всё вокруг."
          },
          {
            name: "Замочник",
            image: "pictures/LockmasterFace.png",
            description: "Замочник — мастер замков и ловушек. Никто не сможет открыть то, что он закрыл."
          },
          {
            name: "Лава",
            image: "pictures/LavaLampDemon.png",
            description: "Демон-лава лампа из Царства Кошмаров."
          }
        ]
      };
    },
    methods: {
      moveCarousel(direction) {
        // Логика перемещения карусели
      },
      showEmployeeModal(employee) {
        this.$emit('open-modal', `Контакты ${employee.name}: secret@gravityfalls.com`);
      },
      setDayMode() {
        this.isNightMode = false;
        document.body.classList.remove('night-mode');
      },
      setNightMode() {
        this.isNightMode = true;
        document.body.classList.add('night-mode');
      },
      openRegistrationModal() {
        this.$emit('open-registration-modal');
      },
      openLoginModal() {
        this.$emit('open-login-modal');
      }
    },
    mounted() {
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    }
  };
</script>