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

async function handleFormSubmit(event) {
  event.preventDefault(); // Sayfanın yenilenmesini engelle
  var form = document.getElementById('productForm');

  var formData = new FormData(form);

  // FormData içeriğini kontrol etmek için (isteğe bağlı)
//   for (var pair of formData.entries()) {
//     console.log(pair[0] + ": " + pair[1]);
//   }
//   var selectedOperationType = document.getElementById("operationType").value;
//   var productName = document.getElementById("productName").value;
//   var brand = document.getElementById("brand").value;
//   var barcode = document.getElementById("barcode").value;
//   var quantity = document.getElementById("quantity").value;

  if (quantity === 0) {
    alert("0 dan büyük bir adet sayısı girmelisiniz");
    return;
  }

  var jsonObject = {};
  formData.forEach(function(value, key){
    jsonObject[key] = value;
  });

  const response = await fetch("/api/product/add-product", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jsonObject)
  });
console.log(JSON.stringify(response))
  const result = await response.json();
  console.log("test: ", result);
  if (result.success) {
    //   window.location.href = result.redirectUrl;
    alert("Eklendi");
  } else {
    alert(result.message);
  }
}

async function fetchIslemTurleri() {
  try {
    const response = await fetch("/api/product/get-all-operation-types"); // Node.js sunucusuna istek gönder
    const operationTypes = await response.json(); // JSON formatında yanıtı al

    const DdOperationTypes = document.getElementById("operationType");
    DdOperationTypes.innerHTML = '<option value="">Seçiniz</option>';

    operationTypes.forEach((type) => {
      const option = document.createElement("option");
      option.value = type.ID;
      option.textContent = type.TypeName;
      DdOperationTypes.appendChild(option);
    });
  } catch (error) {
    console.error(
      "There is a error while getting operation types. Error: ",
      error
    );
  }
}
