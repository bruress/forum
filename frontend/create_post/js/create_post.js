const urlParams = new URLSearchParams(window.location.search);
const catalogId = urlParams.get('category_id');
const catalogName = urlParams.get('category_name');
const user = JSON.parse(localStorage.getItem('user'));

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('.form');
    if (loginButton) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            loginButton.textContent = 'Выход';
            loginButton.addEventListener('click', () => {
                localStorage.removeItem('user');
                alert('Вы вышли из системы');
                window.location.href = 'create_post.html';
            });
        } 
        else {
            loginButton.textContent = 'Вход';
            loginButton.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
        }
    } 

    document.getElementById('bold-btn').addEventListener('click', () => formatText('bold'));
    document.getElementById('italic-btn').addEventListener('click', () => formatText('italic'));
    document.getElementById('underline-btn').addEventListener('click', () => formatText('underline'));
    document.getElementById('strike-btn').addEventListener('click', () => formatText('strikeThrough'));
    document.getElementById('superscript-btn').addEventListener('click', () => formatText('superscript'));
    document.getElementById('subscript-btn').addEventListener('click', () => formatText('subscript'));

    if (catalogName) {
        const matElement = document.querySelector('.mat');
        const predmetButton = document.querySelector('.predmet');
        const catalogTitle = document.querySelector('.catalog-title');

        if (matElement) matElement.textContent = catalogName;
        if (predmetButton) predmetButton.textContent = catalogName;
        if (catalogTitle) catalogTitle.textContent = catalogName;
        document.title = catalogName;
    } 
    else {
        console.error('Название категории не найдено в URL.');
    }

    if (catalogId) {
        loadCatalog(catalogId);
    } else {
        console.error('Каталог не указан в URL.');
    }
    const createPostButton = document.querySelector('.create-btn');
    if (createPostButton && catalogId && catalogName) {
        createPostButton.addEventListener('click', () => {
            const encodedName = encodeURIComponent(catalogName.trim());
            window.location.href = `create_post.html?category_id=${catalogId}&category_name=${encodedName}`;
        });
    }
    const submitButton = document.querySelector('.otpr');
    if (submitButton) {
        submitButton.addEventListener('click', submitThread);
    } 
    else {
        console.error('Кнопка отправки треда не найдена.');
    }

    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', function () {
            const categoryId = this.getAttribute('data-category');
            window.location.href = `/in_catalog?category_id=${categoryId}`;
        });
    });
});

async function submitThread(event) {
    event.preventDefault();
    const topicInput = document.querySelector('.tema');
    const textArea = document.querySelector('#text-input');
    const anonCheckbox = document.getElementById('anon-checkbox');
    const topic = topicInput?.value.trim();
    const threadText = textArea?.innerHTML.trim();
    const anonimState = anonCheckbox?.checked ? 1 : 0;

    if (!topic || !threadText) {
        alert('Пожалуйста, заполните все поля!');
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const threadData = {
        student_id: user.id,
        catalog_id: catalogId,
        thread_name: topic,
        thread_text: threadText,
        anonim_state: anonimState
    };
    try {
        const response = await fetch('/api/threads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(threadData)
        });

        const result = await response.json();
        if (response.ok) {
            alert('Тред успешно создан!');
            topicInput.value = '';
            textArea.innerHTML = '';
            anonCheckbox.checked = false;
            window.location.href = `in_catalog.html?category_id=${catalogId}`;
        } 
        else {
            alert('Ошибка при создании треда: ' + result.error);
        }
    } 
    catch (error) {
        console.error('Ошибка при отправке треда:', error);
        alert('Ошибка при отправке треда: ' + error.message);
    }
    
}


function formatText(command) {
    const textArea = document.getElementById('text-input');
    if (textArea) {
        document.execCommand(command, false, null);
    }
}

async function loadCatalog(catalogId) {
    try {
        const response = await fetch(`/api/catalogs/${catalogId}`);
        const catalog = await response.json();

        const titleElement = document.querySelector('.catalog-title');
        if (titleElement) titleElement.textContent = catalog.name_catalog;
        document.title = catalog.name_catalog;
    } catch (error) {
        console.error('Ошибка загрузки каталога:', error);
    }
}
