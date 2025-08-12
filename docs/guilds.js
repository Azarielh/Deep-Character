window.addEventListener('DOMContentLoaded', () => {
  const guilds = [
    { id: '1071095803302641674', name: 'Serveur 1' },
    { id: '618763592115683341', name: 'Serveur 2' }
  ];
  const logoSrc = 'logo-DeepCharacter.svg';
  const miniSize = 40;
  const nbMini = guilds.length;
  const body = document.body;

  const tooltip = document.getElementById('mini-logo-guild-tooltip');

  guilds.forEach((guild, idx) => {
    const img = document.createElement('img');
    img.src = logoSrc;
    img.alt = `Logo Deep-Character - Guild ${guild}`;
    img.className = 'mini-logo-guild';
    img.style.width = miniSize + 'px';
    img.style.height = miniSize + 'px';
    img.style.position = 'fixed';
    img.dataset.x = Math.random() * (window.innerWidth - miniSize);
    img.dataset.y = Math.random() * (window.innerHeight - miniSize);
    img.style.left = img.dataset.x + 'px';
    img.style.top = img.dataset.y + 'px';
    img.style.zIndex = 10;
    const angle = Math.random() * 2 * Math.PI;
    const speed = 0.3 + Math.random() * 0.3; // pixels/frame, plus lent
    img.dataset.vx = Math.cos(angle) * speed;
    img.dataset.vy = Math.sin(angle) * speed;
    img.dataset.guildName = guild.name;

    img.addEventListener('mouseenter', (e) => {
      tooltip.textContent = guild.name;
      tooltip.style.opacity = 1;
      tooltip.style.display = 'block';
      const rect = img.getBoundingClientRect();
      let left = rect.left + rect.width/2 - tooltip.offsetWidth/2;
      let top = rect.top - tooltip.offsetHeight - 10;
      left = Math.max(8, Math.min(left, window.innerWidth - tooltip.offsetWidth - 8));
      top = Math.max(8, top);
      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
    });
    img.addEventListener('mousemove', (e) => {
      const rect = img.getBoundingClientRect();
      let left = rect.left + rect.width/2 - tooltip.offsetWidth/2;
      let top = rect.top - tooltip.offsetHeight - 10;
      left = Math.max(8, Math.min(left, window.innerWidth - tooltip.offsetWidth - 8));
      top = Math.max(8, top);
      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
    });
    img.addEventListener('mouseleave', () => {
      tooltip.style.opacity = 0;
      tooltip.style.display = 'none';
    });

    body.appendChild(img);
  });

  function animate() {
    document.querySelectorAll('.mini-logo-guild').forEach(img => {
      let x = parseFloat(img.dataset.x);
      let y = parseFloat(img.dataset.y);
      let vx = parseFloat(img.dataset.vx);
      let vy = parseFloat(img.dataset.vy);

      x += vx;
      y += vy;

      if (x <= 0) {
        x = 0;
        vx = Math.abs(vx);
      } else if (x >= window.innerWidth - miniSize) {
        x = window.innerWidth - miniSize;
        vx = -Math.abs(vx);
      }
      if (y <= 0) {
        y = 0;
        vy = Math.abs(vy);
      } else if (y >= window.innerHeight - miniSize) {
        y = window.innerHeight - miniSize;
        vy = -Math.abs(vy);
      }

      img.dataset.x = x;
      img.dataset.y = y;
      img.dataset.vx = vx;
      img.dataset.vy = vy;
      img.style.left = x + 'px';
      img.style.top = y + 'px';
    });
    requestAnimationFrame(animate);
  }
  animate();
});
