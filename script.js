// === OBSERVER FOR ANIMATIONS ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// === UI INTERACTIONS ===
function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
}

let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  document.getElementById('toastText').textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// === COURSE FILTERS ===
function filterLevel(btn, level) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.course-card').forEach(card => {
    if (level === 'all' || card.dataset.level === level) {
      card.style.display = '';
      card.style.opacity = '0';
      card.style.transform = 'translateY(10px)';
      setTimeout(() => {
        card.style.transition = 'all 0.4s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 50);
    } else {
      card.style.display = 'none';
    }
  });
}

function filterByLang(lang) {
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  event.currentTarget.classList.add('active');

  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.filter-btn').classList.add('active');

  document.querySelectorAll('.course-card').forEach(card => {
    if (card.dataset.lang === lang) {
      card.style.display = '';
      card.style.opacity = '0';
      card.style.transform = 'translateY(10px)';
      setTimeout(() => {
        card.style.transition = 'all 0.4s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 50);
    } else {
      card.style.display = 'none';
    }
  });
  document.getElementById('courses').scrollIntoView({ behavior: 'smooth' });
}

// === QUIZ LOGIC ===
let quizAnswered = false;
function checkAnswer(btn, correct) {
  if (quizAnswered) return;
  quizAnswered = true;
  const feedback = document.getElementById('quizFeedback');
  const options = document.querySelectorAll('.quiz-option');
  options.forEach(opt => {
    opt.style.pointerEvents = 'none';
    opt.style.opacity = '0.5';
  });
  if (correct) {
    btn.style.borderColor = '#10b981';
    btn.style.background = 'rgba(16,185,129,0.1)';
    btn.style.opacity = '1';
    btn.style.color = '#34d399';
    feedback.innerHTML = '<span class="text-emerald-400">✓ Правильно! «She is reading a book» — «Она читает книгу».</span>';
    feedback.classList.remove('hidden');
  } else {
    btn.style.borderColor = '#ef4444';
    btn.style.background = 'rgba(239,68,68,0.1)';
    btn.style.opacity = '1';
    btn.style.color = '#f87171';
    options[1].style.borderColor = '#10b981';
    options[1].style.background = 'rgba(16,185,129,0.1)';
    options[1].style.opacity = '1';
    options[1].style.color = '#34d399';
    feedback.innerHTML = '<span class="text-red-400">✗ Неверно. Правильный ответ: B — «Она читает книгу».</span>';
    feedback.classList.remove('hidden');
  }
  setTimeout(() => {
    quizAnswered = false;
    options.forEach(opt => {
      opt.style.pointerEvents = '';
      opt.style.opacity = '';
      opt.style.borderColor = '';
      opt.style.background = '';
      opt.style.color = '';
    });
    feedback.classList.add('hidden');
  }, 4000);
}

// === FAQ LOGIC ===
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-answer');
  const icon = item.querySelector('.faq-icon');
  const isOpen = answer.classList.contains('open');
  document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-icon').forEach(i => i.style.transform = '');
  if (!isOpen) {
    answer.classList.add('open');
    icon.style.transform = 'rotate(180deg)';
  }
}

// === CONTACT FORM ===
function handleSubmit(e) {
  e.preventDefault();
  showToast('Сообщение отправлено! Мы ответим в течение 24 часов.');
  e.target.reset();
}

// === SCROLL EFFECT FOR NAVBAR ===
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  const scroll = window.scrollY;
  if (scroll > 100) {
    nav.style.background = 'rgba(5,5,5,0.95)';
  } else {
    nav.style.background = 'rgba(5,5,5,0.8)';
  }
  lastScroll = scroll;
});

// === BACKEND LOGIC (LocalStorage Simulation) ===
const DB_KEY = 'techeduca_users';
const SESSION_KEY = 'techeduca_session';

function getUsers() {
  return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
}

function saveUser(user) {
  const users = getUsers();
  // Update if exists, else push
  const existingIndex = users.findIndex(u => u.email === user.email);
  if (existingIndex > -1) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(DB_KEY, JSON.stringify(users));
}

function findUser(email) {
  const users = getUsers();
  return users.find(u => u.email === email);
}

// === AUTH MODAL LOGIC ===
function openAuthModal(type) {
  document.getElementById('authModal').classList.add('open');
  switchAuthTab(type);
}

function closeAuthModal(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('authModal').classList.remove('open');
}

function switchAuthTab(type) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const subtitle = document.getElementById('authModalSubtitle');

  if (type === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    subtitle.textContent = 'Войдите, чтобы продолжить обучение';
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
    subtitle.textContent = 'Создайте аккаунт и начните учить';
  }
}

function handleRegister(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');

  if (findUser(email)) {
    showToast('Пользователь с таким email уже существует');
    return;
  }

  const newUser = { name, email, password, enrolledCourses: [] };
  saveUser(newUser);
  loginUser(newUser);
  showToast('Регистрация успешна! Добро пожаловать, ' + name);
  closeAuthModal({ target: document.getElementById('authModal'), currentTarget: document.getElementById('authModal') });
  e.target.reset();
}

function handleLogin(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const email = formData.get('email');
  const password = formData.get('password');

  const user = findUser(email);

  if (user && user.password === password) {
    loginUser(user);
    showToast('С возвращением, ' + user.name + '!');
    closeAuthModal({ target: document.getElementById('authModal'), currentTarget: document.getElementById('authModal') });
    e.target.reset();
  } else {
    showToast('Неверный email или пароль');
  }
}

function loginUser(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  updateAuthUI();
  // Auto open dashboard on login
  showDashboard(); 
}

function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
  updateAuthUI();
  showLanding();
  showToast('Вы вышли из аккаунта');
}

// === VIEW SWITCHING (LANDING <-> DASHBOARD) ===
function showDashboard() {
  document.getElementById('landingContent').classList.add('hidden');
  document.getElementById('mainFooter').classList.add('hidden');
  
  const dashboard = document.getElementById('dashboard');
  dashboard.classList.remove('hidden');
  
  // Hide Navbar links for landing
  document.getElementById('navLinkCourses').classList.add('hidden');
  document.getElementById('navLinkExercises').classList.add('hidden');
  document.getElementById('navLinkCommunity').classList.add('hidden');
  document.getElementById('navLinkResources').classList.add('hidden');
  document.getElementById('navLinkContact').classList.add('hidden');

  renderDashboard();
}

function showLanding() {
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('landingContent').classList.remove('hidden');
  document.getElementById('mainFooter').classList.remove('hidden');

  // Show Navbar links for landing
  document.getElementById('navLinkCourses').classList.remove('hidden');
  document.getElementById('navLinkExercises').classList.remove('hidden');
  document.getElementById('navLinkCommunity').classList.remove('hidden');
  document.getElementById('navLinkResources').classList.remove('hidden');
  document.getElementById('navLinkContact').classList.remove('hidden');
  
  window.scrollTo(0, 0);
}

// === DASHBOARD LOGIC ===
function switchDashTab(tabName) {
  // Update Sidebar Buttons
  document.querySelectorAll('.dash-tab').forEach(btn => btn.classList.remove('active'));
  // Since we don't have specific IDs for buttons, we use event target matching logic if passed, 
  // but here we can just find by onclick string or loop. Let's assume simple toggle for now based on context.
  // Better: pass 'this' in HTML.
}

// Helper for tab switching called from HTML onclick
window.switchDashTab = function(element) {
  document.querySelectorAll('.dash-tab').forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');

  document.querySelectorAll('.dash-content').forEach(content => content.classList.remove('active'));
  const tabId = 'dash-' + element.getAttribute('onclick').match(/'([^']+)'/)[1];
  document.getElementById(tabId).classList.add('active');
}

function renderDashboard() {
  const session = localStorage.getItem(SESSION_KEY);
  const user = session ? JSON.parse(session) : null;
  if (!user) return;

  // Profile Info
  document.getElementById('dashName').textContent = user.name;
  document.getElementById('dashAvatar').textContent = user.name.charAt(0).toUpperCase();
  document.getElementById('settingsName').value = user.name;
  document.getElementById('settingsEmail').value = user.email;

  // Render My Courses
  const grid = document.getElementById('myCoursesGrid');
  const emptyState = document.getElementById('dashEmptyState');
  const countBadge = document.getElementById('dashCourseCount');
  
  // Clear existing courses (keep empty state structure)
  Array.from(grid.children).forEach(child => {
    if (child.id !== 'dashEmptyState') grid.removeChild(child);
  });

  if (!user.enrolledCourses || user.enrolledCourses.length === 0) {
    emptyState.classList.remove('hidden');
    countBadge.textContent = "0";
  } else {
    emptyState.classList.add('hidden');
    countBadge.textContent = user.enrolledCourses.length;

    // Add course cards to dashboard
    user.enrolledCourses.forEach(courseId => {
      // Find course data from DOM (mock logic) or create a simplified card
      // For this demo, we'll create a card based on the ID stored
      const originalCard = document.querySelector(`.course-card[data-id="${courseId}"]`);
      if (originalCard) {
        const clone = originalCard.cloneNode(true);
        // Modify clone for dashboard (Remove 'More Info', add 'Continue')
        const btn = clone.querySelector('button');
        btn.innerHTML = 'Продолжить обучение <iconify-icon icon="lucide:arrow-right" width="12"></iconify-icon>';
        btn.onclick = () => showToast('Запуск урока...');
        btn.className = 'text-xs font-medium text-white bg-emerald-500/20 hover:bg-emerald-500/30 px-4 py-2 rounded-lg transition-colors';
        
        grid.appendChild(clone);
      }
    });
  }
}

function addCourseToUser(courseId) {
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return;
  
  const user = JSON.parse(session);
  if (!user.enrolledCourses.includes(courseId)) {
    user.enrolledCourses.push(courseId);
    saveUser(user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user)); // Update session
  }
}

// === AUTH UI UPDATES ===
function updateAuthUI() {
  const session = localStorage.getItem(SESSION_KEY);
  const user = session ? JSON.parse(session) : null;
  const navContainer = document.getElementById('navAuthContainer');

  if (user) {
    navContainer.innerHTML = `
      <button onclick="showDashboard()" class="text-sm font-medium text-white hover:text-emerald-400 px-4 py-2 rounded-lg border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex items-center gap-2">
        <iconify-icon icon="lucide:layout-dashboard" width="16"></iconify-icon> Личный кабинет
      </button>
      <button onclick="logoutUser()" class="text-sm font-medium text-slate-400 hover:text-red-400 px-4 py-2 rounded-lg transition-colors">
        Выйти
      </button>
      <button id="mobileToggle" class="md:hidden text-white p-2" onclick="toggleMobileMenu()">
        <iconify-icon icon="lucide:menu" width="22"></iconify-icon>
      </button>
    `;
    // Update mobile menu
    const mobileMenuContent = document.getElementById('mobileMenuContent');
    mobileMenuContent.innerHTML = `
      <a href="#" onclick="showDashboard();closeMobileMenu()" class="text-sm text-emerald-400 font-medium py-2 block">Личный кабинет</a>
      <button onclick="logoutUser();closeMobileMenu()" class="text-sm text-red-400 hover:text-red-300 py-2 block text-left w-full">Выйти</button>
    `;
  } else {
    navContainer.innerHTML = `
      <button id="navLoginBtn" class="hidden sm:block text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300">
        Войти
      </button>
      <button id="navRegisterBtn" class="hidden sm:block text-sm font-semibold text-black bg-white px-5 py-2 rounded-lg hover:bg-emerald-100 transition-all duration-200" style="box-shadow:0 0 20px -5px rgba(16,185,129,0.4)">
        Начать бесплатно
      </button>
      <button id="mobileToggle" class="md:hidden text-white p-2" onclick="toggleMobileMenu()">
        <iconify-icon icon="lucide:menu" width="22"></iconify-icon>
      </button>
    `;
    
    // Mobile Menu (Guest)
    const mobileMenuContent = document.getElementById('mobileMenuContent');
    mobileMenuContent.innerHTML = `
      <a href="#courses" onclick="closeMobileMenu()" class="text-sm text-slate-400 hover:text-white py-2">Курсы</a>
      <a href="#exercises" onclick="closeMobileMenu()" class="text-sm text-slate-400 hover:text-white py-2">Упражнения</a>
      <a href="#community" onclick="closeMobileMenu()" class="text-sm text-slate-400 hover:text-white py-2">Сообщество</a>
      <a href="#resources" onclick="closeMobileMenu()" class="text-sm text-slate-400 hover:text-white py-2">Ресурсы</a>
      <a href="#contact" onclick="closeMobileMenu()" class="text-sm text-slate-400 hover:text-white py-2">Контакты</a>
      <button id="mobileRegisterBtn" onclick="openAuthModal('register');closeMobileMenu()" class="text-sm font-semibold text-black bg-white px-5 py-2.5 rounded-lg mt-2">Начать бесплатно</button>
    `;
    
    document.getElementById('navLoginBtn').addEventListener('click', () => openAuthModal('login'));
    document.getElementById('navRegisterBtn').addEventListener('click', () => openAuthModal('register'));
  }
}

// Hijack initial buttons only if they exist
function hijackButtons() {
  const loginBtn = document.getElementById('navLoginBtn');
  const registerBtn = document.getElementById('navRegisterBtn');
  const mobileRegBtn = document.getElementById('mobileRegisterBtn');
  const heroCta = document.getElementById('heroCtaBtn');

  if (loginBtn) {
    loginBtn.setAttribute('onclick', ''); 
    loginBtn.addEventListener('click', (e) => { e.stopImmediatePropagation(); openAuthModal('login'); });
  }
  if (registerBtn) {
    registerBtn.setAttribute('onclick', '');
    registerBtn.addEventListener('click', (e) => { e.stopImmediatePropagation(); openAuthModal('register'); });
  }
  if (mobileRegBtn) {
    mobileRegBtn.setAttribute('onclick', '');
    mobileRegBtn.addEventListener('click', (e) => { e.stopImmediatePropagation(); openAuthModal('register'); closeMobileMenu(); });
  }
  if (heroCta) {
    heroCta.setAttribute('onclick', '');
    heroCta.addEventListener('click', (e) => { e.stopImmediatePropagation(); openAuthModal('register'); });
  }
}

// === COURSE MODAL LOGIC ===
function openCourseDetails(btn) {
  const card = btn.closest('.course-card');
  // If in dashboard, we might need different logic, but for now same
  if (!card) return;

  const icon = card.querySelector('.text-3xl').innerText;
  const title = card.querySelector('h3').innerText;
  const level = card.querySelector('[class*="uppercase"]').innerText;
  const desc = card.querySelector('p').innerText;
  const courseId = card.dataset.id;
  
  const metaContainer = card.querySelectorAll('.text-slate-500 span');
  const timeMeta = metaContainer[0].innerText;
  const typeMeta = metaContainer[1].innerText;

  document.getElementById('modalCourseIcon').innerText = icon;
  document.getElementById('modalCourseTitle').innerText = title;
  document.getElementById('modalCourseLevel').innerText = level;
  document.getElementById('modalCourseDesc').innerText = desc;
  document.getElementById('modalCourseMeta1').innerHTML = `<iconify-icon icon="lucide:clock" width="13"></iconify-icon> ${timeMeta}`;
  document.getElementById('modalCourseMeta2').innerHTML = `<iconify-icon icon="lucide:video" width="13"></iconify-icon> ${typeMeta}`;

  // Store current course ID for enrollment
  document.getElementById('courseModal').setAttribute('data-course-id', courseId);

  document.getElementById('courseModal').classList.add('open');
}

function closeCourseModal(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('courseModal').classList.remove('open');
}

function handleCourseEnroll() {
  const session = localStorage.getItem(SESSION_KEY);
  const user = session ? JSON.parse(session) : null;
  const courseTitle = document.getElementById('modalCourseTitle').innerText;
  const courseId = document.getElementById('courseModal').getAttribute('data-course-id');

  if (user) {
    addCourseToUser(courseId);
    closeCourseModal({ target: document.getElementById('courseModal'), currentTarget: document.getElementById('courseModal') });
    showToast(`Вы успешно записались на курс "${courseTitle}"!`);
    // If we are on landing page, maybe go to dashboard? Or stay.
    // Let's stay but update UI
  } else {
    closeCourseModal({ target: document.getElementById('courseModal'), currentTarget: document.getElementById('courseModal') });
    setTimeout(() => {
      openAuthModal('login');
    }, 300);
  }
}

// === BLOG MODAL LOGIC ===
const blogArticles = {
  'tips': {
    title: '7 техник запоминания слов, которые реально работают',
    date: '15 Окт 2025',
    readTime: '12 мин',
    image: 'https://picsum.photos/seed/blog-lang-tips/700/300.jpg',
    content: `<p class="mb-4">Запоминание новых слов часто становится самым сложным этапом...</p>`
  },
  'culture': {
    title: 'Почему важно изучать культуру вместе с языком',
    date: '10 Окт 2025',
    readTime: '8 мин',
    image: 'https://picsum.photos/seed/blog-culture/700/300.jpg',
    content: `<p class="mb-4">Язык не существует в вакууме...</p>`
  },
  'apps': {
    title: 'Топ-10 приложений-компаньонов для изучения языков',
    date: '05 Окт 2025',
    readTime: '15 мин',
    image: 'https://picsum.photos/seed/blog-apps/700/300.jpg',
    content: `<p class="mb-4">В эпоху смартфонов обучение стало доступнее...</p>`
  }
};

function openBlog(id) {
  const article = blogArticles[id];
  if(!article) return;
  document.getElementById('blogModalTitle').textContent = article.title;
  document.getElementById('blogModalDate').textContent = article.date;
  document.getElementById('blogModalReadTime').textContent = article.readTime;
  document.getElementById('blogModalImg').src = article.image;
  document.getElementById('blogModalBody').innerHTML = article.content;
  document.getElementById('blogModal').classList.add('open');
}

function closeBlogModal(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('blogModal').classList.remove('open');
}

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  hijackButtons();
  updateAuthUI();
});