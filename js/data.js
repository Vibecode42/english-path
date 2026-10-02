/*
 * Учебная программа: Уровни (Levels) → Units → Уроки (Lessons).
 *
 * Формат урока:
 *   id      — уникальный идентификатор (уровень-модуль-урок)
 *   title   — название урока
 *   goal    — цель урока («После урока вы сможете…»)
 *   theory  — HTML с объяснением и примерами
 *   vocab   — [[английский, русский], …] → карточки и автоматический тест слов
 *   ex      — упражнения:
 *             {t:"choice", q:"вопрос", o:["вариант", …], a:индекс_правильного}
 *             {t:"gap",    q:"Текст с ___ пропуском", a:["ответ", "допустимый вариант"]}
 *             {t:"order",  s:"Правильное предложение целиком"}  (слова перемешиваются)
 *             {t:"listen", s:"Предложение, которое озвучивается"}  (аудирование: запишите услышанное)
 *             {t:"translate", ru:"Русская фраза", a:["English answer", …]}
 *             У любого упражнения и вопроса quiz может быть explain — объяснение ошибки.
 *   Необязательные поля (показательный урок a0-3-2):
 *   video     — видеоурок {id, title, channel} (YouTube)
 *   shadowing — фразы для повторения вслух
 *   quiz      — [{q, o, a, explain}]; если нет, quiz собирается из лексики и упражнений
 *   task      — задание speaking / writing
 *   Транскрипции слов — в js/ipa.js; уровни содержат goals и intro (видео-введение).
 */
const LEVEL_INTRO = { id: "BHtDLadc7Fo", title: "How To Evaluate Your Own Level Of English | CEFR: A1, A2, B1, B2, C1, C2", channel: "English with Greg", generic: true };

const COURSE = [
  /* =========================== A0 =========================== */
  {
    id: "a0", code: "A0", name: "Starter", ru: "С нуля",
    desc: "Алфавит, звуки, первые слова и самые простые фразы.",
    goals: ["Читать буквы и простые слова по правилам чтения", "Поздороваться, представиться, назвать возраст и страну", "Понимать числа, цвета, названия предметов вокруг", "Переспросить и попросить говорить медленнее"],
    intro: LEVEL_INTRO,
    modules: [
      {
        id: "a0-1", title: "Алфавит и звуки",
        lessons: [
          { id: "a0-1-1", title: "Алфавит: A–M", goal: "Узнавать и называть первые 13 букв.",
            theory: `<p>В английском алфавите 26 букв. Название буквы и звук, который она даёт в слове, часто отличаются.</p>
<table><tr><th>Буква</th><th>Название</th><th>Пример</th></tr>
<tr><td>A a</td><td>[эй]</td><td>apple</td></tr><tr><td>B b</td><td>[би:]</td><td>book</td></tr>
<tr><td>C c</td><td>[си:]</td><td>cat</td></tr><tr><td>D d</td><td>[ди:]</td><td>dog</td></tr>
<tr><td>E e</td><td>[и:]</td><td>egg</td></tr><tr><td>F f</td><td>[эф]</td><td>fish</td></tr>
<tr><td>G g</td><td>[джи:]</td><td>girl</td></tr><tr><td>H h</td><td>[эйч]</td><td>house</td></tr>
<tr><td>I i</td><td>[ай]</td><td>ink</td></tr><tr><td>J j</td><td>[джей]</td><td>juice</td></tr>
<tr><td>K k</td><td>[кей]</td><td>key</td></tr><tr><td>L l</td><td>[эл]</td><td>lemon</td></tr>
<tr><td>M m</td><td>[эм]</td><td>milk</td></tr></table>
<p class="tip">Нажимайте 🔊 на карточках слов, чтобы услышать произношение.</p>`,
            vocab: [["apple","яблоко"],["book","книга"],["cat","кошка"],["dog","собака"],["egg","яйцо"],["fish","рыба"],["house","дом"],["milk","молоко"]],
            ex: [
              { t: "choice", q: "Какая буква читается как [джи:]?", o: ["J", "G", "E"], a: 1 },
              { t: "choice", q: "Какая буква идёт после K?", o: ["L", "J", "M"], a: 0 },
              { t: "gap", q: "c _ t (кошка) — вставьте букву", a: ["a"] },
              { t: "order", s: "a cat and a dog", explain: "a cat and a dog — кошка и собака. Перед словом ставится a." }
            ] },
          { id: "a0-1-2", title: "Алфавит: N–Z", goal: "Знать весь алфавит и уметь произнести своё имя по буквам.",
            theory: `<table><tr><th>Буква</th><th>Название</th><th>Пример</th></tr>
<tr><td>N n</td><td>[эн]</td><td>nose</td></tr><tr><td>O o</td><td>[оу]</td><td>orange</td></tr>
<tr><td>P p</td><td>[пи:]</td><td>pen</td></tr><tr><td>Q q</td><td>[кью:]</td><td>queen</td></tr>
<tr><td>R r</td><td>[а:]</td><td>red</td></tr><tr><td>S s</td><td>[эс]</td><td>sun</td></tr>
<tr><td>T t</td><td>[ти:]</td><td>table</td></tr><tr><td>U u</td><td>[ю:]</td><td>umbrella</td></tr>
<tr><td>V v</td><td>[ви:]</td><td>van</td></tr><tr><td>W w</td><td>[дабл-ю:]</td><td>water</td></tr>
<tr><td>X x</td><td>[экс]</td><td>box</td></tr><tr><td>Y y</td><td>[уай]</td><td>yes</td></tr>
<tr><td>Z z</td><td>[зед] / [зи:]</td><td>zoo</td></tr></table>
<div class="ex"><b>How do you spell your name?</b> — Как пишется ваше имя? <br>— A-N-N-A.</div>`,
            vocab: [["nose","нос"],["orange","апельсин"],["pen","ручка"],["queen","королева"],["sun","солнце"],["table","стол"],["water","вода"],["zoo","зоопарк"]],
            ex: [
              { t: "choice", q: "Как называется буква W?", o: ["[ви:]", "[дабл-ю:]", "[уай]"], a: 1 },
              { t: "choice", q: "Сколько букв в английском алфавите?", o: ["24", "26", "33"], a: 1 },
              { t: "order", s: "How do you spell your name" },
              { t: "gap", q: "wa _ er (вода) — вставьте букву", a: ["t"] }
            ] },
          { id: "a0-1-3", title: "Основы чтения", goal: "Читать простые слова в открытом и закрытом слоге.",
            theory: `<p><b>Закрытый слог</b> (гласная + согласная в конце): гласная читается кратко — <i>cat, pen, sit, dog, cup</i>.</p>
<p><b>Открытый слог</b> (слово кончается на немую <i>e</i>): гласная читается как в алфавите — <i>name, Pete, five, home, cute</i>.</p>
<p>Частые сочетания: <b>sh</b> [ш] — ship, <b>ch</b> [ч] — chair, <b>th</b> — think / this, <b>ee</b> [и:] — tree, <b>oo</b> [у:] — moon.</p>`,
            vocab: [["name","имя"],["five","пять"],["home","дом (родной)"],["ship","корабль"],["chair","стул"],["tree","дерево"],["moon","луна"],["cup","чашка"]],
            ex: [
              { t: "choice", q: "В каком слове «i» читается как [ай]?", o: ["sit", "five", "big"], a: 1 },
              { t: "choice", q: "Как читается «sh» в слове ship?", o: ["[с]", "[ш]", "[ч]"], a: 1 },
              { t: "choice", q: "Какое слово — открытый слог?", o: ["cat", "home", "dog"], a: 1 },
              { t: "gap", q: "sh _ p (корабль) — вставьте букву", a: ["i"], explain: "ship [ʃɪp]: sh читается как [ш], i в закрытом слоге — коротко." },
              { t: "order", s: "a ship and a tree" }
            ] }
        ]
      },
      {
        id: "a0-2", title: "Первые слова",
        lessons: [
          { id: "a0-2-1", title: "Приветствия и знакомство", goal: "Поздороваться, представиться и попрощаться.",
            theory: `<div class="ex">— <b>Hello!</b> My name is Anna. What's your name?<br>— <b>Hi!</b> I'm Tom. Nice to meet you.<br>— Nice to meet you too. <b>Goodbye!</b></div>
<ul><li><b>Good morning</b> — до 12:00, <b>Good afternoon</b> — 12:00–18:00, <b>Good evening</b> — вечером.</li>
<li><b>Good night</b> — только при прощании перед сном.</li><li><b>I'm</b> = I am (я).</li></ul>`,
            vocab: [["hello","привет / здравствуйте"],["goodbye","до свидания"],["good morning","доброе утро"],["good evening","добрый вечер"],["nice to meet you","приятно познакомиться"],["thank you","спасибо"],["please","пожалуйста (просьба)"],["sorry","извините"]],
            ex: [
              { t: "choice", q: "Сейчас 9 утра. Как поздороваться?", o: ["Good evening", "Good morning", "Good night"], a: 1 },
              { t: "gap", q: "My ___ is Anna.", a: ["name"] },
              { t: "order", s: "Nice to meet you" }
            ] },
          { id: "a0-2-2", title: "Числа 0–20", goal: "Считать до 20 и называть возраст и номер телефона.",
            theory: `<p>0 zero, 1 one, 2 two, 3 three, 4 four, 5 five, 6 six, 7 seven, 8 eight, 9 nine, 10 ten,
11 eleven, 12 twelve, 13 thirteen, 14 fourteen, 15 fifteen, 16 sixteen, 17 seventeen, 18 eighteen, 19 nineteen, 20 twenty.</p>
<p class="tip">13–19 оканчиваются на <b>-teen</b>, ударение на последний слог: fif<b>TEEN</b>.</p>
<div class="ex">How old are you? — I'm <b>twelve</b>.</div>`,
            vocab: [["one","один"],["three","три"],["seven","семь"],["eight","восемь"],["ten","десять"],["twelve","двенадцать"],["fifteen","пятнадцать"],["twenty","двадцать"]],
            ex: [
              { t: "gap", q: "5 + 6 = ___ (словом)", a: ["eleven"] },
              { t: "choice", q: "Как пишется 13?", o: ["thirty", "thirteen", "threeteen"], a: 1 },
              { t: "order", s: "How old are you" }
            ] },
          { id: "a0-2-3", title: "Цвета и предметы", goal: "Называть цвета и описывать предметы: a red apple.",
            theory: `<p>Прилагательное в английском стоит <b>перед</b> существительным и не меняется:</p>
<div class="ex">a <b>red</b> apple, a <b>green</b> book, <b>blue</b> pens</div>
<p>What colour is it? — It's <b>yellow</b>.</p>`,
            vocab: [["red","красный"],["blue","синий"],["green","зелёный"],["yellow","жёлтый"],["black","чёрный"],["white","белый"],["brown","коричневый"],["pink","розовый"]],
            ex: [
              { t: "choice", q: "Как правильно?", o: ["an apple red", "a red apple", "red a apple"], a: 1 },
              { t: "gap", q: "The sun is ___ (жёлтый).", a: ["yellow"] },
              { t: "order", s: "What colour is it" }
            ] }
        ]
      },
      {
        id: "a0-3", title: "Я и люди вокруг",
        lessons: [
          { id: "a0-3-1", title: "Личные местоимения", goal: "Использовать I, you, he, she, it, we, they.",
            theory: `<table><tr><th>English</th><th>Русский</th></tr>
<tr><td>I</td><td>я (всегда с большой буквы!)</td></tr><tr><td>you</td><td>ты / вы</td></tr>
<tr><td>he</td><td>он (о человеке)</td></tr><tr><td>she</td><td>она (о человеке)</td></tr>
<tr><td>it</td><td>оно / он / она (о предмете, животном)</td></tr><tr><td>we</td><td>мы</td></tr><tr><td>they</td><td>они</td></tr></table>`,
            vocab: [["I","я"],["you","ты / вы"],["he","он"],["she","она"],["it","оно (предмет)"],["we","мы"],["they","они"],["friend","друг"]],
            ex: [
              { t: "choice", q: "Tom → ?", o: ["she", "he", "it"], a: 1 },
              { t: "choice", q: "a table → ?", o: ["he", "it", "they"], a: 1 },
              { t: "choice", q: "Anna and I → ?", o: ["we", "they", "you"], a: 0 },
              { t: "gap", q: "Tom is my friend. ___ is from London.", a: ["He"], explain: "Tom — мужчина, поэтому he." },
              { t: "order", s: "She is my friend" }
            ] },
          { id: "a0-3-2", title: "Глагол to be: am / is / are", goal: "Говорить, кто вы и откуда: I am a student.",
            // Показательный урок: заполнены все блоки шаблона (см. docs/SPEC.md, раздел 4)
            video: { id: "5kjCcBsBzUs", title: "Basic English Grammar | Be verbs AM IS ARE", channel: "Acquire English" },
            // фразы для shadowing (шаг Speaking): собственные, не транскрипт чужого видео
            shadowing: ["Hello! I'm Anna.", "I am from Russia.", "I am a student.", "This is my friend Tom.", "He is from London.", "We are happy to meet you."],
            quiz: [
              { q: "I ___ a teacher.", o: ["is", "am", "are"], a: 1, explain: "С местоимением I используется только am: I am (I'm)." },
              { q: "They ___ from Spain.", o: ["are", "is", "am"], a: 0, explain: "We / you / they → are. They are from Spain." },
              { q: "___ she a doctor?", o: ["Are", "Am", "Is"], a: 2, explain: "В вопросе глагол to be выходит вперёд, а для she нужен is: Is she…?" },
              { q: "Отрицание: He ___ tired.", o: ["isn't", "aren't", "not is"], a: 0, explain: "Отрицание: is + not = isn't. Not ставится после глагола, а не перед ним." },
              { q: "Перевод: «Мы студенты».", o: ["We students.", "We are students.", "We is students."], a: 1, explain: "В английском «быть» нельзя пропустить, как в русском: We are students." }
            ],
            task: { speaking: "Представьтесь: имя, страна, город, профессия и как вы себя чувствуете (4–5 предложений).",
                    writing: "Напишите 5 предложений о себе и одном члене семьи. Используйте am, is, are и хотя бы одно отрицание.",
                    minWords: 25, target: ["am", "is", "are", "not"] },
            theory: `<p>В русском «быть» в настоящем времени пропускается, в английском — <b>никогда</b>.</p>
<table><tr><td>I <b>am</b> (I'm)</td><td>He / She / It <b>is</b> (he's)</td><td>We / You / They <b>are</b> (we're)</td></tr></table>
<div class="ex">I <b>am</b> a student. — Я студент.<br>She <b>is</b> from Spain. — Она из Испании.<br>They <b>are</b> happy. — Они счастливы.</div>
<p>Отрицание: I am <b>not</b>, she <b>isn't</b>, they <b>aren't</b>. Вопрос: <b>Are</b> you a teacher? — Yes, I am.</p>`,
            vocab: [["student","студент"],["teacher","учитель"],["doctor","врач"],["happy","счастливый"],["tired","уставший"],["from","из (откуда)"],["country","страна"],["city","город"]],
            ex: [
              { t: "choice", q: "They ___ my friends.", o: ["is", "am", "are"], a: 2, explain: "They → are." },
              { t: "gap", q: "I ___ a student.", a: ["am", "'m"], explain: "I → am." },
              { t: "gap", q: "She ___ from Italy.", a: ["is", "'s"], explain: "He / she / it → is." },
              { t: "listen", s: "My brother is a doctor.", explain: "Brother — он (he), поэтому is." },
              { t: "translate", ru: "Мы не уставшие.", a: ["We are not tired", "We aren't tired", "We're not tired"], explain: "Отрицание: are + not. Не забудьте глагол to be!" },
              { t: "order", s: "Are you a teacher", explain: "В вопросе to be стоит перед подлежащим: Are you…?" }
            ] },
          { id: "a0-3-3", title: "Моя семья", goal: "Рассказать о членах семьи: This is my mother.",
            theory: `<p>Притяжательные местоимения: <b>my</b> (мой), <b>your</b> (твой), <b>his</b> (его), <b>her</b> (её), <b>our</b> (наш), <b>their</b> (их).</p>
<div class="ex">This is <b>my</b> brother. <b>His</b> name is Max.<br>This is <b>my</b> sister. <b>Her</b> name is Kate.</div>`,
            vocab: [["mother","мама"],["father","папа"],["brother","брат"],["sister","сестра"],["son","сын"],["daughter","дочь"],["grandmother","бабушка"],["parents","родители"]],
            ex: [
              { t: "choice", q: "This is my sister. ___ name is Kate.", o: ["His", "Her", "Their"], a: 1 },
              { t: "choice", q: "This is my father. ___ name is Ivan.", o: ["His", "Her", "My"], a: 0 },
              { t: "order", s: "This is my mother" }
            ] }
        ]
      },
      {
        id: "a0-4", title: "Вокруг меня",
        lessons: [
          { id: "a0-4-1", title: "Артикли a / an", goal: "Правильно ставить a или an перед словом.",
            theory: `<p><b>a</b> — перед согласным звуком: a book, a cat, a <b>u</b>niversity [ju:].</p>
<p><b>an</b> — перед гласным звуком: an apple, an egg, an <b>h</b>our [ауэ].</p>
<p class="tip">Важен звук, а не буква!</p>`,
            vocab: [["umbrella","зонт"],["orange","апельсин"],["hour","час"],["bag","сумка"],["window","окно"],["door","дверь"],["phone","телефон"],["car","машина"]],
            ex: [
              { t: "choice", q: "___ umbrella", o: ["a", "an"], a: 1 },
              { t: "choice", q: "___ car", o: ["a", "an"], a: 0 },
              { t: "choice", q: "___ hour", o: ["a", "an"], a: 1 },
              { t: "choice", q: "___ university", o: ["a", "an"], a: 0 },
              { t: "order", s: "I have an orange and a bag", explain: "an orange — гласный звук, a bag — согласный." }
            ] },
          { id: "a0-4-2", title: "This / that / these / those", goal: "Указывать на предметы рядом и далеко.",
            theory: `<table><tr><th></th><th>Рядом</th><th>Далеко</th></tr>
<tr><td>Ед. число</td><td><b>this</b> (этот)</td><td><b>that</b> (тот)</td></tr>
<tr><td>Мн. число</td><td><b>these</b> (эти)</td><td><b>those</b> (те)</td></tr></table>
<div class="ex">What is this? — It's a pen.<br>What are those? — They're birds.</div>`,
            vocab: [["this","этот"],["that","тот"],["these","эти"],["those","те"],["bird","птица"],["key","ключ"],["picture","картинка"],["box","коробка"]],
            ex: [
              { t: "choice", q: "___ are my keys (в руке).", o: ["Those", "These", "This"], a: 1 },
              { t: "choice", q: "Look at ___ bird in the sky!", o: ["this", "that", "these"], a: 1 },
              { t: "order", s: "What is this" }
            ] },
          { id: "a0-4-3", title: "Множественное число", goal: "Образовывать множественное число существительных.",
            theory: `<ul><li>Обычно + <b>-s</b>: book → books, cat → cats</li>
<li>После s, sh, ch, x + <b>-es</b>: box → boxes, watch → watches</li>
<li>Согласная + y → <b>-ies</b>: baby → babies</li>
<li>Исключения: man → <b>men</b>, woman → <b>women</b>, child → <b>children</b>, foot → <b>feet</b>, tooth → <b>teeth</b>, mouse → <b>mice</b></li></ul>`,
            vocab: [["man / men","мужчина / мужчины"],["woman / women","женщина / женщины"],["child / children","ребёнок / дети"],["foot / feet","ступня / ступни"],["tooth / teeth","зуб / зубы"],["mouse / mice","мышь / мыши"],["baby","малыш"],["watch","часы (наручные)"]],
            ex: [
              { t: "gap", q: "one box — two ___", a: ["boxes"] },
              { t: "gap", q: "one child — three ___", a: ["children"] },
              { t: "gap", q: "one city — two ___", a: ["cities"] }
            ] }
        ]
      }
    ]
  },

  /* =========================== A1 =========================== */
  {
    id: "a1", code: "A1", name: "Beginner", ru: "Начальный",
    desc: "Настоящее время, повседневные темы, простые диалоги.",
    goals: ["Рассказать о себе, семье, работе и распорядке дня", "Заказать еду, купить билет, спросить дорогу", "Задавать простые вопросы и отвечать на них", "Написать короткое сообщение или заполнить анкету"],
    intro: LEVEL_INTRO,
    modules: [
      {
        id: "a1-1", title: "Present Simple",
        lessons: [
          { id: "a1-1-1", title: "Утверждения", goal: "Рассказывать о привычках и фактах.",
            theory: `<p>Present Simple — регулярные действия и факты.</p>
<div class="ex">I <b>work</b> in an office. You <b>live</b> in Moscow.<br>He <b>works</b>. She <b>lives</b>. It <b>rains</b>.</div>
<p class="tip">He / she / it → глагол + <b>-s</b> (watch → watch<b>es</b>, study → stud<b>ies</b>, have → <b>has</b>).</p>`,
            vocab: [["work","работать"],["live","жить"],["play","играть"],["watch","смотреть"],["study","учиться"],["speak","говорить"],["like","нравиться, любить"],["every day","каждый день"]],
            ex: [
              { t: "gap", q: "She ___ (live) in London.", a: ["lives"] },
              { t: "gap", q: "My brother ___ (watch) TV every day.", a: ["watches"] },
              { t: "gap", q: "Tom ___ (study) English.", a: ["studies"] }
            ] },
          { id: "a1-1-2", title: "Отрицания и вопросы", goal: "Задавать вопросы и отвечать с do / does.",
            theory: `<table><tr><td>I / you / we / they</td><td><b>don't</b> work</td><td><b>Do</b> you work?</td></tr>
<tr><td>he / she / it</td><td><b>doesn't</b> work</td><td><b>Does</b> she work?</td></tr></table>
<p class="tip">После does/doesn't глагол без -s: She doesn't <b>like</b> (не likes).</p>
<div class="ex">Where <b>do</b> you live? — I live in Kazan.<br><b>Does</b> he speak French? — No, he <b>doesn't</b>.</div>`,
            vocab: [["coffee","кофе"],["tea","чай"],["music","музыка"],["sport","спорт"],["where","где"],["what","что"],["when","когда"],["why","почему"]],
            ex: [
              { t: "choice", q: "___ she like coffee?", o: ["Do", "Does", "Is"], a: 1 },
              { t: "choice", q: "They ___ speak Spanish.", o: ["doesn't", "don't", "aren't"], a: 1 },
              { t: "order", s: "Where do you live" },
              { t: "choice", q: "He doesn't ___ tea.", o: ["likes", "like", "liking"], a: 1 }
            ] },
          { id: "a1-1-3", title: "Мой день", goal: "Описывать распорядок дня и использовать слова частотности.",
            theory: `<p>Наречия частотности: <b>always</b> (всегда) → <b>usually</b> → <b>often</b> → <b>sometimes</b> → <b>never</b> (никогда).</p>
<p>Стоят <b>перед</b> основным глаголом, но <b>после</b> to be:</p>
<div class="ex">I <b>usually</b> get up at 7. She is <b>always</b> late.</div>`,
            vocab: [["get up","вставать"],["have breakfast","завтракать"],["go to work","идти на работу"],["have lunch","обедать"],["come home","приходить домой"],["go to bed","ложиться спать"],["always","всегда"],["never","никогда"]],
            ex: [
              { t: "order", s: "I usually get up at seven" },
              { t: "choice", q: "Как правильно?", o: ["She always is late.", "She is always late.", "Always she is late."], a: 1 },
              { t: "gap", q: "I ___ (никогда) drink coffee.", a: ["never"] }
            ] }
        ]
      },
      {
        id: "a1-2", title: "Дом и место",
        lessons: [
          { id: "a1-2-1", title: "There is / there are", goal: "Описывать, что где находится.",
            theory: `<div class="ex"><b>There is</b> a sofa in the room. (ед.ч.)<br><b>There are</b> two windows. (мн.ч.)<br><b>Is there</b> a TV? — Yes, there is. / No, there isn't.</div>
<p class="tip">По-русски начинаем с места («В комнате есть…»), по-английски — с There is.</p>`,
            vocab: [["kitchen","кухня"],["bedroom","спальня"],["bathroom","ванная"],["living room","гостиная"],["sofa","диван"],["fridge","холодильник"],["bed","кровать"],["lamp","лампа"]],
            ex: [
              { t: "choice", q: "___ three chairs in the kitchen.", o: ["There is", "There are", "It is"], a: 1 },
              { t: "choice", q: "___ a fridge in the kitchen?", o: ["Are there", "Is there", "There is"], a: 1 },
              { t: "order", s: "There is a lamp on the table" }
            ] },
          { id: "a1-2-2", title: "Предлоги места", goal: "Использовать in, on, under, next to, between.",
            theory: `<ul><li><b>in</b> — в (in the box)</li><li><b>on</b> — на (on the table)</li><li><b>under</b> — под</li>
<li><b>next to</b> — рядом с</li><li><b>between</b> — между</li><li><b>behind</b> — за, позади</li><li><b>in front of</b> — перед</li></ul>`,
            vocab: [["in","в"],["on","на"],["under","под"],["next to","рядом с"],["between","между"],["behind","позади"],["in front of","перед"],["shelf","полка"]],
            ex: [
              { t: "choice", q: "The cat is ___ the bed (под).", o: ["on", "under", "in"], a: 1 },
              { t: "choice", q: "The bank is ___ the café and the shop.", o: ["between", "next", "in"], a: 0 },
              { t: "gap", q: "The books are ___ the shelf (на).", a: ["on"] }
            ] },
          { id: "a1-2-3", title: "Have got", goal: "Говорить о том, что у вас есть.",
            theory: `<div class="ex">I <b>have got</b> (I've got) a car. She <b>has got</b> (she's got) a dog.<br>I <b>haven't got</b> a bike. <b>Have</b> you <b>got</b> a pen? — Yes, I have.</div>
<p class="tip">В американском английском чаще: I have a car / Do you have a pen?</p>`,
            vocab: [["bike","велосипед"],["laptop","ноутбук"],["garden","сад"],["pet","домашний питомец"],["flat","квартира (брит.)"],["apartment","квартира (амер.)"],["money","деньги"],["time","время"]],
            ex: [
              { t: "choice", q: "She ___ got a laptop.", o: ["have", "has", "is"], a: 1 },
              { t: "choice", q: "___ you got a pet?", o: ["Has", "Do", "Have"], a: 2 },
              { t: "order", s: "I haven't got a bike" }
            ] }
        ]
      },
      {
        id: "a1-3", title: "Умения и время",
        lessons: [
          { id: "a1-3-1", title: "Can / can't", goal: "Говорить об умениях и просить разрешения.",
            theory: `<div class="ex">I <b>can</b> swim. She <b>can't</b> drive. <b>Can</b> you cook? — Yes, I can.<br><b>Can</b> I open the window? — Можно открыть окно?</div>
<p class="tip">После can глагол без to и без -s: He can <b>play</b>.</p>`,
            vocab: [["swim","плавать"],["drive","водить машину"],["cook","готовить"],["sing","петь"],["dance","танцевать"],["ride a bike","кататься на велосипеде"],["draw","рисовать"],["help","помогать"]],
            ex: [
              { t: "choice", q: "He can ___ the guitar.", o: ["plays", "play", "to play"], a: 1 },
              { t: "order", s: "Can you help me" },
              { t: "gap", q: "I ___ swim. I'm afraid of water. (не умею)", a: ["can't", "cannot", "can not"] }
            ] },
          { id: "a1-3-2", title: "Который час?", goal: "Называть время и договариваться о встрече.",
            theory: `<div class="ex">What time is it? — It's <b>seven o'clock</b> (7:00).<br>7:15 — <b>quarter past</b> seven, 7:30 — <b>half past</b> seven, 7:45 — <b>quarter to</b> eight.<br>7:10 — ten <b>past</b> seven, 7:50 — ten <b>to</b> eight.</div>
<p>Предлоги: <b>at</b> 5 o'clock, <b>on</b> Monday, <b>in</b> the morning.</p>`,
            vocab: [["o'clock","ровно (о времени)"],["half past","половина (после)"],["quarter","четверть"],["Monday","понедельник"],["weekend","выходные"],["morning","утро"],["afternoon","день (после полудня)"],["evening","вечер"]],
            ex: [
              { t: "choice", q: "8:30 = ?", o: ["half past eight", "half to eight", "eight half"], a: 0 },
              { t: "choice", q: "Let's meet ___ Friday.", o: ["in", "at", "on"], a: 2 },
              { t: "choice", q: "The film starts ___ 7 p.m.", o: ["at", "on", "in"], a: 0 }
            ] },
          { id: "a1-3-3", title: "Хобби: like + -ing", goal: "Рассказывать, что вы любите делать.",
            theory: `<div class="ex">I <b>like reading</b>. She <b>loves dancing</b>. They <b>hate getting up</b> early. I <b>don't mind</b> cooking.</div>
<p>После like / love / hate / enjoy глагол часто с окончанием <b>-ing</b>.</p>`,
            vocab: [["reading","чтение"],["travelling","путешествия"],["hiking","походы"],["gaming","видеоигры"],["enjoy","получать удовольствие"],["hate","ненавидеть"],["free time","свободное время"],["hobby","хобби"]],
            ex: [
              { t: "choice", q: "I enjoy ___ books.", o: ["read", "reading", "to reading"], a: 1 },
              { t: "order", s: "What do you do in your free time" },
              { t: "gap", q: "She loves ___ (travel).", a: ["travelling", "traveling"] }
            ] }
        ]
      },
      {
        id: "a1-4", title: "Еда и покупки",
        lessons: [
          { id: "a1-4-1", title: "Исчисляемые и неисчисляемые", goal: "Различать apples и water.",
            theory: `<p><b>Исчисляемые</b> можно посчитать: an apple, two apples.</p>
<p><b>Неисчисляемые</b> — вещества и понятия: water, bread, money, rice, information. Нет мн.ч. и артикля a/an.</p>
<div class="ex">a bottle of water, a loaf of bread, a piece of cheese</div>`,
            vocab: [["bread","хлеб"],["cheese","сыр"],["rice","рис"],["butter","масло"],["a bottle of","бутылка (чего-то)"],["a piece of","кусок"],["vegetables","овощи"],["fruit","фрукты"]],
            ex: [
              { t: "choice", q: "Какое слово неисчисляемое?", o: ["egg", "rice", "banana"], a: 1 },
              { t: "choice", q: "Как правильно?", o: ["a bread", "a loaf of bread", "two breads"], a: 1 },
              { t: "choice", q: "Как правильно?", o: ["an information", "informations", "some information"], a: 2 }
            ] },
          { id: "a1-4-2", title: "Some / any", goal: "Говорить о количестве в утверждениях и вопросах.",
            theory: `<div class="ex">There is <b>some</b> milk. (утверждение)<br>There isn't <b>any</b> sugar. (отрицание)<br>Are there <b>any</b> eggs? (вопрос)<br>Would you like <b>some</b> tea? (предложение — some!)</div>`,
            vocab: [["sugar","сахар"],["salt","соль"],["juice","сок"],["meat","мясо"],["chicken","курица"],["potato","картофель"],["would like","хотел бы"],["menu","меню"]],
            ex: [
              { t: "choice", q: "Is there ___ juice?", o: ["some", "any", "a"], a: 1 },
              { t: "choice", q: "Would you like ___ cake?", o: ["any", "some", "an"], a: 1 },
              { t: "choice", q: "We haven't got ___ salt.", o: ["some", "any", "no"], a: 1 }
            ] },
          { id: "a1-4-3", title: "В магазине и кафе", goal: "Сделать заказ и спросить цену.",
            theory: `<div class="ex">— Can I help you?<br>— <b>I'd like</b> a coffee, please.<br>— Anything else?<br>— No, thanks. <b>How much is it?</b><br>— It's three pounds fifty.</div>
<p><b>How much</b> — для неисчисляемых и цены, <b>how many</b> — для исчисляемых: How many eggs?</p>`,
            vocab: [["How much is it?","Сколько это стоит?"],["I'd like","я бы хотел"],["bill","счёт (в кафе)"],["cash","наличные"],["card","карта"],["cheap","дешёвый"],["expensive","дорогой"],["receipt","чек"]],
            ex: [
              { t: "choice", q: "How ___ apples do you need?", o: ["much", "many"], a: 1 },
              { t: "choice", q: "How ___ is this jacket?", o: ["much", "many"], a: 0 },
              { t: "order", s: "Can I have the bill please" }
            ] }
        ]
      }
    ]
  },

  /* =========================== A2 =========================== */
  {
    id: "a2", code: "A2", name: "Elementary", ru: "Элементарный",
    desc: "Прошедшее и будущее время, сравнения, первый опыт Present Perfect.",
    goals: ["Рассказать, что случилось в прошлом, и о планах на будущее", "Справиться в путешествии, отеле, у врача", "Сравнивать и выбирать: товары, города, варианты", "Написать короткое письмо или рабочий e-mail"],
    intro: LEVEL_INTRO,
    modules: [
      {
        id: "a2-1", title: "Past Simple",
        lessons: [
          { id: "a2-1-1", title: "Правильные глаголы", goal: "Рассказывать о прошлом с -ed.",
            theory: `<div class="ex">I <b>worked</b> yesterday. She <b>visited</b> Paris last year. We <b>stopped</b> at a café.</div>
<p>Правила: + <b>-ed</b> (play → played), e → +d (live → lived), согл.+y → -ied (study → studied), CVC → удвоение (stop → stopped).</p>
<p>Маркеры: yesterday, last week, ago, in 2010.</p>`,
            vocab: [["yesterday","вчера"],["last week","на прошлой неделе"],["ago","назад"],["visit","посещать"],["travel","путешествовать"],["arrive","прибывать"],["decide","решать"],["try","пытаться, пробовать"]],
            ex: [
              { t: "gap", q: "We ___ (stop) for lunch.", a: ["stopped"] },
              { t: "gap", q: "She ___ (study) all night.", a: ["studied"] },
              { t: "gap", q: "They ___ (arrive) two hours ago.", a: ["arrived"] }
            ] },
          { id: "a2-1-2", title: "Неправильные глаголы", goal: "Использовать 20 самых частых неправильных глаголов.",
            theory: `<table><tr><th>Инфинитив</th><th>Past</th></tr>
<tr><td>go</td><td>went</td></tr><tr><td>have</td><td>had</td></tr><tr><td>see</td><td>saw</td></tr>
<tr><td>buy</td><td>bought</td></tr><tr><td>eat</td><td>ate</td></tr><tr><td>take</td><td>took</td></tr>
<tr><td>make</td><td>made</td></tr><tr><td>be</td><td>was / were</td></tr></table>
<p class="tip">Учите неправильные глаголы группами по похожему звучанию: buy–bought, bring–brought, think–thought.</p>`,
            vocab: [["went","пошёл (go)"],["saw","увидел (see)"],["bought","купил (buy)"],["ate","съел (eat)"],["took","взял (take)"],["made","сделал (make)"],["wrote","написал (write)"],["found","нашёл (find)"]],
            ex: [
              { t: "gap", q: "I ___ (go) to the cinema yesterday.", a: ["went"] },
              { t: "gap", q: "She ___ (buy) a new dress.", a: ["bought"] },
              { t: "gap", q: "We ___ (be) at home last night.", a: ["were"] }
            ] },
          { id: "a2-1-3", title: "Вопросы и отрицания в прошлом", goal: "Спрашивать о прошлом с did.",
            theory: `<div class="ex"><b>Did</b> you <b>see</b> the film? — Yes, I did.<br>I <b>didn't go</b> to work. (не didn't went!)<br>Where <b>did</b> she <b>go</b>?</div>
<p class="tip">Did уже показывает прошлое, поэтому глагол — в начальной форме.</p>`,
            vocab: [["holiday","отпуск, каникулы"],["weekend","выходные"],["beach","пляж"],["museum","музей"],["ticket","билет"],["hotel","отель"],["fly","лететь"],["stay","останавливаться"]],
            ex: [
              { t: "choice", q: "Did you ___ the museum?", o: ["visited", "visit", "visits"], a: 1 },
              { t: "choice", q: "He ___ call me.", o: ["didn't", "doesn't", "wasn't"], a: 0 },
              { t: "order", s: "Where did you stay" }
            ] }
        ]
      },
      {
        id: "a2-2", title: "Сейчас и в будущем",
        lessons: [
          { id: "a2-2-1", title: "Present Continuous", goal: "Описывать то, что происходит прямо сейчас.",
            theory: `<p>am / is / are + глагол<b>-ing</b></p>
<div class="ex">I <b>am reading</b> now. Look! It <b>is raining</b>. What <b>are</b> you <b>doing</b>?</div>
<p>Сравните: I <b>work</b> in a bank (всегда). I <b>am working</b> from home this week (временно).</p>`,
            vocab: [["now","сейчас"],["at the moment","в данный момент"],["look!","смотри!"],["rain","дождь / идти (о дожде)"],["wait","ждать"],["wear","носить (одежду)"],["listen","слушать"],["this week","на этой неделе"]],
            ex: [
              { t: "choice", q: "Listen! The baby ___.", o: ["cries", "is crying", "cry"], a: 1 },
              { t: "choice", q: "She usually ___ jeans.", o: ["wears", "is wearing"], a: 0 },
              { t: "order", s: "What are you doing now" }
            ] },
          { id: "a2-2-2", title: "Going to: планы", goal: "Говорить о планах и намерениях.",
            theory: `<div class="ex">I <b>am going to</b> learn Spanish next year.<br><b>Are</b> you <b>going to</b> buy a car?<br>Look at the clouds! It<b>'s going to</b> rain. (очевидно по признакам)</div>`,
            vocab: [["plan","план"],["next year","в следующем году"],["tomorrow","завтра"],["soon","скоро"],["move","переезжать"],["start","начинать"],["save money","копить деньги"],["learn","изучать"]],
            ex: [
              { t: "gap", q: "We ___ going to move next month.", a: ["are", "'re"] },
              { t: "order", s: "I am going to learn Spanish" },
              { t: "choice", q: "Look at that car! It ___ crash!", o: ["will", "is going to", "goes to"], a: 1 }
            ] },
          { id: "a2-2-3", title: "Will: решения и прогнозы", goal: "Принимать решения на ходу и делать предсказания.",
            theory: `<div class="ex">It's cold. — I<b>'ll close</b> the window. (решение в момент речи)<br>I think it <b>will</b> be sunny tomorrow. (мнение о будущем)<br>I <b>won't</b> tell anyone. (обещание)</div>`,
            vocab: [["promise","обещать"],["probably","вероятно"],["I think","я думаю"],["future","будущее"],["weather","погода"],["sunny","солнечный"],["won't","не будет (will not)"],["maybe","может быть"]],
            ex: [
              { t: "choice", q: "The phone is ringing. — I ___ answer it.", o: ["am going to", "'ll", "answer"], a: 1 },
              { t: "choice", q: "I promise I ___ be late.", o: ["won't", "don't", "am not going"], a: 0 },
              { t: "order", s: "I think it will rain tomorrow" }
            ] }
        ]
      },
      {
        id: "a2-3", title: "Сравнения",
        lessons: [
          { id: "a2-3-1", title: "Сравнительная степень", goal: "Сравнивать два предмета.",
            theory: `<ul><li>Короткие: + <b>-er than</b>: tall → taller than, big → bigger, happy → happier</li>
<li>Длинные: <b>more ... than</b>: more expensive than</li>
<li>Исключения: good → <b>better</b>, bad → <b>worse</b>, far → <b>further</b></li></ul>
<div class="ex">Moscow is <b>bigger than</b> Kazan. This book is <b>more interesting than</b> that one.</div>`,
            vocab: [["tall","высокий"],["cheap","дешёвый"],["interesting","интересный"],["difficult","трудный"],["better","лучше"],["worse","хуже"],["old","старый"],["fast","быстрый"]],
            ex: [
              { t: "gap", q: "A plane is ___ (fast) than a train.", a: ["faster"] },
              { t: "gap", q: "My cold is ___ (bad) today.", a: ["worse"] },
              { t: "choice", q: "Maths is ___ than art for me.", o: ["difficulter", "more difficult", "most difficult"], a: 1 }
            ] },
          { id: "a2-3-2", title: "Превосходная степень", goal: "Говорить о самом-самом.",
            theory: `<div class="ex">the tall<b>est</b> building, the bigg<b>est</b> city, the <b>most</b> beautiful place, the <b>best</b> / the <b>worst</b></div>
<p class="tip">Не забывайте <b>the</b>!</p>`,
            vocab: [["the best","лучший"],["the worst","худший"],["beautiful","красивый"],["famous","знаменитый"],["dangerous","опасный"],["in the world","в мире"],["mountain","гора"],["river","река"]],
            ex: [
              { t: "gap", q: "Everest is the ___ (high) mountain in the world.", a: ["highest"] },
              { t: "gap", q: "It's the ___ (good) day of my life!", a: ["best"] },
              { t: "choice", q: "She is the ___ person I know.", o: ["more famous", "most famous", "famousest"], a: 1 }
            ] },
          { id: "a2-3-3", title: "As ... as, too, enough", goal: "Говорить о равенстве и избытке.",
            theory: `<div class="ex">Tom is <b>as tall as</b> his father. (такой же)<br>It's <b>not as cold as</b> yesterday. (не такой, как)<br>This coffee is <b>too hot</b> to drink. (слишком)<br>He isn't <b>old enough</b> to drive. (достаточно — после прилагательного!)</div>`,
            vocab: [["too","слишком"],["enough","достаточно"],["as ... as","такой же ... как"],["hot","горячий"],["cold","холодный"],["young","молодой"],["strong","сильный"],["heavy","тяжёлый"]],
            ex: [
              { t: "choice", q: "The box is ___ to carry.", o: ["too heavy", "heavy enough", "enough heavy"], a: 0 },
              { t: "order", s: "She is as tall as her mother" },
              { t: "choice", q: "Are you ___ to lift this?", o: ["enough strong", "strong enough", "too strong"], a: 1 }
            ] }
        ]
      },
      {
        id: "a2-4", title: "Жизненный опыт",
        lessons: [
          { id: "a2-4-1", title: "Present Perfect: введение", goal: "Говорить об опыте без точного времени.",
            theory: `<p>have / has + 3-я форма глагола (V3)</p>
<div class="ex">I <b>have been</b> to London. She <b>has seen</b> this film. We <b>haven't tried</b> sushi.</div>
<p>Время не важно — важен результат или опыт.</p>`,
            vocab: [["been","был (V3 от be)"],["seen","видел (V3 от see)"],["done","сделал (V3 от do)"],["eaten","съел (V3 от eat)"],["tried","пробовал"],["met","встретил (V3 от meet)"],["experience","опыт"],["abroad","за границей"]],
            ex: [
              { t: "gap", q: "She ___ visited Japan twice.", a: ["has", "'s"] },
              { t: "gap", q: "I have never ___ (eat) octopus.", a: ["eaten"] },
              { t: "choice", q: "They ___ finished the project.", o: ["has", "have", "are"], a: 1 }
            ] },
          { id: "a2-4-2", title: "Ever, never, just, already, yet", goal: "Использовать маркеры Present Perfect.",
            theory: `<div class="ex">Have you <b>ever</b> been to Italy? — No, I've <b>never</b> been there.<br>I've <b>just</b> finished. (только что)<br>She's <b>already</b> left. (уже)<br>Have you done it <b>yet</b>? / I haven't done it <b>yet</b>. (уже? / ещё не — в конце)</div>`,
            vocab: [["ever","когда-либо"],["never","никогда"],["just","только что"],["already","уже"],["yet","ещё (не) / уже (в вопросе)"],["finish","заканчивать"],["leave","уходить"],["recently","недавно"]],
            ex: [
              { t: "choice", q: "Have you ___ ridden a horse?", o: ["ever", "yet", "already"], a: 0 },
              { t: "choice", q: "I haven't finished ___.", o: ["already", "yet", "just"], a: 1 },
              { t: "order", s: "I have just finished my homework" }
            ] },
          { id: "a2-4-3", title: "Present Perfect vs Past Simple", goal: "Выбирать время в зависимости от того, указан ли момент.",
            theory: `<table><tr><th>Present Perfect</th><th>Past Simple</th></tr>
<tr><td>Время не указано, связь с настоящим</td><td>Конкретное время в прошлом</td></tr>
<tr><td>I <b>have lost</b> my keys. (их нет сейчас)</td><td>I <b>lost</b> my keys <b>yesterday</b>.</td></tr>
<tr><td>Have you ever been to Rome?</td><td>When <b>did</b> you <b>go</b> there?</td></tr></table>`,
            vocab: [["lose","терять"],["break","ломать"],["win","выигрывать"],["last year","в прошлом году"],["in 2020","в 2020 году"],["so far","до сих пор"],["this year","в этом году"],["since","с (какого-то момента)"]],
            ex: [
              { t: "choice", q: "I ___ him last week.", o: ["have met", "met"], a: 1 },
              { t: "choice", q: "Oh no! I ___ my phone!", o: ["have broken", "broke"], a: 0 },
              { t: "choice", q: "When ___ you arrive?", o: ["have", "did"], a: 1 }
            ] }
        ]
      }
    ]
  },

  /* =========================== B1 =========================== */
  {
    id: "b1", code: "B1", name: "Intermediate", ru: "Средний",
    desc: "Свободное общение на знакомые темы, условные предложения, пассив.",
    goals: ["Связно рассказать историю, описать опыт и мечты", "Высказать мнение и коротко его обосновать", "Понимать главное в новостях и видео на знакомые темы", "Написать связный текст или письмо-жалобу"],
    intro: LEVEL_INTRO,
    modules: [
      {
        id: "b1-1", title: "Времена в повествовании",
        lessons: [
          { id: "b1-1-1", title: "Past Continuous", goal: "Описывать фон событий в прошлом.",
            theory: `<p>was / were + V-ing — процесс в определённый момент прошлого.</p>
<div class="ex">At 8 p.m. I <b>was having</b> dinner.<br>I <b>was walking</b> home <b>when</b> it <b>started</b> to rain. (длительное + короткое)<br><b>While</b> she <b>was cooking</b>, he <b>was reading</b>. (два процесса)</div>`,
            vocab: [["while","пока, в то время как"],["suddenly","внезапно"],["happen","случаться"],["notice","замечать"],["fall asleep","заснуть"],["ring","звонить"],["accident","авария, несчастный случай"],["witness","свидетель"]],
            ex: [
              { t: "choice", q: "I ___ TV when the phone rang.", o: ["watched", "was watching", "am watching"], a: 1 },
              { t: "choice", q: "While we were walking, we ___ an old friend.", o: ["were meeting", "met", "meet"], a: 1 },
              { t: "gap", q: "What ___ you doing at 10 last night?", a: ["were"] }
            ] },
          { id: "b1-1-2", title: "Used to", goal: "Говорить о прошлых привычках, которых больше нет.",
            theory: `<div class="ex">I <b>used to</b> smoke. (раньше курил, теперь нет)<br>Did you <b>use to</b> play football? I <b>didn't use to</b> like vegetables.</div>
<p class="tip">Не путайте: <b>be used to</b> doing = привык делать (I'm used to getting up early).</p>`,
            vocab: [["used to","раньше (делал)"],["childhood","детство"],["habit","привычка"],["be used to","быть привыкшим"],["get used to","привыкать"],["nowadays","в наше время"],["grow up","вырастать"],["remember","помнить"]],
            ex: [
              { t: "gap", q: "I ___ to live in Paris, but now I live in Rome.", a: ["used"] },
              { t: "choice", q: "Did you ___ to have long hair?", o: ["used", "use", "using"], a: 1 },
              { t: "choice", q: "I'm used to ___ early.", o: ["get up", "getting up", "got up"], a: 1 }
            ] },
          { id: "b1-1-3", title: "Present Perfect Continuous", goal: "Говорить о длительности действия до настоящего.",
            theory: `<p>have/has been + V-ing</p>
<div class="ex">I<b>'ve been learning</b> English <b>for</b> three years.<br>She<b>'s been waiting</b> <b>since</b> 9 o'clock.<br>You look tired. — I<b>'ve been running</b>.</div>
<p><b>for</b> + период (for two hours), <b>since</b> + точка отсчёта (since Monday).</p>`,
            vocab: [["for","в течение"],["since","с (момента)"],["how long","как долго"],["lately","в последнее время"],["recently","недавно"],["exhausted","измотанный"],["all day","весь день"],["queue","очередь"]],
            ex: [
              { t: "choice", q: "I've been living here ___ 2019.", o: ["for", "since", "from"], a: 1 },
              { t: "choice", q: "She's been working ___ six hours.", o: ["for", "since", "during"], a: 0 },
              { t: "order", s: "How long have you been learning English" }
            ] }
        ]
      },
      {
        id: "b1-2", title: "Условные предложения",
        lessons: [
          { id: "b1-2-1", title: "Zero и First Conditional", goal: "Говорить о фактах и реальных условиях.",
            theory: `<p><b>Zero</b>: If + Present, Present — всегда верно.</p><div class="ex">If you heat ice, it melts.</div>
<p><b>First</b>: If + Present, will + V — реальное будущее.</p><div class="ex">If it rains, I<b>'ll stay</b> at home.</div>
<p class="tip">После if в первом типе НЕ ставим will: If it <s>will rain</s> rains.</p>`,
            vocab: [["if","если"],["unless","если не"],["as soon as","как только"],["melt","таять"],["boil","кипеть"],["miss the bus","опоздать на автобус"],["pass an exam","сдать экзамен"],["fail","провалить"]],
            ex: [
              { t: "choice", q: "If you ___ hard, you'll pass.", o: ["will study", "study", "studied"], a: 1 },
              { t: "choice", q: "___ you hurry, you'll miss the train.", o: ["If", "Unless", "When"], a: 1 },
              { t: "gap", q: "If water reaches 100°C, it ___ (boil).", a: ["boils"] }
            ] },
          { id: "b1-2-2", title: "Second Conditional", goal: "Говорить о воображаемых ситуациях.",
            theory: `<p>If + Past Simple, would + V</p>
<div class="ex">If I <b>had</b> a million dollars, I <b>would travel</b> the world.<br>If I <b>were</b> you, I <b>would</b> call her. (совет)</div>
<p class="tip">С be в условии часто <b>were</b> для всех лиц: If I were, if he were.</p>`,
            vocab: [["would","бы"],["If I were you","на твоём месте"],["imagine","представлять"],["rich","богатый"],["lottery","лотерея"],["advice","совет"],["afford","позволить себе"],["choose","выбирать"]],
            ex: [
              { t: "choice", q: "If I ___ rich, I'd buy an island.", o: ["am", "were", "will be"], a: 1 },
              { t: "choice", q: "What would you do if you ___ the lottery?", o: ["win", "won", "would win"], a: 1 },
              { t: "order", s: "If I were you I would apologise" }
            ] },
          { id: "b1-2-3", title: "Wish (настоящее)", goal: "Выражать сожаление о настоящем.",
            theory: `<div class="ex">I <b>wish</b> I <b>had</b> more time. (жаль, что у меня мало времени)<br>I <b>wish</b> I <b>could</b> swim.<br>I <b>wish</b> it <b>weren't</b> so cold.</div>`,
            vocab: [["wish","желать, жалеть"],["regret","сожалеть"],["if only","если бы только"],["could","мог бы"],["patient","терпеливый"],["confident","уверенный"],["fluent","свободно говорящий"],["tall enough","достаточно высокий"]],
            ex: [
              { t: "choice", q: "I wish I ___ French.", o: ["speak", "spoke", "will speak"], a: 1 },
              { t: "choice", q: "I wish I ___ fly.", o: ["can", "could", "would can"], a: 1 },
              { t: "gap", q: "If ___ I were taller! (если бы только)", a: ["only"] }
            ] }
        ]
      },
      {
        id: "b1-3", title: "Модальные глаголы",
        lessons: [
          { id: "b1-3-1", title: "Must / have to / mustn't / don't have to", goal: "Говорить об обязанностях и запретах.",
            theory: `<ul><li><b>must</b> — внутренняя необходимость / правило: I must call mum.</li>
<li><b>have to</b> — внешняя необходимость: I have to wear a uniform.</li>
<li><b>mustn't</b> — запрет: You mustn't smoke here.</li>
<li><b>don't have to</b> — нет необходимости: You don't have to come.</li></ul>`,
            vocab: [["must","должен"],["have to","приходится"],["mustn't","нельзя"],["don't have to","не обязательно"],["rule","правило"],["allowed","разрешено"],["uniform","униформа"],["deadline","крайний срок"]],
            ex: [
              { t: "choice", q: "It's Sunday. I ___ get up early.", o: ["mustn't", "don't have to", "must"], a: 1 },
              { t: "choice", q: "You ___ touch that! It's dangerous.", o: ["mustn't", "don't have to"], a: 0 },
              { t: "choice", q: "She ___ work on Saturdays — it's in her contract.", o: ["has to", "must to", "have"], a: 0 }
            ] },
          { id: "b1-3-2", title: "Should / ought to", goal: "Давать советы.",
            theory: `<div class="ex">You <b>should</b> see a doctor. You <b>shouldn't</b> eat so much sugar.<br>You <b>ought to</b> apologise. (более формально)</div>`,
            vocab: [["should","следует"],["ought to","следовало бы"],["recommend","рекомендовать"],["suggest","предлагать"],["healthy","здоровый"],["habit","привычка"],["take a break","сделать перерыв"],["apologise","извиняться"]],
            ex: [
              { t: "choice", q: "You look tired. You ___ go to bed.", o: ["should", "shouldn't", "mustn't"], a: 0 },
              { t: "gap", q: "You ought ___ tell the truth.", a: ["to"] },
              { t: "order", s: "You should take a break" }
            ] },
          { id: "b1-3-3", title: "May / might / could — вероятность", goal: "Говорить о возможном.",
            theory: `<div class="ex">It <b>might</b> rain later. (~30%)<br>She <b>may</b> be at home. (~50%)<br>It <b>could</b> be true.<br>He <b>must</b> be tired — he worked all night. (почти уверен)<br>That <b>can't</b> be Tom — he's in Spain. (уверен, что нет)</div>`,
            vocab: [["might","может (быть)"],["possibly","возможно"],["certainly","безусловно"],["likely","вероятный"],["unlikely","маловероятный"],["guess","догадываться"],["sure","уверенный"],["perhaps","возможно"]],
            ex: [
              { t: "choice", q: "The lights are off. They ___ be out.", o: ["must", "can't", "should"], a: 0 },
              { t: "choice", q: "That ___ be true! It's impossible.", o: ["might", "can't", "must"], a: 1 },
              { t: "choice", q: "Take an umbrella. It ___ rain.", o: ["might", "must", "can't"], a: 0 }
            ] }
        ]
      },
      {
        id: "b1-4", title: "Пассив и косвенная речь",
        lessons: [
          { id: "b1-4-1", title: "Passive Voice", goal: "Говорить о действии, когда исполнитель не важен.",
            theory: `<p>be + V3</p>
<div class="ex">English <b>is spoken</b> all over the world. (Present)<br>The house <b>was built</b> in 1900. (Past)<br>The letter <b>will be sent</b> tomorrow. (Future)<br>Hamlet was written <b>by</b> Shakespeare.</div>`,
            vocab: [["build","строить"],["invent","изобретать"],["produce","производить"],["deliver","доставлять"],["steal","красть"],["translate","переводить"],["discover","открывать"],["by","кем (в пассиве)"]],
            ex: [
              { t: "gap", q: "Coffee ___ grown in Brazil. (Present)", a: ["is"] },
              { t: "gap", q: "My bike was ___ (steal) yesterday.", a: ["stolen"] },
              { t: "choice", q: "The telephone ___ by Bell.", o: ["invented", "was invented", "is inventing"], a: 1 }
            ] },
          { id: "b1-4-2", title: "Reported Speech", goal: "Передавать чужие слова.",
            theory: `<p>Время сдвигается на шаг назад:</p>
<div class="ex">"I <b>am</b> tired." → She said (that) she <b>was</b> tired.<br>"I <b>will</b> help." → He said he <b>would</b> help.<br>"I <b>saw</b> it." → He said he <b>had seen</b> it.<br>"Do you like it?" → She asked <b>if</b> I liked it.</div>
<p>say + (that), tell + <b>кому</b>: He told <b>me</b> that…</p>`,
            vocab: [["say","сказать"],["tell","сказать (кому-то)"],["ask","спросить"],["explain","объяснять"],["claim","утверждать"],["admit","признавать"],["reply","отвечать"],["whether","ли"]],
            ex: [
              { t: "choice", q: "She ___ me she was busy.", o: ["said", "told", "spoke"], a: 1 },
              { t: "choice", q: '"I can swim." → He said he ___ swim.', o: ["can", "could", "would"], a: 1 },
              { t: "choice", q: '"Are you ready?" → She asked ___ I was ready.', o: ["that", "if", "do"], a: 1 }
            ] },
          { id: "b1-4-3", title: "Relative clauses", goal: "Соединять предложения с who, which, that, where.",
            theory: `<div class="ex">The man <b>who</b> lives next door is a pilot. (люди)<br>The book <b>which / that</b> I bought is great. (предметы)<br>This is the café <b>where</b> we met. (место)<br>That's the girl <b>whose</b> brother is famous. (чей)</div>`,
            vocab: [["who","который (о людях)"],["which","который (о предметах)"],["whose","чей"],["where","где"],["neighbour","сосед"],["pilot","пилот"],["owner","владелец"],["describe","описывать"]],
            ex: [
              { t: "choice", q: "The woman ___ called you is my aunt.", o: ["which", "who", "where"], a: 1 },
              { t: "choice", q: "This is the town ___ I was born.", o: ["which", "where", "who"], a: 1 },
              { t: "choice", q: "I know a boy ___ father is a chef.", o: ["who", "whose", "which"], a: 1 }
            ] }
        ]
      }
    ]
  },

  /* =========================== B2 =========================== */
  {
    id: "b2", code: "B2", name: "Upper-Intermediate", ru: "Выше среднего",
    desc: "Сложная грамматика, фразовые глаголы, аргументированная речь и эссе.",
    goals: ["Свободно участвовать в дискуссии с носителями", "Понимать фильмы и лекции на литературном языке", "Написать эссе с аргументами за и против", "Пройти собеседование и выступить на совещании"],
    intro: LEVEL_INTRO,
    modules: [
      {
        id: "b2-1", title: "Нарративные времена",
        lessons: [
          { id: "b2-1-1", title: "Past Perfect", goal: "Показывать, что одно событие было раньше другого.",
            theory: `<p>had + V3 — «прошлое в прошлом».</p>
<div class="ex">When I arrived, the train <b>had</b> already <b>left</b>.<br>She <b>had never seen</b> snow before she moved to Canada.</div>
<p>Past Perfect Continuous: He was tired because he <b>had been working</b> all day.</p>`,
            vocab: [["by the time","к тому времени как"],["before","до того как"],["realise","осознать"],["already","уже"],["previously","ранее"],["turn out","оказаться"],["disappear","исчезать"],["unexpected","неожиданный"]],
            ex: [
              { t: "choice", q: "By the time we got there, the film ___.", o: ["started", "had started", "has started"], a: 1 },
              { t: "choice", q: "I realised I ___ my wallet at home.", o: ["had left", "have left", "was leaving"], a: 0 },
              { t: "gap", q: "Her eyes were red. She had ___ crying.", a: ["been"] }
            ] },
          { id: "b2-1-2", title: "Future Continuous и Future Perfect", goal: "Говорить о процессах и результатах в будущем.",
            theory: `<div class="ex">This time tomorrow I <b>will be lying</b> on a beach. (процесс в момент будущего)<br>By 2030 I <b>will have finished</b> university. (завершится к моменту)</div>`,
            vocab: [["by then","к тому времени"],["this time next week","в это время на следующей неделе"],["complete","завершать"],["retire","выйти на пенсию"],["achieve","достигать"],["goal","цель"],["career","карьера"],["in a decade","через десятилетие"]],
            ex: [
              { t: "choice", q: "Don't call at 9 — I ___ my exam then.", o: ["will be taking", "will have taken", "take"], a: 0 },
              { t: "choice", q: "By June, she ___ her thesis.", o: ["will be writing", "will have written", "writes"], a: 1 },
              { t: "order", s: "This time tomorrow I will be flying to Rome" }
            ] },
          { id: "b2-1-3", title: "Третий и смешанный тип условий", goal: "Говорить о нереальном прошлом и его последствиях.",
            theory: `<p><b>Third</b>: If + had V3, would have V3 — о прошлом, которое уже не изменить.</p>
<div class="ex">If I <b>had studied</b>, I <b>would have passed</b>.</div>
<p><b>Mixed</b>: прошлое условие → настоящий результат.</p>
<div class="ex">If I <b>had taken</b> that job, I <b>would be</b> rich now.</div>
<p>I wish I <b>had known</b>. — Жаль, что я не знал.</p>`,
            vocab: [["would have","было бы"],["missed opportunity","упущенная возможность"],["consequence","последствие"],["avoid","избегать"],["warn","предупреждать"],["in time","вовремя"],["blame","винить"],["mistake","ошибка"]],
            ex: [
              { t: "choice", q: "If you ___ me, I would have helped.", o: ["told", "had told", "would tell"], a: 1 },
              { t: "choice", q: "If I hadn't missed the bus, I ___ here now.", o: ["would be", "would have been", "will be"], a: 0 },
              { t: "gap", q: "I wish I ___ listened to you.", a: ["had"] }
            ] }
        ]
      },
      {
        id: "b2-2", title: "Глагольные конструкции",
        lessons: [
          { id: "b2-2-1", title: "Gerund или Infinitive", goal: "Правильно выбирать -ing или to + V после глаголов.",
            theory: `<p><b>+ -ing</b>: enjoy, avoid, mind, suggest, finish, consider, can't stand.</p>
<p><b>+ to</b>: want, decide, hope, agree, refuse, manage, afford.</p>
<p><b>Меняется смысл</b>:</p>
<div class="ex">I <b>stopped smoking</b>. (бросил) — I <b>stopped to smoke</b>. (остановился, чтобы закурить)<br><b>Remember to lock</b> the door. (не забудь) — I <b>remember locking</b> it. (помню, как запер)</div>`,
            vocab: [["avoid","избегать"],["consider","рассматривать"],["refuse","отказываться"],["manage","суметь"],["afford","позволить себе"],["can't stand","терпеть не могу"],["regret","сожалеть"],["mind","возражать"]],
            ex: [
              { t: "choice", q: "She refused ___ the question.", o: ["answering", "to answer"], a: 1 },
              { t: "choice", q: "I can't stand ___ in queues.", o: ["waiting", "to wait"], a: 0 },
              { t: "choice", q: "He stopped ___ a coffee on the way.", o: ["buying", "to buy"], a: 1 }
            ] },
          { id: "b2-2-2", title: "Have something done", goal: "Говорить об услугах, которые для вас делают другие.",
            theory: `<div class="ex">I <b>had my hair cut</b>. (меня подстригли)<br>We're <b>having our kitchen redecorated</b>.<br>She <b>got her phone repaired</b>. (разг.)</div>`,
            vocab: [["haircut","стрижка"],["repair","ремонтировать"],["redecorate","делать ремонт"],["service","обслуживать (машину)"],["deliver","доставлять"],["check","проверять"],["install","устанавливать"],["dry-clean","сдавать в химчистку"]],
            ex: [
              { t: "order", s: "I had my car serviced last week" },
              { t: "choice", q: "We need to ___ the roof repaired.", o: ["have", "make", "do"], a: 0 },
              { t: "gap", q: "She had her teeth ___ (check).", a: ["checked"] }
            ] },
          { id: "b2-2-3", title: "Модальные глаголы о прошлом", goal: "Делать выводы и упрекать о прошлом.",
            theory: `<div class="ex">He <b>must have forgotten</b>. (наверняка забыл)<br>She <b>can't have seen</b> us. (не может быть, что видела)<br>They <b>might have got</b> lost. (возможно)<br>You <b>should have told</b> me! (надо было)</div>`,
            vocab: [["must have","должно быть (о прошлом)"],["should have","следовало"],["needn't have","не нужно было"],["assume","предполагать"],["conclude","делать вывод"],["evidence","доказательство"],["clue","подсказка, улика"],["obviously","очевидно"]],
            ex: [
              { t: "choice", q: "The ground is wet. It ___ rained.", o: ["must have", "can't have", "should have"], a: 0 },
              { t: "choice", q: "You ___ called! I was worried.", o: ["should have", "must have", "can't have"], a: 0 },
              { t: "choice", q: "He ___ stolen it — he was with me.", o: ["must have", "can't have", "might have"], a: 1 }
            ] }
        ]
      },
      {
        id: "b2-3", title: "Лексика: беглость",
        lessons: [
          { id: "b2-3-1", title: "Фразовые глаголы: работа и учёба", goal: "Понимать и использовать 10 ключевых фразовых глаголов.",
            theory: `<div class="ex">I need to <b>catch up on</b> my emails. (наверстать)<br>She <b>came up with</b> a great idea. (придумала)<br>Don't <b>give up</b>! (не сдавайся)<br>We <b>ran out of</b> time. (закончилось)<br>Can you <b>look into</b> this problem? (разобраться)</div>`,
            vocab: [["catch up on","наверстать"],["come up with","придумать"],["give up","сдаться, бросить"],["run out of","израсходовать"],["look into","изучить, расследовать"],["put off","откладывать"],["carry out","выполнять"],["figure out","разобраться"]],
            ex: [
              { t: "choice", q: "We've ___ milk. Can you buy some?", o: ["run out of", "given up", "put off"], a: 0 },
              { t: "choice", q: "Stop ___ the meeting — let's do it today.", o: ["carrying out", "putting off", "looking into"], a: 1 },
              { t: "gap", q: "Who came up ___ this plan?", a: ["with"] }
            ] },
          { id: "b2-3-2", title: "Коллокации", goal: "Использовать естественные сочетания слов.",
            theory: `<p>make или do?</p>
<div class="ex"><b>make</b> a decision, a mistake, money, progress, an effort<br><b>do</b> homework, research, business, your best, damage</div>
<p>Сильные сочетания: <b>heavy</b> rain, <b>strong</b> coffee, <b>take</b> a risk, <b>pay</b> attention.</p>`,
            vocab: [["make a decision","принять решение"],["make progress","добиваться прогресса"],["do research","проводить исследование"],["take a risk","рисковать"],["pay attention","обращать внимание"],["heavy traffic","плотное движение"],["raise awareness","повышать осведомлённость"],["meet a deadline","уложиться в срок"]],
            ex: [
              { t: "choice", q: "___ a mistake", o: ["do", "make"], a: 1 },
              { t: "choice", q: "___ research", o: ["do", "make"], a: 0 },
              { t: "choice", q: "___ rain", o: ["strong", "heavy", "big"], a: 1 }
            ] },
          { id: "b2-3-3", title: "Словообразование", goal: "Образовывать новые слова приставками и суффиксами.",
            theory: `<ul><li>Сущ.: -tion (inform → information), -ment (develop → development), -ness (happy → happiness), -ity (able → ability)</li>
<li>Прил.: -ful, -less, -able, -ous, -ive (care → careful / careless)</li>
<li>Отрицание: un-, in-, im-, dis-, ir- (possible → impossible, regular → irregular)</li></ul>`,
            vocab: [["development","развитие"],["happiness","счастье"],["ability","способность"],["careless","небрежный"],["reliable","надёжный"],["dangerous","опасный"],["impossible","невозможный"],["disagree","не соглашаться"]],
            ex: [
              { t: "gap", q: "Her ___ (kind) surprised everyone.", a: ["kindness"] },
              { t: "gap", q: "That's ___ (possible)! (отрицание)", a: ["impossible"] },
              { t: "gap", q: "The ___ (develop) of AI is fast.", a: ["development"] }
            ] }
        ]
      },
      {
        id: "b2-4", title: "Аргументация и письмо",
        lessons: [
          { id: "b2-4-1", title: "Слова-связки", goal: "Логично связывать мысли в речи и на письме.",
            theory: `<ul><li>Добавление: moreover, furthermore, in addition</li><li>Контраст: however, although, whereas, on the other hand, despite + noun</li>
<li>Причина/следствие: therefore, as a result, due to, consequently</li><li>Вывод: in conclusion, to sum up, overall</li></ul>
<div class="ex"><b>Although</b> it was raining, we went out. <b>Despite</b> the rain, we went out.</div>`,
            vocab: [["however","однако"],["moreover","более того"],["although","хотя"],["despite","несмотря на"],["therefore","поэтому"],["whereas","тогда как"],["due to","из-за"],["in conclusion","в заключение"]],
            ex: [
              { t: "choice", q: "___ being tired, she finished the report.", o: ["Although", "Despite", "However"], a: 1 },
              { t: "choice", q: "It's expensive. ___, it's worth it.", o: ["However", "Therefore", "Despite"], a: 0 },
              { t: "choice", q: "He was ill; ___, he missed the exam.", o: ["although", "therefore", "whereas"], a: 1 }
            ] },
          { id: "b2-4-2", title: "Выражение мнения и несогласия", goal: "Вежливо спорить и аргументировать.",
            theory: `<div class="ex"><b>In my view</b>, … / <b>As far as I'm concerned</b>, …<br><b>I see your point, but</b> … / <b>I'm not sure I agree</b> …<br><b>That's a fair point.</b> / <b>I couldn't agree more.</b></div>`,
            vocab: [["in my view","на мой взгляд"],["I see your point","понимаю вашу мысль"],["fair point","справедливое замечание"],["I couldn't agree more","полностью согласен"],["argue","утверждать, спорить"],["convince","убеждать"],["opinion","мнение"],["evidence","доказательства"]],
            ex: [
              { t: "choice", q: "Какая фраза выражает полное согласие?", o: ["I see your point, but…", "I couldn't agree more.", "I'm not sure about that."], a: 1 },
              { t: "order", s: "As far as I'm concerned it's a bad idea" },
              { t: "choice", q: "Вежливое несогласие:", o: ["You're wrong.", "I see what you mean, but…", "No way."], a: 1 },
              { t: "gap", q: "I couldn't agree ___. (полностью согласен)", a: ["more"] }
            ] },
          { id: "b2-4-3", title: "Эссе: структура", goal: "Писать эссе-мнение из 4–5 абзацев.",
            theory: `<ol><li><b>Введение</b>: перефразируйте тему, дайте свою позицию.</li><li><b>Аргумент 1</b> + пример.</li>
<li><b>Аргумент 2</b> + пример.</li><li><b>Контраргумент</b> и его опровержение.</li><li><b>Заключение</b>: повторите позицию другими словами.</li></ol>
<p class="tip">Каждый абзац начинайте с topic sentence — предложения с главной мыслью.</p>`,
            vocab: [["topic sentence","главное предложение абзаца"],["paraphrase","перефразировать"],["counterargument","контраргумент"],["it is often argued","часто утверждается"],["for instance","например"],["to illustrate","для иллюстрации"],["outweigh","перевешивать"],["drawback","недостаток"]],
            ex: [
              { t: "choice", q: "Где обычно указывается позиция автора?", o: ["Только в заключении", "Во введении и заключении", "Только в аргументах"], a: 1 },
              { t: "choice", q: "Что открывает абзац?", o: ["Topic sentence", "Пример", "Вывод"], a: 0 },
              { t: "order", s: "In my opinion the advantages outweigh the drawbacks" }
            ] }
        ]
      }
    ]
  },

  /* =========================== C1 =========================== */
  {
    id: "c1", code: "C1", name: "Advanced", ru: "Продвинутый",
    desc: "Стилистическая гибкость, сложный синтаксис, академический и деловой английский.",
    goals: ["Говорить бегло, почти не подбирая слов", "Понимать подтекст, иронию и длинные сложные тексты", "Переключаться между деловым, академическим и разговорным стилем", "Вести переговоры, презентации и дебаты"],
    intro: LEVEL_INTRO,
    modules: [
      {
        id: "c1-1", title: "Эмфаза и порядок слов",
        lessons: [
          { id: "c1-1-1", title: "Инверсия", goal: "Усиливать высказывание с помощью инверсии.",
            theory: `<div class="ex"><b>Never have I seen</b> such a mess.<br><b>Not only did she win</b>, but she also broke the record.<br><b>Hardly had</b> we arrived <b>when</b> it started to rain.<br><b>Had I known</b>, I would have come. (= If I had known)</div>`,
            vocab: [["never","никогда"],["rarely","редко"],["not only … but also","не только … но и"],["hardly … when","едва … как"],["no sooner … than","не успел … как"],["under no circumstances","ни при каких обстоятельствах"],["little did I know","я и не подозревал"],["only then","только тогда"]],
            ex: [
              { t: "choice", q: "Rarely ___ such talent.", o: ["we see", "do we see", "we do see"], a: 1 },
              { t: "choice", q: "No sooner had I sat down ___ the phone rang.", o: ["when", "than", "that"], a: 1 },
              { t: "order", s: "Under no circumstances should you open this door" }
            ] },
          { id: "c1-1-2", title: "Cleft sentences", goal: "Выделять главное с помощью It is… / What…",
            theory: `<div class="ex"><b>It was</b> Tom <b>who</b> broke the window. (а не кто-то другой)<br><b>What</b> I need <b>is</b> a holiday.<br><b>All</b> I want <b>is</b> some peace.<br><b>The reason why</b> I left <b>was</b> the salary.</div>`,
            vocab: [["emphasise","подчёркивать"],["highlight","выделять"],["focus","фокус"],["the thing is","дело в том, что"],["what matters is","важно то, что"],["it was … that","именно … (выделение)"],["peace and quiet","тишина и покой"],["point","суть"]],
            ex: [
              { t: "order", s: "What I really need is a long holiday" },
              { t: "choice", q: "It was in Paris ___ they first met.", o: ["where", "that", "which"], a: 1 },
              { t: "gap", q: "___ I want is the truth. (Всё, что)", a: ["All"] }
            ] },
          { id: "c1-1-3", title: "Participle clauses", goal: "Сокращать придаточные с помощью причастий.",
            theory: `<div class="ex"><b>Feeling</b> tired, I went to bed. (= Because I felt tired)<br><b>Having finished</b> the report, she left. (= After she had finished)<br><b>Built</b> in 1890, the bridge is still in use. (пассив)</div>`,
            vocab: [["having done","сделав"],["once completed","после завершения"],["given that","учитывая, что"],["provided that","при условии, что"],["considering","учитывая"],["concise","лаконичный"],["clause","придаточное предложение"],["subject","подлежащее"]],
            ex: [
              { t: "choice", q: "___ the email, he closed his laptop.", o: ["Having sent", "Sent", "Sending had"], a: 0 },
              { t: "choice", q: "___ by millions, the song became a hit.", o: ["Loving", "Loved", "Having loved"], a: 1 },
              { t: "choice", q: "___ that she's new, she's doing well.", o: ["Given", "Giving", "Gave"], a: 0 }
            ] }
        ]
      },
      {
        id: "c1-2", title: "Формальный и академический регистр",
        lessons: [
          { id: "c1-2-1", title: "Безличный пассив", goal: "Передавать мнения без указания источника.",
            theory: `<div class="ex"><b>It is said that</b> he is a millionaire. = He <b>is said to be</b> a millionaire.<br><b>It is believed that</b> the painting was stolen. = The painting <b>is believed to have been</b> stolen.</div>`,
            vocab: [["it is thought","считается"],["it is reported","сообщается"],["allegedly","предположительно"],["is said to","говорят, что"],["is believed to","считается, что"],["is expected to","ожидается"],["is known to","известно, что"],["rumour","слух"]],
            ex: [
              { t: "choice", q: "The CEO is expected ___ next month.", o: ["resigning", "to resign", "resign"], a: 1 },
              { t: "choice", q: "He is believed ___ the country last year.", o: ["to leave", "to have left", "leaving"], a: 1 },
              { t: "gap", q: "It ___ reported that prices will rise.", a: ["is"] }
            ] },
          { id: "c1-2-2", title: "Hedging: осторожные формулировки", goal: "Смягчать утверждения в академической речи.",
            theory: `<div class="ex">This <b>suggests</b> that … / It <b>would appear</b> that … / There is <b>a tendency</b> to …<br>The results <b>may indicate</b> … / <b>To some extent</b>, … / It <b>could be argued</b> that …</div>
<p class="tip">Сравните: "Smoking causes cancer" vs "Smoking is likely to increase the risk of cancer".</p>`,
            vocab: [["suggest","указывать на"],["tend to","иметь тенденцию"],["to some extent","в некоторой степени"],["arguably","пожалуй"],["presumably","предположительно"],["indicate","указывать"],["somewhat","в некоторой мере"],["it could be argued","можно утверждать"]],
            ex: [
              { t: "choice", q: "Какая фраза более осторожная?", o: ["This proves that…", "This suggests that…", "This shows clearly…"], a: 1 },
              { t: "order", s: "It could be argued that the data is incomplete" },
              { t: "gap", q: "People ___ to spend more in December. (имеют тенденцию)", a: ["tend"] }
            ] },
          { id: "c1-2-3", title: "Номинализация", goal: "Делать текст более формальным с помощью существительных.",
            theory: `<div class="ex">Prices <b>increased</b> sharply, which <b>worried</b> investors. →<br>The sharp <b>increase</b> in prices caused investor <b>concern</b>.</div>
<p>Формальный стиль предпочитает существительные глаголам.</p>`,
            vocab: [["increase","рост"],["decline","спад"],["concern","обеспокоенность"],["implementation","внедрение"],["assessment","оценка"],["reliance","зависимость"],["significant","значительный"],["subsequent","последующий"]],
            ex: [
              { t: "gap", q: "They decided → their ___", a: ["decision"] },
              { t: "gap", q: "The economy grew → economic ___", a: ["growth"] },
              { t: "gap", q: "We analysed → our ___", a: ["analysis"] }
            ] }
        ]
      },
      {
        id: "c1-3", title: "Идиоматичность",
        lessons: [
          { id: "c1-3-1", title: "Идиомы: работа и деньги", goal: "Понимать распространённые бизнес-идиомы.",
            theory: `<div class="ex">We need to <b>think outside the box</b>. (мыслить нестандартно)<br>Let's <b>get the ball rolling</b>. (начать)<br>It <b>cost an arm and a leg</b>. (очень дорого)<br>Back <b>to the drawing board</b>. (начать заново)</div>`,
            vocab: [["think outside the box","мыслить нестандартно"],["get the ball rolling","запустить процесс"],["cost an arm and a leg","стоить целое состояние"],["back to the drawing board","начать всё сначала"],["cut corners","экономить на качестве"],["on the same page","на одной волне"],["the bottom line","суть, итог"],["a long shot","маловероятная попытка"]],
            ex: [
              { t: "choice", q: "'Let's make sure we're on the same page' означает:", o: ["читаем одну книгу", "одинаково понимаем ситуацию", "сидим рядом"], a: 1 },
              { t: "choice", q: "'Don't cut corners' означает:", o: ["не срезай путь", "не экономь на качестве", "не спеши"], a: 1 },
              { t: "gap", q: "That watch cost an arm and a ___!", a: ["leg"] }
            ] },
          { id: "c1-3-2", title: "Фразовые глаголы C1", goal: "Расширить запас многозначных фразовых глаголов.",
            theory: `<div class="ex">The deal <b>fell through</b>. (сорвалась)<br>She <b>brought up</b> an interesting point. (подняла)<br>Can you <b>account for</b> the difference? (объяснить)<br>I can't <b>put up with</b> this noise. (терпеть)</div>`,
            vocab: [["fall through","сорваться"],["bring up","поднять (тему)"],["account for","объяснять"],["put up with","мириться с"],["live up to","оправдать (ожидания)"],["come across","наткнуться; производить впечатление"],["rule out","исключать"],["phase out","постепенно отменять"]],
            ex: [
              { t: "choice", q: "The film didn't ___ the hype.", o: ["live up to", "put up with", "bring up"], a: 0 },
              { t: "choice", q: "Police have ___ murder.", o: ["ruled out", "fallen through", "come across"], a: 0 },
              { t: "gap", q: "Our holiday plans fell ___.", a: ["through"] }
            ] },
          { id: "c1-3-3", title: "Оттенки значения синонимов", goal: "Различать близкие по смыслу слова.",
            theory: `<div class="ex"><b>look</b> — <b>glance</b> (мельком) — <b>stare</b> (пристально) — <b>gaze</b> (долго, мечтательно) — <b>peer</b> (вглядываться)<br><b>walk</b> — <b>stroll</b> (прогуливаться) — <b>stride</b> (широко шагать) — <b>stagger</b> (шататься)</div>`,
            vocab: [["glance","взглянуть мельком"],["stare","пристально смотреть"],["gaze","долго смотреть"],["peer","вглядываться"],["stroll","прогуливаться"],["stride","шагать широко"],["stagger","идти шатаясь"],["tiptoe","идти на цыпочках"]],
            ex: [
              { t: "choice", q: "He ___ at his watch and hurried off.", o: ["stared", "glanced", "gazed"], a: 1 },
              { t: "choice", q: "We ___ along the beach at sunset.", o: ["strolled", "staggered", "strode"], a: 0 },
              { t: "choice", q: "She ___ into the dark room.", o: ["peered", "glanced", "strolled"], a: 0 }
            ] }
        ]
      },
      {
        id: "c1-4", title: "Профессиональная коммуникация",
        lessons: [
          { id: "c1-4-1", title: "Презентации", goal: "Структурировать и вести публичное выступление.",
            theory: `<div class="ex"><b>I'd like to start by</b> … / <b>Moving on to</b> … / <b>As you can see from this graph</b> …<br><b>To recap</b> … / <b>I'd be happy to take any questions.</b></div>`,
            vocab: [["outline","изложить в общих чертах"],["moving on","переходя к"],["to recap","подведём итог"],["slide","слайд"],["key takeaway","главный вывод"],["elaborate","подробно объяснить"],["audience","аудитория"],["engage","вовлекать"]],
            ex: [
              { t: "order", s: "I'd like to start by outlining the main points" },
              { t: "choice", q: "Фраза для перехода:", o: ["To recap…", "Moving on to…", "Thank you for listening"], a: 1 },
              { t: "choice", q: "'Could you elaborate?' означает:", o: ["Можете уточнить подробнее?", "Можете закончить?", "Можете повторить?"], a: 0 },
              { t: "gap", q: "I'd like to start ___ outlining the main points.", a: ["by"], explain: "start by + -ing: начать с того, чтобы…" }
            ] },
          { id: "c1-4-2", title: "Переговоры", goal: "Предлагать, уступать и договариваться.",
            theory: `<div class="ex"><b>Would you be willing to</b> …? / <b>We could consider</b> … <b>provided that</b> …<br><b>That's not quite what we had in mind.</b> / <b>Let's meet halfway.</b></div>`,
            vocab: [["willing","готовый"],["compromise","компромисс"],["meet halfway","пойти навстречу"],["concession","уступка"],["leverage","рычаг влияния"],["terms","условия"],["counteroffer","встречное предложение"],["deal-breaker","неприемлемое условие"]],
            ex: [
              { t: "choice", q: "Вежливый отказ:", o: ["No.", "That's not quite what we had in mind.", "Forget it."], a: 1 },
              { t: "gap", q: "We could offer a discount, provided ___ you order 500 units.", a: ["that"] },
              { t: "order", s: "Would you be willing to meet us halfway" }
            ] },
          { id: "c1-4-3", title: "Деловая переписка", goal: "Писать формальные письма.",
            theory: `<div class="ex"><b>I am writing with regard to</b> … / <b>Please find attached</b> …<br><b>I would be grateful if you could</b> … / <b>I look forward to hearing from you.</b><br><b>Kind regards</b> / <b>Yours sincerely</b> (если знаете имя) / <b>Yours faithfully</b> (если нет)</div>`,
            vocab: [["with regard to","касательно"],["attached","прилагаемый"],["grateful","признательный"],["at your earliest convenience","при первой возможности"],["regarding","относительно"],["enquiry","запрос"],["follow up","последующее письмо"],["acknowledge","подтверждать получение"]],
            ex: [
              { t: "choice", q: "Dear Sir or Madam, … ___", o: ["Yours sincerely", "Yours faithfully", "Love"], a: 1 },
              { t: "order", s: "I look forward to hearing from you" },
              { t: "gap", q: "Please find ___ the invoice.", a: ["attached"] }
            ] }
        ]
      }
    ]
  },

  /* =========================== C2 =========================== */
  {
    id: "c2", code: "C2", name: "Proficiency", ru: "Владение в совершенстве",
    desc: "Тонкости стиля, редкая лексика, риторика, подготовка к C2 Proficiency.",
    goals: ["Понимать практически всё, включая быструю речь и литературу", "Точно передавать тонкие оттенки смысла", "Убеждать с помощью риторических приёмов", "Обобщать информацию из разных источников"],
    intro: LEVEL_INTRO,
    modules: [
      {
        id: "c2-1", title: "Грамматика нюансов",
        lessons: [
          { id: "c2-1-1", title: "Сослагательное наклонение", goal: "Использовать subjunctive в формальной речи.",
            theory: `<div class="ex">It is essential that he <b>be</b> present. (не is)<br>I suggest that she <b>attend</b> the meeting. (не attends)<br>It's high time we <b>left</b>. / I'd rather you <b>didn't</b> smoke.<br><b>Were</b> it not for your help, we'd have failed.</div>`,
            vocab: [["essential","необходимый"],["insist","настаивать"],["it's high time","давно пора"],["I'd rather","я бы предпочёл"],["as it were","так сказать"],["be that as it may","как бы то ни было"],["so be it","да будет так"],["were it not for","если бы не"]],
            ex: [
              { t: "choice", q: "The board insists that the CEO ___ immediately.", o: ["resigns", "resign", "resigned"], a: 1 },
              { t: "choice", q: "It's high time you ___ a job.", o: ["get", "got", "will get"], a: 1 },
              { t: "gap", q: "___ it not for the rain, we'd go. (Если бы не)", a: ["Were"] }
            ] },
          { id: "c2-1-2", title: "Эллипсис и субституция", goal: "Избегать повторов как носитель.",
            theory: `<div class="ex">— Are you coming? — I hope <b>so</b>. / I'm afraid <b>not</b>.<br>She can swim and <b>so can</b> I.<br>I wanted to go but I couldn't (go).<br>— Will it rain? — It <b>might</b> (rain).</div>`,
            vocab: [["I hope so","надеюсь, что да"],["I'm afraid not","боюсь, что нет"],["so do I","я тоже"],["neither do I","я тоже нет"],["I suppose so","полагаю, да"],["if so","если так"],["if not","если нет"],["the former / the latter","первый / последний"]],
            ex: [
              { t: "choice", q: "— I don't like jazz. — ___", o: ["So do I.", "Neither do I.", "I don't too."], a: 1 },
              { t: "choice", q: "— Is it going to be expensive? — I'm afraid ___.", o: ["so", "not", "yes"], a: 0 },
              { t: "gap", q: "He's tired and so ___ I. (I am tired too)", a: ["am"] }
            ] },
          { id: "c2-1-3", title: "Тонкости модальности", goal: "Передавать тончайшие оттенки уверенности и отношения.",
            theory: `<div class="ex">You <b>might have told</b> me! (упрёк)<br>I <b>should think</b> so! (возмущение / подтверждение)<br>He <b>would</b> say that, wouldn't he? (типично для него)<br>You <b>needn't have bothered</b>. (зря беспокоились)<br>She <b>will</b> keep interrupting. (раздражающая привычка)</div>`,
            vocab: [["needn't have","не нужно было (но сделали)"],["might have","могли бы (упрёк)"],["bound to","обязательно (случится)"],["be supposed to","предполагается"],["dare","сметь"],["would","(типичное поведение)"],["shall","(формальное обязательство)"],["reproach","упрёк"]],
            ex: [
              { t: "choice", q: "It's bound ___ rain — it always does.", o: ["to", "for", "that"], a: 0 },
              { t: "choice", q: "You ___ have brought wine — we have plenty!", o: ["needn't", "mustn't", "couldn't"], a: 0 },
              { t: "choice", q: "'He WOULD forget my birthday' выражает:", o: ["условие", "раздражение типичным поведением", "будущее"], a: 1 }
            ] }
        ]
      },
      {
        id: "c2-2", title: "Лексика мастера",
        lessons: [
          { id: "c2-2-1", title: "Пословицы и поговорки", goal: "Понимать и уместно использовать пословицы.",
            theory: `<div class="ex"><b>Every cloud has a silver lining.</b> — Нет худа без добра.<br><b>Don't count your chickens before they hatch.</b> — Цыплят по осени считают.<br><b>The proof of the pudding is in the eating.</b> — Всё проверяется на практике.</div>`,
            vocab: [["every cloud has a silver lining","нет худа без добра"],["when in Rome","в чужой монастырь со своим уставом не ходят"],["the early bird catches the worm","кто рано встаёт, тому Бог подаёт"],["a blessing in disguise","не было бы счастья, да несчастье помогло"],["let sleeping dogs lie","не буди лихо"],["actions speak louder than words","судят по делам, а не по словам"],["burn the midnight oil","работать допоздна"],["a storm in a teacup","буря в стакане воды"]],
            ex: [
              { t: "choice", q: "Losing that job was a blessing in ___.", o: ["disguise", "silence", "mask"], a: 0 },
              { t: "choice", q: "'A storm in a teacup' — это:", o: ["серьёзная проблема", "много шума из ничего", "плохая погода"], a: 1 },
              { t: "gap", q: "Actions speak louder than ___.", a: ["words"] }
            ] },
          { id: "c2-2-2", title: "Редкая и книжная лексика", goal: "Расширить словарь для чтения серьёзной литературы.",
            theory: `<p>На уровне C2 важно узнавать слова, характерные для качественной прессы и литературы.</p>
<div class="ex">His <b>ubiquitous</b> presence … / an <b>ephemeral</b> trend / a <b>meticulous</b> analysis / <b>ambivalent</b> feelings</div>`,
            vocab: [["ubiquitous","вездесущий"],["ephemeral","мимолётный"],["meticulous","скрупулёзный"],["ambivalent","противоречивый (о чувствах)"],["pragmatic","прагматичный"],["eloquent","красноречивый"],["scrutiny","тщательная проверка"],["candid","откровенный"]],
            ex: [
              { t: "choice", q: "Smartphones are now ___.", o: ["ubiquitous", "ephemeral", "candid"], a: 0 },
              { t: "choice", q: "Fame on social media is often ___.", o: ["meticulous", "ephemeral", "eloquent"], a: 1 },
              { t: "choice", q: "She gave an ___ speech that moved everyone.", o: ["eloquent", "ambivalent", "ubiquitous"], a: 0 }
            ] },
          { id: "c2-2-3", title: "Продвинутые коллокации", goal: "Звучать естественно в формальном контексте.",
            theory: `<div class="ex"><b>bitterly</b> disappointed, <b>deeply</b> concerned, <b>highly</b> unlikely, <b>utterly</b> ridiculous<br><b>a sweeping</b> generalisation, <b>a vested</b> interest, <b>a foregone</b> conclusion</div>`,
            vocab: [["bitterly disappointed","горько разочарован"],["highly unlikely","крайне маловероятно"],["utterly ridiculous","совершенно нелепо"],["sweeping generalisation","огульное обобщение"],["vested interest","личная заинтересованность"],["foregone conclusion","предрешённый исход"],["blatant lie","откровенная ложь"],["vicious circle","порочный круг"]],
            ex: [
              { t: "choice", q: "The result was a ___ conclusion.", o: ["foregone", "vested", "bitter"], a: 0 },
              { t: "choice", q: "It's ___ unlikely that he'll win.", o: ["highly", "bitterly", "deeply"], a: 0 },
              { t: "choice", q: "Poverty and poor education create a ___ circle.", o: ["vicious", "blatant", "sweeping"], a: 0 }
            ] }
        ]
      },
      {
        id: "c2-3", title: "Стиль и риторика",
        lessons: [
          { id: "c2-3-1", title: "Understatement и ирония", goal: "Понимать британскую сдержанность и иронию.",
            theory: `<div class="ex">"It's <b>a bit</b> chilly." (при -20°) — преуменьшение.<br>"<b>Not bad</b>." = очень хорошо.<br>"<b>With all due respect</b> …" = я категорически не согласен.<br>"<b>That's an interesting idea</b>." = скорее всего, плохая идея.</div>`,
            vocab: [["understatement","преуменьшение"],["irony","ирония"],["tongue-in-cheek","в шутку"],["with all due respect","при всём уважении"],["not entirely","не совсем"],["a tad","чуточку"],["sarcasm","сарказм"],["deadpan","с невозмутимым видом"]],
            ex: [
              { t: "choice", q: "'I'm not entirely convinced' скорее значит:", o: ["Я полностью согласен", "Я с этим не согласен", "Мне всё равно"], a: 1 },
              { t: "choice", q: "'Tongue-in-cheek' комментарий — это:", o: ["серьёзный", "шутливый, иронический", "грубый"], a: 1 },
              { t: "gap", q: "With all ___ respect, I disagree.", a: ["due"] }
            ] },
          { id: "c2-3-2", title: "Риторические приёмы", goal: "Использовать триады, параллелизм и риторические вопросы.",
            theory: `<div class="ex"><b>Триада</b>: "Government of the people, by the people, for the people."<br><b>Антитеза</b>: "Ask not what your country can do for you…"<br><b>Анафора</b>: "We shall fight on the beaches, we shall fight on the landing grounds…"</div>`,
            vocab: [["rhetorical question","риторический вопрос"],["parallelism","параллелизм"],["antithesis","антитеза"],["anaphora","анафора"],["persuasive","убедительный"],["appeal to emotion","обращение к эмоциям"],["tricolon","триада"],["alliteration","аллитерация"]],
            ex: [
              { t: "choice", q: "'Veni, vidi, vici' — пример:", o: ["антитезы", "триады", "риторического вопроса"], a: 1 },
              { t: "choice", q: "Повтор начала фраз называется:", o: ["anaphora", "alliteration", "irony"], a: 0 },
              { t: "choice", q: "'Who doesn't want to be happy?' — это:", o: ["rhetorical question", "antithesis", "understatement"], a: 0 },
              { t: "gap", q: "Repeating the same words at the start of clauses is called ___.", a: ["anaphora"] },
              { t: "order", s: "We shall fight on the beaches" }
            ] },
          { id: "c2-3-3", title: "Регистр: от сленга до канцелярита", goal: "Переключаться между стилями.",
            theory: `<table><tr><th>Неформально</th><th>Нейтрально</th><th>Формально</th></tr>
<tr><td>get</td><td>receive</td><td>obtain</td></tr><tr><td>find out</td><td>discover</td><td>ascertain</td></tr>
<tr><td>help</td><td>assist</td><td>facilitate</td></tr><tr><td>start</td><td>begin</td><td>commence</td></tr></table>`,
            vocab: [["obtain","получать (офиц.)"],["ascertain","устанавливать (офиц.)"],["facilitate","содействовать"],["commence","начинать (офиц.)"],["terminate","прекращать"],["endeavour","стараться (офиц.)"],["chill out","расслабиться (сленг)"],["gonna","собираться (разг.)"]],
            ex: [
              { t: "choice", q: "Формальный вариант 'find out':", o: ["figure", "ascertain", "get"], a: 1 },
              { t: "choice", q: "Формальный вариант 'start':", o: ["commence", "kick off", "get going"], a: 0 },
              { t: "choice", q: "Неформальный вариант 'endeavour':", o: ["attempt", "try", "strive"], a: 1 },
              { t: "gap", q: "Formal notice: The meeting will ___ at 9 a.m. (start)", a: ["commence"] },
              { t: "order", s: "We endeavour to respond within two working days" }
            ] }
        ]
      },
      {
        id: "c2-4", title: "Подготовка к C2 Proficiency",
        lessons: [
          { id: "c2-4-1", title: "Key word transformations", goal: "Перефразировать предложение с ключевым словом.",
            theory: `<p>Перепишите предложение, используя данное слово (не меняя его), 3–8 слов.</p>
<div class="ex">"I only realised the truth later." <b>DID</b> → Only later <b>did I realise</b> the truth.<br>"He's sure to win." <b>BOUND</b> → He <b>is bound to</b> win.</div>`,
            vocab: [["paraphrase","перефразировать"],["key word","ключевое слово"],["word limit","ограничение по словам"],["meaning","смысл"],["accuracy","точность"],["rephrase","переформулировать"],["equivalent","эквивалентный"],["transformation","трансформация"]],
            ex: [
              { t: "gap", q: "She's certain to be late. (BOUND) → She is ___ to be late.", a: ["bound"] },
              { t: "gap", q: "I've never seen anything like it. (HAVE) → Never ___ I seen anything like it.", a: ["have"] },
              { t: "gap", q: "It wasn't necessary for you to come. (NEEDN'T) → You ___ have come.", a: ["needn't", "need not"] }
            ] },
          { id: "c2-4-2", title: "Стратегии чтения", goal: "Понимать имплицитный смысл и позицию автора.",
            theory: `<ul><li>Ищите <b>оценочную лексику</b>: admittedly, regrettably, ostensibly.</li><li>Различайте <b>факт</b> и <b>мнение</b>.</li>
<li>Обращайте внимание на <b>сигналы контраста</b>: yet, nonetheless, that said.</li><li>Задавайте вопрос: <i>чего автор НЕ говорит прямо?</i></li></ul>`,
            vocab: [["implicit","подразумеваемый"],["explicit","явный"],["ostensibly","якобы, по видимости"],["admittedly","надо признать"],["nonetheless","тем не менее"],["that said","при этом"],["infer","делать вывод"],["stance","позиция"]],
            ex: [
              { t: "choice", q: "'The policy was ostensibly about safety' предполагает:", o: ["цель действительно безопасность", "заявленная цель может быть не настоящей", "политика отменена"], a: 1 },
              { t: "choice", q: "'Implicit' противоположно:", o: ["explicit", "infer", "stance"], a: 0 },
              { t: "choice", q: "'Admittedly' обычно вводит:", o: ["уступку", "вывод", "пример"], a: 0 },
              { t: "gap", q: "The author never says it directly, so we have to ___ it from the text. (сделать вывод)", a: ["infer"] },
              { t: "order", s: "Admittedly the evidence is far from conclusive" }
            ] },
          { id: "c2-4-3", title: "Итоговый проект: эссе-обзор", goal: "Написать связный аналитический текст уровня C2.",
            theory: `<p>Задание: напишите эссе (280–320 слов) на тему <i>"Technology has made us more connected but lonelier."</i></p>
<ol><li>Используйте минимум 2 инверсии и 1 cleft sentence.</li><li>Примените hedging в аргументах.</li>
<li>Включите 5 продвинутых коллокаций из модуля «Лексика мастера».</li><li>Сохраняйте единый формальный регистр.</li></ol>
<p class="tip">Самопроверка: прочитайте вслух — звучит ли естественно? Есть ли повторы, которые можно заменить эллипсисом?</p>`,
            vocab: [["coherence","связность"],["cohesion","логическая связанность"],["nuance","нюанс"],["concise","лаконичный"],["proofread","вычитывать"],["draft","черновик"],["word count","количество слов"],["self-assessment","самооценка"]],
            ex: [
              { t: "choice", q: "'Cohesion' в тексте обеспечивают:", o: ["слова-связки и местоимения", "длинные слова", "восклицания"], a: 0 },
              { t: "choice", q: "Что важнее всего на C2?", o: ["Сложные слова любой ценой", "Точность и уместность", "Длина текста"], a: 1 },
              { t: "order", s: "Not only has technology connected us but it has also isolated us" },
              { t: "gap", q: "Before you submit your essay, always ___ it for mistakes. (вычитать)", a: ["proofread"] }
            ] }
        ]
      }
    ]
  }
];

/*
 * Входной тест: по 2 вопроса на уровень A1–C2.
 * Рекомендуемый уровень — первый, на котором ученик ошибся (см. app.js → placementResult).
 */
const PLACEMENT = [
  { lvl: "a1", q: "She ___ in a bank.", o: ["work", "works", "working"], a: 1 },
  { lvl: "a1", q: "___ you like coffee?", o: ["Does", "Are", "Do"], a: 2 },
  { lvl: "a2", q: "I ___ to Paris last summer.", o: ["go", "went", "have gone"], a: 1 },
  { lvl: "a2", q: "This is the ___ film I've ever seen.", o: ["better", "best", "most good"], a: 1 },
  { lvl: "b1", q: "If it rains, we ___ at home.", o: ["will stay", "would stay", "stayed"], a: 0 },
  { lvl: "b1", q: "The bridge ___ in 1890.", o: ["built", "was built", "has built"], a: 1 },
  { lvl: "b2", q: "If I had known, I ___ you.", o: ["would tell", "would have told", "told"], a: 1 },
  { lvl: "b2", q: "She refused ___ the contract.", o: ["signing", "to sign", "sign"], a: 1 },
  { lvl: "c1", q: "Never ___ such a mess.", o: ["I have seen", "have I seen", "I saw"], a: 1 },
  { lvl: "c1", q: "He is believed ___ the country last year.", o: ["to leave", "to have left", "leaving"], a: 1 },
  { lvl: "c2", q: "It is essential that he ___ present.", o: ["is", "be", "will be"], a: 1 },
  { lvl: "c2", q: "The outcome was a ___ conclusion.", o: ["foregone", "vested", "sweeping"], a: 0 }
];
