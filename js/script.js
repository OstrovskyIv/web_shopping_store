document.addEventListener("DOMContentLoaded", function() {
  const preloader = document.getElementById("preloader");

  if (!sessionStorage.getItem('preloaderShown')) {
    startPreloaderAnimation();
    sessionStorage.setItem('preloaderShown', 'true');
  } else {
    preloader.classList.add("hide");
  }

  initializeContacts();

  initModalCloseHandlers();
  initExhibitsAnimation(); 
  
});

function startPreloaderAnimation() {
  const preloader = document.getElementById("preloader");
  let percent = 0;
  const interval = 50;
  const duration = 3500;
  
  const updatePercent = () => {
    percent += (100 * interval) / duration;
    if (percent <= 100) {
      setTimeout(updatePercent, interval);
    } else {
      setTimeout(() => {
        preloader.classList.add("hide");
      }, 500);
    }
  };
  
  updatePercent();
}

function initModalCloseHandlers() {
  const closeButton = document.querySelector(".close");
  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }
  
  window.addEventListener('click', function(event) {
    const modal = document.getElementById("modal");
    if (event.target === modal) {
      closeModal();
    }
    
    const regModal = document.getElementById("registrationModal");
    if (event.target === regModal) {
      closeRegistrationModal();
    }
    
    const loginModal = document.getElementById("loginModal");
    if (event.target === loginModal) {
      closeLoginModal();
    }
  });
}

function initExhibitsAnimation() {
  const discoveryBtn = document.getElementById('discoveryBtn');
  const animationSphere = document.querySelector('.animation-sphere');
  const animationPath = document.querySelector('.discovery-animation');
  const exhibitsWrapper = document.querySelector('.exhibits-wrapper');
  const exhibits = document.querySelectorAll('.exhibit');
  const section = document.querySelector('.exhibits-section');
  const sectionTitle = document.querySelector('.section-title');
  
  if (!discoveryBtn) return;

  const MOVE_DURATION = 300;
  const STOP_DURATION = 200;
  
  let isOpen = false;
  let animationId = null;
  let currentStop = 0;
  let positions = [];

  function calculatePositions() {
    const result = [];
    const btnBottom = discoveryBtn.getBoundingClientRect().bottom + window.scrollY;
    
    result.push({
      y: btnBottom + 30,
      pause: false
    });
    
    exhibits.forEach((exhibit, i) => {
      const rect = exhibit.getBoundingClientRect();
      
      result.push({
        y: rect.top + window.scrollY - 50,
        pause: true,
        showIndex: i
      });
      
      if (i < exhibits.length - 1) {
        result.push({
          y: rect.bottom + window.scrollY + 30,
          pause: false
        });
      }
    });
    
    result.push({
      y: exhibits[exhibits.length-1].getBoundingClientRect().bottom + window.scrollY + 100,
      pause: true
    });
    
    return result;
  }

  function resetAnimation() {
    clearTimeout(animationId);
    
    animationSphere.style.transition = 'none';
    animationSphere.style.top = '0';
    animationSphere.style.opacity = '0';
    animationPath.style.height = '0';
    
    exhibits.forEach(ex => ex.classList.remove('visible'));
    section.classList.remove('expanded');
    exhibitsWrapper.classList.remove('visible');
    
    discoveryBtn.innerHTML = '<i class="fas fa-scroll"></i>';
    discoveryBtn.disabled = false;
    
    isOpen = false;
    currentStop = 0;
  }

  function toggleAnimation() {
    if (isOpen) {
      resetAnimation();
      return;
    }
    
    isOpen = true;
    positions = calculatePositions();
    const pathHeight = positions[positions.length-1].y - positions[0].y;
    
    animationPath.style.height = `${pathHeight}px`;
    section.classList.add('expanded');
    exhibitsWrapper.classList.add('visible');
    discoveryBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    discoveryBtn.disabled = true;
    
    setTimeout(() => {
      animationSphere.style.opacity = '1';
      animationSphere.style.top = '0';
      
      setTimeout(() => {
        animationSphere.style.transition = `top ${MOVE_DURATION}ms linear`;
        animate();
      }, 10);
    }, 100);
  }

  function animate() {
    if (currentStop >= positions.length) {
      finishAnimation();
      return;
    }
    
    const pos = positions[currentStop];
    animationSphere.style.top = `${pos.y - positions[0].y}px`;
    
    if (pos.showIndex !== undefined) {
      setTimeout(() => {
        exhibits[pos.showIndex].classList.add('visible');
      }, MOVE_DURATION/2);
    }
    
    currentStop++;
    const delay = pos.pause ? MOVE_DURATION + STOP_DURATION : MOVE_DURATION;
    animationId = setTimeout(animate, delay);
  }

  function finishAnimation() {
    discoveryBtn.innerHTML = '<i class="fas fa-scroll"></i>';
    discoveryBtn.disabled = false;
  }

  setTimeout(() => {
    if (sectionTitle) sectionTitle.classList.add('visible');
  }, 500);

  discoveryBtn.addEventListener('click', toggleAnimation);

  window.addEventListener('resize', () => {
    if (isOpen) {
      positions = calculatePositions();
      animationPath.style.height = `${positions[positions.length-1].y - positions[0].y}px`;
      
      if (currentStop > 0) {
        animationSphere.style.top = `${positions[currentStop-1].y - positions[0].y}px`;
      }
    }
  });
}

const dayEmployees = [
  {
    name: "Стэнли Пайнс",
    fullName: "Владелец магазина Стэнли Пайнс",
    email: "stanley@mysteryhut.com",
    image: "pictures/StanFace.png",
    description: "Стэнли Пайнс — владелец Хижины Чудес в Гравити Фолз, сидевший мошенник и авантюрист. Родившись в 1950-х, он с детства был противоположностью своего умного брата Форда, но их связывала крепкая дружба. После ссоры и исчезновения Форда, Стэн взял на себя его личность, чтобы восстановить портал и вернуть брата. Он превратил Хижину в популярную туристическую ловушку, скрывая её тайны. Несмотря на грубый характер, Стэн заботится о своей семье. Летом 2012 года он присматривает за Диппером и Мэйбл, открывая им мир паранормального. Его жизнь полна приключений, соперничества с Гидеоном и попыток исправить прошлые ошибки. В юности Стэн мечтал о путешествиях, но его планы рухнули после ссоры с Фордом и ухода его девушки Карлы. Он скитался по стране, занимаясь мошенничеством, пока не получил открытку от Форда, которая привела его в Гравити Фолз. Там он обнаружил портал в другое измерение и посвятил 30 лет его восстановлению. Стэн — мастер манипуляций и хитрости, но его преданность семье и друзьям делает его героем, несмотря на все его недостатки.",
    blockText: "Стэнли — хитрый и жадный, но в душе добряк."
  },
  {
    name: "Венди Кордрой",
    fullName: "Старший сотрудник Венди Кордрой",
    email: "wendy@mysteryhut.com",
    image: "pictures/wendyFace.png",
    description: "Венди Кордрой — старшая дочь лесоруба Отважного Дэна Кордроя и одна из самых крутых подростков в Гравити Фолз. Работая в Хижине Чудес неполный день, она всегда готова помочь своим друзьям, особенно Дипперу, который в неё влюблён. Венди — мастер сарказма и любительница приключений, она часто нарушает правила, но всегда остаётся верной своим принципам. Её расслабленный характер и умение находить выход из любой ситуации делают её незаменимой в команде. Несмотря на внешнюю беззаботность, Венди заботится о своей семье и друзьях больше чем о себе, стараясь поддерживать их в трудные моменты.",
    blockText: "Венди — крутая, саркастичная, но всегда готовая помочь."
  },
  {
    name: "Зус Рамирес",
    fullName: "Главный помощник Зус Рамирес",
    email: "soos@mysteryhut.com",
    image: "pictures/zooseFace.png",
    description: "Зус Рамирез — добродушный и преданный помощник в Хижине Чудес. Несмотря на свою наивность, он всегда готов прийти на помощь своим друзьям. Зус вырос без отца, что сделало его особенно привязанным к Стэнли, которого он считает своим дедушкой. Его любовь к видеоиграм, комиксам и всему необычному делает его душой компании. Зус мечтает однажды стать настоящим героем, и его доброта и отзывчивость уже делают его таковым в глазах окружающих. Несмотря на свои неудачи, он никогда не сдаётся и всегда старается сделать мир лучше.",
    blockText: "Зус — добрый, наивный и преданный друг."
  },
  {
    name: "Диппер Пайнс",
    fullName: "Младший сотрудник Диппер Пайнс",
    email: "dipper@mysteryhut.com",
    image: "pictures/DipperFace.png",
    description: "Диппер Пайнс — умный и любознательный 13-летний мальчик, который проводит лето в Гравити Фолз вместе со своей сестрой-близнецом Мэйбл. Он — главный исследователь паранормальных явлений в Хижине Чудес. Диппер находит загадочный дневник, который открывает ему тайны городка, и с тех пор его жизнь превращается в череду приключений. Несмотря на свою занудность и склонность к переживаниям, Диппер проявляет смелость и находчивость в критических ситуациях. Его дружба с Мэйбл и Зусом помогает ему справляться с трудностями, а его стремление к знаниям делает его настоящим героем.",
    blockText: "Диппер — зануда, так что лучше ничего у него не спрашивайте."
  },
  {
    name: "Мэйбл Пайнс",
    fullName: "Младший сотрудник Мэйбл Пайнс",
    email: "mabel@mysteryhut.com",
    image: "pictures/MabelFace.png",
    description: "Мэйбл Пайнс — весёлая, энергичная и немного хаотичная сестра-близнец Диппера. Она обожает свитеры с яркими узорами, единорогов и всё, что связано с вечеринками. Мэйбл — душа компании, её оптимизм и жизнерадостность вдохновляют окружающих. Несмотря на свою легкомысленность, она проявляет невероятную смелость и преданность своим друзьям и семье. Мэйбл всегда готова поддержать Диппера в его приключениях, а её творческий подход к решению проблем часто оказывается ключом к успеху. Её мечты и фантазии делают мир ярче и интереснее.",
    blockText: "Мэйбл — энергичная, весёлая и немного хаотичная."
  },
  {
    name: "Стэнфорд Пайнс",
    fullName: "Владелец хижины Стэнфорд Пайнс",
    email: "stanford@mysteryhut.com",
    image: "pictures/StanfordFace.png",
    description: "Стэнфорд Пайнс — учёный, исследователь и автор трёх дневников, которые стали ключом к разгадке тайн Гравити Фолз. Он — брат-близнец Стэнли, но в отличие от него, Форд с детства увлекался наукой и паранормальными явлениями. После открытия портала он попал в другое измерение, оставив после себя лишь дневники. Его возвращение в Гравити Фолз стало поворотным моментом в жизни всех обитателей Хижины Чудес. Стэнфорд — гениальный, но немного отстранённый человек, чьи знания и опыт помогают бороться с угрозами из других миров.",
    blockText: "Стэнфорд — гениальный, но загадочный учёный."
  },
  {
    name: "Пухля",
    fullName: "Временный сотрудник Пухля",
    email: "waddles@mysteryhut.com",
    image: "pictures/Puhla.png",
    description: "Пухля — любимая свинка Мэйбл, которую она выиграла на ярмарке. Несмотря на то, что Пухля — обычная свинья, её преданность и ум делают её настоящим членом семьи. Она часто сопровождает Мэйбл в её приключениях, а её неожиданная помощь не раз спасала ситуацию. Пухля — символ доброты и заботы, которые Мэйбл дарит своим друзьям. Её присутствие в Хижине Чудес добавляет уюта и тепла в жизнь всех её обитателей.",
    blockText: "Пухля — милая, преданная и неожиданно умная свинка."
  }
];

const nightEmployees = [
  {
    name: "Билл Шифр",
    fullName: "Билл Шифр",
    email: "bill@mysteryhut.com",
    image: "pictures/BillFace.png",
    description: "Билл Шифр — загадочный и могущественный демон из другого измерения. Никто не знает, что у него на уме, но его планы всегда связаны с хаосом и разрушением. Он мастер манипуляций и иллюзий, способный обмануть даже самых умных. Его цель — захватить все измерения и установить свой порядок. Билл не остановится ни перед чем, чтобы достичь своей цели, и его появление всегда предвещает беду.",
    blockText: "Билл Шифр — загадочный и могущественный. Никто не знает, что у него на уме."
  },
  {
    name: "Криптос",
    fullName: "Криптос",
    email: "cryptos@mysteryhut.com",
    image: "pictures/CryptosFace.png",
    description: "Криптос — мастер шифров и тайн. Он специализируется на скрытии информации и создании сложных головоломок. Его способности позволяют ему проникать в любые системы и оставаться незамеченным. Криптос — правая рука Билла, отвечающая за безопасность и передачу секретных сообщений.",
    blockText: "Криптос — мастер шифров и тайн. Всегда знает, как скрыть информацию."
  },
  {
    name: "Восьмёрка",
    fullName: "Восьмёрка",
    email: "eight@mysteryhut.com",
    image: "pictures/EightFace.png",
    description: "Восьмёрка — механический помощник Билла, созданный для выполнения самых сложных задач. Он никогда не спит и всегда начеку. Его точность и скорость делают его идеальным исполнителем для любых миссий. Восьмёрка — это не просто машина, он обладает искусственным интеллектом, который позволяет ему адаптироваться к любой ситуации.",
    blockText: "Восьмёрка — механический помощник Билла. Никогда не спит и всегда начеку."
  },
  {
    name: "Аморфник",
    fullName: "Аморфник",
    email: "amorph@mysteryhut.com",
    image: "pictures/AmorphFace.png",
    description: "Аморфник — существо, способное менять свою форму и облик. Никто не знает, как он выглядит на самом деле, и это делает его идеальным шпионом. Он может проникнуть куда угодно, принимая любую форму, и оставаться незамеченным. Аморфник — мастер маскировки и обмана.",
    blockText: "Аморфник — меняет форму и облик. Никто не знает, как он выглядит на самом деле."
  },
  {
    name: "Зантар",
    fullName: "Зантар",
    email: "zantar@mysteryhut.com",
    image: "pictures/ZantarFace.png",
    description: "Зантар — хранитель древних знаний и секретов. Он знает всё, что скрыто во тьме, и использует эти знания для достижения целей Билла. Зантар — мудрый и хитрый, его способности позволяют ему находить слабости врагов и использовать их против них.",
    blockText: "Зантар — хранитель древних знаний. Знает всё, что скрыто во тьме."
  },
  {
    name: "Шестигран",
    fullName: "Шестигран",
    email: "hexagon@mysteryhut.com",
    image: "pictures/HexagonFace.png",
    description: "Шестигран — слуга Билла, всегда готовый на пакости и хитрости. Он выполняет самые грязные задания и никогда не задаёт лишних вопросов. Шестигран — это воплощение преданности и безжалостности.",
    blockText: "Шестигран — слуга Билла. Всегда готов на пакости и хитрости."
  },
  {
    name: "Зубы",
    fullName: "Зубы",
    email: "teeth@mysteryhut.com",
    image: "pictures/TeethFace.png",
    description: "Зубы — тайный агент Билла, специализирующийся на устрашении и запугивании. Его улыбка пугает даже самых смелых, а его методы всегда эффективны. Зубы — это не просто агент, он — символ страха, который Билл использует для контроля над своими врагами.",
    blockText: "Зубы — тайный агент Билла. Его улыбка пугает даже самых смелых."
  },
  {
    name: "Пустышка",
    fullName: "Пустышка",
    email: "dummy@mysteryhut.com",
    image: "pictures/DummyFace.png",
    description: "Пустышка — мастер маскировки, способный сливаться с окружающей средой и оставаться незамеченным. Его способности делают его идеальным шпионом и разведчиком. Никто не знает, где он находится, и это делает его одним из самых опасных членов банды.",
    blockText: "Пустышка — мастер маскировки. Никто не знает, где он находится."
  },
  {
    name: "Пироньяка",
    fullName: "Пироньяка",
    email: "pyronyak@mysteryhut.com",
    image: "pictures/PyronyakFace.png",
    description: "Пироньяка — огненный дух, способный поджечь всё вокруг. Его стихия — огонь, и он использует её для уничтожения врагов Билла. Пироньяка — это воплощение разрушения и хаоса, и его появление всегда предвещает катастрофу.",
    blockText: "Пироньяка — огненный дух. Всегда готов поджечь всё вокруг."
  },
  {
    name: "Замочник",
    fullName: "Замочник",
    email: "lockmaster@mysteryhut.com",
    image: "pictures/LockmasterFace.png",
    description: "Замочник — мастер замков и ловушек. Он создаёт сложные механизмы, которые невозможно взломать. Его способности делают его незаменимым для защиты секретов Билла. Никто не сможет открыть то, что он закрыл.",
    blockText: "Замочник — мастер замков и ловушек. Никто не сможет открыть то, что он закрыл."
  },
  {
    name: "Лава",
    fullName: "Лава",
    email: "nightmare@mysteryhut.com",
    image: "pictures/LavaLampDemon.png",
    description: "Лава-лампообразный демон — существо из Царства Кошмаров. Является членом банды Межгалактических преступников и Ночных Кошмаров, а также верным прислужником Билла Шифра. Его лампообразная форма служит проводником между измерениями, помогая воплощать зловещие планы своего хозяина.",
    blockText: "Демон-лава лампа из Царства Кошмаров."
}
];

function initializeContacts() {
  updateContacts(false); 
}

function updateContacts(isNightMode) {
  const employees = isNightMode ? nightEmployees : dayEmployees;
  const employeeButtons = document.querySelectorAll('.employee .contact-button');

  employeeButtons.forEach((button, index) => {
    if (employees[index]) {
      const employee = employees[index];
      const employeeInfo = button.closest('.employee-info');
      
      if (employeeInfo) {
        const nameElement = employeeInfo.querySelector('h3');
        const descriptionElement = employeeInfo.querySelector('.description');
        
        if (nameElement) nameElement.textContent = employee.fullName || employee.name;
        if (descriptionElement) descriptionElement.textContent = employee.blockText;
        
        button.onclick = () => {
          showContact(
            employee.name,
            employee.email,
            employee.image,
            employee.description
          );
        };
      }
    }
  });
}

function showContact(name, email, imageSrc, description) {
  const modal = document.getElementById("modal");
  const modalContent = modal.querySelector('.modal-content');
  
  modalContent.innerHTML = `
    <span class="close">&times;</span>
    <h2>${name}</h2>
    <img src="${imageSrc}" alt="${name}">
    <p>${description}</p>
    <hr>
    <p><strong>Контакт:</strong> <a href="mailto:${email}">${email}</a></p>
  `;
  
  modal.style.display = "flex";
  setTimeout(() => {
    modalContent.classList.add('show');
  }, 10);
  
  modal.querySelector('.close').onclick = closeModal;
}

function closeModal() {
  const modal = document.getElementById("modal");
  const modalContent = modal.querySelector('.modal-content');
  
  modalContent.classList.remove('show');
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

function closeModal() {
  const modal = document.getElementById("modal");
  const modalContent = modal.querySelector('.modal-content');
  
  modalContent.classList.remove('show');
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

function setNightMode() {
  document.body.classList.add("night-mode");
  const nightButton = document.getElementById('nightButton');
  const dayButton = document.querySelector('.buttons button[onclick="setDayMode()"]');
  const overlay = document.getElementById('overlay');
  const backSharckImage = document.querySelector('.backSharck img');
  const logo = document.querySelector(".logo img");

  nightButton.disabled = true;
  dayButton.disabled = true;

  const rect = nightButton.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  overlay.style.transition = 'none';
  overlay.style.clipPath = `circle(0% at ${centerX}px ${centerY}px)`;
  overlay.style.opacity = 1;
  overlay.style.backgroundColor = "black";

  setTimeout(() => {
    overlay.style.transition = 'clip-path 2s ease, opacity 2s ease';
    overlay.style.clipPath = 'circle(150% at center)';
  }, 10);

  setTimeout(() => {
    overlay.style.opacity = 0;
    window.scrollTo({ top: 0, behavior: 'auto' });

    document.querySelectorAll('.night-only').forEach(el => el.style.display = 'block');
    document.querySelectorAll('.map-notes.night-only').forEach(el => el.style.display = 'flex');
    document.querySelectorAll('.day-only').forEach(el => el.style.display = 'none');

    logo.src = "pictures/nightImageLogo.png";
    logo.alt = "Ночной логотип Хижины чудес";
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white";

    const header = document.querySelector("header");
    header.style.backgroundColor = "#ff4444";
    header.style.color = "black";

    const navLinks = document.querySelectorAll("nav ul li a");
    navLinks.forEach(link => link.style.color = "black");

    const main = document.querySelector("main");
    main.style.backgroundColor = "black";

    const employeeTexts = document.querySelectorAll(".employee-info h3, .employee-info .description");
    employeeTexts.forEach(text => text.style.color = "black");

    const sections = [
      ".registration-section",
      ".product-section",
      ".map"
    ].forEach(selector => {
      const section = document.querySelector(selector);
      if (section) {
        section.style.backgroundColor = "black";
        section.style.color = "white";
      }
    });

    const discountText = document.getElementById("discount-text");
    const uncleStoryText = document.getElementById("uncle-story-text");
    if (discountText && uncleStoryText) {
      discountText.textContent = "Давай заключим сделку, гений!";
      discountText.style.color = "white";
      uncleStoryText.textContent = "В подарок — знания о вселенной!";
      uncleStoryText.style.color = "white";
    }

    const leftContainer = document.querySelector(".leftSharck");
    leftContainer.innerHTML = `<img src="pictures/famBill.png" alt="Ночное изображение" style="max-width: 1440px; width: 100%; height: auto; object-fit: contain;">`;

    const mainText = document.getElementById("mainText");
    mainText.innerHTML = `
      <p><strong>Ты попал в мир, где правила пишутся заново, а логика теряет смысл.</strong></p>
      <p>Здесь, среди бесконечных коридоров и зеркал, отражающих твои страхи, ты найдешь не ответы, а вопросы, заставляющие усомниться во всём.</p>
      <p>Это место не для слабых. Каждый шаг — игра, а каждая игра — ловушка. Ты можешь найти ключи к тайнам, но помни: за каждым скрывается дверь, за которой — то, к чему ты не готов.</p>
      <p>Ты ищешь знания? Силу? Или хочешь узнать, что скрывает этот мир? Я предложу сделку... но цена будет выше, чем ты готов заплатить. Здесь ничто не даётся просто так.</p>
      <p>Сначала этот сайт, потом — весь мир. Готов ли ты бросить вызов судьбе? Если да, шагай... но помни: обратного пути может не быть.</p>
      <p>Когда ты поймёшь, что уже поздно, я буду смеяться, глядя, как мир склоняется передо мной. Ведь это только начало...</p>
    `;

    const aboutHeader = document.querySelector("#aboutText h2");
    aboutHeader.textContent = "Билл Шифр";

    backSharckImage.src = "pictures/nigtBackHous.png";
    backSharckImage.alt = "Ночное фоновое изображение Хижины чудес";

    const employeeContainer = document.querySelector('.employee-container');
    employeeContainer.innerHTML = '';
  
    nightEmployees.forEach(employee => {
      const employeeDiv = document.createElement('div');
      employeeDiv.className = 'employee';
      employeeDiv.innerHTML = `
        <div class="employee-image">
          <img src="${employee.image}" alt="${employee.name}" />
        </div>
        <div class="employee-info">
          <h3>${employee.fullName || employee.name}</h3>
          <p class="description">${employee.blockText}</p>
          <button class="contact-button">Контакты</button>
        </div>
      `;
      employeeContainer.appendChild(employeeDiv);
    });

    updateContacts(true);

    const employeeSectionTitle = document.querySelector(".employee-section h2");
    if (employeeSectionTitle) {
      employeeSectionTitle.textContent = "Банда Межгалактических преступников";
    }

    const employeeSection = document.querySelector('.employee-section');
    employeeSection.classList.add('night-mode');

    nightButton.disabled = false;
    dayButton.disabled = false;
  }, 2000);
}

function setDayMode() {
  document.body.classList.remove("night-mode");
  const dayButton = document.querySelector('.buttons button[onclick="setDayMode()"]');
  const nightButton = document.getElementById('nightButton');
  const overlay = document.getElementById('overlay');
  const backSharckImage = document.querySelector('.backSharck img');
  const logo = document.querySelector(".logo img");

  nightButton.disabled = true;
  dayButton.disabled = true;

  const rect = dayButton.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  overlay.style.transition = 'none';
  overlay.style.clipPath = `circle(0% at ${centerX}px ${centerY}px)`;
  overlay.style.opacity = 1;
  overlay.style.backgroundColor = "#d4b08c";

  setTimeout(() => {
    overlay.style.transition = 'clip-path 2s ease, opacity 2s ease';
    overlay.style.clipPath = 'circle(150% at center)';
  }, 10);

  setTimeout(() => {
    overlay.style.opacity = 0;
    window.scrollTo({ top: 0, behavior: 'auto' });

    document.querySelectorAll('.day-only').forEach(el => el.style.display = 'block');
    document.querySelectorAll('.map-notes.day-only').forEach(el => el.style.display = 'flex');
    document.querySelectorAll('.night-only').forEach(el => el.style.display = 'none');

    logo.src = "pictures/LoGo.png";
    logo.alt = "Логотип Хижины чудес";
    document.body.style.backgroundColor = "#d4b08c";
    document.body.style.color = "black";

    const header = document.querySelector("header");
    header.style.backgroundColor = "#2a2929";
    header.style.color = "white";

    const navLinks = document.querySelectorAll("nav ul li a");
    navLinks.forEach(link => link.style.color = "white");

    const main = document.querySelector("main");
    main.style.backgroundColor = "transparent";

    const employeeTexts = document.querySelectorAll(".employee-info h3, .employee-info .description");
    employeeTexts.forEach(text => text.style.color = "");

    const sections = [
      ".registration-section",
      ".product-section",
      ".map"
    ].forEach(selector => {
      const section = document.querySelector(selector);
      if (section) {
        section.style.backgroundColor = selector === ".map" ? "transparent" : "#f9f9f9";
        section.style.color = "#333";
      }
    });

    const discountText = document.getElementById("discount-text");
    const uncleStoryText = document.getElementById("uncle-story-text");
    if (discountText && uncleStoryText) {
      discountText.textContent = "Получи скидку в 0% за регистрацию!";
      discountText.style.color = "";
      uncleStoryText.textContent = "А также историю от Дяди Стэна!";
      uncleStoryText.style.color = "";
    }

    const leftContainer = document.querySelector(".leftSharck");
    leftContainer.innerHTML = `<img src="pictures/famPains.png" alt="Семья Пайнс" />`;

    const mainText = document.getElementById("mainText");
    mainText.innerHTML = `
      <p><strong>Добро пожаловать в Хижину чудес — место, где реальность переплетается с тайнами, а каждый предмет хранит свою историю.</strong></p>
      <p>Здесь, среди скрипучих половиц и шепчущих стен, вы найдете не просто товары, а настоящие артефакты. Загадочные книги, наполненные древними знаниями, кристаллы, мерцающие неведомой энергией, и карты, ведущие туда, куда не ступала нога обычного человека.</p>
      <p>Хижина чудес спрятана в самом сердце Гравити Фолз, и те, кто осмелится войти, уже не выйдут прежними. Что вас ждет за прилавком? Мистика? Открытия? А, может, что-то, о чем лучше не знать?</p>
      <p>Но одно можно сказать наверняка — скучно не будет. Готовы ли вы раскрыть тайны, скрытые в тени? Тогда шагните вперед… если осмелитесь.</p>
    `;

    const aboutHeader = document.querySelector("#aboutText h2");
    aboutHeader.textContent = "О Хижине чудес";

    backSharckImage.src = "pictures/backSharck.png";
    backSharckImage.alt = "Фоновое изображение Хижины чудес";

    const employeeContainer = document.querySelector('.employee-container');
    employeeContainer.innerHTML = '';
  
    dayEmployees.forEach(employee => {
      const employeeDiv = document.createElement('div');
      employeeDiv.className = 'employee';
      employeeDiv.innerHTML = `
        <div class="employee-image">
          <img src="${employee.image}" alt="${employee.name}" />
        </div>
        <div class="employee-info">
          <h3>${employee.fullName}</h3>
          <p class="description">${employee.blockText}</p>
          <button class="contact-button">Контакты</button>
        </div>
      `;
      employeeContainer.appendChild(employeeDiv);
    });

    updateContacts(false);

    const employeeSectionTitle = document.querySelector(".employee-section h2");
    if (employeeSectionTitle) {
      employeeSectionTitle.textContent = "Наши сотрудники";
    }

    const employeeSection = document.querySelector('.employee-section');
    employeeSection.classList.remove('night-mode');

    nightButton.disabled = false;
    dayButton.disabled = false;
  }, 2000);
}

document.addEventListener("DOMContentLoaded", function() {
  const nightButton = document.getElementById('nightButton');
  const dayButton = document.querySelector('.buttons button[onclick="setDayMode()"]');
  
  if (nightButton) nightButton.addEventListener('click', setNightMode);
  if (dayButton) dayButton.addEventListener('click', setDayMode);
});

function updateBasketCounter() {
  const basket = JSON.parse(localStorage.getItem('basket')) || [];
  const totalItems = basket.reduce((sum, item) => sum + item.quantity, 0);
  const basketLinks = document.querySelectorAll('nav ul li a[href="basket.html"]');
  
  basketLinks.forEach(link => {
    let counter = link.querySelector('.basket-counter');
    
    if (!counter) {
      counter = document.createElement('span');
      counter.className = 'basket-counter';
      link.appendChild(counter);
    }
    
    counter.textContent = totalItems;
    counter.style.display = totalItems > 0 ? 'inline-block' : 'none';
  });
}

function register() {
  const modal = document.getElementById("registrationModal");
  modal.style.display = "flex"; 
  setTimeout(() => {
    modal.classList.add("show"); 
    modal.querySelector('.modal-content').classList.add('show');
  }, 10);
}

function closeRegistrationModal() {
  const modal = document.getElementById("registrationModal");
  modal.classList.remove("show");
  modal.querySelector('.modal-content').classList.remove('show');
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

function login() {
  const modal = document.getElementById("loginModal");
  modal.style.display = "flex"; 
  setTimeout(() => {
    modal.classList.add("show"); 
    modal.querySelector('.modal-content').classList.add('show');
  }, 10);
}

function closeLoginModal() {
  const modal = document.getElementById("loginModal");
  modal.classList.remove("show"); 
  modal.querySelector('.modal-content').classList.remove('show');
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

document.getElementById("registrationForm")?.addEventListener("submit", function(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  alert(`Регистрация успешна!\nИмя пользователя: ${username}\nEmail: ${email}`);
  closeRegistrationModal();
});

document.getElementById("loginForm")?.addEventListener("submit", function(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  alert(`Вход выполнен!\nEmail: ${email}`);
  closeLoginModal();
});

let currentIndex = 0;

function moveCarousel(direction) {
  const carouselContainer = document.querySelector(".carousel-container");
  const items = document.querySelectorAll(".carousel-item");
  const totalItems = items.length;

  currentIndex += direction;

  if (currentIndex < 0) {
    currentIndex = totalItems - 1; 
  } else if (currentIndex >= totalItems) {
    currentIndex = 0; 
  }

  const offset = -currentIndex * 100; 
  carouselContainer.style.transform = `translateX(${offset}%)`;
}

function scrollToTopWithMode() {
  const isNightMode = document.body.classList.contains('night-mode');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (isNightMode) {
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white";

    const header = document.querySelector("header");
    header.style.backgroundColor = "#ff4444";
    header.style.color = "black";

    const navLinks = document.querySelectorAll("nav ul li a");
    navLinks.forEach(link => link.style.color = "black");

    const logo = document.querySelector(".logo img");
    logo.src = "pictures/nightImageLogo.png";
    logo.alt = "Ночной логотип Хижины чудес";
  } else {
    document.body.style.backgroundColor = "#d4b08c";
    document.body.style.color = "black";

    const header = document.querySelector("header");
    header.style.backgroundColor = "#2a2929";
    header.style.color = "white";

    const navLinks = document.querySelectorAll("nav ul li a");
    navLinks.forEach(link => link.style.color = "white");

    const logo = document.querySelector(".logo img");
    logo.src = "pictures/LoGo.png";
    logo.alt = "Логотип Хижины чудес";
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const logoLink = document.querySelector('.logo a');
  const homeLink = document.querySelector('nav ul li a[href="index.html"]');
  
  if (logoLink) {
    logoLink.addEventListener('click', function(e) {
      if (document.body.classList.contains('night-mode')) {
        e.preventDefault();
        scrollToTopNightMode();
      }
    });
  }
  
  if (homeLink) {
    homeLink.addEventListener('click', function(e) {
      if (document.body.classList.contains('night-mode')) {
        e.preventDefault();
        scrollToTopNightMode();
      }
    });
  }
});

function scrollToTopNightMode() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  
  document.body.classList.add('night-mode');
  
  const header = document.querySelector("header");
  header.style.backgroundColor = "#ff4444";
  header.style.color = "black";
  
  const navLinks = document.querySelectorAll("nav ul li a");
  navLinks.forEach(link => link.style.color = "black");
  
  const logo = document.querySelector(".logo img");
  logo.src = "pictures/nightImageLogo.png";
  logo.alt = "Ночной логотип Хижины чудес";
}

document.addEventListener('DOMContentLoaded', updateBasketCounter);
window.addEventListener('storage', function(e) {
  if (e.key === 'basket') {
    updateBasketCounter();
  }
});