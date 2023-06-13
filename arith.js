/**
 * arith.js - script for arithmetic drills.
 * refactored and modified from arithmetic.zetamac.com
 * for editors: go to Arithmetic.Gen
 */

(function() {
  let window = this
  let $ = window.jQuery
  let game = $('#game')
  let Arithmetic = {
    Gen: {
      // any intitialization required goes here
      init: function(options) {
        window.Arithmetic.Gen.primes = []
        let sieve = []
        for (let i = 1; i < options.max_prime; i++) sieve.push(1)
        for (let i = 2; i <= options.max_prime; i++) {
          if (sieve[i - 2]) {
            window.Arithmetic.Gen.primes.push(i);
            for (let j = 1; i * j <= options.max_prime; j++) sieve[i * j - 2] = 0;
          }
        }
        let pi = window.Arithmetic.Gen.primes.length
        window.Arithmetic.Gen.get_prime = function() {
          let pos = ((1 + options.bias) ** Math.random() - 1) * pi / (options.bias)
          return window.Arithmetic.Gen.primes[Math.floor(pos)]
        }
        window.Arithmetic.Gen.stop = options.stopping
        window.Arithmetic.Gen.limit = options.max_num
        window.Arithmetic.Gen.lower = options.min_num
      },
      // rand(n) => random integer in [0,n), rand(n,m) => random integer in [n,m]
      rand: function(min, max) {
        if (max == undefined) return Math.floor(min * Math.random())
        else return min + Math.floor((max - min + 1) * Math.random())
      },
      // the problem generating function
      problemGen: function() {
        let primes = []
        let prod = 1
        while (1) {
          let prime = window.Arithmetic.Gen.get_prime()
          if (prime * prod > window.Arithmetic.Gen.limit) {
            primes.sort(function(a, b){return a - b})
            return [prod, primes.join(' ')]
          }
          primes.push(prime)
          prod = prod * prime
          if (Math.random() < window.Arithmetic.Gen.stop && prod > window.Arithmetic.Gen.lower) {
            primes.sort(function(a, b){return a - b})
            return [prod, primes.join(' ')]
          }
        }
      }
    },

    start: 0,
    correct_ct: 0,
    correct_info: [],

    el: {
      game: game,
      left: game.find('.left'),
      correct: game.find('.correct'),
      banner: game.find('.banner'),
      problem: game.find('.problem'),
      answer: game.find('.answer')
    },

    init: function(options) {
      let pstart = 0
      window.Arithmetic.el.answer.focus()

      window.Arithmetic.Gen.init(options)

      let genned = null
      let problemGeng = function problemGeng() {
        genned = window.Arithmetic.Gen.problemGen()
        window.Arithmetic.el.problem.text(genned[0])
        window.Arithmetic.el.answer.val('')
      };

      window.Arithmetic.start = (pstart = Date.now())
      window.Arithmetic.correct_ct = 0
      window.Arithmetic.correct_info = []
      let cb = function cb(e) {
        var str_ans = '' + genned[1]
        if ($.trim($(this).val()) === str_ans) {
          var now = Date.now()
          window.Arithmetic.correct_info.push([
            genned[0],
            genned[1],
            Math.floor(now - pstart)
          ])
          pstart = now
          problemGeng()
          window.Arithmetic.el.correct.text('Score: ' + (++window.Arithmetic.correct_ct))
        }
        return true
      }
      window.Arithmetic.el.answer.keydown(cb).keyup(cb)

      problemGeng()

      let duration = options.duration
      window.Arithmetic.el.left.text('Seconds left: ' + duration)
      let timer = setInterval(function() {
        let d = duration - Math.floor((Date.now() - window.Arithmetic.start) / 1000)
        window.Arithmetic.el.left.text('Seconds left: ' + d)

        if (d <= 0) {
          window.Arithmetic.correct_info.push([genned[0], genned[1], -1])
          window.Arithmetic.el.answer.prop('disabled', true)
          let $doc = $(window.document)
          let bsEat = function bsEat(e) {
            return e.keyCode !== 8
          }
          $doc.keydown(bsEat)
          clearInterval(timer)

          window.Arithmetic.el.banner.find('.start').hide()
          window.Arithmetic.el.banner.find('.end').show()
        }
      }, 1000)
    }
  }

  window.Arithmetic = Arithmetic
}).call(this)
