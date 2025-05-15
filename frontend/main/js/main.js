
document.addEventListener('DOMContentLoaded', () => {
    loadCatalogs();
    // loadCatalogsFilter();
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
let cachedCatalogs = [];
window.addEventListener('DOMContentLoaded', async () => {
    await loadCatalogsFilter();
    await loadThreads();
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
            location.reload();
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

async function loadCatalogsFilter() {
    try {
        const response = await fetch('/api/catalogs');
        const catalogs = await response.json();

        cachedCatalogs = catalogs;

        const checkboxContainer = document.getElementById('catalog-checkboxes');
        checkboxContainer.innerHTML = '';

        catalogs.forEach(catalog => {
            const label = document.createElement('label');
            label.className = 'checkbox';

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.value = catalog.catalog_id;
            input.classList.add('catalog-checkbox');
            input.addEventListener('change', loadThreads);

            const custom = document.createElement('span');
            custom.className = 'custom';

            const nameSpan = document.createElement('span');
            nameSpan.className = 'checkbox-catalogs';
            nameSpan.textContent = catalog.name_catalog;

            label.appendChild(input);
            label.appendChild(custom);
            label.appendChild(nameSpan);
            checkboxContainer.appendChild(label);
        });
    } catch (error) {
    }
}
function getCatalogNameById(id) {
    const found = cachedCatalogs.find(c => c.catalog_id === Number(id));
    return found ? found.name_catalog : `Каталог ${id}`;
}

async function loadThreads() {
    try {
        const selectedCatalogs = Array.from(document.querySelectorAll('.catalog-checkbox:checked'))
            .map(cb => cb.value);

        let response;
        if (selectedCatalogs.length > 0) {
            const query = selectedCatalogs.join(',');
            response = await fetch(`/api/catalogs/threads/by-catalogs?catalogs=${query}`);
        } else {
            response = await fetch('/api/threads');
        }

        let threads = await response.json();
        threads.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

        const threadContainer = document.getElementById('thread-container');
        threadContainer.innerHTML = '';

        threads.slice(0, 3).forEach(thread => {
            const catalogName = getCatalogNameById(thread.catalog_id);
            const div = document.createElement('div');
            div.className = 'filter-group';
            div.innerHTML = `
            <div class="filter-header">
                <span class="filter-title">${thread.thread_name}</span>
                <a class="filter-catalog" href="in_catalog.html?category_id=${thread.catalog_id}">
                    ${catalogName}
                </a>
            </div>
            <div class="filter-box">
                <div class="filter-text thread-text-${thread.thread_id}" contenteditable="false"></div>
            </div>
        `;
            threadContainer.appendChild(div);
            const formattedText = sanitizeHTML(thread.thread_text);
            displayFormattedText(`.thread-text-${thread.thread_id}`, formattedText);
        });

    } catch (err) {
    }
}

function sanitizeHTML(text) {
    const textWithLineBreaks = text.replace(/\n/g, '<br>');
    const doc = new DOMParser().parseFromString(textWithLineBreaks, 'text/html');

    const allowedTags = [
        'b', 'i', 'u', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'blockquote',
        'sup', 'sub', 's', 'del', 'code', 'pre',
        'strike'
    ];

    const elements = doc.body.querySelectorAll('*');

    elements.forEach(el => {
        if (!allowedTags.includes(el.nodeName.toLowerCase())) {
            el.remove();
        }
    });

    return doc.body.innerHTML;
}
function displayFormattedText(containerSelector, formattedText) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    container.innerHTML = formattedText;
}