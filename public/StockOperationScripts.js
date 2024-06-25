function handleOperationTypeChange() {
  var selectBox = document.getElementById("operationType");
  var urunAdiInput = document.getElementById("productName");
  var markaInput = document.getElementById("brand");
  var barkodNoInput = document.getElementById("barcode");
  var adetSayisiGroup = document.getElementById("quantityGroup");
  var adetSayisiInput = document.getElementById("quantity");

  if (selectBox.value !== "") {
    urunAdiInput.disabled = false;
    markaInput.disabled = false;
    barkodNoInput.disabled = false;
    adetSayisiGroup.style.display = "block";
    adetSayisiInput.disabled = false;
  } else {
    urunAdiInput.disabled = true;
    markaInput.disabled = true;
    barkodNoInput.disabled = true;
    adetSayisiGroup.style.display = "none";
    adetSayisiInput.disabled = true;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchIslemTurleri();

  document
    .getElementById("productForm")
    .addEventListener("submit", handleFormSubmit);
});
function isFormDataValid(form) {
  var formData = new FormData(form);
  for (let [key, value] of formData.entries()) {
    if (value.trim() === "") {
      // Boş değer bulundu, uyarı göster ve fonksiyondan çık
      Swal.fire({
        icon: "warning",
        title: "Uyarı!",
        text: "Lütfen bütün alanları doldurunuz",
        confirmButtonText: "Anladım",
        allowOutsideClick: false, // Dışarı tıklamayı kapat
        allowEscapeKey: false, // ESC tuşunu kapat
        allowEnterKey: true, // Enter tuşunu aç
      }).then((result) => {
        if (result.isConfirmed) {
        }
      });
      return false;
    }
  }
  // Tüm değerler dolu
  return true;
}
async function handleFormSubmit(event) {
  event.preventDefault(); // Sayfanın yenilenmesini engelle
  var form = document.getElementById("productForm");

  var formData = new FormData(form);
  let validate = isFormDataValid(form);
  if (!validate) {
    return;
  }
  if (document.getElementById("quantity").value <= 0) {
    Swal.fire({
      icon: "error",
      title: "Uyarı!",
      text: `Lütfen Adet Sayısını 0'dan büyük yapınız`,
      confirmButtonText: "Anladım",
      allowOutsideClick: false, // Dışarı tıklamayı kapat
      allowEscapeKey: false, // ESC tuşunu kapat
      allowEnterKey: true, // Enter tuşunu aç
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
    return;
  }

  var jsonObject = {};
  formData.forEach(function (value, key) {
    jsonObject[key] = value;
  });

  const response = await fetch("/api/product/add-product", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonObject),
  });
  // if (!response.ok) {
  //   throw new Error("HTTP error " + response.status);
  // }
  let responseJson = await response.json();
  let responseParse = JSON.parse(responseJson);
  if (responseParse.success === false) {
    Swal.fire({
      icon: "error",
      title: "Hata!",
      text: responseParse.message,
      confirmButtonText: "Anladım",
      allowOutsideClick: false, // Dışarı tıklamayı kapat
      allowEscapeKey: false, // ESC tuşunu kapat
      allowEnterKey: true, // Enter tuşunu aç
    }).then((result) => {
      if (result.isConfirmed) {
        let operationType = document.getElementById("operationType");
        operationType.classList.add("error");

      }
    });
    return;
  }
  Swal.fire({
    icon: "success",
    title: "Başarılı!",
    text: responseParse.message,
    confirmButtonText: "Teşekkürler",
    allowOutsideClick: false, // Dışarı tıklamayı kapat
    allowEscapeKey: false, // ESC tuşunu kapat
    allowEnterKey: true, // Enter tuşunu aç
  }).then((result) => {
    if (result.isConfirmed) {
      location.reload();
    }
  });
}

async function fetchIslemTurleri() {
  try {
    const response = await fetch("/api/product/get-all-operation-types"); // Node.js sunucusuna istek gönder
    if (!response.ok) {
      Swal.fire({
        icon: "error",
        title: "İşlem türleri yüklenemdi",
        text: response.status,
        confirmButtonText: "Tamam",
        allowOutsideClick: false, // Dışarı tıklamayı kapat
        allowEscapeKey: false, // ESC tuşunu kapat
        allowEnterKey: true, // Enter tuşunu aç
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseJson = await response.json(); // JSON formatında yanıtı al
    const operationTypes = JSON.parse(responseJson); // JSON formatında yanıtı al

    const DdOperationTypes = document.getElementById("operationType");
    DdOperationTypes.innerHTML = '<option value="">Seçiniz</option>';
    operationTypes.forEach((type) => {
      const option = document.createElement("option");
      option.value = type.ID;
      option.textContent = type.TypeName;
      DdOperationTypes.appendChild(option);
    });
  } catch (error) {
    console.log(
      "There is a error while getting operation types. Error: ",
      error
    );
  }
}
