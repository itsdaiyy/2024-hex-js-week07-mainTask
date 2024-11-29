import "./assets/scss/all.scss";
import "bootstrap/dist/js/bootstrap.min.js";
import axios from "axios";

const API_URL =
  "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";

let data = [];

// # 初始化功能元素
const ticketsRow = document.querySelector(".tickets-row");
const searchResultText = document.querySelector("#searchResult-text");
// # 篩選功能元素
const regionSearchSelect = document.querySelector("#regionSearch");
const cantFindArea = document.querySelector(".cantFind-area");
// # 新增套票元素
const ticketName = document.querySelector("#inputTicketName");
const ticketImageURL = document.querySelector("#inputImageURL");
const ticketArea = document.querySelector("#selectArea");
const ticketPrice = document.querySelector("#inputTicketPrice");
const ticketCounts = document.querySelector("#inputTicketCounts");
const ticketLevel = document.querySelector("#inputTicketLevel");
const ticketDescriptions = document.querySelector(
  "#textareaTicketDescriptions"
);
const addTicketBtn = document.querySelector("#addTicketBtn");
const addTicketForm = document.querySelector("#addTicketForm");

// 取得資料
async function fetchData() {
  try {
    const response = await axios.get(API_URL);
    return response.data.data;
  } catch (error) {
    throw error.message;
  }
}

// 初始化
async function init() {
  try {
    data = await fetchData();
    render(data);
    renderPieChart(data);
  } catch (error) {
    console.error("Failed to fetch data:  ", error);
  }
}

init();

// 渲染邏輯
function render(renderData) {
  // 顯示搜尋資料數
  searchResultText.textContent = `本次搜尋共 ${renderData.length} 筆資料`;

  // 判斷是否顯示查無資料圖示
  if (renderData.length > 0) {
    cantFindArea.style.display = "none";
  } else {
    cantFindArea.style.display = "block";
    clearRender();
    return;
  }

  // 資料跑迴圈印出 HTML
  const str = renderData.reduce((acc, cur) => {
    const { name, imgUrl, area, description, group, price, rate } = cur;
    return (acc += `<li class="col-lg-4 col-md-6">
              <div class="card ticket-card shadow h-100 border-neutral-400">
                <div class="position-relative">
                  <img
                    src="${imgUrl}"
                    class="card-img-top ticket-card__top-image object-fit-cover"
                    alt="${name}套票"
                  />
                  <div
                    class="position-absolute bg-primary-100 text-white px-6 py-3 border-right location-tag"
                  >
                    ${area}
                  </div>
                </div>
                <div class="card-body p-6 position-relative">
                  <div
                    class="position-absolute start-0 top-0 translate-middle-y bg-primary-200 text-white px-3 py-2 border-right "
                  >
                    ${rate.toFixed(1)}
                  </div>
                  <h3
                    class="card-title text-primary border-bottom border-2 border-primary-300 h4 mb-5 lh-sm"
                  >
                    ${name}
                  </h3>
                  <p class="card-text text-600 text-neutral-600">
                 ${description}
                  </p>
                </div>
                <div
                  class="d-flex justify-content-between align-items-center text-primary fw-medium px-6 pb-6"
                >
                  <p>
                    <i class="bi bi-exclamation-circle-fill me-3"></i
                    ><span>剩下最後 ${group} 組</span>
                  </p>
                  <p>
                    <span class="me-2">TWD</span
                    ><span class="h2 align-middle">$${price}</span>
                  </p>
                </div>
              </div>
            </li>`);
  }, "");

  ticketsRow.innerHTML = str;
}

// 清空套票欄位
function clearRender() {
  ticketsRow.innerHTML = "";
}

// 套票篩選邏輯
function filterRenderData(renderTarget) {
  if (renderTarget === "") {
    render(data);
    return;
  }
  const renderData = data.filter((ticket) => ticket.area === renderTarget);
  render(renderData);
}

// 新增套票邏輯
function getFormData() {
  return {
    id: data.length + 1,
    name: ticketName.value.trim(),
    imgUrl: ticketImageURL.value.trim(),
    area: ticketArea.value.trim(),
    price: Number(ticketPrice.value.trim()),
    group: Number(ticketCounts.value.trim()),
    rate: Number(ticketLevel.value.trim()),
    description: ticketDescriptions.value.trim(),
  };
}

function validateFormData(ticket) {
  if (!ticket.name) return "必須填入套票名稱";
  if (!ticket.imgUrl) return "必須填入圖片網址";
  if (!ticket.area) return "必須填入套票地區";
  if (!ticket.price) return "必須填入套票價錢";
  if (ticket.group < 1) return "套票組數必須至少為 1";
  if (ticket.rate < 1 || ticket.rate > 10) return "套票星級必須在 1 ~ 10 之間";
  if (ticket.description.length > 100 || !ticket.description)
    return "必須填入套票描述，且不能超過 100 字";
  return null;
}

function addData(obj) {
  data.push(obj);
  clearRender();
  render(data);
  renderPieChart(data);
}

function resetForm() {
  addTicketForm.reset();
  regionSearchSelect.value = "";
}

// 監聽 filter
regionSearchSelect.addEventListener("change", function (e) {
  clearRender();
  filterRenderData(e.target.value);
});

// 監聽新增套票表格
addTicketBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const newTicket = getFormData();
  // 錯誤驗證
  const errorMsg = validateFormData(newTicket);

  if (errorMsg) {
    alert(errorMsg);
    return;
  }

  addData(newTicket);
  resetForm();
});

// 圓餅圖邏輯
function renderPieChart(renderData) {
  const data = formateChartData(renderData);
  console.log("renderChart", data);
  let chart = c3.generate({
    bindto: "#chart",
    size: {
      height: 184,
    },
    color: {
      pattern: ["#E68618", "#26C0C7", "#5151D3"],
    },
    data: {
      columns: data,
      type: "donut",
    },
    donut: {
      title: "套票地區比重",
      width: 10,
      label: {
        show: false,
      },
    },
  });
}

function formateChartData(renderData) {
  console.log("formate data", renderData);
  const countsObj = {};

  renderData.forEach((ticket) => {
    const property = ticket.area;

    if (!countsObj[property]) {
      countsObj[property] = 1;
    } else {
      countsObj[property] += 1;
    }
  });

  const newData = getSortedData(Object.entries(countsObj));

  return newData;
}

function getSortedData(arrayData) {
  const order = ["台北", "台中", "高雄"];
  return arrayData.sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
}
