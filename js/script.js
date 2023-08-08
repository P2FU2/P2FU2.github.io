document.addEventListener("DOMContentLoaded", function() {
  const projectLinks = document.querySelectorAll('.project-list a');

  projectLinks.forEach(link => {
      link.addEventListener('click', function(event) {
          // Remove a classe 'active' de qualquer outro link
          projectLinks.forEach(innerLink => innerLink.classList.remove('active'));

          // Adiciona a classe 'active' ao link clicado
          link.classList.add('active');

          // Opcional: para evitar que o link realmente navegue (se for o caso)
          event.preventDefault();
      });
  });
});

//teste