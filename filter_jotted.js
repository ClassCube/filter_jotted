require(['https://cdn.jsdelivr.net/npm/jotted@latest/jotted.min.js'], function (Jotted) {
    filter_jotted.init(Jotted);
});
var filter_jotted = {
    init: function (Jotted) {
        var jotted = document.querySelectorAll('[data-jotted]');
        for (var i = 0; i < jotted.length; ++i) {
            console.info(jotted[i].dataset.js); 
            var html = jotted[i].dataset.html || false;
            var css = jotted[i].dataset.css || false;
            var js = typeof jotted[i].dataset.js === 'undefined' ? false : jotted[i].dataset.js;
console.info(js); 
            files = [];
            if (html !== false) {
                files.push({type: 'html', content: filter_jotted.Base64.decode(html)});
            }
            if (css !== false) {
                files.push({type: 'css', content: filter_jotted.Base64.decode(css).replace('\n', "\n")});
            }
            if (js !== false) {
                files.push({type: 'js', content: js});
            }

            var x = new Jotted(document.querySelector('#' + jotted[i].id), {
                files: files,
                plugins: ['pen', {
                        name: 'ace',
                        options: {
                            useWorker: false
                        }
                    }]
            });

        }
        var editors = document.querySelectorAll('.ace_editor');
        for (var i = 0; i < editors.length; ++i) {
            var parent = editors[i].parentNode.parentNode.parentNode;
            editors[i].env.editor.setOptions({fontSize: parent.dataset.size});
        }
    },

    Base64: {
        characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        encode: function (string)        {
            var characters = filter_jotted.Base64.characters;
            var result = '';

            var i = 0;
            do {
                var a = string.charCodeAt(i++);
                var b = string.charCodeAt(i++);
                var c = string.charCodeAt(i++);

                a = a ? a : 0;
                b = b ? b : 0;
                c = c ? c : 0;

                var b1 = (a >> 2) & 0x3F;
                var b2 = ((a & 0x3) << 4) | ((b >> 4) & 0xF);
                var b3 = ((b & 0xF) << 2) | ((c >> 6) & 0x3);
                var b4 = c & 0x3F;

                if (!b) {
                    b3 = b4 = 64;
                } else if (!c) {
                    b4 = 64;
                }

                result += filter_jotted.Base64.characters.charAt(b1) + filter_jotted.Base64.characters.charAt(b2) + filter_jotted.Base64.characters.charAt(b3) + filter_jotted.Base64.characters.charAt(b4);

            } while (i < string.length);

            return result;
        },

        decode: function (string)
        {
            var characters = filter_jotted.Base64.characters;
            var result = '';

            var i = 0;
            do {
                var b1 = filter_jotted.Base64.characters.indexOf(string.charAt(i++));
                var b2 = filter_jotted.Base64.characters.indexOf(string.charAt(i++));
                var b3 = filter_jotted.Base64.characters.indexOf(string.charAt(i++));
                var b4 = filter_jotted.Base64.characters.indexOf(string.charAt(i++));

                var a = ((b1 & 0x3F) << 2) | ((b2 >> 4) & 0x3);
                var b = ((b2 & 0xF) << 4) | ((b3 >> 2) & 0xF);
                var c = ((b3 & 0x3) << 6) | (b4 & 0x3F);

                result += String.fromCharCode(a) + (b ? String.fromCharCode(b) : '') + (c ? String.fromCharCode(c) : '');

            } while (i < string.length);

            return result;
        }
    }
};

