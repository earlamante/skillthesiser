(function($){
    let splash = $('#splash'),
        game = $('#game'),
        data = {},
        attempt = 0,
        guess = '',
        max = 7,
        word = '',
        dayZero = new Date("19-Dec-2024"),
        today = new Date();

    let winScreen = function() {
        $('#definition .status').text('Congratulations!');
        $('#definition .msg').text('You have guessed the word after 3 tries!');
        $('#win-lose').html('<img src="win.png">');
        showDefinition();
    };
    let loseScreen = function() {
        $('#definition .status').text('Too bad!');
        $('#definition .msg').text('You were not able to guess today’s word.');
        $('#win-lose').html('<img src="lose.png">');
        showDefinition();
    };
    let showDefinition = function() {
        $('#definition .word').text(word);
        $('#definition .definition').html(data['m'][word]);
        $('#win-lose').removeClass('hidden');
        $('#definition').removeClass('hidden');
    }
    let printLine = function() {
        let elems = $('#row-'+attempt+' .card');
        elems.text('');
        for(i=0; i<guess.length ;i++) elems.eq(i).text(guess.charAt(i));
    };
    let validate = function() {
        let elems = $('#row-'+attempt+' .card'),
            w = word.split(''),
            g = guess.split('');

        for(i=0; i<w.length ;i++) {
            if(w[i] === g[i]) {
                elems.eq(i).addClass('g');
                w[i] = "";
                g[i] = "";
            }
        }

        for(i=0; i<g.length ;i++) {
            if(g[i] === "") continue;
            let c = false;
            for(x=0; x<w.length ;x++) {
                if(g[i] === w[x]) {
                    elems.eq(i).addClass('y');
                    w[x] = "";
                    c = true;
                    break;
                }
            }
            if(!c) {
                $('.key.'+g[i]).addClass('used');
                elems.eq(i).addClass('x');
            }
        }
    };
    let takeGuess = function() {
        let elems = $('#row-'+attempt+' .card');
        if(guess === word) {
            elems.addClass('g');
            winScreen();
        } else {
            validate();
            guess = '';
            attempt++;
            if(attempt >= 6) loseScreen();
        }
    };
    let enter = function(key) {
        if(key === 'enter') {
            if(guess.length < max) return;

            if(data['w'].includes(guess)) {
                logWord();
                takeGuess();
            }
            else snackbar("Not a word.")
        } else if(key === 'backspace') {
            if(guess.length > 0) guess = guess.substring(0, guess.length-1);
        } else {
            if(guess.length < max) guess += key;
            else return;
        }
        printLine();
    };
    let startGame = function() {
        splash.removeClass('lg:flex');
        game.removeClass('hidden');
        let i = Math.floor((today - dayZero) / (1000 * 60 * 60 * 24));
        word = data['w'][i];
    };
    let logWord = function() {
        let key = today.toISOString().split('T')[0],
            ls = localStorage.getItem(key),
            guesses = ls ? JSON.parse(ls) : [];
        guesses[guesses.length] = guess;
        localStorage.setItem(key, JSON.stringify(guesses));
    };
    let checkGuesses = function() {
        let key = today.toISOString().split('T')[0],
            ls = localStorage.getItem(key);
        if(ls) {
            startGame();
            let guesses = ls ? JSON.parse(ls) : [];
            for(let i in guesses) {
                guess = guesses[i];
                printLine();
                takeGuess();
            }
        }
    };
    let snackbar = function(msg) {
        let sb = $('#snackbar');
        $('body').addClass('shake');
        sb.text(msg);
        sb.addClass('show');
        setTimeout(function() {
            $('body').removeClass('shake');
            sb.text('');
            sb.removeClass('show');
        }, 2000);
    };
    $('button.key').on('click', function() {
        let e = $(this).html();
        if(e === '<img src="icon-backspace.png" alt="backspace">') e = 'backspace';
        enter(e);
    });
    $(document)
        .ready(function () {
            $.getJSON('data.json?'+today, function (d) {
                data = d;
                checkGuesses();
            }).fail(function () {
                console.error('Failed to load JSON file.');
            });
        })
        .on('click', '#play', function(e) {
            startGame();
        });
    $(window).on('keydown', function (e) {
        if(game.hasClass('hidden')) return;
        let key = e.key.toLowerCase();
        if(['enter','backspace'].includes(key) || /^[a-z]$/.test(key)) enter(key);
    });
})(jQuery);
