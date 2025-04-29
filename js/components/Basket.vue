<template>
  <div>
    <div id="preloader" v-if="loading">
      <div class="preloader-content">
        <div class="loading-bar"></div>
        <div class="question-mark">?</div>
        <div class="question-mark-fill">?</div>
      </div>
    </div>

    <div class="backSharck">
      <img :src="isNightMode ? 'pictures/nigtBackHous.png' : 'pictures/backSharck.png'" 
           :alt="isNightMode ? 'Ночное фоновое изображение Хижины чудес' : 'Фоновое изображение Хижины чудес'" />
      <div class="welcome-message" :class="isNightMode ? 'night-mode' : 'day-mode'">
        {{ isNightMode ? 'Приветствую, странник! Ты попал в мир, где реальность переплетается с тайнами. Готов ли ты к приключениям?' : 
           'Добро пожаловать в Хижину чудес! Здесь вы найдете самые загадочные и мистические товары.' }}
      </div>
    </div>

    <section id="aboutText">
      <h1>{{ isNightMode ? 'Билл Шифр' : 'Добро пожаловать в Хижину чудес' }}</h1>
    </section>

    <div class="about-section">
      <div class="leftSharck">
        <img :src="isNightMode ? 'pictures/famBill.png' : 'pictures/famPains.png'" 
             :alt="isNightMode ? 'Ночное изображение' : 'Семья Пайнс'" />
      </div>

      <div class="text-and-buttons">
        <section id="aboutText">
          <h2>{{ isNightMode ? 'Билл Шифр' : 'О Хижине чудес' }}</h2>
          <div id="mainText" v-html="isNightMode ? nightMainText : dayMainText"></div>
        </section>

        <div class="buttons">
          <button @click="setDayMode" :disabled="!isNightMode">День</button>
          <button id="nightButton" @click="setNightMode" :disabled="isNightMode">Ночь</button>
        </div>
      </div>
    </div>

    <div id="overlay"></div>

    <section class="product-section">
      <h2>Популярные сувениры</h2>
      <div class="carousel">
        <button class="carousel-button prev" @click="moveCarousel(-1)">&#10094;</button>
        <div class="carousel-container">
          <div class="carousel-item" v-for="(product, index) in featuredProducts" :key="index">
            <div class="product">
              <div class="product-image">
                <img :src="product.image" :alt="product.name" />
              </div>
              <div class="product-info">
                <h3>{{ product.name }}</h3>
                <p class="price">{{ product.price }} $</p>
                <p class="description">
                  {{ product.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <button class="carousel-button next" @click="moveCarousel(1)">&#10095;</button>
      </div>
    </section>

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
        <button id="discoveryBtn" class="discovery-btn" @click="toggleAnimation">
          <i class="fas" :class="isOpen ? 'fa-spinner fa-spin' : 'fa-scroll'"></i>
          <span class="btn-tooltip">Развернуть древние свитки</span>
        </button>
        
        <div class="discovery-animation">
          <div class="animation-path"></div>
          <div class="animation-sphere" ref="animationSphere"></div>
        </div>
      </div>
      
      <div class="exhibits-wrapper">
        <div class="exhibit" v-for="(exhibit, index) in exhibits" :key="index" :data-index="index+1" ref="exhibits">
          <div class="exhibit-content">
            <div class="exhibit-info">
              <h3><i class="fas" :class="exhibit.icon" style="margin-right: 10px;"></i>{{ exhibit.title }}</h3>
              <p>{{ exhibit.description }}</p>
              <div class="exhibit-meta">
                <span v-for="(meta, i) in exhibit.meta" :key="i"><i class="fas" :class="meta.icon"></i> {{ meta.text }}</span>
              </div>
            </div>
            <img :src="exhibit.image" :alt="exhibit.title" class="exhibit-img">
          </div>
        </div>
      </div>
    </section>

    <section class="employee-section" :class="{ 'night-mode': isNightMode }">
      <h2>{{ isNightMode ? 'Банда Межгалактических преступников' : 'Наши сотрудники' }}</h2>
      <div class="employee-container">
        <div class="employee" v-for="(employee, index) in isNightMode ? nightEmployees : employees" :key="index">
          <div class="employee-image">
            <img :src="employee.image" :alt="employee.name" />
          </div>
          <div class="employee-info">
            <h3>{{ employee.name }}</h3>
            <p class="description">
              {{ employee.description }}
            </p>
            <button class="contact-button" @click="showEmployeeModal(employee)">Контакты</button>
          </div>
        </div>
      </div>
    </section>

    <section class="registration-section">
      <h2 id="discount-text">{{ isNightMode ? 'Давай заключим сделку, гений!' : 'Получи скидку в 0% за регистрацию!' }}</h2>
      <p id="uncle-story-text">{{ isNightMode ? 'В подарок — знания о вселенной!' : 'А также историю от Дяди Стэна!' }}</p>
      <button @click="openRegistrationModal">Зарегистрироваться</button>
      <button @click="openLoginModal">Войти</button>
    </section>

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
      isOpen: false,
      currentIndex: 0,
      currentStop: 0,
      positions: [],
      animationId: null,
      
      dayMainText: `
        <p><strong>Добро пожаловать в Хижину чудес — место, где реальность переплетается с тайнами, а каждый предмет хранит свою историю.</strong></p>
        <p>Здесь, среди скрипучих половиц и шепчущих стен, вы найдете не просто товары, а настоящие артефакты. Загадочные книги, наполненные древними знаниями, кристаллы, мерцающие неведомой энергией, и карты, ведущие туда, куда не ступала нога обычного человека.</p>
        <p>Хижина чудес спрятана в самом сердце Гравити Фолз, и те, кто осмелится войти, уже не выйдут прежними. Что вас ждет за прилавком? Мистика? Открытия? А, может, что-то, о чем лучше не знать?</p>
        <p>Но одно можно сказать наверняка — скучно не будет. Готовы ли вы раскрыть тайны, скрытые в тени? Тогда шагните вперед… если осмелитесь.</p>
      `,
      
      nightMainText: `
        <p><strong>Ты попал в мир, где правила пишутся заново, а логика теряет смысл.</strong></p>
        <p>Здесь, среди бесконечных коридоров и зеркал, отражающих твои страхи, ты найдешь не ответы, а вопросы, заставляющие усомниться во всём.</p>
        <p>Это место не для слабых. Каждый шаг — игра, а каждая игра — ловушка. Ты можешь найти ключи к тайнам, но помни: за каждым скрывается дверь, за которой — то, к чему ты не готов.</p>
        <p>Ты ищешь знания? Силу? Или хочешь узнать, что скрывает этот мир? Я предложу сделку... но цена будет выше, чем ты готов заплатить. Здесь ничто не даётся просто так.</p>
        <p>Сначала этот сайт, потом — весь мир. Готов ли ты бросить вызов судьбе? Если да, шагай... но помни: обратного пути может не быть.</p>
        <p>Когда ты поймёшь, что уже поздно, я буду смеяться, глядя, как мир склоняется передо мной. Ведь это только начало...</p>
      `,

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
          title: "Невидимый человек",
          icon: "fa-user-secret",
          description: "Загадочный экспонат - пустое пространство в форме человеческой фигуры, сохраняющее очертания даже при движении. Температура в этой области всегда на 10°C ниже окружающей среды. Некоторые посетители сообщают о тактильных ощущениях при приближении.",
          meta: [
            { icon: "fa-ruler-combined", text: "Размер: 180 см" },
            { icon: "fa-temperature-low", text: "Температура: +15°C" },
            { icon: "fa-question", text: "Природа: неизвестна" }
          ],
          image: "pictures/exhibit2.jpg"
        },
        {
          title: "Двухголовая фея",
          icon: "fa-pastafarianism",
          description: "Уникальное чучело мифического существа с двумя головами. Каждая голова выражает противоположные эмоции. Согласно легендам, такие феи исполняли желания, но всегда с неожиданными последствиями. Биологи не могут определить видовую принадлежность.",
          meta: [
            { icon: "fa-dna", text: "Вид: неизвестен" },
            { icon: "fa-magic", text: "Легенда: исполнение желаний" },
            { icon: "fa-exclamation-triangle", text: "Особенность: противоречивые эмоции" }
          ],
          image: "pictures/exhibit3.jpg"
        },
        {
          title: "Таинственный мешок волшебства",
          icon: "fa-magic",
          description: "Старинный холщовый мешок, который, согласно легендам, принадлежал бродячему магу. Несмотря на небольшие размеры, в него невозможно поместить больше трех предметов - новые просто \"не помещаются\". При встряхивании всегда издает звук, будто внутри что-то есть.",
          meta: [
            { icon: "fa-weight-hanging", text: "Вес: всегда 300 г" },
            { icon: "fa-list-ol", text: "Вместимость: максимум 3 предмета" },
            { icon: "fa-theater-masks", text: "Происхождение: цирковой артефакт" }
          ],
          image: "pictures/exhibit4.jpg"
        },
        {
          title: "Самый завораживающий объект в мире",
          icon: "fa-eye",
          description: "Гипнотический спиральный диск, при взгляде на который 98% людей впадают в состояние транса. Вращается без видимого источника энергии. Ученые предупреждают: не смотреть более 30 секунд подряд. Известны случаи временной потери памяти после длительного наблюдения.",
          meta: [
            { icon: "fa-stopwatch", text: "Безопасное время: 30 сек" },
            { icon: "fa-bolt", text: "Энергия: неизвестного типа" },
            { icon: "fa-brain", text: "Эффект: гипнотический транс" }
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
          description: "Диппер - зануда, так что лучше ничего у него не спрашивайте."
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
      const carouselContainer = this.$el.querySelector(".carousel-container");
      const items = this.$el.querySelectorAll(".carousel-item");
      const totalItems = items.length;

      this.currentIndex = (this.currentIndex + direction + totalItems) % totalItems;
      const offset = -this.currentIndex * 100;
      carouselContainer.style.transform = `translateX(${offset}%)`;
    },
    
    showEmployeeModal(employee) {
      this.$emit('open-modal', {
        name: employee.name,
        email: employee.email || 'secret@gravityfalls.com',
        image: employee.image,
        description: employee.description
      });
    },
    
    setDayMode() {
      if (this.isNightMode) {
        this.isNightMode = false;
        document.body.classList.remove('night-mode');
        this.applyDayModeStyles();
      }
    },
    
    setNightMode() {
      if (!this.isNightMode) {
        this.isNightMode = true;
        document.body.classList.add('night-mode');
        this.applyNightModeStyles();
      }
    },
    
    applyDayModeStyles() {
      const logo = this.$el.querySelector(".logo img");
      if (logo) {
        logo.src = "pictures/LoGo.png";
        logo.alt = "Логотип Хижины чудес";
      }
      
      document.body.style.backgroundColor = "#d4b08c";
      document.body.style.color = "black";

      const header = this.$el.querySelector("header");
      if (header) {
        header.style.backgroundColor = "#2a2929";
        header.style.color = "white";
      }

      const navLinks = this.$el.querySelectorAll("nav ul li a");
      navLinks.forEach(link => link.style.color = "white");

      const main = this.$el.querySelector("main");
      if (main) {
        main.style.backgroundColor = "transparent";
      }
    },
    
    applyNightModeStyles() {
      const logo = this.$el.querySelector(".logo img");
      if (logo) {
        logo.src = "pictures/nightImageLogo.png";
        logo.alt = "Ночной логотип Хижины чудес";
      }
      
      document.body.style.backgroundColor = "black";
      document.body.style.color = "white";

      const header = this.$el.querySelector("header");
      if (header) {
        header.style.backgroundColor = "#ff4444";
        header.style.color = "black";
      }

      const navLinks = this.$el.querySelectorAll("nav ul li a");
      navLinks.forEach(link => link.style.color = "black");
    },
    
    openRegistrationModal() {
      this.$emit('open-registration-modal');
    },
    
    openLoginModal() {
      this.$emit('open-login-modal');
    },
    
    toggleAnimation() {
      if (this.isOpen) {
        this.resetAnimation();
        return;
      }
      
      this.isOpen = true;
      this.positions = this.calculatePositions();
      const pathHeight = this.positions[this.positions.length-1].y - this.positions[0].y;
      
      const animationPath = this.$el.querySelector('.animation-path');
      animationPath.style.height = `${pathHeight}px`;
      
      const exhibitsWrapper = this.$el.querySelector('.exhibits-wrapper');
      exhibitsWrapper.classList.add('visible');
      
      const discoveryBtn = this.$el.querySelector('#discoveryBtn');
      discoveryBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      discoveryBtn.disabled = true;
      
      setTimeout(() => {
        const animationSphere = this.$refs.animationSphere;
        animationSphere.style.opacity = '1';
        animationSphere.style.top = '0';
        
        setTimeout(() => {
          animationSphere.style.transition = `top ${this.MOVE_DURATION}ms linear`;
          this.animate();
        }, 10);
      }, 100);
    },
    
    calculatePositions() {
      const result = [];
      const discoveryBtn = this.$el.querySelector('#discoveryBtn');
      const exhibits = this.$refs.exhibits;
      
      const btnBottom = discoveryBtn.getBoundingClientRect().bottom + window.scrollY;
      result.push({ y: btnBottom + 30, pause: false });
      
      exhibits.forEach((exhibit, i) => {
        const rect = exhibit.getBoundingClientRect();
        result.push({ y: rect.top + window.scrollY - 50, pause: true, showIndex: i });
        
        if (i < exhibits.length - 1) {
          result.push({ y: rect.bottom + window.scrollY + 30, pause: false });
        }
      });
      
      result.push({ y: exhibits[exhibits.length-1].getBoundingClientRect().bottom + window.scrollY + 100, pause: true });
      return result;
    },
    
    resetAnimation() {
      clearTimeout(this.animationId);
      
      const animationSphere = this.$refs.animationSphere;
      animationSphere.style.transition = 'none';
      animationSphere.style.top = '0';
      animationSphere.style.opacity = '0';
      
      const animationPath = this.$el.querySelector('.animation-path');
      animationPath.style.height = '0';
      
      const exhibits = this.$refs.exhibits;
      exhibits.forEach(ex => ex.classList.remove('visible'));
      
      const exhibitsWrapper = this.$el.querySelector('.exhibits-wrapper');
      exhibitsWrapper.classList.remove('visible');
      
      const discoveryBtn = this.$el.querySelector('#discoveryBtn');
      discoveryBtn.innerHTML = '<i class="fas fa-scroll"></i>';
      discoveryBtn.disabled = false;
      
      this.isOpen = false;
      this.currentStop = 0;
    },
    
    animate() {
      if (this.currentStop >= this.positions.length) {
        this.finishAnimation();
        return;
      }
      
      const pos = this.positions[this.currentStop];
      const animationSphere = this.$refs.animationSphere;
      animationSphere.style.top = `${pos.y - this.positions[0].y}px`;
      
      if (pos.showIndex !== undefined) {
        setTimeout(() => {
          this.$refs.exhibits[pos.showIndex].classList.add('visible');
        }, this.MOVE_DURATION/2);
      }
      
      this.currentStop++;
      const delay = pos.pause ? this.MOVE_DURATION + this.STOP_DURATION : this.MOVE_DURATION;
      this.animationId = setTimeout(this.animate, delay);
    },
    
    finishAnimation() {
      const discoveryBtn = this.$el.querySelector('#discoveryBtn');
      discoveryBtn.innerHTML = '<i class="fas fa-scroll"></i>';
      discoveryBtn.disabled = false;
    },
    
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },
  
  mounted() {
    this.MOVE_DURATION = 300;
    this.STOP_DURATION = 200;
    
    if (!sessionStorage.getItem('preloaderShown')) {
      sessionStorage.setItem('preloaderShown', 'true');
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    } else {
      this.loading = false;
    }
    
    const sectionTitle = this.$el.querySelector('.section-title');
    if (sectionTitle) {
      setTimeout(() => {
        sectionTitle.classList.add('visible');
      }, 500);
    }
    
    window.addEventListener('resize', () => {
      if (this.isOpen) {
        this.positions = this.calculatePositions();
        const animationPath = this.$el.querySelector('.animation-path');
        animationPath.style.height = `${this.positions[this.positions.length-1].y - this.positions[0].y}px`;
        
        if (this.currentStop > 0) {
          const animationSphere = this.$refs.animationSphere;
          animationSphere.style.top = `${this.positions[this.currentStop-1].y - this.positions[0].y}px`;
        }
      }
    });
  }
};
</script>

<style scoped>
/* Ваши стили здесь */
#preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #2a2929;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity 0.5s ease;
}

.preloader-content {
  position: relative;
  width: 200px;
  height: 20px;
}

.loading-bar {
  width: 100%;
  height: 100%;
  background-color: #444;
  border-radius: 10px;
  overflow: hidden;
}

.question-mark {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 50px;
  color: #ff4444;
  font-weight: bold;
  opacity: 0.8;
}

.question-mark-fill {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 50px;
  color: #fff;
  font-weight: bold;
  clip-path: inset(0 100% 0 0);
  animation: fillQuestionMark 2s linear forwards;
}

@keyframes fillQuestionMark {
  to {
    clip-path: inset(0 0 0 0);
  }
}

.backSharck {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.backSharck img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.welcome-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  max-width: 80%;
  padding: 20px;
  border-radius: 10px;
}

.welcome-message.day-mode {
  background-color: rgba(212, 176, 140, 0.8);
  color: #2a2929;
}

.welcome-message.night-mode {
  background-color: rgba(0, 0, 0, 0.8);
  color: #ff4444;
}

#overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0;
  pointer-events: none;
  z-index: 999;
}

/* Дополнительные стили для других элементов */
.about-section {
  display: flex;
  padding: 40px;
  background-color: rgba(249, 249, 249, 0.8);
}

.leftSharck {
  flex: 1;
}

.leftSharck img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
}

.text-and-buttons {
  flex: 2;
  padding-left: 40px;
}

.buttons {
  margin-top: 20px;
}

.buttons button {
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.buttons button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.product-section {
  padding: 40px;
  background-color: #f9f9f9;
}

.carousel {
  position: relative;
  overflow: hidden;
}

.carousel-container {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-item {
  min-width: 100%;
  padding: 0 15px;
}

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 1;
}

.carousel-button.prev {
  left: 10px;
}

.carousel-button.next {
  right: 10px;
}

.excursions-section {
  padding: 40px;
  background-color: #f0e6d2;
  position: relative;
}

.section-title {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.section-title.visible {
  opacity: 1;
  transform: translateY(0);
}

.discovery-btn {
  background-color: #8b4513;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  position: relative;
}

.discovery-btn:hover .btn-tooltip {
  visibility: visible;
  opacity: 1;
}

.btn-tooltip {
  visibility: hidden;
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
}

.discovery-animation {
  position: relative;
  width: 2px;
  margin: 0 auto;
}

.animation-path {
  width: 2px;
  background-color: #8b4513;
  margin: 0 auto;
  height: 0;
  transition: height 0.5s ease;
}

.animation-sphere {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background-color: #ff4444;
  border-radius: 50%;
  opacity: 0;
}

.exhibits-wrapper {
  opacity: 0;
  height: 0;
  overflow: hidden;
  transition: opacity 0.5s ease, height 0.5s ease;
}

.exhibits-wrapper.visible {
  opacity: 1;
  height: auto;
}

.exhibit {
  margin: 40px 0;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.exhibit.visible {
  opacity: 1;
  transform: translateY(0);
}

.employee-section {
  padding: 40px;
  background-color: #f9f9f9;
}

.employee-section.night-mode {
  background-color: #222;
}

.employee-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.employee {
  width: 300px;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.employee-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.employee-info {
  padding: 20px;
}

.contact-button {
  background-color: #2a2929;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.registration-section {
  padding: 40px;
  background-color: #f9f9f9;
  text-align: center;
}

.registration-section button {
  margin: 10px;
  padding: 10px 20px;
  background-color: #2a2929;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.map {
  padding: 40px;
  background-color: transparent;
}

.map-header {
  text-align: center;
  margin-bottom: 20px;
}

.map-container {
  position: relative;
}

.map-frame {
  border: 5px solid #8b4513;
  border-radius: 10px;
  overflow: hidden;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  pointer-events: none;
}

.map-notes {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.note {
  width: 48%;
  padding: 15px;
  background-color: #f0e6d2;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.compass {
  font-size: 30px;
  text-align: center;
  margin-top: 10px;
}

.map-riddle {
  text-align: center;
  margin-top: 20px;
  font-style: italic;
}

.night-mode .map-riddle {
  color: #ff4444;
}

/* Ночные стили */
.night-mode {
  background-color: black;
  color: white;
}

.night-mode .product-section,
.night-mode .registration-section {
  background-color: #111;
}

.night-mode .employee {
  background-color: #333;
}

.night-mode .contact-button,
.night-mode .registration-section button {
  background-color: #ff4444;
}

.night-mode .note {
  background-color: #333;
  color: white;
}

.day-only {
  display: block;
}

.night-only {
  display: none;
}

.night-mode .day-only {
  display: none;
}

.night-mode .night-only {
  display: block;
}
</style>