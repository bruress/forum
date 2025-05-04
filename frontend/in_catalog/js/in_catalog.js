
document.addEventListener('DOMContentLoaded', () => {
    const createPostButton = document.querySelector('.create-btn');
    const catalogTitle = document.querySelector('.catalog-title');
    const urlParams = new URLSearchParams(window.location.search);
    const catalogId = urlParams.get('category_id');

    if (catalogId) {
        loadCatalog(catalogId);
        loadThreads(catalogId);
    } 
    else {
        console.error('Каталог не указан в URL.');
    }

    if (createPostButton) {
        createPostButton.addEventListener('click', () => {
            if (catalogId && catalogTitle) {
                const categoryName = encodeURIComponent(catalogTitle.textContent.trim());
                window.location.href = `create_post.html?category_id=${catalogId}&category_name=${categoryName}`;
            } 
        });
    }

    const loginButton = document.querySelector('.form');
    if (loginButton) {
        const user = JSON.parse(localStorage.getItem('user'));
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
    }
});

async function isModerator() {
    const user = JSON.parse(localStorage.getItem('user')); 
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

async function loadCatalog(catalogId) {
    try {
        const response = await fetch(`/api/catalogs/${catalogId}`);
        const catalog = await response.json();
        const titleElement = document.querySelector('.catalog-title');
        titleElement.textContent = catalog.name_catalog;
        document.title = catalog.name_catalog;
    } 
    catch (error) {
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', options);
}

function updateReactions(threadId, reactionType, action) {
    const userData = JSON.parse(localStorage.getItem('user')); 
    if (!userData || !userData.id) {
        return;
    }
    const userId = userData.id; 
    fetch('http://localhost:5000/api/reactions/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            student_id: userId,
            thread_id: threadId,
            type_reaction: reactionType,
            action: action
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Ошибка при обновлении реакции: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        location.reload();
    })
}

function handleLikeDislikeButtonClick(event, reactionType) {
    const threadId = event.target.closest('.like-button')?.getAttribute('data-thread-id') ||
                     event.target.closest('.dislike-button')?.getAttribute('data-thread-id');
    if (!threadId) return;
    const button = event.target;
    const oppositeReactionType = reactionType === 'like' ? 'dislike' : 'like';
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.id) {
      return;
    }
    const userReaction = button.classList.contains('active');
    if (userReaction) {
        updateReactions(threadId, reactionType, 'remove');
        button.classList.remove('active');
    } 
    else {
        updateReactions(threadId, reactionType, 'add');
        button.classList.add('active');
        const oppositeButton = document.querySelector(`.${oppositeReactionType}-button[data-thread-id="${threadId}"]`);
        if (oppositeButton && oppositeButton.classList.contains('active')) {
            updateReactions(threadId, oppositeReactionType, 'remove');
            oppositeButton.classList.remove('active');
        }
    }
}

async function loadThreads(catalogId) {
    try {
        if (!catalogId) {
            return;
        }
        const url = `/api/threads/by_catalog/${catalogId}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Ошибка загрузки тредов: ${response.statusText} (${response.status})`);
        }
        const result = await response.json();
        const postsContainer = document.querySelector('.posts-container');
        postsContainer.innerHTML = ''; 
        for (const thread of result) {
            const threadText = thread.thread_text?.trim();
            if (!threadText) return;

            const isAnonymous = thread.anonim_state === 1;
            const authorName = isAnonymous
                ? 'Анонимный пользователь'
                : (thread.student_name && thread.student_name.trim() !== '' ? thread.student_name : 'Неизвестный');
            const groupName = isAnonymous
                ? 'Скрыто' 
                : (thread.group_name && thread.group_name.trim() !== '' ? thread.group_name : 'Не указана');
            const reactionResponse = await fetch(`/api/reactions/thread-reactions/count/${thread.thread_id}`);
            const reactionCount = await reactionResponse.json();
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <div class="post-header">
                    <div class="author-info">
                        <a href="#" class="author-name">${authorName}</a>
                        ${groupName ? `<div class="group">${groupName}</div>` : ''}
                    </div>
                    <div class="post-date">${formatDate(thread.created_date)}</div>
                </div>
                <div class="containter_question">
                    <div class="textarea-wrapper">
                        <div class="text-wrapper">
                            <div class="thread_name">${thread.thread_name || 'Без названия'}</div>
                            <div class="post-text">
                                <div class="post-text-content" contenteditable="false">${threadText}</div>
                            </div>
                        </div>
                        <div class="answer-panel">
                            <button class="answer-counter"
                                data-thread-id="${thread.thread_id}"
                                data-author-name="${authorName}"
                                data-thread-text="${encodeURIComponent(threadText)}"
                                data-thread-title="${encodeURIComponent(thread.thread_title || '')}"
                                data-thread-date="${thread.created_date}" 
                                data-author-group="${groupName}"
                                data-anonim-state="${thread.anonim_state}">
                                <img src="../img/comm.svg" alt="Ответы" class="answer-icon">
                            </button>
                            <button class="delete-btn" data-thread-id="${thread.thread_id}">
                                <img src="../img/delete.svg" alt="Удалить" class="delete-icon">
                            </button>
                        </div>
                    </div>
                    <div class="reply-btn-wrapper">
                        <div class="reactions">
                            <button class="like-button" data-thread-id="${thread.thread_id}">
                                <img src="img/like.svg" alt="Like" />
                            </button>
                            <span class='react' id="like-count-${thread.thread_id}">${reactionCount.like}</span>

                            <button class="dislike-button" data-thread-id="${thread.thread_id}">
                                <img src="img/dislike.svg" alt="Dislike" />
                            </button>
                            <span class='react' id="dislike-count-${thread.thread_id}">${reactionCount.dislike}</span>

                        </div>
                        <button class="reply-btn"
                                data-thread-id="${thread.thread_id}"
                                data-author-name="${authorName}"
                                data-thread-text="${encodeURIComponent(threadText)}"
                                data-thread-title="${encodeURIComponent(thread.thread_title || '')}"
                                data-thread-date="${thread.created_date}" 
                                data-author-group="${groupName}"
                                data-anonim-state="${thread.anonim_state}">
                            Ответить
                        </button>
                    </div>
                </div>
            `;
            postsContainer.appendChild(postElement);
            document.querySelector(`.like-button[data-thread-id="${thread.thread_id}"]`).addEventListener('click', (event) => handleLikeDislikeButtonClick(event, 'like'));
            document.querySelector(`.dislike-button[data-thread-id="${thread.thread_id}"]`).addEventListener('click', (event) => handleLikeDislikeButtonClick(event, 'dislike'));
        }
        document.querySelectorAll('.reply-btn, .answer-counter').forEach(button => {
            button.addEventListener('click', () => {
                const threadId = button.getAttribute('data-thread-id');
                const authorName = button.getAttribute('data-author-name');
                const threadText = decodeURIComponent(button.getAttribute('data-thread-text'));
                const threadTitle = decodeURIComponent(button.getAttribute('data-thread-title'));
                const threadDate = button.getAttribute('data-thread-date');
                const authorGroup = button.getAttribute('data-author-group');
                const anonimState = button.getAttribute('data-anonim-state');
                const urlParams = new URLSearchParams(window.location.search);
                const catalogId = urlParams.get('category_id');
                const catalogTitle = document.querySelector('.catalog-title')?.textContent || 'Каталог';
                window.location.href = `add_answer.html?` +
                `thread_id=${threadId || ''}` +
                `&catalog_id=${catalogId || ''}` +
                `&catalog_title=${encodeURIComponent(catalogTitle || '')}` +
                `&author_name=${encodeURIComponent(authorName || 'Неизвестен')}` +
                `&thread_text=${encodeURIComponent(threadText || '')}` +
                `&thread_title=${encodeURIComponent(threadTitle || '')}` +
                `&thread_date=${encodeURIComponent(threadDate || '')}` +
                `&author_group=${encodeURIComponent(authorGroup || 'Неизвестно')}` +
                `&anonim_state=${anonimState || 0}`; 
            });
});

document.querySelectorAll('.delete-btn').forEach(button => { // удаление
    button.addEventListener('click', async () => {
        const threadId = button.getAttribute('data-thread-id');
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
        if (confirm('Удалить этот пост?')) {
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
                loadThreads(catalogId);
                location.reload()
            } 
            catch (error) {
            }
        }
    });
});
} 
catch (error) {
    }
}
