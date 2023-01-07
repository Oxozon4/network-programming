const { pathname } = window.location;
const formattedPathName = pathname.replace('/', '');
const tableElement = document.querySelector('.app-table');
const summaryElement = document.querySelector('.app-summary');
let summaryValue = 0;

const embedStorageData = async (storageNumber) => {
  const response = await fetch(`Storage${storageNumber}.txt`);
  const storageData = await response.text();
  tableElement.insertAdjacentHTML('beforeend', storageData);
  setProductsSummaryValue();
};

const setProductsSummaryValue = () => {
  if (!summaryElement) {
    return;
  }
  document.querySelectorAll('tr').forEach((element) => {
    const secondRowValue = element.querySelector('td:nth-child(2)').innerHTML;
    if (!isNaN(secondRowValue) && !isNaN(parseFloat(secondRowValue))) {
      summaryValue += Number(secondRowValue);
    }
  });
  summaryElement.innerHTML = `Suma: ${summaryValue}`;
};

if (formattedPathName) {
  let isDataEmbeded = false;
  for (let i = 1; i < 6; i += 1) {
    if (formattedPathName.includes(i)) {
      embedStorageData(i);
      isDataEmbeded = true;
    }
  }
} else if (summaryElement) {
  summaryElement.innerHTML =
    'By wybrać magazyn podaj odpowiednią cyfrę (1-5) w url. np http://localhost:8080/1_2';
}
