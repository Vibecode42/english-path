/*
 * Погружение (immersive learning): понятный вход чуть выше уровня ученика.
 *
 * STORIES — короткие тексты по уровням: озвучка по предложениям, двойные субтитры EN/RU,
 *           клик по выделенному слову показывает перевод и добавляет слово в словарь (SRS).
 *           В рабочей версии так же работает плеер видео и сериалов с интерактивными субтитрами.
 * MEDIA   — подборка видео, подкастов и сериалов по уровням. Сериалы — только рекомендации
 *           (смотреть на легальных платформах), видео встраиваются только официальным embed.
 */
const STORIES = [
  {
    id: "s-a1", level: "a1", title: "My morning", minutes: 2,
    lines: [
      ["My name is Kate and I live in a small flat in London.", "Меня зовут Кейт, я живу в маленькой квартире в Лондоне."],
      ["I usually get up at seven o'clock.", "Обычно я встаю в семь часов."],
      ["I have breakfast in the kitchen: bread, cheese and a cup of coffee.", "Я завтракаю на кухне: хлеб, сыр и чашка кофе."],
      ["Then I go to work by bus.", "Потом я еду на работу на автобусе."],
      ["My office is next to a big park.", "Мой офис рядом с большим парком."],
      ["At lunch I sometimes walk in the park with my friends.", "В обед я иногда гуляю в парке с друзьями."]
    ],
    glossary: { "flat": "квартира", "usually": "обычно", "get up": "вставать", "breakfast": "завтрак", "kitchen": "кухня",
                "then": "потом", "office": "офис", "next to": "рядом с", "sometimes": "иногда" }
  },
  {
    id: "s-b1", level: "b1", title: "A trip that went wrong", minutes: 3,
    lines: [
      ["Last summer my friend and I decided to go camping in the mountains.", "Прошлым летом мы с другом решили пойти в поход в горы."],
      ["We had planned everything carefully, or so we thought.", "Мы всё тщательно спланировали, по крайней мере так нам казалось."],
      ["While we were driving, it started to rain heavily.", "Пока мы ехали, начался сильный дождь."],
      ["By the time we arrived, the campsite was completely flooded.", "К тому времени, как мы приехали, кемпинг был полностью затоплен."],
      ["If we had checked the weather forecast, we would have stayed at home.", "Если бы мы проверили прогноз погоды, мы бы остались дома."],
      ["Still, it turned out to be one of the funniest weekends of my life.", "И всё же это оказались одни из самых весёлых выходных в моей жизни."]
    ],
    glossary: { "decided": "решили", "go camping": "пойти в поход (с палаткой)", "carefully": "тщательно", "heavily": "сильно (о дожде)",
                "by the time": "к тому времени как", "campsite": "кемпинг", "flooded": "затопленный", "weather forecast": "прогноз погоды",
                "turned out": "оказалось" }
  },
  {
    id: "s-c1", level: "c1", title: "The paradox of choice", minutes: 3,
    lines: [
      ["We tend to assume that having more options inevitably makes us happier.", "Мы склонны полагать, что большее количество вариантов неизбежно делает нас счастливее."],
      ["Yet research suggests that an abundance of choice can be paralysing.", "Однако исследования показывают, что изобилие выбора может парализовать."],
      ["Faced with dozens of almost identical products, many people simply walk away.", "Столкнувшись с десятками почти одинаковых товаров, многие просто уходят."],
      ["Those who do decide are often left wondering whether they made the right call.", "Те, кто всё-таки решается, нередко потом гадают, правильный ли сделали выбор."],
      ["Arguably, the key is not to eliminate choice but to set clear criteria in advance.", "Пожалуй, ключ не в том, чтобы устранить выбор, а в том, чтобы заранее задать чёткие критерии."],
      ["Only then can we enjoy the freedom that choice is supposed to bring.", "Только тогда мы можем наслаждаться свободой, которую должен приносить выбор."]
    ],
    glossary: { "tend to": "иметь склонность", "assume": "предполагать", "inevitably": "неизбежно", "abundance": "изобилие",
                "paralysing": "парализующий", "faced with": "столкнувшись с", "identical": "одинаковый", "walk away": "уйти, отказаться",
                "made the right call": "принять верное решение", "arguably": "пожалуй, можно утверждать", "eliminate": "устранить",
                "criteria": "критерии", "in advance": "заранее", "is supposed to": "должен (по замыслу)" }
  }
];

const MEDIA = [
  { type: "video", levels: "A0–A1", title: "How to introduce yourself: Easy English Conversations", source: "BBC Learning English",
    yt: "I_tRSrPru94", note: "Короткий диалог-знакомство. Смотрите с английскими субтитрами, затем повторите реплики вслух." },
  { type: "channel", levels: "A1–C1", title: "BBC Learning English", source: "YouTube", url: "https://www.youtube.com/@bbclearningenglish",
    note: "Грамматика, лексика, новости простым языком. Есть плейлисты по уровням." },
  { type: "channel", levels: "A2–B2", title: "English with Lucy", source: "YouTube", url: "https://www.youtube.com/@EnglishwithLucy",
    note: "Британский английский: произношение, лексика, разговорные темы." },
  { type: "channel", levels: "B1–C2", title: "Rachel's English", source: "YouTube", url: "https://www.youtube.com/@rachelsenglish",
    note: "Американское произношение, связная речь. Хорошо подходит для shadowing." },
  { type: "podcast", levels: "A1–B2", title: "LearnEnglish (подкасты и видео)", source: "British Council", url: "https://learnenglish.britishcouncil.org/",
    note: "Аудио с транскриптами и заданиями, разметка по уровням CEFR." },
  { type: "podcast", levels: "B1–B2", title: "6 Minute English", source: "BBC Learning English", url: "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english",
    note: "6 минут на актуальную тему, 6 новых слов, есть транскрипт." },
  { type: "podcast", levels: "B1–C1", title: "The English We Speak", source: "BBC Learning English", url: "https://www.bbc.co.uk/learningenglish/english/features/the-english-we-speak",
    note: "Короткие выпуски про одну идиому или разговорное выражение." },
  { type: "podcast", levels: "B2–C2", title: "Luke's English Podcast", source: "teacherluke.co.uk", url: "https://teacherluke.co.uk/",
    note: "Длинные живые разговоры с британским юмором. Настоящее погружение." },
  { type: "video", levels: "C1–C2", title: "TED Talks", source: "ted.com", url: "https://www.ted.com/talks",
    note: "Выступления с интерактивным транскриптом и субтитрами на многих языках." },
  { type: "series", levels: "A1–A2", title: "Extra English", source: "учебный ситком",
    note: "Сериал, созданный для изучающих английский: простой язык, бытовые ситуации." },
  { type: "series", levels: "B1", title: "Friends", source: "сериал",
    note: "Короткие серии, повседневные диалоги. Начните с английских субтитров." },
  { type: "series", levels: "B1–B2", title: "Modern Family", source: "сериал",
    note: "Формат мокьюментари: много монологов на камеру, понятная речь." },
  { type: "series", levels: "B2–C1", title: "The Office (UK / US)", source: "сериал",
    note: "Рабочий сленг, ирония, понимание подтекста." },
  { type: "series", levels: "C1–C2", title: "Sherlock, The Crown", source: "сериалы",
    note: "Быстрая речь, британские акценты, богатая лексика. Субтитры только на английском или без них." }
];
