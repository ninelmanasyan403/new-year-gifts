const STORAGE_KEY = "ny-gifts-2027";
const money = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0
});

const state = loadState();
const shop = document.getElementById("shop");
let activeCompanyId = null;
let clearArmed = false;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    return {};
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function companyById(id) {
  for (let i = 0; i < COMPANIES.length; i += 1) {
    if (COMPANIES[i].id === id) return COMPANIES[i];
  }
  return null;
}

function productById(company, productId) {
  for (let i = 0; i < company.products.length; i += 1) {
    if (company.products[i].id === productId) return company.products[i];
  }
  return null;
}

function ensureBag(companyId) {
  const current = state[companyId];
  if (current && current.items && typeof current.items === "object") {
    if (!current.sheets) current.sheets = {};
    if (!current.flags) current.flags = {};
    if (typeof current.delivery !== "boolean") current.delivery = false;
    return current;
  }
  const items = {};
  if (current && typeof current === "object") {
    Object.keys(current).forEach(function (key) {
      if (typeof current[key] === "number" && current[key] > 0) items[key] = current[key];
    });
  }
  state[companyId] = { items: items, sheets: {}, delivery: false, flags: {} };
  return state[companyId];
}

function qtyOf(companyId, productId) {
  const value = ensureBag(companyId).items[productId];
  return typeof value === "number" && value > 0 ? value : 0;
}

function sheetChoice(company, product) {
  if (!product.sheets || !product.sheets.length) return null;
  const chosen = ensureBag(company.id).sheets[product.id];
  for (let i = 0; i < product.sheets.length; i += 1) {
    if (product.sheets[i].count === chosen) return product.sheets[i];
  }
  return product.sheets[0];
}

function unitPrice(company, product) {
  const sheet = sheetChoice(company, product);
  return sheet ? sheet.price : product.price;
}

function lineLabel(company, product) {
  const sheet = sheetChoice(company, product);
  if (!sheet) return product.name;
  return product.name + ", " + sheet.count + (sheet.count === 1 ? " лист" : " листа");
}

function deliveryOn(company) {
  return Boolean(company.delivery && ensureBag(company.id).delivery);
}

function activeFlags(company) {
  const flags = [];
  if (!company.flags) return flags;
  const bag = ensureBag(company.id);
  for (let i = 0; i < company.flags.length; i += 1) {
    if (bag.flags[company.flags[i].id]) flags.push(company.flags[i]);
  }
  return flags;
}

function itemsLabel(count) {
  const mod100 = count % 100;
  const mod10 = count % 10;
  if (mod100 > 10 && mod100 < 20) return count + " товаров";
  if (mod10 === 1) return count + " товар";
  if (mod10 > 1 && mod10 < 5) return count + " товара";
  return count + " товаров";
}

function companyTotal(company) {
  let sum = 0;
  let itemCount = 0;
  for (let i = 0; i < company.products.length; i += 1) {
    const qty = qtyOf(company.id, company.products[i].id);
    if (qty > 0) {
      sum += qty * unitPrice(company, company.products[i]);
      itemCount += 1;
    }
  }
  const withDelivery = deliveryOn(company);
  if (withDelivery) sum += company.delivery.price;
  const flags = activeFlags(company);
  return {
    sum: sum,
    itemCount: itemCount,
    delivery: withDelivery,
    flagCount: flags.length,
    count: itemCount + (withDelivery ? 1 : 0) + flags.length
  };
}

function grandTotal() {
  let sum = 0;
  for (let i = 0; i < COMPANIES.length; i += 1) {
    sum += companyTotal(COMPANIES[i]).sum;
  }
  return sum;
}

function parseQty(value) {
  const digits = String(value).replace(/[^\d]/g, "");
  if (!digits) return 0;
  return Math.min(100000, parseInt(digits, 10));
}

function setQty(productId, rawValue, source) {
  const company = companyById(activeCompanyId);
  if (!company) return;
  const product = productById(company, productId);
  if (!product) return;
  let qty = parseQty(rawValue);
  if (product.once) qty = qty > 0 ? 1 : 0;
  const bag = ensureBag(company.id);
  if (qty > 0) bag.items[productId] = qty;
  else delete bag.items[productId];
  saveState();
  syncProduct(company, product, source);
  syncCartRow(company, product);
  updateCartSummary(company);
  refreshCompanyMeta(company);
  renderBudget();
}

function spawnSnow() {
  const layer = document.querySelector(".snow");
  for (let i = 0; i < 26; i += 1) {
    const flake = document.createElement("i");
    flake.style.left = Math.random() * 100 + "%";
    flake.style.animationDuration = 8 + Math.random() * 12 + "s";
    flake.style.animationDelay = -Math.random() * 16 + "s";
    flake.style.opacity = String(0.35 + Math.random() * 0.55);
    const size = 4 + Math.random() * 7;
    flake.style.width = size + "px";
    flake.style.height = size + "px";
    layer.appendChild(flake);
  }
}

function renderCompanies() {
  const root = document.getElementById("company-grid");
  root.replaceChildren();
  COMPANIES.forEach(function (company) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "company";
    button.dataset.fit = company.logoFit;
    button.addEventListener("click", function () { openCompany(company.id); });

    const image = document.createElement("img");
    image.src = company.logo;
    image.alt = "Логотип " + company.name;

    const name = document.createElement("span");
    name.className = "company-name";
    name.textContent = company.name;

    const meta = document.createElement("span");
    meta.className = "company-meta";
    meta.dataset.meta = company.id;

    button.append(image, name, meta);
    root.appendChild(button);
    refreshCompanyMeta(company);
  });
}

function refreshCompanyMeta(company) {
  const meta = document.querySelector('[data-meta="' + company.id + '"]');
  if (!meta) return;
  const totals = companyTotal(company);
  if (!totals.count) {
    meta.textContent = "Корзина пуста";
    return;
  }
  const bits = [];
  if (totals.itemCount) bits.push(itemsLabel(totals.itemCount));
  if (totals.delivery) bits.push("доставка");
  if (totals.flagCount) {
    activeFlags(company).forEach(function (flag) { bits.push(flag.name); });
  }
  const tail = totals.itemCount || totals.delivery ? money.format(totals.sum) : "цену уточнить";
  meta.textContent = bits.join(", ") + " · " + tail;
}

function renderBudget() {
  const list = document.getElementById("budget-list");
  list.replaceChildren();
  COMPANIES.forEach(function (company) {
    const card = document.createElement("article");
    card.className = "budget-card";
    const title = document.createElement("h3");
    title.textContent = company.name;
    const items = document.createElement("ul");
    company.products.forEach(function (product) {
      const qty = qtyOf(company.id, product.id);
      if (qty <= 0) return;
      const row = document.createElement("li");
      const label = document.createElement("span");
      label.textContent = product.once
        ? lineLabel(company, product) + ", весь тираж"
        : lineLabel(company, product) + " × " + qty;
      const value = document.createElement("span");
      value.textContent = money.format(qty * unitPrice(company, product));
      row.append(label, value);
      items.appendChild(row);
    });
    if (deliveryOn(company)) {
      const row = document.createElement("li");
      const label = document.createElement("span");
      label.textContent = company.delivery.name;
      const value = document.createElement("span");
      value.textContent = money.format(company.delivery.price);
      row.append(label, value);
      items.appendChild(row);
    }
    activeFlags(company).forEach(function (flag) {
      const row = document.createElement("li");
      const label = document.createElement("span");
      label.textContent = flag.name;
      const value = document.createElement("span");
      value.textContent = "цену уточнить";
      row.append(label, value);
      items.appendChild(row);
    });
    const subtotal = document.createElement("p");
    subtotal.className = "subtotal";
    const totals = companyTotal(company);
    if (!totals.count) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "Пока ничего не выбрано";
      card.append(title, empty);
    } else {
      subtotal.textContent = "Итого: " + money.format(totals.sum);
      card.append(title, items, subtotal);
    }
    list.appendChild(card);
  });
  document.getElementById("grand-total").textContent = "Общий бюджет: " + money.format(grandTotal());
}

function openCompany(companyId) {
  activeCompanyId = companyId;
  clearArmed = false;
  const company = companyById(companyId);
  const logo = document.getElementById("shop-logo");
  logo.src = company.logo;
  logo.alt = "";
  logo.style.objectFit = company.logoFit;
  document.getElementById("shop-kicker").textContent = "Витрина";
  document.getElementById("shop-title").textContent = company.name;
  document.getElementById("shop-tagline").textContent = company.tagline;
  document.getElementById("clear-cart").textContent = "Очистить";
  renderProducts(company);
  renderCart(company);
  document.body.classList.add("modal-open");
  if (!shop.open) shop.showModal();
}

function renderProducts(company) {
  const grid = document.getElementById("shop-grid");
  grid.replaceChildren();
  if (company.notes && company.notes.length) {
    const notes = document.createElement("div");
    notes.className = "shop-notes";
    const heading = document.createElement("p");
    heading.className = "shop-notes-title";
    heading.textContent = "Условия";
    const list = document.createElement("ul");
    company.notes.forEach(function (text) {
      const item = document.createElement("li");
      item.textContent = text;
      list.appendChild(item);
    });
    notes.append(heading, list);
    grid.appendChild(notes);
  }
  company.products.forEach(function (product) {
    const card = document.createElement("article");
    card.className = "product";
    card.dataset.product = product.id;

    if (product.image) {
      const photo = document.createElement("img");
      photo.className = "product-photo";
      photo.src = product.image;
      photo.alt = product.name;
      card.appendChild(photo);
    } else if (product.kind) {
      const art = document.createElement("div");
      art.className = "product-art";
      art.innerHTML = productArt(company.id, product.kind);
      card.appendChild(art);
    } else {
      const blank = document.createElement("div");
      blank.className = "product-blank";
      blank.textContent = "Без фото";
      card.appendChild(blank);
    }

    const title = document.createElement("h3");
    title.textContent = product.name;
    card.appendChild(title);

    if (product.note) {
      const note = document.createElement("p");
      note.className = "product-note";
      note.textContent = product.note;
      card.appendChild(note);
    }

    if (!product.sheets) {
      const price = document.createElement("p");
      price.className = "price";
      price.textContent = money.format(product.price);
      card.appendChild(price);
    }

    if (product.sheets) {
      const variants = document.createElement("div");
      variants.className = "variants";
      product.sheets.forEach(function (tier) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "variant";
        button.dataset.sheets = String(tier.count);
        button.dataset.product = product.id;
        const sheetWord = tier.count === 1 ? "лист" : "листа";
        button.textContent = tier.count + " " + sheetWord + " · " + money.format(tier.price);
        variants.appendChild(button);
      });
      card.appendChild(variants);
    }

    if (product.qtyLabel) {
      const qtyLabel = document.createElement("p");
      qtyLabel.className = "qty-label";
      qtyLabel.textContent = product.qtyLabel;
      card.appendChild(qtyLabel);
    }

    const qty = document.createElement("div");
    qty.className = "qty";
    const minus = document.createElement("button");
    minus.type = "button";
    minus.className = "step";
    minus.dataset.step = "-1";
    minus.dataset.qty = product.id;
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Меньше");
    const input = document.createElement("input");
    input.dataset.qty = product.id;
    input.inputMode = "numeric";
    input.setAttribute("aria-label", "Количество: " + product.name);
    input.placeholder = "0";
    const plus = document.createElement("button");
    plus.type = "button";
    plus.className = "step";
    plus.dataset.step = "1";
    plus.dataset.qty = product.id;
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Больше");
    qty.append(minus, input, plus);

    const sum = document.createElement("p");
    sum.className = "item-sum";
    card.appendChild(qty);

    if (!product.once) {
      const presets = document.createElement("div");
      presets.className = "presets";
      [10, 25, 50, 100].forEach(function (amount) {
        const preset = document.createElement("button");
        preset.type = "button";
        preset.className = "preset";
        preset.dataset.preset = String(amount);
        preset.dataset.qty = product.id;
        preset.textContent = String(amount);
        presets.appendChild(preset);
      });
      card.appendChild(presets);
    }

    card.appendChild(sum);
    grid.appendChild(card);
    syncProduct(company, product, null);
  });
}

function renderCart(company) {
  const rows = document.getElementById("cart-rows");
  rows.replaceChildren();
  company.products.forEach(function (product) {
    if (qtyOf(company.id, product.id) > 0) ensureCartRow(company, product);
  });
  renderCartOptions(company);
  updateCartSummary(company);
}

function renderCartOptions(company) {
  const root = document.getElementById("cart-options");
  root.replaceChildren();
  if (company.delivery) {
    root.appendChild(optionBox("delivery", "1", company.delivery.name + " · " + money.format(company.delivery.price), company.delivery.detail, deliveryOn(company)));
  }
  if (company.flags) {
    const bag = ensureBag(company.id);
    company.flags.forEach(function (flag) {
      root.appendChild(optionBox("flag", flag.id, flag.name, flag.detail, Boolean(bag.flags[flag.id])));
    });
  }
}

function optionBox(kind, id, title, detail, checked) {
  const label = document.createElement("label");
  label.className = "cart-option";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = checked;
  if (kind === "delivery") input.dataset.delivery = id;
  else input.dataset.flag = id;
  const text = document.createElement("span");
  const name = document.createElement("strong");
  name.textContent = title;
  text.appendChild(name);
  if (detail) {
    const small = document.createElement("small");
    small.textContent = detail;
    text.appendChild(small);
  }
  label.append(input, text);
  return label;
}

function syncProduct(company, product, source) {
  const card = document.querySelector('.product[data-product="' + product.id + '"]');
  if (!card) return;
  const qty = qtyOf(company.id, product.id);
  const input = card.querySelector("input");
  if (input !== source || product.once) input.value = qty > 0 ? String(qty) : "";
  card.classList.toggle("is-selected", qty > 0);
  const price = unitPrice(company, product);
  card.querySelector(".item-sum").textContent = qty > 0 ? money.format(qty * price) : "";
  card.querySelectorAll(".preset").forEach(function (preset) {
    preset.classList.toggle("is-on", Number(preset.dataset.preset) === qty);
  });
  const chosen = sheetChoice(company, product);
  card.querySelectorAll(".variant").forEach(function (variant) {
    variant.classList.toggle("is-on", chosen && Number(variant.dataset.sheets) === chosen.count);
  });
}

function ensureCartRow(company, product) {
  const rows = document.getElementById("cart-rows");
  let row = rows.querySelector('[data-row="' + product.id + '"]');
  if (!row) {
    row = document.createElement("div");
    row.className = "cart-row";
    row.dataset.row = product.id;
    const title = document.createElement("strong");
    title.textContent = lineLabel(company, product);
    const formula = document.createElement("p");
    formula.className = "row-formula";
    const sum = document.createElement("p");
    sum.className = "row-sum";
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "text-btn";
    remove.dataset.remove = product.id;
    remove.textContent = "Убрать";
    row.append(title, formula, sum, remove);
    rows.appendChild(row);
  }
  const qty = qtyOf(company.id, product.id);
  const price = unitPrice(company, product);
  row.querySelector("strong").textContent = lineLabel(company, product);
  row.querySelector(".row-formula").textContent = product.once
    ? "весь тираж · " + money.format(price)
    : qty + " × " + money.format(price);
  row.querySelector(".row-sum").textContent = money.format(qty * price);
}

function setSheets(productId, count) {
  const company = companyById(activeCompanyId);
  if (!company) return;
  const product = productById(company, productId);
  if (!product) return;
  ensureBag(company.id).sheets[productId] = count;
  saveState();
  syncProduct(company, product, null);
  syncCartRow(company, product);
  updateCartSummary(company);
  refreshCompanyMeta(company);
  renderBudget();
}

function setDelivery(on) {
  const company = companyById(activeCompanyId);
  if (!company) return;
  ensureBag(company.id).delivery = on;
  saveState();
  updateCartSummary(company);
  refreshCompanyMeta(company);
  renderBudget();
}

function setFlag(flagId, on) {
  const company = companyById(activeCompanyId);
  if (!company) return;
  ensureBag(company.id).flags[flagId] = on;
  saveState();
  updateCartSummary(company);
  refreshCompanyMeta(company);
  renderBudget();
}

function syncCartRow(company, product) {
  const qty = qtyOf(company.id, product.id);
  const rows = document.getElementById("cart-rows");
  const row = rows.querySelector('[data-row="' + product.id + '"]');
  if (qty <= 0) {
    if (row) row.remove();
    return;
  }
  ensureCartRow(company, product);
}

function updateCartSummary(company) {
  const totals = companyTotal(company);
  document.getElementById("cart-empty").hidden = totals.count > 0;
  document.getElementById("cart-total").textContent = "Итого: " + money.format(totals.sum);
  const flagNote = document.getElementById("cart-flag-note");
  const flags = activeFlags(company);
  if (!flags.length) {
    flagNote.hidden = true;
    flagNote.textContent = "";
    return;
  }
  flagNote.hidden = false;
  flagNote.textContent = flags.map(function (flag) { return flag.name + " в сумму не входит."; }).join(" ");
}

function buildSummaryText() {
  const lines = ["Подарки сотрудникам", ""];
  COMPANIES.forEach(function (company) {
    const totals = companyTotal(company);
    lines.push(company.name);
    if (!totals.count) {
      lines.push("— ничего не выбрано");
    } else {
      company.products.forEach(function (product) {
        const qty = qtyOf(company.id, product.id);
        if (qty <= 0) return;
        const price = unitPrice(company, product);
        if (product.once) {
          lines.push("• " + lineLabel(company, product) + " — весь тираж " + money.format(price));
        } else {
          lines.push("• " + lineLabel(company, product) + " — " + qty + " × " + money.format(price) + " = " + money.format(qty * price));
        }
      });
      if (totals.delivery) {
        lines.push("• " + company.delivery.name + " — " + money.format(company.delivery.price));
      }
      activeFlags(company).forEach(function (flag) {
        lines.push("• " + flag.name + " — цену уточнить, в сумму не входит");
      });
      lines.push("Итого: " + money.format(totals.sum));
      if (company.notes && company.notes.length) {
        lines.push("Условия:");
        company.notes.forEach(function (note) { lines.push("— " + note); });
      }
    }
    lines.push("");
  });
  lines.push("Общий бюджет: " + money.format(grandTotal()));
  return lines.join("\n");
}

function copySummary() {
  const text = buildSummaryText();
  const button = document.getElementById("copy-all");
  function done() {
    button.textContent = "Скопировано";
    setTimeout(function () { button.textContent = "Скопировать сводку"; }, 1600);
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text); done(); });
    return;
  }
  fallbackCopy(text);
  done();
}

function fallbackCopy(text) {
  const area = document.createElement("textarea");
  area.value = text;
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  area.remove();
}

shop.addEventListener("input", function (event) {
  const input = event.target.closest("[data-qty]");
  if (!input || input.tagName !== "INPUT") return;
  setQty(input.dataset.qty, input.value, input);
});

shop.addEventListener("click", function (event) {
  const step = event.target.closest("[data-step]");
  if (step) {
    const productId = step.dataset.qty;
    const current = qtyOf(activeCompanyId, productId);
    const next = Math.max(0, current + Number(step.dataset.step));
    setQty(productId, next, null);
    return;
  }
  const preset = event.target.closest("[data-preset]");
  if (preset) {
    setQty(preset.dataset.qty, preset.dataset.preset, null);
    return;
  }
  const variant = event.target.closest("[data-sheets]");
  if (variant) {
    setSheets(variant.dataset.product, Number(variant.dataset.sheets));
    return;
  }
  const remove = event.target.closest("[data-remove]");
  if (remove) setQty(remove.dataset.remove, 0, null);
});

document.getElementById("shop-close").addEventListener("click", function () {
  shop.close();
});

shop.addEventListener("click", function (event) {
  if (event.target === shop) shop.close();
});

shop.addEventListener("close", function () {
  document.body.classList.remove("modal-open");
  activeCompanyId = null;
  renderBudget();
  COMPANIES.forEach(refreshCompanyMeta);
});

document.getElementById("clear-cart").addEventListener("click", function () {
  const button = document.getElementById("clear-cart");
  if (!clearArmed) {
    clearArmed = true;
    button.textContent = "Точно очистить?";
    setTimeout(function () {
      clearArmed = false;
      if (shop.open) button.textContent = "Очистить";
    }, 2200);
    return;
  }
  clearArmed = false;
  button.textContent = "Очистить";
  const company = companyById(activeCompanyId);
  if (!company) return;
  state[company.id] = { items: {}, sheets: {}, delivery: false, flags: {} };
  saveState();
  renderProducts(company);
  renderCart(company);
  refreshCompanyMeta(company);
  renderBudget();
});

document.getElementById("cart-options").addEventListener("change", function (event) {
  const input = event.target;
  if (input.dataset.delivery) setDelivery(input.checked);
  if (input.dataset.flag) setFlag(input.dataset.flag, input.checked);
});

document.getElementById("copy-all").addEventListener("click", copySummary);

function pigSvg(outfit) {
  var behind = "";
  var front = "";
  if (outfit === "santa") {
    front = '<path d="M36 64c6-34 58-48 78-16 2 8-18 8-24 2-6 16-40 16-54 14z" fill="#d4536a"/>' +
      '<ellipse cx="72" cy="66" rx="34" ry="8" fill="#fff"/>' +
      '<circle cx="112" cy="44" r="9" fill="#fff"/>';
  } else if (outfit === "elf") {
    front = '<path d="M46 60 L70 12 L94 60 Z" fill="#2f6b4f"/>' +
      '<ellipse cx="70" cy="60" rx="28" ry="7" fill="#e3b45a"/>' +
      '<circle cx="70" cy="12" r="6" fill="#d4536a"/>';
    behind = '<path d="M36 134c8 3 14 5 34 5s26-2 34-5v8c-8 8-20 12-34 12s-26-4-34-12z" fill="#2f6b4f"/>' +
      '<circle cx="70" cy="140" r="3" fill="#e3b45a"/>';
  } else if (outfit === "sweater") {
    behind = '<path d="M30 134c8 3 16 5 40 5s32-2 40-5v14c-10 10-24 14-40 14s-30-4-40-14z" fill="#d4536a"/>' +
      '<path d="M70 144l2 3.2 3.6.4-2.8 2.4.7 3.6-3.5-2-3.5 2 .7-3.6-2.8-2.4 3.6-.4z" fill="#fff"/>' +
      '<circle cx="52" cy="148" r="2.2" fill="#e3b45a"/>' +
      '<circle cx="88" cy="148" r="2.2" fill="#7dcea0"/>';
  } else if (outfit === "antlers") {
    front = '<path d="M34 52c-16-6-20-24-8-28 3 8 7 12 14 14" fill="none" stroke="#8d5a32" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M106 52c16-6 20-24 8-28-3 8-7 12-14 14" fill="none" stroke="#8d5a32" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M30 46c-8-8 2-16 8-8" fill="none" stroke="#8d5a32" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M110 46c8-8-2-16-8-8" fill="none" stroke="#8d5a32" stroke-width="3" stroke-linecap="round"/>';
    behind = '<path d="M34 134c8 3 14 5 36 5s28-2 36-5v10c-8 8-22 12-36 12s-28-4-36-12z" fill="#d4536a"/>' +
      '<path d="M56 140h12" stroke="#e3b45a" stroke-width="2.4" stroke-linecap="round"/>';
  } else if (outfit === "treehat") {
    front = '<polygon points="70,4 88,28 78,28 96,50 44,50 62,28 52,28" fill="#2f6b4f"/>' +
      '<circle cx="70" cy="20" r="3.2" fill="#e3b45a"/>' +
      '<circle cx="60" cy="36" r="3.2" fill="#d4536a"/>' +
      '<circle cx="80" cy="40" r="3.2" fill="#7eb6d9"/>' +
      '<polygon points="70,0 73,7 70,5 67,7" fill="#f2c14e"/>';
  } else if (outfit === "baubles") {
    front = '<path d="M34 70c-6 6-8 14-4 16" fill="none" stroke="#e3b45a" stroke-width="1.6"/>' +
      '<path d="M106 70c6 6 8 14 4 16" fill="none" stroke="#e3b45a" stroke-width="1.6"/>' +
      '<circle cx="26" cy="90" r="8" fill="#d4536a" stroke="#e3b45a" stroke-width="2"/>' +
      '<circle cx="114" cy="90" r="8" fill="#7eb6d9" stroke="#e3b45a" stroke-width="2"/>' +
      '<path d="M22 86c3 1 6 0 8-2" fill="none" stroke="#fff" stroke-width="1.4" opacity="0.8"/>' +
      '<path d="M110 86c3 1 6 0 8-2" fill="none" stroke="#fff" stroke-width="1.4" opacity="0.8"/>';
  } else if (outfit === "party") {
    front = '<path d="M40 64 L48 34 L60 52 L70 26 L80 52 L92 34 L100 64 Z" fill="#e3b45a"/>' +
      '<circle cx="48" cy="34" r="4" fill="#d4536a"/>' +
      '<circle cx="70" cy="26" r="4.5" fill="#d4536a"/>' +
      '<circle cx="92" cy="34" r="4" fill="#2f6b4f"/>' +
      '<rect x="40" y="60" width="60" height="8" rx="3" fill="#e3b45a"/>';
  }
  return '<svg class="pig-svg" viewBox="0 0 140 156">' +
    behind +
    '<ellipse cx="42" cy="58" rx="14" ry="18" fill="#f3a7b5" transform="rotate(-28 42 58)"/>' +
    '<ellipse cx="98" cy="58" rx="14" ry="18" fill="#f3a7b5" transform="rotate(28 98 58)"/>' +
    '<ellipse cx="44" cy="60" rx="7" ry="11" fill="#ffd5de" transform="rotate(-28 44 60)"/>' +
    '<ellipse cx="96" cy="60" rx="7" ry="11" fill="#ffd5de" transform="rotate(28 96 60)"/>' +
    '<ellipse cx="70" cy="90" rx="48" ry="42" fill="#f7b7c3"/>' +
    '<ellipse cx="70" cy="102" rx="22" ry="15" fill="#f48fa3"/>' +
    '<ellipse cx="62" cy="102" rx="3.6" ry="5" fill="#b94b63"/>' +
    '<ellipse cx="78" cy="102" rx="3.6" ry="5" fill="#b94b63"/>' +
    '<ellipse cx="52" cy="82" rx="4.6" ry="6" fill="#4a2c32"/>' +
    '<ellipse cx="88" cy="82" rx="4.6" ry="6" fill="#4a2c32"/>' +
    '<circle cx="53.5" cy="80" r="1.6" fill="#fff"/>' +
    '<circle cx="89.5" cy="80" r="1.6" fill="#fff"/>' +
    '<ellipse cx="40" cy="94" rx="7" ry="4" fill="#f07a90" opacity="0.5"/>' +
    '<ellipse cx="100" cy="94" rx="7" ry="4" fill="#f07a90" opacity="0.5"/>' +
    '<path d="M61 112q9 8 18 0" fill="none" stroke="#b94b63" stroke-width="2.4" stroke-linecap="round"/>' +
    front +
    "</svg>";
}

function treeSvg() {
  return '<svg viewBox="0 0 80 112">' +
    '<polygon points="40,6 64,40 54,40 72,68 58,68 78,102 2,102 22,68 8,68 26,40 16,40" fill="#2f6b4f"/>' +
    '<rect x="33" y="102" width="14" height="10" rx="2" fill="#8a5a3a"/>' +
    '<circle cx="40" cy="34" r="4" fill="#e3b45a"/>' +
    '<circle cx="30" cy="56" r="4" fill="#d4536a"/>' +
    '<circle cx="52" cy="78" r="4.5" fill="#7eb6d9"/>' +
    '<polygon points="40,0 43,8 40,6 37,8" fill="#f2c14e"/>' +
    "</svg>";
}

function baubleSvg(color) {
  return '<svg viewBox="0 0 40 56">' +
    '<rect x="16" y="2" width="8" height="8" rx="2" fill="#c9a24a"/>' +
    '<circle cx="20" cy="32" r="16" fill="' + color + '"/>' +
    '<path d="M12 26c4 2 8 2 14-4" fill="none" stroke="#fff" stroke-width="2" opacity="0.75"/>' +
    "</svg>";
}

function spawnPigs() {
  var scene = document.getElementById("pig-scene");
  var pigs = [
    { outfit: "santa", style: "left:1%; top:14%; --tilt:-8deg;" },
    { outfit: "elf", style: "right:1%; top:22%; --tilt:8deg; animation-delay:-1.4s;" },
    { outfit: "sweater", style: "left:2%; bottom:6%; --tilt:-4deg; animation-delay:-2.2s;" },
    { outfit: "antlers", style: "right:2%; bottom:8%; --tilt:7deg; animation-delay:-3s;" },
    { outfit: "treehat", style: "left:15%; top:2%; --tilt:-10deg; animation-delay:-0.8s;", size: "small" },
    { outfit: "baubles", style: "right:16%; top:2%; --tilt:6deg; animation-delay:-2.8s;", size: "small" }
  ];
  var trees = [
    { style: "left:7%; top:48%; width:72px; animation-delay:-1s;" },
    { style: "right:6%; top:46%; width:84px; animation-delay:-2.4s;" },
    { style: "left:24%; bottom:2%; width:52px; animation-delay:-0.6s;" }
  ];
  var baubles = [
    { color: "#d4536a", style: "left:12%; top:32%; width:28px; animation-delay:-1.3s;" },
    { color: "#e3b45a", style: "right:13%; top:38%; width:34px; animation-delay:-2s;" },
    { color: "#7eb6d9", style: "left:27%; top:10%; width:22px; animation-delay:-0.4s;" },
    { color: "#d4536a", style: "right:24%; bottom:16%; width:26px; animation-delay:-2.8s;" },
    { color: "#7dcea0", style: "left:9%; bottom:20%; width:24px; animation-delay:-1.6s;" }
  ];
  var hearts = [
    { style: "left:10%; top:42%; font-size:22px;" },
    { style: "left:22%; top:18%; font-size:14px; animation-delay:-1s;", gold: true },
    { style: "right:12%; top:16%; font-size:20px; animation-delay:-2s;" },
    { style: "right:20%; top:48%; font-size:16px; animation-delay:-1.5s;", gold: true },
    { style: "left:8%; bottom:28%; font-size:18px; animation-delay:-3s;" },
    { style: "right:8%; bottom:32%; font-size:24px; animation-delay:-0.6s;" },
    { style: "left:46%; top:8%; font-size:13px; animation-delay:-2.4s;", gold: true },
    { style: "left:38%; bottom:8%; font-size:16px; animation-delay:-1.8s;" },
    { style: "left:30%; top:36%; font-size:18px; animation-delay:-0.4s;" },
    { style: "right:28%; top:34%; font-size:15px; animation-delay:-2.2s;", gold: true },
    { style: "left:18%; bottom:18%; font-size:12px; animation-delay:-1.2s;", gold: true },
    { style: "right:16%; bottom:22%; font-size:20px; animation-delay:-3.2s;" },
    { style: "left:52%; bottom:16%; font-size:14px; animation-delay:-0.9s;" },
    { style: "right:36%; bottom:12%; font-size:17px; animation-delay:-1.7s;", gold: true }
  ];
  pigs.forEach(function (pig) {
    var node = document.createElement("div");
    node.className = "deco-pig" + (pig.size ? " " + pig.size : "");
    node.style.cssText = pig.style;
    node.innerHTML = pigSvg(pig.outfit);
    scene.appendChild(node);
  });
  trees.forEach(function (tree) {
    var node = document.createElement("div");
    node.className = "deco-tree";
    node.style.cssText = tree.style;
    node.innerHTML = treeSvg();
    scene.appendChild(node);
  });
  baubles.forEach(function (bauble) {
    var node = document.createElement("div");
    node.className = "deco-bauble";
    node.style.cssText = bauble.style;
    node.innerHTML = baubleSvg(bauble.color);
    scene.appendChild(node);
  });
  hearts.forEach(function (heart) {
    var node = document.createElement("span");
    node.className = "float-heart" + (heart.gold ? " gold" : "");
    node.style.cssText = heart.style;
    node.textContent = "♥";
    scene.appendChild(node);
  });
}

var oinkContext = null;

function playOink() {
  var AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  if (!oinkContext) oinkContext = new AudioCtx();
  if (oinkContext.state === "suspended") oinkContext.resume();
  grunt(oinkContext.currentTime, 240, 0.16);
  grunt(oinkContext.currentTime + 0.2, 300, 0.14);
}

function grunt(start, base, duration) {
  var osc = oinkContext.createOscillator();
  var tone = oinkContext.createGain();
  var filter = oinkContext.createBiquadFilter();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(base * 1.8, start);
  osc.frequency.exponentialRampToValueAtTime(base * 0.62, start + duration);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1800, start);
  filter.frequency.exponentialRampToValueAtTime(420, start + duration);
  tone.gain.setValueAtTime(0.0001, start);
  tone.gain.exponentialRampToValueAtTime(0.22, start + 0.025);
  tone.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(filter);
  filter.connect(tone);
  tone.connect(oinkContext.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function burstHearts(button) {
  for (var i = 0; i < 10; i += 1) {
    var heart = document.createElement("i");
    var angle = (Math.PI * 2 * i) / 10;
    var distance = 46 + (i % 3) * 16;
    heart.className = "burst-heart";
    heart.textContent = i % 2 === 0 ? "♥" : "♡";
    heart.style.setProperty("--dx", Math.cos(angle) * distance + "px");
    heart.style.setProperty("--dy", Math.sin(angle) * distance + "px");
    button.appendChild(heart);
    window.setTimeout(function (node) { node.remove(); }, 820, heart);
  }
}

function bindOink() {
  var button = document.getElementById("oink-pig");
  button.insertAdjacentHTML("afterbegin", pigSvg("party"));
  button.addEventListener("click", function () {
    button.classList.remove("is-glowing");
    void button.offsetWidth;
    button.classList.add("is-glowing");
    burstHearts(button);
    playOink();
    window.setTimeout(function () { button.classList.remove("is-glowing"); }, 900);
  });
}

spawnSnow();
spawnPigs();
bindOink();
renderCompanies();
renderBudget();
