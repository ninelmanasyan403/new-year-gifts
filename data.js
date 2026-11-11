// Черновик ассортимента. Чтобы добавить компанию — допишите объект в COMPANIES
// и положите логотип в assets/logos/. Цена — число в рублях.
const COMPANIES = [
  {
    id: "aket",
    name: "aket",
    tagline: "Краски, наклейки и футболки",
    logo: "assets/logos/aket.jpg",
    logoFit: "cover",
    notes: [
      "Футболки только белого цвета.",
      "Срок изготовления — 18 рабочих дней.",
      "В отправление могут вложить наклейки.",
      "Кастомная коробка возможна за доплату. Эту сумму ещё не называли, в калькулятор она не входит.",
      "Доставка 10 000 ₽ в один адрес. Дальше переупаковку и отправку по людям делаем сами."
    ],
    delivery: {
      name: "Доставка в 1 точку",
      price: 10000,
      detail: "Один раз за весь заказ, не за каждую вещь. Дальше везём сами."
    },
    flags: [
      {
        id: "custom-box",
        name: "Кастомная коробка",
        detail: "Нужна, но цены пока нет — в сумму не входит."
      }
    ],
    products: [
      {
        id: "aket-paint",
        name: "Краски + трафарет",
        price: 200,
        image: "assets/products/aket-paint.png"
      },
      {
        id: "aket-thermo",
        name: "Термонаклейки А5",
        price: 320,
        image: "assets/products/aket-thermo.png",
        note: "Цена за один набор. Количество ниже — сколько таких наборов нужно.",
        qtyLabel: "Сколько наборов",
        sheets: [
          { count: 1, price: 320 },
          { count: 2, price: 420 }
        ]
      },
      {
        id: "aket-tee",
        name: "Футболка",
        price: 2300,
        image: "assets/products/aket-tee.png",
        note: "Только белый цвет."
      }
    ]
  },
  {
    id: "money-merch",
    name: "Money Merch",
    tagline: "Мерч с доставкой в одну точку",
    logo: "assets/logos/money-merch.jpg",
    logoFit: "cover",
    notes: [
      "Могут добавить наши товары в отправление.",
      "Всё присылают в одну точку.",
      "Кастомная коробка возможна за доплату. Эту сумму ещё не называли, в калькулятор она не входит."
    ],
    delivery: {
      name: "Доставка в 1 точку",
      price: 5000,
      detail: "Один раз за весь заказ, не за каждую вещь."
    },
    flags: [
      {
        id: "custom-box",
        name: "Кастомная коробка",
        detail: "Нужна, но цены пока нет — в сумму не входит."
      }
    ],
    products: [
      { id: "mm-tumbler", name: "Термостакан", price: 2040, image: "assets/products/mm-tumbler.png" },
      { id: "mm-tshirt", name: "Футболка", price: 1782, image: "assets/products/mm-tshirt.png" },
      { id: "mm-squish", name: "Сквиш", price: 2143, image: "assets/products/mm-squish.png" },
      { id: "mm-bottle", name: "Бутхолдер", price: 2167, image: "assets/products/mm-bottle.png" },
      { id: "mm-tote", name: "Сумка тоут", price: 1717, image: "assets/products/mm-tote.png" },
      { id: "mm-tin-candle", name: "Свеча в жестяной банке", price: 2288, image: "assets/products/mm-tin-candle.png" },
      { id: "mm-candle", name: "Свеча", price: 1197, image: "assets/products/mm-candle.png" },
      { id: "mm-drip", name: "Дрип-кофе", price: 891, image: "assets/products/mm-drip.png" },
      { id: "mm-card", name: "Картхолдер", price: 860, image: "assets/products/mm-card.png" },
      { id: "mm-magsafe", name: "Картхолдер MagSafe", price: 910, image: "assets/products/mm-magsafe.png" },
      { id: "mm-blanket", name: "Плед для пикника", price: 2410, image: "assets/products/mm-blanket.png" },
      { id: "mm-shopper", name: "Шоппер", price: 951, image: "assets/products/mm-shopper.png" },
      { id: "mm-cord", name: "Подвес для телефона (шнур)", price: 1859, image: "assets/products/mm-cord.png" },
      { id: "mm-strap", name: "Подвес для телефона (лента)", price: 1409, image: "assets/products/mm-strap.png" },
      { id: "mm-charm", name: "Подвес-брелок", price: 975, image: "assets/products/mm-charm.png" },
      { id: "mm-stickers", name: "Стикерпак", price: 241, image: "assets/products/mm-stickers.png" },
      { id: "mm-layout", name: "Техмакет", price: 13000, note: "Без фото. Цена за один макет." }
    ]
  },
  {
    id: "prezentum",
    name: "Презентум",
    tagline: "Сумка, пледы и мелочи",
    logo: "assets/logos/prezentum-cover.png",
    logoFit: "cover",
    notes: [
      "Крокс-сумка бывает разных цветов. В неё можно сложить остальные подарки и отправить сумку.",
      "Пины для крокс-сумки бывают разного размера.",
      "Пледы бывают разных оттенков.",
      "Сами соберут и сами отправят за доплату. Сумму ещё не называли, в калькулятор она не входит.",
      "Можно дозаказать открытки.",
      "Можно попросить вложить то, что купим сами и пришлём им."
    ],
    flags: [
      {
        id: "assemble-ship",
        name: "Сборка и отправка",
        detail: "Сами соберут и отправят. Доплата, цену ещё не назвали — в сумму не входит."
      }
    ],
    products: [
      {
        id: "pz-croc",
        name: "Крокс-сумка",
        price: 920,
        image: "assets/products/pz-croc.png",
        note: "Разные цвета. Можно сложить внутрь остальные подарки."
      },
      {
        id: "pz-jibbit",
        name: "Джибитс",
        price: 120,
        image: "assets/products/pz-jibbit.png",
        note: "Пин для сумки. Цена за 1 штуку, размеры разные."
      },
      { id: "pz-tumbler", name: "Термостакан", price: 915, image: "assets/products/pz-tumbler.png" },
      { id: "pz-shopper", name: "Шопер", price: 300, image: "assets/products/pz-shopper.png" },
      { id: "pz-badge", name: "Значки", price: 150, image: "assets/products/pz-badge.png" },
      {
        id: "pz-waffle",
        name: "Плед вафельный",
        price: 2320,
        image: "assets/products/pz-waffle.png",
        note: "Есть разные оттенки."
      },
      {
        id: "pz-fleece",
        name: "Плед флисовый",
        price: 1815,
        image: "assets/products/pz-fleece.png",
        note: "Есть разные оттенки."
      },
      {
        id: "pz-travel",
        name: "Плед дорожный",
        price: 1570,
        image: "assets/products/pz-travel.png",
        note: "Есть разные оттенки."
      },
      {
        id: "pz-vicenza",
        name: "Плед «Виченца»",
        price: 2420,
        image: "assets/products/pz-vicenza.png",
        note: "Есть разные оттенки."
      },
      { id: "pz-drip", name: "Дрип-пакет", price: 125, image: "assets/products/pz-drip.png" },
      { id: "pz-hazelnut", name: "Фундук в шоколаде", price: 820, image: "assets/products/pz-hazelnut.png" }
    ]
  },
  {
    id: "merchify",
    name: "Merchify Factory",
    tagline: "Сами пакуют и отправляют по СДЭК",
    logo: "assets/logos/merchify.jpg",
    logoFit: "cover",
    notes: [
      "Сами всё пакуют и отправляют по СДЭК.",
      "Могут заменить некоторые позиции на наши.",
      "Могут доложить в коробку наши собственные товары.",
      "Приглашают в гости на производство в Москву.",
      "У футболок много расцветок. Цвет уже выбрала Оля, арт-директор.",
      "У флисового пледа остатки: зелёных около 75, красных больше 132, синих около 35–40, светлых около 135–140."
    ],
    products: [
      {
        id: "mf-tee",
        name: "Футболка + наклейки А4",
        price: 1190,
        image: "assets/products/mf-set.png",
        note: "Цвет футболки уже выбран. Расцветок было много."
      },
      {
        id: "mf-a4",
        name: "Ещё один лист наклеек А4",
        price: 170,
        image: "assets/products/mf-a4.png",
        note: "Дополнительный лист к набору."
      },
      { id: "mf-vicenza", name: "Плед «Виченца»", price: 1200, image: "assets/products/mf-vicenza.png" },
      {
        id: "mf-fleece",
        name: "Плед флисовый",
        price: 600,
        image: "assets/products/mf-fleece.png",
        note: "Зелёных около 75, красных больше 132, синих около 35–40, светлых около 135–140."
      },
      {
        id: "mf-label",
        name: "Нашивка на ярлык пледа",
        price: 120,
        image: "assets/products/mf-label.png"
      },
      { id: "mf-tumbler", name: "Термостакан", price: 700, image: "assets/products/mf-tumbler.png" },
      {
        id: "mf-pack",
        name: "Работа по упаковке",
        price: 120,
        note: "Без фото. Цена за одну упаковку."
      },
      {
        id: "mf-box",
        name: "Коробка",
        price: 300,
        note: "Без фото. Цена за одну коробку."
      }
    ]
  },
  {
    id: "extras",
    name: "Что можем добавить / дозаказать",
    tagline: "Докупка к подаркам",
    logo: "assets/logos/extras.jpg",
    logoFit: "cover",
    notes: [
      "Это не поставщик. Сюда складываем то, что можем докупить сами и добавить в подарок.",
      "Открытка — 300 ₽ за весь тираж, один раз, не за каждую штуку."
    ],
    products: [
      {
        id: "extra-kinder-1",
        name: "Набор шоколада Киндер 1",
        price: 401,
        image: "assets/products/extra-kinder-1.png",
        note: "Kinder Bueno Eggs."
      },
      {
        id: "extra-kinder-2",
        name: "Набор шоколада Киндер 2",
        price: 724,
        image: "assets/products/extra-kinder-2.png",
        note: "Kinder Mix."
      },
      {
        id: "extra-kinder-3",
        name: "Набор шоколада Киндер 3",
        price: 851,
        image: "assets/products/extra-kinder-3.png",
        note: "Kinder mini box."
      },
      {
        id: "extra-mug-1",
        name: "Термокружка 1",
        price: 358,
        image: "assets/products/extra-mug-1.png",
        note: "Чёрная, 450 мл."
      },
      {
        id: "extra-mug-2",
        name: "Термокружка 2",
        price: 692,
        image: "assets/products/extra-mug-2.png",
        note: "С датчиком температуры, 450 мл."
      },
      {
        id: "extra-cocktail",
        name: "Набор для коктейля",
        price: 1914,
        image: "assets/products/extra-cocktail.png",
        note: "12 предметов."
      },
      {
        id: "extra-card",
        name: "Открытка",
        price: 300,
        image: "assets/products/extra-card.webp",
        once: true,
        qtyLabel: "Весь тираж, один раз",
        note: "300 ₽ за весь тираж, не за одну открытку."
      },
      {
        id: "extra-mms",
        name: "Шоколадный набор M&M",
        price: 684,
        image: "assets/products/extra-mms.png",
        note: "Адвент-календарь, 16 окон."
      },
      {
        id: "extra-ritter",
        name: "Набор шоколада Риттер Спорт",
        price: 1354,
        image: "assets/products/extra-ritter.png",
        note: "21 шоколадка."
      }
    ]
  }
];
