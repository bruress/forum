document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const login = document.querySelector('#login').value;
    const password = document.querySelector('#password').value;

    try {
      const res = await fetch('http://localhost:5000/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.student));
        alert(`Добро пожаловать, ${data.student.name}`);
        
        window.location.href = 'main.html';
      } 
      else {
        alert(data.error || 'Ошибка входа');

      }
    } catch (err) {
      alert('Ошибка сервера');

  
    }
  });
});
