// Show BibTeX inline under a publication instead of opening the .bib.txt file.
// Without JavaScript, the link still opens the file.
document.addEventListener('click', function (event) {
	var link = event.target.closest('.js-bibtex');
	if (!link) return;
	event.preventDefault();

	var article = link.closest('article');
	var box = article.querySelector('.bibtex-box');
	if (box) {
		box.hidden = !box.hidden;
		link.setAttribute('aria-expanded', String(!box.hidden));
		return;
	}

	box = document.createElement('div');
	box.className = 'bibtex-box';
	var pre = document.createElement('pre');
	pre.textContent = 'Loading…';
	var copy = document.createElement('button');
	copy.type = 'button';
	copy.className = 'bibtex-copy';
	var icon = document.createElement('i');
	icon.setAttribute('aria-hidden', 'true');
	var label = document.createElement('span');
	function setCopyState(copied) {
		icon.className = copied ? 'fa-solid fa-check' : 'fa-regular fa-copy';
		label.textContent = copied ? ' Copied' : ' Copy';
	}
	setCopyState(false);
	copy.append(icon, label);
	copy.addEventListener('click', function () {
		navigator.clipboard.writeText(pre.textContent).then(function () {
			setCopyState(true);
			setTimeout(function () { setCopyState(false); }, 1500);
		});
	});
	box.append(copy, pre);
	article.append(box);
	link.setAttribute('aria-expanded', 'true');

	fetch(link.href)
		.then(function (response) {
			if (!response.ok) throw new Error(response.status);
			return response.text();
		})
		.then(function (text) { pre.textContent = text.trim(); })
		.catch(function () { pre.textContent = 'Could not load BibTeX.'; });
});
