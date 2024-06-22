async function changePage(pageNumber) {
  fetch(`/company-stocks?pageNumber=${pageNumber}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(htmlContent => {
    // Tüm sayfanın içeriğini değiştir
    document.documentElement.innerHTML = htmlContent;
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });
}
