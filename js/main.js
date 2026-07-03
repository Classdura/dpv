document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================================
    // 1. ИНИЦИАЛИЗАЦИЯ AOS (Анимация элементов при скролле)
    // =========================================================================
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // =========================================================================
    // 2. УПРАВЛЕНИЕ ПРЕЛОАДЕРОМ
    // =========================================================================
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.classList.add('hide');
    });

    // =========================================================================
    // 3. МОБИЛЬНОЕ БУРГЕР-МЕНЮ
    // =========================================================================
    const burger = document.getElementById('burger');
    const navMenu = document.querySelector('.nav-menu');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Закрываем меню при клике на любую ссылку
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        burger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // =========================================================================
    // 4. КНОПКА «НАВЕРХ»
    // =========================================================================
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // =========================================================================
    // 5. ТАБЫ В ГАЛЕРЕЕ ПОРТФОЛИО
    // =========================================================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const cards = document.querySelectorAll('.gallery-card');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-tab');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                // Логика фильтрации категорий
                if (filter === 'all' || category === filter || (filter === 'print' && (category === 'print' || category === 'schemas'))) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
            // Пересчитываем позиции AOS для оставшихся карточек
            AOS.refresh();
        });
    });

    // =========================================================================
    // 6. РАСКРЫВАЮЩИЕСЯ СЕКЦИИ FAQ (Спойлеры)
    // =========================================================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // =========================================================================
    // 7. АНИМИРОВАННЫЙ ФОН: ЛЕТАЮЩИЕ ИКОСАЭДРЫ (THREE.JS)
    // =========================================================================
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Группа-контейнер для всех будущих икосаэдров
    const icosaGroup = new THREE.Group();
    scene.add(icosaGroup);

    // Геометрия (0 — значит жесткие flat-грани без сглаживания) и wireframe-материал
    const icoGeometry = new THREE.IcosahedronGeometry(0.1, 0); 
    const icoMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.15 // Ненавязчивый, полупрозрачный футуристичный вид
    });

    const icosCount = 120; // Оптимальное количество для производительности

    // Спавним икосаэдры в случайных точках пространства
    for (let i = 0; i < icosCount; i++) {
        const mesh = new THREE.Mesh(icoGeometry, icoMaterial);

        // Разбрасываем хаотично по осям X, Y, Z
        mesh.position.x = (Math.random() - 0.5) * 10;
        mesh.position.y = (Math.random() - 0.5) * 10;
        mesh.position.z = (Math.random() - 0.5) * 10;

        // Рандомный начальный угол поворота
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;

        // Рандомный размер (от 0.5 до 1.5 от базового)
        const scale = Math.random() * 1.0 + 0.5;
        mesh.scale.set(scale, scale, scale);

        // Добавляем готовый объект в нашу группу
        icosaGroup.add(mesh);
    }

    camera.position.z = 3;

    // Цикл непрерывной анимации (Рендеринг)
    function animate() {
        requestAnimationFrame(animate);

        // Медленное общее вращение всей сцены фона
        icosaGroup.rotation.y += 0.0003;

        // Индивидуальное хаотичное вращение каждого отдельного икосаэдра
        icosaGroup.children.forEach((ico, index) => {
            // Используем индекс, чтобы скорость вращения у всех слегка отличалась
            const speedModifier = (index % 3 + 1) * 0.001;
            ico.rotation.x += speedModifier;
            ico.rotation.y += speedModifier * 1.5;
        });

        renderer.render(scene, camera);
    }
    animate();

    // Адаптивность под изменение размеров экрана
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});