<template>
  <div class="shop-container">
    <section class="products-section">
      <h2 class="section-title">Товары от дяди стена!</h2>
      <div class="products-container">
        <div class="product-card" v-for="(product, index) in products" :key="index">
          <div class="product-image">
            <img :src="product.image" :alt="product.name">
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="description">{{ product.shortDescription }}</p>
            <p class="price">{{ product.price }} $</p>
            <button class="details-btn" @click="showProductDetails(product)">
              Подробнее
            </button>
            <div class="rating">
              <span class="star" v-for="i in 5" :key="i" :data-rating="i">★</span>
              <span class="rating-value">{{ product.rating }}</span>
            </div>
            <button class="order-btn" @click="addToCart(product)">Ха! Беру!</button>
          </div>
        </div>
      </div>
    </section>

    <section class="excursions-section ancient-scroll-theme" id="excursions">
      <h2 class="section-title">Мистические туры</h2>

      <div class="excursions-container">
        <article class="product-card excursion-card" v-for="(excursion, index) in excursions" :key="index"
                :data-id="excursion.id"
                :data-photos="JSON.stringify(excursion.photos)"
                :data-locations="JSON.stringify(excursion.locations)"
                :data-base-price="excursion.price"
                :data-duration="excursion.duration">
          <div class="product-image-container">
            <img :src="excursion.photos[0]" 
                :alt="excursion.title" 
                class="product-image">
            <div class="exclusive-badge" v-if="excursion.exclusive">{{ excursion.exclusive }}</div>
            <div class="difficulty-badge" v-if="excursion.difficulty">
              <i :class="excursion.difficultyIcon"></i>
            </div>
          </div>
          
          <div class="product-info">
            <h3 class="product-title">{{ excursion.title }}</h3>
            
            <div class="excursion-meta">
              <div class="meta-item" v-for="(meta, i) in excursion.meta" :key="i">
                <i :class="meta.icon"></i>
                <span>{{ meta.text }}</span>
              </div>
            </div>

            <p class="description">
              {{ excursion.description }}
            </p>

            <div class="price-container">
              <span class="price-label">{{ excursion.priceLabel }}:</span>
              <p class="price">{{ excursion.price }} $</p>
            </div>

            <div class="actions-container">
              <button class="details-btn excursion-details-btn" @click="showExcursionDetails(excursion)">
                <i :class="excursion.detailsIcon"></i>
                {{ excursion.detailsText }}
              </button>
              <button class="order-btn book-excursion-btn" :class="{ danger: excursion.danger }" @click="bookExcursion(excursion)">
                <i :class="excursion.bookIcon"></i>
                {{ excursion.bookText }}
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [
        {
          id: 1,
          name: "Болванчики",
          image: "pictures/Puhla.png",
          shortDescription: "Качают головой так, что все позавидуют!",
          description: "Ха! Эти малыши качают гололвами так что вы не сможете оторваться! Приклейте к приборной панели и наслаждайтесь, как они одобрительно кивают вашим гениальным решениям!",
          price: "31.99",
          rating: "4.3"
        },
        {
          id: 2,
          name: "Глаза в банке",
          image: "pictures/nightImage.jpg",
          shortDescription: "Смотрят прямо в душу (и кошелёк)!",
          description: "Эти глаза видели такое, что вам и не снилось! Идеально для устрашения тёщи, коллекционеров и налоговой инспекции. Гарантия на 92% - они стеклянные!(Цена за одну штуку)",
          price: "14.99",
          rating: "5.0"
        },
        {
          id: 3,
          name: "Глаз великана",
          image: "pictures/wendyFace.png",
          shortDescription: "Видит вашу кредитную историю!",
          description: "Найден в лесу за хижиной! Гарантирую - либо артефакт древней цивилизации, либо бракованный продукт офтальмологической фабрики. Отлично смотрится на книжной полке и пугает религиозных фанатиков!",
          price: "144.99",
          rating: "4.1"
        },
        {
          id: 4,
          name: "Шар для хомячков",
          image: "pictures/stanlyFace.png",
          shortDescription: "Для хомяков и мелких родственников!",
          description: "Проверено на племяннике - выдерживает до 30 кг! Идеально для прогулок по дому, побега от коллекторов и экстремального похудения. В комплекте: 1 шар, 0 гарантий.",
          price: "199.99",
          rating: "3.2"
        },
        {
          id: 5,
          name: "Черепашки",
          image: "pictures/wendyFace.png",
          shortDescription: "Бывшие владельцы не жалуются!",
          description: "Набор черепов. Отлично подходят для: 1) Медицинских исследований 2) Устрашения соседей 3) Игры в Шекспира. На 87% не человеческие!",
          price: "37.99",
          rating: "2.9"
        },
        {
          id: 6,
          name: "Олень-мутант",
          image: "pictures/wendyFace.png",
          shortDescription: "Голова оленя с крыльями летучей мыши вместо ушей!",
          description: "Одно из лучшего что можно было найти в нашем лесу! Часть оленя, часть летучая мышь, 100% безумие! Гарантированно станет главной темой сплетен в вашем городке. При покупке - бесплатная легенда о происхождении!",
          price: "350.00",
          rating: "4.7"
        },
        {
          id: 7,
          name: "Рунные камни",
          image: "pictures/wendyFace.png",
          shortDescription: "Либо древние руны, либо камни с царапинами!",
          description: "На 80% уверен, что это не просто камни! Могут: 1) Предсказывать будущее 2) Вызывать дождь 3) Быть классным пресс-папье. Расшифровка прилагается (точность 12%)",
          price: "150.00",
          rating: "3.9"
        },
        {
          id: 8,
          name: "Мозг в банке",
          image: "pictures/wendyFace.png",
          shortDescription: "Умнее моего адвоката!",
          description: "Эйнштейн отдыхает! Этот красавец в формалине знает ответы на все вопросы (но молчит). Отличный подарок учёному, студенту-двоечнику или серийному убийце!",
          price: "200.00",
          rating: "1.2"
        },
        {
          id: 9,
          name: "Абордажный крюк",
          image: "pictures/wendyFace.png",
          shortDescription: "Проверено на тюремных охранниках!",
          description: "Спасёт из любой ситуации: тюрьма, скучный свидание, семейный ужин! Гарантирую - улетите с восторгом. В комплекте: 1 крюк, 0 угрызений совести!",
          price: "69.99",
          rating: "5.0"
        },
        {
          id: 10,
          name: "Бейсболка с ёлкой",
          image: "pictures/wendyFace.png",
          shortDescription: "Скрывает лысину и мысли!",
          description: "Эксклюзивный дизайн - ёлка, потому что почему бы и нет? Задерживает 73% солнечных лучей и 100% здравого смысла. Стирать не рекомендуется - краска сделана из того, что было под рукой!",
          price: "19.99",
          rating: "4.9"
        },
        {
          id: 11,
          name: "Открытки 'Чудовища'",
          image: "pictures/wendyFace.png",
          shortDescription: "Шокируют бабушек с 1952 года!",
          description: "Коллекция 'Милашки Гравити Фолз' - от маньяков до мутантов! Гарантированно испортят настроение тёще и порадуют коллекционеров странной всячины. На обратной стороне - место для ваших угроз!",
          price: "15.99",
          rating: "4.0"
        },
        {
          id: 12,
          name: "Карты 'Для беглецов'",
          image: "pictures/wendyFace.png",
          shortDescription: "С гномами и без полиции!",
          description: "На этих картах отмечены все: 1) Ловушки для туристов 2) Места, где полиция не ходит 3) Тайные тропы гномов. Точность 60%, но это лучше, чем ваша GPS!",
          price: "9.99",
          rating: "2.7"
        },
        {
          id: 13,
          name: "Обезьянья лапка",
          image: "pictures/wendyFace.png",
          shortDescription: "Исполняет желания (или нет)!",
          description: "Гарантирую - либо магический артефакт, либо лапка старой обезьяны из цирка! Исполняет 1 из 100 желаний (остальные 99 превратят вас в жабу). Продаётся как есть, претензии не принимаются!",
          price: "150.00",
          rating: "2.3"
        },
        {
          id: 14,
          name: "Форель в меху",
          image: "pictures/wendyFace.png",
          shortDescription: "Для тех, кому холодно!",
          description: "Рыбка в норковой шубке - роскошь для гурманов и безумцев. Не съедобна, но отлично смотрится с бокалом виски (как и всё в этом мире)!",
          price: "75.00",
          rating: "1.5"
        },
        {
          id: 15,
          name: "Шлем водолаза",
          image: "pictures/wendyFace.png",
          shortDescription: "Дышать не гарантирую!",
          description: "Антиквариат с историей! Возможно, принадлежал капитану Немо, а может быть валялся на свалке. Проверьте сами - ныряйте на здоровье (рекомендую завещание оформить заранее)!",
          price: "300.00",
          rating: "5.0"
        },
        {
          id: 16,
          name: "Футболка 'Загадка'",
          image: "pictures/wendyFace.png",
          shortDescription: "Ответов не будет!",
          description: "Символ моей жизни! Надпись '?' как бы говорит: Купи меня, если сможешь! Изготовлена из 70% хлопка и 30% тайн.",
          price: "22.99",
          rating: "4.3"
        },
        {
          id: 17,
          name: "Мороженое 'Сюрприз'",
          image: "pictures/wendyFace.png",
          shortDescription: "Вкус - загадка!",
          description: "Секретный рецепт от Мейбл! Возможные вкусы: 1) Ваниль 2) Грибы 3) Что-то зелёное. Гарантирую - либо вкусно, либо незабываемо! (Холодильник в подарок не прилагается)",
          price: "1.99",
          rating: "1.9"
        },
        {
          id: 18,
          name: "Лицензионные номера",
          image: "pictures/wendyFace.png",
          shortDescription: "Скрывают прошлое!",
          description: "Коллекция для тех, кому надо. Гарантирую - эти номера не числятся в розыске (на момент продажи). Идеально для: 1) Автолюбителей 2) Беглецов 3) Шпионов-любителей! Продажа за штуку!",
          price: "10.99",
          rating: "4.4"
        },
        {
          id: 19,
          name: "Трости с бильярдным шаром",
          image: "pictures/wendyFace.png",
          shortDescription: "Для игры и самообороны!",
          description: "Универсальный инструмент: 1) Поддержка при ходьбе 2) Импровизированное оружие 3) Шар для бильярда в экстренной ситуации. Предупреждение: не пытайтесь играть тростью в бильярд!",
          price: "40.00",
          rating: "3.1"
        },
        {
          id: 20,
          name: "Пришельцы в банке",
          image: "pictures/wendyFace.png",
          shortDescription: "Либо артефакт, либо подделка!",
          description: "На 99% уверен, что это не головастики! Эти малыши прилетели прямиком из... (место происхождения утеряно). Отлично подходят для: 1) Научных исследований 2) Запугивания соседей 3) Вечеринок уфологов!",
          price: "15.99",
          rating: "2.2"
        },
        {
          id: 21,
          name: "Голова ольмека",
          image: "pictures/wendyFace.png",
          shortDescription: "Думает о ваших деньгах!",
          description: "Точная копия (на глаз) древнего артефакта! Весит как 3 туриста, смотрится как миллион долларов. Идеально для сада, если хотите, чтобы соседи вас боялись!",
          price: "75.00",
          rating: "4.6"
        },
        {
          id: 22,
          name: "Календарь ацтеков",
          image: "pictures/wendyFace.png",
          shortDescription: "Точность ±1000 лет!",
          description: "Предсказывает конец света с 80% скидкой! Либо древний артефакт, либо подделка из гаража - решайте сами. В любом случае, выглядит круче, чем ваш iPhone!",
          price: "150.00",
          rating: "4.0"
        },
        {
          id: 23,
          name: "Журналы 'Для ванной'",
          image: "pictures/wendyFace.png",
          shortDescription: "Чтение на любой вкус!",
          description: "Коллекция от модных тенденций 1920-х до рецептов сомнительных зелий! Гарантированно займут вас в уборной дольше, чем планировалось.",
          price: "5.99",
          rating: "5.0"
        },
        {
          id: 24,
          name: "Осколки алмазов",
          image: "pictures/wendyFace.png",
          shortDescription: "Похожие на стекло!",
          description: "Неожиданно дешевые алмазы или обман зрения - обычные стекляшки. Подойдут всем кто любит все прозрачное или острое!",
          price: "100.01",
          rating: "1.0"
        },
        {
          id: 25,
          name: "Наклейки на бампер",
          image: "pictures/wendyFace.png",
          shortDescription: "Украсят любой автомобиль!",
          description: "Коллекция редких наклеек! Эти винтажные наклейки превратят вашу машину в лучшее что вы видели. Особенно рекомендую данные наклейки!",
          price: "4.99",
          rating: "3.5"
        },
        {
          id: 26,
          name: "Часы с кукушкой",
          image: "pictures/wendyFace.png",
          shortDescription: "Разбудят даже мёртвого!",
          description: "Антикварные часы с сюрпризом! Каждый час вылетает не только кукушка, но и моль(работает не всегда)!",
          price: "199.99",
          rating: "3.9"
        },
        {
          id: 27,
          name: "Поющий лосось",
          image: "pictures/wendyFace.png",
          shortDescription: "Лосось поющий на пляжу лежующий!",
          description: "Шедевр таксидермии и звуковой техники! Нажимаете кнопку - получаете лучшую мелодию которую вы слышали. Гарантирую - либо смех, либо звонок в полицию. Работает от батареек (в комплект не входят)!",
          price: "120.00",
          rating: "4.7"
        },
        {
          id: 28,
          name: "Мозг мужчины и женщины в банках",
          image: "pictures/wendyFace.png",
          shortDescription: "Сравните и узнайте правду!",
          description: "Научный эксперимент в вашем доме! Два мозга: 1) Мужской (возможно) 2) Женский (якобы). Сравните вес, размер и количество извилин если вам нечем заняться. А в общем и целом подходит для коллекционерв!",
          price: "450.00",
          rating: "2.1"
        },
        {
          id: 29,
          name: "Золотые самородки",
          image: "pictures/wendyFace.png",
          shortDescription: "Блестит как настоящее!",
          description: "На 0.01% уверен, что это золото! Эти самородки: 1) Либо драгоценны 2) Либо покрашены кем-то. Отличный подарок для вашего врага!",
          price: "50.00",
          rating: "1.0"
        },
        {
          id: 30,
          name: "Шарик со снегом",
          image: "pictures/wendyFace.png",
          shortDescription: "Снег и ностальгия в одном флаконе!",
          description: "Хижина чудес в миниатюре! Встряхните - и увидите снег. Гарантирую - либо антиквариат, либо подделка из 90-х. В любом случае, красиво!",
          price: "175.00",
          rating: "4.7"
        },
        {
          id: 31,
          name: "Майки с пумой и пантерой",
          image: "pictures/wendyFace.png",
          shortDescription: "Какую лучше выбрать?",
          description: "Две майки - две личности! Сегодня вы пума, завтра - пантера (или наоборот). Изготовлены из 50% хлопка и 50% бравады. Размеры: S - для притворщиков, XXXL - для настоящих мужчин!",
          price: "40.00",
          rating: "4.4"
        },
        {
          id: 32,
          name: "Пляжные полотенца",
          image: "pictures/wendyFace.png",
          shortDescription: "Скрывают всё и сразу!",
          description: "Три полотенца для: 1) Пляжа 2) Сауны 3) Срочного побега. Яркие цвета скрывают: 1) Волосы на спине 2) Пивной живот 3) Чувство стыда. Стирать не рекомендуется - линяют, как я от налоговой!",
          price: "30.00",
          rating: "4.5"
        },
        {
          id: 33,
          name: "Книги",
          image: "pictures/wendyFace.png",
          shortDescription: "Интересные книги для чтения!",
          description: "Данные книги описывают историю нашего городка а так-же всяких интересных животных. Книги идеально подходят для камина и понтов (продаются по одной штуке)!",
          price: "20.00",
          rating: "4.4"
        },
        {
          id: 34,
          name: "Одноглазый череп",
          image: "pictures/wendyFace.png",
          shortDescription: "Находятся за хижиной и устрашают",
          description: "Мой любимый экспонат! Возможно гиганский глаз как раз для этой черепушки(закажи гиганский глаз и проверь!). Гарантирую - либо древний артефакт, либо результат неудачного падения!",
          price: "120.00",
          rating: "4.8"
        },
        {
          id: 35,
          name: "Деревянный гном",
          image: "pictures/wendyFace.png",
          shortDescription: "Лучше гнома не придумать!",
          description: "Лучше деревянных гномов вы не видели! Настоящие гномы были добыты с трудом из леса и превращены в деревянных. Данный товар подойдет для заумных шестипалов!",
          price: "11.91",
          rating: "4.3"
        },
        {
          id: 36,
          name: "Брелки",
          image: "pictures/wendyFace.png",
          shortDescription: "Для ключей и не только!",
          description: "Коллекция данных брелков всегда будет вам напоминать о нашей хижине. Большое количество брелков в виде знака вопроса. Понравятся взрослым и детям!",
          price: "12.99",
          rating: "3.9"
        },
        {
          id: 37,
          name: "Брелок в виде НЛО",
          image: "pictures/wendyFace.png",
          shortDescription: "Светится и пугает!",
          description: "НЛО в миниатюре! Светится в темноте, пугает домашних животных и привлекает настоящих пришельцев (возможно). Гарантирую - либо крутая игрушка, либо начало вашего похищения!",
          price: "15.99",
          rating: "5.0"
        }
      ],
      excursions: [
        {
          id: "hut-tour",
          title: "Тайны Хижины Чудес",
          photos: ["pictures/backSharck.png","pictures/famPains.png","pictures/backSharck.png","pictures/famPains.png"],
          locations: ["Тайная комната","Зал артефактов","Библиотека заклинаний","Подземные лабиринты","Чердак странностей"],
          price: "300",
          duration: "1 час",
          exclusive: "Лучший выбор!",
          difficulty: true,
          difficultyIcon: "fas fa-skull",
          meta: [
            { icon: "fas fa-hat-wizard", text: "Экскурсовод" },
            { icon: "fas fa-clock", text: "Таких чудес вы ещё не видели" }
          ],
          description: "Эксклюзивный тур по захватывающим местам в Хижине чудес",
          priceLabel: "Цена за человека",
          detailsIcon: "fas fa-eye",
          detailsText: "Осмотреть экспонаты",
          bookIcon: "fas fa-key",
          bookText: "Открыть двери"
        },
        {
          id: "city-tour",
          title: "Улицы Гравити Фолз",
          photos: ["pictures/backSharck.png","pictures/famPains.png","pictures/backSharck.png","pictures/famPains.png"],
          locations: ["Закусочная 'Слепой свиньи'","Памятник основателям","Секретный бункер","Логово гномов","Проклятый мост"],
          price: "220",
          duration: "3 часа",
          exclusive: "Только у нас!",
          meta: [
            { icon: "fas fa-ghost", text: "Много локаций" },
            { icon: "fas fa-baby", text: "Тур для всей семьи" }
          ],
          description: "Расследование городских легенд и встреча с местными... жителями",
          priceLabel: "За человека",
          detailsIcon: "fas fa-map-marked-alt",
          detailsText: "Маршрут",
          bookIcon: "fas fa-search",
          bookText: "Начать поиск"
        },
        {
          id: "forest-tour",
          title: "Лесные аномалии",
          photos: ["pictures/backSharck.png","pictures/famPains.png","pictures/backSharck.png","pictures/famPains.png"],
          locations: ["Пещера времени","Древо желаний","Ручей оборотней","Поляна фей","Алтарь древних"],
          price: "600",
          duration: "7 часов",
          exclusive: "Опасно!",
          danger: true,
          difficulty: true,
          difficultyIcon: "fas fa-hiking",
          meta: [
            { icon: "fas fa-campground", text: "Снаряжение включено" },
            { icon: "fas fa-exclamation-triangle", text: "Возрастное ограничение 16+" }
          ],
          description: "Экстремальный поход по самым загадочным местам с ночёвкой у костра (возвращение и полную сохранность не гарантируем)",
          priceLabel: "Цена за человека",
          detailsIcon: "fas fa-tree",
          detailsText: "В глубь тайны",
          bookIcon: "fas fa-fire",
          bookText: "Испытать себя"
        }
      ]
    };
  },
  methods: {
    showProductDetails(product) {
      this.$emit('open-product-modal', product);
    },
    addToCart(product) {
      this.$emit('add-to-cart', product);
    },
    showExcursionDetails(excursion) {
      this.$emit('show-excursion-details', excursion);
    },
    bookExcursion(excursion) {
      this.$emit('book-excursion', excursion);
    }
  }
};
</script>