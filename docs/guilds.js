// Script pour générer dynamiquement les miniatures de logo pour chaque guild
window.addEventListener('DOMContentLoaded', () => {
  const guilds = [
    '1071095803302641674',
    '618763592115683341'
  ];
  const logoSrc = 'logo-DeepCharacter.svg';
  const miniSize = 40; // 120/3 = 40px
  const nbMini = guilds.length;
  const body = document.body;

  guilds.forEach((guild, idx) => {
    const img = document.createElement('img');
    img.src = logoSrc;
    img.alt = `Logo Deep-Character - Guild ${guild}`;
    img.className = 'mini-logo-guild';
    img.style.width = miniSize + 'px';
    img.style.height = miniSize + 'px';
    img.style.position = 'fixed';
    img.style.left = Math.random() * (window.innerWidth - miniSize) + 'px';
    img.style.top = Math.random() * (window.innerHeight - miniSize) + 'px';
    img.style.zIndex = 10;
    img.dataset.angle = Math.random() * 360;
    img.dataset.speed = 0.1 + Math.random() * 0.15;
    body.appendChild(img);
  });

  function animate() {
    document.querySelectorAll('.mini-logo-guild').forEach(img => {
      let angle = parseFloat(img.dataset.angle);
      let speed = parseFloat(img.dataset.speed);
      angle += speed;
      const radius = 30 + Math.random() * 40;
      const centerX = parseFloat(img.style.left) + miniSize/2;
      const centerY = parseFloat(img.style.top) + miniSize/2;
      img.style.left = (centerX + Math.cos(angle/30) * radius - miniSize/2) + 'px';
      img.style.top = (centerY + Math.sin(angle/30) * radius - miniSize/2) + 'px';
      img.dataset.angle = angle;
    });
    requestAnimationFrame(animate);
  }
  animate();
});
