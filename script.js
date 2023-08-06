// script.js

// Esta função será usada para navegar pelos projetos
function navigateProjects(direction) {
    var projects = document.querySelectorAll('.projects ul li');
    var currentActive = document.querySelector('.projects ul li.active');
    var index = Array.prototype.indexOf.call(projects, currentActive);
  
    projects[index].classList.remove('active');
  
    if (direction === 'next') {
      var nextIndex = index + 1 === projects.length ? 0 : index + 1;
      projects[nextIndex].classList.add('active');
    } else {
      var prevIndex = index - 1 < 0 ? projects.length - 1 : index - 1;
      projects[prevIndex].classList.add('active');
    }
  }
  
  // Esta função será usada para alternar a visualização do CV
  function toggleCV() {
    var cvSection = document.querySelector('.cv');
    cvSection.style.display = cvSection.style.display === 'none' ? 'block' : 'none';
  }
  
  // Aqui você pode adicionar eventos de escuta para os botões de navegação dos projetos e a exibição do CV
  document.querySelector('#nextProjectButton').addEventListener('click', function() {
    navigateProjects('next');
  });
  
  document.querySelector('#prevProjectButton').addEventListener('click', function() {
    navigateProjects('prev');
  });
  
  document.querySelector('#toggleCVButton').addEventListener('click', toggleCV);
  