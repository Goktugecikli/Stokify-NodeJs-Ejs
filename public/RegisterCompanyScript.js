document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("registerCompany")
    .addEventListener("click", handleFormSubmit);
});

async function handleFormSubmit(event) {
  event.preventDefault();

  let companyNameInput = document.getElementById("Name");
  if (!companyNameInput.value) {
    alert("Lütfen form alanlarını doldurunuz.");
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
      alert(result.message);
      return;
    }

    alert(
      "Şirket kayıt olma işlemi başarılı. yönlendirme işlemi yapılacaktır."
    );

    setTimeout(function () {
      window.location.href = result.redirectUrl;
    }, 2000);
  } catch (error) {
    console.error("Fetch error:", error);
    alert("An error occurred while regsitering the company.");
  }
}
