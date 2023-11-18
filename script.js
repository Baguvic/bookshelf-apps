// search
function search() {
  const filter = document.getElementById("search").value.toUpperCase();
  const item = document.querySelectorAll(".detail-book");
  const h4 = document.getElementsByTagName("h4");

  for (let i = 0; i < item.length; i++) {
    let h4Text = h4[i].innerHTML || h4[i].textContent;
    let value = h4Text;

    if (value.toUpperCase().indexOf(filter) !== -1) {
      item[i].style.display = "";
    } else {
      item[i].style.display = "none";
    }
  }
  document.getElementById("search").value = "";
}

// form
const buku = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "Daftar_Buku";

function generateId() {
  return +new Date();
}

document.addEventListener("DOMContentLoaded", function () {
  const sumbitForm = document.getElementById("form-book");
  sumbitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const judulBookInput = document.getElementById("judul-form");
  const penulisBookInput = document.getElementById("penulis-form");
  const tahunBookInput = document.getElementById("tahun-form");
  const checkCompletedInput = document.getElementById("check-completed");

  const judulBook = judulBookInput.value;
  const penulisBook = penulisBookInput.value;
  const thnBook = Number(tahunBookInput.value);
  const isComplete = checkCompletedInput.checked;

  const generateID = generateId();
  const bookObject = generateBookObject(
    generateID,
    judulBook,
    penulisBook,
    thnBook,
    isComplete
  );
  buku.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  console.log(buku);
  saveData();

  judulBookInput.value = "";
  penulisBookInput.value = "";
  tahunBookInput.value = "";
  checkCompletedInput.checked = false;
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const belumDiBaca = document.getElementById("belum-di-baca");
  belumDiBaca.innerHTML = "";

  const sudahDiBaca = document.getElementById("sudah-di-baca");
  sudahDiBaca.innerHTML = "";

  for (const bukuItem of buku) {
    const bukuElement = saveBook(bukuItem);
    if (!bukuItem.isComplete === false) {
      sudahDiBaca.append(bukuElement);
    } else {
      belumDiBaca.append(bukuElement);
    }
  }
});

function saveBook(bookObject) {
  const detailBook = document.createElement("article");
  detailBook.classList.add("detail-book");
  const title = document.createElement("h4");
  title.innerText = bookObject.title;
  const author = document.createElement("p");
  author.innerText = `Penulis: ${bookObject.author}`;
  const year = document.createElement("p");
  year.innerText = `tahun: ${bookObject.year}`;
  const btn = document.createElement("div");
  btn.classList.add("btn");
  const btnCoklat = document.createElement("button");
  const btnhijau = document.createElement("button");
  const btnKuning = document.createElement("button");
  btnCoklat.classList.add("coklat");
  btnhijau.classList.add("hijau");
  btnKuning.classList.add("kuning");

  detailBook.append(title, author, year, btn);
  detailBook.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isComplete === true) {
    btnCoklat.innerHTML = `<i class="bi bi-check2-circle"></i> Belum dibaca`;
    btnCoklat.addEventListener("click", function () {
      belumDiBaca(bookObject.id);
    });
    btnhijau.innerHTML = `<i class="bi bi-trash-fill"></i> Hapus buku`;
    btnhijau.addEventListener("click", function () {
      hapusBuku(bookObject.id);
    });
    btnKuning.innerHTML = `<i class="bi bi-pen-fill"></i> Edit buku`;
    btnKuning.addEventListener("click", function () {
      editBuku(bookObject.id);
    });
    btn.append(btnCoklat, btnhijau, btnKuning);
  } else {
    btnCoklat.innerHTML = `<i class="bi bi-check2-circle"></i> Sudah dibaca`;
    btnCoklat.addEventListener("click", function () {
      sudahDiBaca(bookObject.id);
    });
    btnhijau.innerHTML = `<i class="bi bi-trash-fill"></i> Hapus buku`;
    btnhijau.addEventListener("click", function () {
      hapusBuku(bookObject.id);
    });
    btnKuning.innerHTML = `<i class="bi bi-pen-fill"></i> Edit buku`;
    btnKuning.addEventListener("click", function () {
      editBuku(bookObject.id);
    });
    btn.append(btnCoklat, btnhijau, btnKuning);
  }

  return detailBook;
}

function sudahDiBaca(bukuId) {
  const bukuTarget = findBook(bukuId);

  if (bukuTarget == false) return;

  bukuTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function belumDiBaca(bukuId) {
  const bukuTarget = findBook(bukuId);

  if (bukuTarget == true) return;

  bukuTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bukuId) {
  for (const bukuItem of buku) {
    if (bukuItem.id === bukuId) {
      return bukuItem;
    }
  }
  return null;
}

function hapusBuku(bukuId) {
  const bukuTarget = findBookIndex(bukuId);
  if (bukuTarget === -1) return;

  const konfirmasi = confirm("Apa kamu yakin ingin menghapus buku ini?");
  if (!konfirmasi) return;
  buku.splice(bukuTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bukuId) {
  for (const index in buku) {
    if (buku[index].id === bukuId) {
      return index;
    }
  }
  return -1;
}

function editBuku(bukuId) {
  const bukuTarget = findBook(bukuId);

  if (bukuTarget === null) {
    alert("buku tidak di temukan");
    return;
  }

  const titleBaru = prompt("Masukan judul buku baru", bukuTarget.title);
  const authorBaru = prompt("Masukan author baru", bukuTarget.author);
  const yearBaru = prompt("Masukan year buku baru", bukuTarget.year);

  if (titleBaru !== null && titleBaru !== "") {
    bukuTarget.title = titleBaru;
  }

  if (authorBaru !== null) {
    bukuTarget.author = authorBaru;
  }

  if (yearBaru !== null) {
    bukuTarget.year = yearBaru;
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(buku);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === "undefined") {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    buku.length = 0;
    for (const bukuItem of data) {
      buku.push(bukuItem);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});
