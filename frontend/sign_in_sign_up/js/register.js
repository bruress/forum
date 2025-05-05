document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const student_name = document.querySelector('#student_name').value;
    const login = document.querySelector('#login').value;
    const password = document.querySelector('#password').value;
    const invite_code = document.querySelector('#invite-code').value;

    try {
      const res = await fetch('http://localhost:5000/api/student/register-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invite_code, student_name, login, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Успешная регистрация');
        window.location.href = 'login.html'; 
      } 
      else {
        alert(data.error || 'Ошибка регистрации');
        window.location.href = 'error.html';
      }
    } 
    catch (err) {
      alert('Ошибка сервера');
      window.location.href = 'error.html';
    }
  });
});

