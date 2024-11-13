// Import our custom CSS
import "./assets/scss/all.scss";
import "bootstrap/dist/js/bootstrap.min.js";
import axios from "axios";

const API_URL =
  "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";

let data = [];

axios
  .get(API_URL)
  .then((res) => {
    data = res.data.data;

    init();
  })
  .catch((err) => {
    console.log(err.message);
  });

// # 初始化邏輯
const ticketsRow = document.querySelector(".tickets-row");
const searchResultText = document.querySelector("#searchResult-text");

function init() {
  render(data);
  searchResultText.textContent = `本次搜尋共 ${data.length} 筆資料`;
}

function render(renderData) {
  if (renderData.length > 0) {
    cantFindArea.style.display = "none";
  } else {
    cantFindArea.style.display = "block";
  }
  renderData.forEach((ticket) => {
    const { name, imgUrl, area, description, group, price, rate } = ticket;
    ticketsRow.innerHTML += `<li class="col-lg-4 col-md-6">
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
            </li>`;
  });
}

// # 篩選邏輯
const regionSearchSelect = document.querySelector("#regionSearch");
const cantFindArea = document.querySelector(".cantFind-area");

// 監聽 selector
regionSearchSelect.addEventListener("change", function (e) {
  clearRender();
  filterRenderData(e.target.value);
});

function clearRender() {
  ticketsRow.innerHTML = "";
}

function filterRenderData(renderTarget) {
  if (renderTarget === "") {
    init();
    return;
  }
  const renderData = data.filter((ticket) => ticket.area === renderTarget);
  searchResultText.textContent = `本次搜尋共 ${renderData.length} 筆資料`;
  render(renderData);
}

// # 新增邏輯
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

addTicketBtn.addEventListener("click", function (e) {
  e.preventDefault();

  let obj = {
    id: data.length + 1,
    name: ticketName.value.trim(),
    imgUrl: ticketImageURL.value.trim(),
    area: ticketArea.value.trim(),
    price: Number(ticketPrice.value.trim()),
    group: Number(ticketCounts.value.trim()),
    rate: Number(ticketLevel.value.trim()),
    description: ticketDescriptions.value.trim(),
  };

  // 錯誤驗證
  let errorMsg = "";

  if (!obj.name) {
    errorMsg = "必須填入套票名稱";
  } else if (!obj.imgUrl) {
    errorMsg = "必須填入圖片網址";
  } else if (!obj.area) {
    errorMsg = "必須填入套票地區";
  } else if (!obj.price) {
    errorMsg = "必須填入套票價錢";
  } else if (obj.group < 1) {
    errorMsg = "套票組數必須至少為 1";
  } else if (obj.rate < 1 || obj.rate > 10) {
    errorMsg = "套票星級必須在 1 ~ 10 之間";
  } else if (obj.description.length > 100 || !obj.description) {
    errorMsg = "必須填入套票描述，且不能超過 100 字";
  }

  if (errorMsg) {
    alert(errorMsg);
    return;
  }

  addData(obj);
  resetForm();
});

function addData(obj) {
  data.push(obj);
  clearRender();
  init();
}

function resetForm() {
  addTicketForm.reset();
  regionSearchSelect.value = "";
}
