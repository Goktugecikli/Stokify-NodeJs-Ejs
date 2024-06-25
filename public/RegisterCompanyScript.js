document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("registerCompany")
    .addEventListener("click", handleFormSubmit);
});

async function handleFormSubmit(event) {
  event.preventDefault();

  let companyNameInput = document.getElementById("Name");
  if (!companyNameInput.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Uyarı!',
      text: "Lütfen şirket isim alanını doldurunuz.",
      confirmButtonText: 'Anladım.',
      allowOutsideClick: false, // Dışarı tıklamayı kapat
      allowEscapeKey: false, // ESC tuşunu kapat
      allowEnterKey: true // Enter tuşunu aç
    }).then((result) => {
      if (result.isConfirmed) {
       
      }
    });
    companyNameInput.classList.add("error");
    return;
  }
  if (companyNameInput.classList.contains("error")) {
    companyNameInput.classList.remove("error");
  }
  let value = companyNameInput.value;
  try {
    const response = await fetch("/api/company/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ companyName: value }),
    });

    const result = await response.json();

    if (result.success === false) {
    
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: result.message,
        confirmButtonText: 'Anladım.',
        allowOutsideClick: false, // Dışarı tıklamayı kapat
        allowEscapeKey: false, // ESC tuşunu kapat
        allowEnterKey: true // Enter tuşunu aç
      }).then((result) => {
        if (result.isConfirmed) {
         
        }
      });
      return;
    }

    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: "Şirket kayıt olma işlemi başarılı. yönlendirme işlemi yapılacaktır."
    });

    setTimeout(function () {
      window.location.href = result.redirectUrl;
    }, 2005);
  } catch (error) {
    console.error("Fetch error:", error);
    Swal.fire({
      icon: "error",
      title: "Hata!",
      text: "Şirket kaydedilirken bir hata oluştu.",
      confirmButtonText: "Tamam",
      allowOutsideClick: false, // Dışarı tıklamayı kapat
      allowEscapeKey: false, // ESC tuşunu kapat
      allowEnterKey: true, // Enter tuşunu aç
    }).then((result) => {
      if (result.isConfirmed) {}
    });
  }
}
