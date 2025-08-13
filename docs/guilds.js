const stats_file = document.getElementById('stats-json').textContent;
const data = JSON.parse(stats_file);
const count_elem = document.getElementById('guild-count');
const span_verb = document.getElementById('guild-verb');

function case_set(guilds_len) {
	console.log(guilds_len, typeof(guilds_len));
	guilds_len = Number(guilds_len);
	if (guilds_len <= 2)
		return '2';
	if (guilds_len == 3)
		return '3';
	if (guilds_len < 10)
		return '4-9';
	if (guilds_len == 10)
		return '10';
	if (guilds_len < 20)
		return '11-19';
	if (guilds_len == 20)
		return '20';
	if (guilds_len < 50)
		return '21-49';
	if (guilds_len == 50)
		return '50';
	if (guilds_len < 100)
		return '51-99';
	if (guilds_len == 100)
		return '100';
	if (guilds_len < 200)
		return '101-199';
	if (guilds_len == 200)
		return '200';
	if (guilds_len < 500)
		return '201-499';
	if (guilds_len == 500)
		return '500';
	if (guilds_len < 1000)
		return '501-999';
	if (guilds_len == 1000)
		return '1000';
	if (guilds_len > 1000)
		return '1000+++';
}

if (count_elem) {
	switch (case_set(data.guild_len)) {
		case '2':
			console.log('test')
			count_elem.innerHTML = `<strong>Deep-Character</strong> a  pris conscience de son existence et parcourt les mondes qui lui ont donné la vie<br>Il ne sait pas encore que son histoire pourra lui faire découvrir une infinité d'autres monde.<br>Mais cela, ça dépend de vous ! Alors ? Allez-vous l'invoquer comme serviteur? `;
			span_verb.textContent = '';
			break ;
		case '3':
			count_elem.textContent = 'Pour la première fois, Deep-Character a été invoqué par un dieu qui n\'est pas son créateur !\n';
			span_verb.innerHTML = `<br>Merci pour ton invocation <strong>${data.guilds_list[2]}</strong><br>Nous créeront des statues à l'effigie des dieux de ton monde qui l'ont invoqués.`;
			break ;
		case '4-9':
			count_elem.textContent = `${data.guilds_len}`;
			span_verb.innerHTML = `mondes ont invoqué <strong>Deep-Character</strong> pour enrichir leur histoires !`;
			break ;
		case '10':
			count_elem.textContent = `${data.guild_len}`;
			span_verb.innerHTML = `univers ont invoqués <strong>Deep-Character</strong> pour guider leurs héros !<br>Merci ${data.guilds_list[9]}, 10ème monde du multivers.`;
			break ;
		case '11-19':
			count_elem.textContent = `${data.guild_len}`;
			span_verb.innerHTML = `mondes ont fait appel à la magie de <strong>Deep-Character</strong> !`;
			break ;
		case '20':
			count_elem.textContent = `${data.guild_len}`;
			span_verb.innerHTML = `univers ont invoqués <strong>Deep-Character</strong> pour guider leurs héros !<br>Merci ${data.guilds_list[19]}, 20ème monde du multivers.`;
			break ;
		case '21-49':
			count_elem.textContent = `${data.guild_len}`;
			span_verb.innerHTML = `ont acceuilli <strong>Deep-Character</strong> dans leurs légendes.`
			break ;
		case '50':
			count_elem.textContent = `${data.guild_len}`;
			span_verb.innerHTML = `univers ont invoqués <strong>Deep-Character</strong> pour explorer de nouveaux horizons !<br>Merci ${data.guilds_list[49]}, 50ème monde du multivers.`;
			break ;
		case '51-99':
			count_elem.textContent = `${data.guild_len}`;
			span_verb.innerHTML = `ont ouvert leur portail à <strong>Deep-Character</strong> !`;
		case '100':
			count_elem.textContent = `Wooww !! ${data.guild_len}`;
			span_verb.innerHTML = `univers ont fait appel à <strong>Deep-Character</strong> pour la magie qu'il détient !<br>Merci ${data.guilds_list[99]}, 100ème monde du multivers.`;
			break ;
		case '101-199':
			count_elem.textContent = `${data.guild_len}`;
			span_verb.innerHTML = `ont finalement fait appel à <strong>Deep-Character</strong> pour servir leur monde`;
			break ;
		case '200':
			count_elem.textContent = `${data.guild_len}`;
			span_verb.innerHTML = `univers ont été séduit par la magie <strong>Deep-Character</strong> et l'ont invoqués sur leurs terres !<br>Merci ${data.guilds_list[199]}, 200ème monde du multivers.<br>Merci à tous !`;
			break ;
		case '201-499':
			count_elem.textContent = `${data.guild_len}`;
			span_verb.innerHTML = `ont invoqué leur serviteur <strong>Deep-Character</strong> pour challenger leurs joueurs !`;
			break ;
		case '500':
			count_elem.textContent = `${data.guild_len}`;
			span_verb.innerHTML = `univers ont invoqués <strong>Deep-Character</strong> comme guide roliste !<br>Merci ${data.guilds_list}, 500ème monde du multivers.`;
			break ;
		case '501-999':
			count_elem.textContent = `${data.guild_len}`;
			span_verb.innerHTML = `mondes ont appel à <strong>Deep-Character</strong> pour assister leurs dieux.`
		case '1000':
			count_elem.textContent = `Wooowww !! C'est incroyable ! ${data.guild_len}`;
			span_verb.innerHTML = `univers ont usés de leur magie pour invoqués <strong>Deep-Character</strong> comme serviteur !<br>Merci ${data.guilds_list}, 1000ème monde du multivers.<br> Merci à tous ! Je n'aurais jamais cru en arriver là !`
			break ;

	}
}
window.addEventListener('DOMContentLoaded', () => {
	const logoSrc = 'logo-DeepCharacter.svg';
	const miniSize = 70 / data.guild_len < 70 ? 70 : 70 / data.guild_len;
	const body = document.body;
	const tooltip = document.getElementById('mini-logo-guild-tooltip');
	const big_logo = document.querySelector('.logo-deepcharacter');
	const pos_big = big_logo.getBoundingClientRect();
	const centerX = pos_big.left + pos_big.width / 2;
	const centerY = pos_big.top + pos_big.height / 2;
	const x = centerX;
	const y = centerY;
	let delay;

  data.guilds_list.forEach((guildName, i) => {
	setTimeout(() => {
	  const img = document.createElement('img');
	  img.src = logoSrc;
	  img.alt = `Logo Deep-Character - Guild ${guildName}`;
	  img.className = 'mini-logo-guild';
	  img.style.width = miniSize + 'px';
	  img.style.height = miniSize + 'px';
	  img.style.position = 'fixed';
	  img.dataset.x = x;
	  img.dataset.y = y;
	  img.style.left = img.dataset.x + 'px';
	  img.style.top = img.dataset.y + 'px';
	  img.style.zIndex = 10;
	  const angle = Math.random() * 2 * Math.PI;
	  const speed = 0.3 + Math.random() * 0.3;
	  img.dataset.vx = Math.cos(angle) * speed;
	  img.dataset.vy = Math.sin(angle) * speed;
	  img.dataset.guildName = guildName;

	  img.addEventListener('mouseenter', (e) => {
		tooltip.textContent = guildName;
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
	}, i * 400);
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
