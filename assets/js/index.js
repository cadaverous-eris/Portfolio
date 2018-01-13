
$(document).on('ready', () => {
	
	resize();
	$(window).on('resize', () => {
		resize();
	});
	
});

function resize() {
	let navbarHeight = $('.navbar').outerHeight();
	$('body > .container').css('padding-top', (navbarHeight + 40) + 'px');
}
