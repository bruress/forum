document.addEventListener('DOMContentLoaded', () => {
    loadCatalogs();
    const submitButton = document.querySelector('.submit-btn');
    if (submitButton) {
        submitButton.addEventListener('click', submitThread);
    } 
    else {
        console.error('Кнопка отправки треда не найдена.');
    }
    const loginButton = document.querySelector('.form');
    if (loginButton) {
        const userData = localStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : null;
        if (user) {
            loginButton.textContent = 'Выход';
            loginButton.addEventListener('click', () => {
                localStorage.removeItem('user');
                alert('Вы вышли из системы');
                window.location.href = 'main.html'; 
            });
        } 
        else {
            loginButton.textContent = 'Вход';
            loginButton.addEventListener('click', () => {
                window.location.href = 'login.html'; 
            });
        }
    } 
    else {
        console.error('Кнопка входа/выхода не найдена.');
        window.location.href = 'error.html';
    }
    
    document.getElementById('bold-btn').addEventListener('click', () => formatText('bold'));
    document.getElementById('italic-btn').addEventListener('click', () => formatText('italic'));
    document.getElementById('underline-btn').addEventListener('click', () => formatText('underline'));
    document.getElementById('strike-btn').addEventListener('click', () => formatText('strikeThrough'));
    document.getElementById('superscript-btn').addEventListener('click', () => formatText('superscript'));
    document.getElementById('subscript-btn').addEventListener('click', () => formatText('subscript'));

    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-category');
            window.location.href = `/in_catalog.html?category_id=${categoryId}`;
        });
    });
});

async function loadCatalogs() {
    try {
        const response = await fetch('/api/catalogs');
        const catalogs = await response.json();
        const catalogSelect = document.querySelector('#catalog-select');
        catalogs.forEach(catalog => {
            const option = document.createElement('option');
            option.textContent = catalog.name_catalog;
            option.value = catalog.catalog_id;
            catalogSelect.appendChild(option);
        });
    } 
    catch (error) {
        window.location.href = 'error.html';
    }
}

async function submitThread(event) {
    event.preventDefault();
    const topicInput = document.querySelector('#topic-input');
    const catalogSelect = document.querySelector('#catalog-select');
    const textArea = document.querySelector('#text-input');
    const anonymityCheckbox = document.querySelector('#anon-checkbox');
    const topic = topicInput.value;
    const catalogId = catalogSelect.value;
    const threadText = textArea.innerHTML;
    const anonimState = anonymityCheckbox.checked ? 1 : 0;
    const user = JSON.parse(localStorage.getItem('user'));
    const studentId = user ? user.id : null;
    if (!studentId) {
        alert('Вы не авторизованы! Пожалуйста, войдите в систему.');
        return;
    }
    if (!topic || !catalogId || !threadText) {
        alert('Пожалуйста, заполните все поля!');
        return;
    }
    const threadData = {
        student_id: studentId,
        catalog_id: catalogId,
        thread_name: topic,
        thread_text: threadText,
        anonim_state: anonimState
    };
    try {
        const response = await fetch('/api/threads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(threadData)
        });
        const result = await response.json();
        if (response.ok) {
            alert('Тред успешно создан!');
            topicInput.value = '';
            textArea.innerHTML = '';
            catalogSelect.value = '';
            anonymityCheckbox.checked = false;
        } 
        else {
            alert('Ошибка при создании треда: ' + result.error);
            window.location.href = 'error.html';
        }
    } 
    catch (error) {
        console.error('Ошибка при отправке треда:', error);
        alert('Ошибка при отправке треда!');
        window.location.href = 'error.html';
    }
}
function formatText(command) {
    const textArea = document.getElementById('text-input');
    if (textArea) {
        document.execCommand(command, false, null);
    }
}
