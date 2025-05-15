const urlParams = new URLSearchParams(window.location.search);
const threadId = urlParams.get('thread_id');
const catalogId = urlParams.get('catalog_id');
const authorName = decodeURIComponent(urlParams.get('author_name') || 'Анонимный пользователь');
const threadText = decodeURIComponent(urlParams.get('thread_text'));
const threadDate = decodeURIComponent(urlParams.get('thread_date'));
const authorGroup = decodeURIComponent(urlParams.get('author_group') || 'Скрыто');
const anonimState = urlParams.get('anonim_state');
const user = JSON.parse(localStorage.getItem('user'));

async function isModerator() {
    if (user && user.id) {
        const studentId = user.id;
        try {
            const response = await fetch(`/api/moderation/moderators/${studentId}`);
            if (!response.ok) {
                throw new Error('Ошибка при проверке модератора');
            }
            const result = await response.json();
            return result.moderator != null;
        }  
        catch (error) {
            return false;
        }
    } 
    else {
        return false;
    }
}


function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', options);
}

document.addEventListener('click', async (event) => {
    if (event.target.closest('.delete-btn')) {
        const threadId = urlParams.get('thread_id');
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('Вы не авторизованы.');
            return;
        }
        const isModeratorUser = await isModerator();
        if (!isModeratorUser) {
            alert('Вы не имеете прав для удаления этого поста.');
            return;
        }
        if (confirm('Удалить этот тред?')) {
            try {
                const response = await fetch(`/api/threads/${threadId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        student_id: user.id,
                        thread_id: threadId,
                    }),
                });
                if (!response.ok) {
                    throw new Error('Ошибка при удалении треда');
                }
                alert('Тред удален!');
                window.location.href = `/in_catalog.html?category_id=${catalogId}`
            } 
            catch (error) {
            }
        }
    }
});


document.addEventListener('DOMContentLoaded', () => {
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
        window.location.href = 'error.html';
    }

    const catalogTitleElement = document.querySelector('.catalog-title'); // название ттреда
    const threadTextElement = document.getElementById('thread-text'); // текст треда
    const threadAuthorNameElement = document.getElementById('thread-author-name'); // автор треда
    const answersContainer = document.getElementById('add-answer-text');
    const textInput = document.getElementById('add-answer-text');
    const anonimToggle = document.getElementById('anon-checkbox');  // чекбокс анонимности
    const threadDateElement = document.getElementById('thread-date');
    const threadAuthorGroupElement = document.getElementById('thread-author-group');
    const studentId = user?.id || null;
    if (threadAuthorNameElement) threadAuthorNameElement.textContent = authorName;
    if (threadTextElement) threadTextElement.innerHTML = sanitizeHTML(threadText);
    if (threadDateElement) threadDateElement.textContent = formatDate(threadDate);
    if (threadAuthorGroupElement) {
        threadAuthorGroupElement.textContent = `${authorGroup}`;
    }

    async function loadThreadTitle() {
        try {
            const response = await fetch(`/api/threads/${threadId}`);
            const thread = await response.json();
            if (catalogTitleElement) {
                catalogTitleElement.textContent = thread.thread_name;
            }
        } 
        catch (error) {
        }
    }

    async function sendAnswer() {
        const answerText = textInput.innerHTML.trim();
        const anonimStateAnswer = anonimToggle?.checked ? 1 : 0;
        if (!answerText) {
            alert('Ответ не может быть пустым!');
            return;
        }
        if (!studentId) {
            alert('Не удалось получить данные о пользователе. Пожалуйста, войдите в систему.');
            return;
        }
        const payload = {
            thread_id: threadId,
            student_id: studentId,
            answer_text: answerText,
            anonim_state: anonimStateAnswer,
        };
        try {
            const response = await fetch('/api/answers/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                const data = await response.json();
                alert('Ответ успешно отправлен!');
                textInput.innerHTML = '';
                window.location.reload();
                const answersContainer = document.getElementById('answers-container');
                const isAnon = data.anonim_state === 1;
                const authorName = isAnon ? 'Анонимный пользователь' : sanitizeHTML(data.student_name);
                const groupName = isAnon ? 'Скрыто' : (data.group_name || 'Скрыто');
                const postDate = formatDate(data.created_date);
                const answerElement = document.createElement('div');
                answerElement.classList.add('answer');
                answerElement.innerHTML = `
                
                    <div class="answer-header">
                        <div class="author-info">
                            <a href="#" class="author-name-answer" id="answer-author-name">${authorName}</a>
                            <div class="group" id="answer-author-group">${groupName}</div>
                        </div>
                        <div class="post-date" id="answer-date">${postDate}</div>
                    </div>
                `;
                answersContainer.appendChild(answerElement);
            } 
            else {
                const errorData = await response.json();
                alert(errorData.error || 'Ошибка при отправке ответа');
            }
        } 
        catch (error) {
        }
    }

    document.addEventListener('click', async (event) => {  // удаление ответа
        if (event.target.closest('.delete-btn-answer')) {
            const button = event.target.closest('.delete-btn-answer');
            const answerId = button.closest('.answer').getAttribute('data-answer-id');
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                alert('Вы не авторизованы.');
                return;
            }
            const isModeratorUser = await isModerator();
            if (!isModeratorUser) {
                alert('Вы не имеете прав для удаления этого ответа.');
                return;
            }
            if (confirm('Удалить этот ответ?')) {
                try {
                    const response = await fetch(`/api/answers/id/${answerId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            student_id: user.id,
                            answer_id: Number(answerId)
                        }),
                    });
                    if (!response.ok) {
                        throw new Error('Ошибка при удалении ответа');
                    }
                    alert('Ответ удален!');
                    window.location.reload();
                } 
                catch (error) {
                }
            }
        }
    });
    
    function logThreadText() {
        const urlParams = new URLSearchParams(window.location.search);
        const threadText = decodeURIComponent(urlParams.get('thread_text')); 
        if (threadText) {
            console.log('threadText:', threadText); 
            const threadTextElement = document.getElementById('thread-text');
            if (threadTextElement) {
                threadTextElement.innerHTML = threadText;
            }
        } else {
            console.error('threadText не найден в URL параметрах');
        }
    }

    async function loadAnswers() {
        const answersContainer = document.getElementById('answers-container');
        if (!answersContainer) {
            return;
        }
        if (typeof threadId === 'undefined') {
            return;
        }
        try {
            const response = await fetch(`/api/answers/thread/${threadId}`);
            if (!response.ok) throw new Error('Ошибка при загрузке ответов');
            const answers = await response.json();
            if (!Array.isArray(answers)) {
                return;
            }
            answersContainer.innerHTML = '';
            if (answers.length === 0) {
                return; 
            }
            for (const answer of answers) {
                const authorName = answer.anonim_state=== 1 ? 'Анонимный пользователь' : answer.author_name;
                const groupName = (answer.anonim_state===1 || !answer.group_name) 
                    ? 'Скрыто' 
                    : answer.group_name;
                const postText = sanitizeHTML(answer.answer_text);
                const postDate = formatDate(answer.created_date);
                const answerElement = document.createElement('div');
                answerElement.classList.add('answer');
                answerElement.dataset.answerId = answer.answer_id;
                answerElement.innerHTML = `
                    <div class="answer-header">
                        <div class="author-info">
                            <a href="#" class="author-name-answer">${authorName}</a>
                            <div class="group" id="answer-author-group">${groupName}</div>
                        </div>
                        <div class="post-date">${postDate}</div>
                    </div>
                    <div class="textarea-wrapper">
                        <div class="text-wrapper">
                            <div class="post-text">
                                <div class="post-text-content-answer">${postText}</div>
                            </div>
                        </div>
                        <div class="answer-panel">
                            <button class="delete-btn-answer" id="answer-author-name">
                                <img src="img/delete.svg" alt="Удалить" class="delete-icon" />
                            </button>
                        </div>
                    </div>
                                        
                    <div class="reply-btn-wrapper">
                        <div class="reactions">
                        <button class="like-button">
                            <img src="img/like.svg" alt="Like" />
                        </button>
                        <span class='like-count'>0</span>

                        <button class="dislike-button">
                            <img src="img/dislike.svg" alt="Dislike" />
                        </button>
                        <span class='dislike-count'>0</span>
                        </div>
                    </div>
                    `;
                    answersContainer.appendChild(answerElement);
                    await updateReactionCount(answer.answer_id);
            }
        } 
        catch (error) {
        }
    }
    
    loadThreadTitle();
    logThreadText();
    loadAnswers();
    document.addEventListener('click', (event) => {
        if (event.target.closest('.reply-btn')) {
            sendAnswer();
        }
    });
    
});

function sanitizeHTML(text) {
    const textWithLineBreaks = text.replace(/\n/g, '<br>');
    const doc = new DOMParser().parseFromString(textWithLineBreaks, 'text/html');
    const allowedTags = ['b', 'i', 'u', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'blockquote'];
    const elements = doc.body.querySelectorAll('*');
    elements.forEach(el => {
        if (!allowedTags.includes(el.nodeName.toLowerCase())) {
            el.remove();
        }
    });
    return doc.body.innerHTML;
}
document.addEventListener('click', async (event) => {
    if (event.target.closest('.like-button') || event.target.closest('.dislike-button')) {
        const answerElement = event.target.closest('.answer');
        const answerId = answerElement.dataset.answerId;
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user) {
            alert('Вы не авторизованы.');
            return;
        }

        const isLikeButton = event.target.closest('.like-button');
        const reactionType = isLikeButton ? 'like' : 'dislike';

        try {
            const response = await fetch('/api/reactions/answer-reactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    student_id: user.id,
                    answer_id: answerId,
                    type_reaction: reactionType,
                }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при установке реакции на ответ');
            }
            await updateReactionCount(answerId);
        } catch (error) {
            alert('Ошибка при установке реакции');
        }
    }
});

async function updateReactionCount(answerId) {
    try {
        const response = await fetch(`/api/reactions/answer-reactions/count/${answerId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        const answerElements = document.querySelectorAll(`.answer[data-answer-id="${answerId}"]`);
        
        answerElements.forEach(answerElement => {
            const likeCountElement = answerElement.querySelector('.like-count');
            const dislikeCountElement = answerElement.querySelector('.dislike-count');
            
            if (likeCountElement) {
                likeCountElement.textContent = data.like ?? 0;
                likeCountElement.classList.add('updated');
                setTimeout(() => likeCountElement.classList.remove('updated'), 300);
            }
            
            if (dislikeCountElement) {
                dislikeCountElement.textContent = data.dislike ?? 0;
                dislikeCountElement.classList.add('updated');
                setTimeout(() => dislikeCountElement.classList.remove('updated'), 300);
            }
        });
    } catch (error) {
    }
}